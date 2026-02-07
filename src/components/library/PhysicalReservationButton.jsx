import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const PhysicalReservationButton = ({ book }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState(null);
  const [existingReservation, setExistingReservation] = useState(null);
  const [librarySettings, setLibrarySettings] = useState(null);

  useEffect(() => {
    if (currentUser) {
      checkMembershipAndReservation();
      loadLibrarySettings();
    }
  }, [currentUser, book.id]);

  const loadLibrarySettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'library_settings', 'library_settings'));
      if (settingsDoc.exists()) {
        setLibrarySettings(settingsDoc.data());
      }
    } catch (error) {
      console.error('Error loading library settings:', error);
    }
  };

  const checkMembershipAndReservation = async () => {
    try {
      // Check if user has library membership
      const memberDoc = await getDoc(doc(db, 'library_members', currentUser.uid));
      if (memberDoc.exists()) {
        const memberData = memberDoc.data();

        // Check if membership is active
        const expiryDate = new Date(memberData.membership_expiry);
        const today = new Date();

        if (memberData.status === 'active' && expiryDate > today) {
          setMember(memberData);

          // Check for existing reservation
          const reservationsQuery = query(
            collection(db, 'book_reservations'),
            where('member_uid', '==', currentUser.uid),
            where('book_id', '==', book.id),
            where('status', 'in', ['pending', 'ready'])
          );
          const reservationSnapshot = await getDocs(reservationsQuery);

          if (!reservationSnapshot.empty) {
            setExistingReservation(reservationSnapshot.docs[0].data());
          }
        }
      }
    } catch (error) {
      console.error('Error checking membership:', error);
    }
  };

  const handleReserveBook = async () => {
    if (!currentUser) {
      alert('Please sign in to reserve books');
      navigate('/login');
      return;
    }

    if (!member) {
      alert('You need to register for library membership first');
      navigate('/library-membership-register');
      return;
    }

    // Check if user has reached max allowed books
    if (member.current_books_borrowed >= member.max_books_allowed) {
      alert(`You have reached the maximum limit of ${member.max_books_allowed} books. Please return some books before reserving more.`);
      return;
    }

    // Check for outstanding fines
    if (member.fine_balance > 0) {
      alert(`You have outstanding fines of LKR ${member.fine_balance}. Please clear your fines before making new reservations.`);
      return;
    }

    setLoading(true);
    try {
      // Calculate expiry date (default 7 days from library settings)
      const expiryDays = librarySettings?.reservation_expiry_days || 7;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);

      // Create reservation
      const reservationData = {
        reservation_id: `RES-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        member_uid: currentUser.uid,
        member_id: member.member_id,
        member_name: member.full_name,
        member_email: member.email,
        member_phone: member.phone,
        book_id: book.id,
        book_title: book.title,
        book_author: book.author || 'Unknown',
        book_call_number: book.call_number || '',
        book_material_type: book.material_type || '',
        status: 'pending', // pending, ready, collected, cancelled, expired
        reserved_at: serverTimestamp(),
        expires_at: expiryDate.toISOString(),
        priority: 1, // Lower number = higher priority
        notification_sent: false,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };

      await addDoc(collection(db, 'book_reservations'), reservationData);

      // Update inventory to track reservations
      const inventoryQuery = query(
        collection(db, 'library_inventory'),
        where('book_id', '==', book.id)
      );
      const inventorySnapshot = await getDocs(inventoryQuery);

      if (!inventorySnapshot.empty) {
        const inventoryDoc = inventorySnapshot.docs[0];
        await updateDoc(inventoryDoc.ref, {
          total_reservations: increment(1),
          updated_at: serverTimestamp()
        });
      }

      // Create transaction log
      await addDoc(collection(db, 'library_transactions'), {
        transaction_type: 'reservation_created',
        member_uid: currentUser.uid,
        member_id: member.member_id,
        book_id: book.id,
        book_title: book.title,
        reservation_id: reservationData.reservation_id,
        timestamp: serverTimestamp(),
        notes: `Member ${member.full_name} reserved ${book.title}`
      });

      alert(`Book reserved successfully! Your reservation ID is ${reservationData.reservation_id}. You will be notified when the book is ready for pickup within ${expiryDays} days.`);
      checkMembershipAndReservation(); // Refresh reservation status
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Failed to reserve book. Please try again or contact library staff.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!existingReservation) return;

    const confirmCancel = window.confirm('Are you sure you want to cancel this reservation?');
    if (!confirmCancel) return;

    setLoading(true);
    try {
      // Find and update the reservation
      const reservationsQuery = query(
        collection(db, 'book_reservations'),
        where('member_uid', '==', currentUser.uid),
        where('book_id', '==', book.id),
        where('status', 'in', ['pending', 'ready'])
      );
      const reservationSnapshot = await getDocs(reservationsQuery);

      if (!reservationSnapshot.empty) {
        const reservationDoc = reservationSnapshot.docs[0];
        await updateDoc(reservationDoc.ref, {
          status: 'cancelled',
          cancelled_at: serverTimestamp(),
          updated_at: serverTimestamp()
        });

        // Update inventory
        const inventoryQuery = query(
          collection(db, 'library_inventory'),
          where('book_id', '==', book.id)
        );
        const inventorySnapshot = await getDocs(inventoryQuery);

        if (!inventorySnapshot.empty) {
          const inventoryDoc = inventorySnapshot.docs[0];
          await updateDoc(inventoryDoc.ref, {
            total_reservations: increment(-1),
            updated_at: serverTimestamp()
          });
        }

        // Create transaction log
        await addDoc(collection(db, 'library_transactions'), {
          transaction_type: 'reservation_cancelled',
          member_uid: currentUser.uid,
          member_id: member.member_id,
          book_id: book.id,
          book_title: book.title,
          timestamp: serverTimestamp(),
          notes: `Member ${member.full_name} cancelled reservation for ${book.title}`
        });

        alert('Reservation cancelled successfully.');
        setExistingReservation(null);
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('Failed to cancel reservation. Please try again or contact library staff.');
    } finally {
      setLoading(false);
    }
  };

  // Don't show button if book is digital only (has PDF URL)
  if (book.url || book.source_url) {
    return null;
  }

  // User not signed in
  if (!currentUser) {
    return (
      <button
        onClick={() => navigate('/login')}
        className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition flex items-center justify-center gap-2 font-semibold shadow-lg"
      >
        <Icons.LogIn className="w-5 h-5" />
        Sign In to Reserve
      </button>
    );
  }

  // User not a library member
  if (!member) {
    return (
      <div className="space-y-3">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Icons.AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Library Membership Required</p>
              <p className="text-xs text-yellow-700 mt-1">You need to register for library membership to reserve physical books.</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/library-membership-register')}
          className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition flex items-center justify-center gap-2 font-semibold shadow-lg"
        >
          <Icons.UserPlus className="w-5 h-5" />
          Register for Membership
        </button>
      </div>
    );
  }

  // User has existing reservation
  if (existingReservation) {
    return (
      <div className="space-y-3">
        <div className={`border-2 rounded-lg p-4 ${
          existingReservation.status === 'ready'
            ? 'bg-green-50 border-green-200'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start gap-2 mb-2">
            <Icons.CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              existingReservation.status === 'ready' ? 'text-green-600' : 'text-blue-600'
            }`} />
            <div className="flex-1">
              <p className={`text-sm font-semibold ${
                existingReservation.status === 'ready' ? 'text-green-800' : 'text-blue-800'
              }`}>
                {existingReservation.status === 'ready' ? 'Book Ready for Pickup!' : 'Reservation Active'}
              </p>
              <p className={`text-xs mt-1 ${
                existingReservation.status === 'ready' ? 'text-green-700' : 'text-blue-700'
              }`}>
                {existingReservation.status === 'ready'
                  ? 'Your book is ready! Please visit the library to collect it.'
                  : 'You will be notified when the book is available.'}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Reservation ID: {existingReservation.reservation_id}
              </p>
              {existingReservation.expires_at && (
                <p className="text-xs text-gray-600">
                  Expires: {new Date(existingReservation.expires_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={handleCancelReservation}
          disabled={loading}
          className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 font-medium disabled:opacity-50"
        >
          {loading ? (
            <>
              <Icons.Loader2 className="w-4 h-4 animate-spin" />
              Cancelling...
            </>
          ) : (
            <>
              <Icons.XCircle className="w-4 h-4" />
              Cancel Reservation
            </>
          )}
        </button>
      </div>
    );
  }

  // User can reserve book
  return (
    <div className="space-y-3">
      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Icons.Info className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-cyan-800">Physical Book Reservation</p>
            <p className="text-xs text-cyan-700 mt-1">Reserve this book and collect it from NARA Library</p>
            <p className="text-xs text-gray-600 mt-2">
              Operating Hours: Mon-Fri 9:00-17:00, Sat 9:00-13:00
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={handleReserveBook}
        disabled={loading}
        className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition flex items-center justify-center gap-2 font-semibold shadow-lg disabled:opacity-50"
      >
        {loading ? (
          <>
            <Icons.Loader2 className="w-4 h-4 animate-spin" />
            Reserving...
          </>
        ) : (
          <>
            <Icons.BookmarkPlus className="w-5 h-5" />
            Reserve Book for Pickup
          </>
        )}
      </button>
      <div className="text-xs text-gray-600 text-center">
        <p>Available slots: {member.max_books_allowed - member.current_books_borrowed}/{member.max_books_allowed}</p>
        {member.fine_balance > 0 && (
          <p className="text-red-600 font-medium mt-1">Outstanding fines: LKR {member.fine_balance}</p>
        )}
      </div>
    </div>
  );
};

export default PhysicalReservationButton;
