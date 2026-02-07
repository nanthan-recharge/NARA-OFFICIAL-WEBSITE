import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { db } from '../../lib/firebase';
import {
  collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc,
  serverTimestamp, increment, orderBy, limit
} from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import Html5QrcodePlugin from '../../components/library/Html5QrcodePlugin';

const LibrarianDesk = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState('checkout'); // checkout, return, reservations, search
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Checkout State
  const [memberSearch, setMemberSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [librarySettings, setLibrarySettings] = useState(null);

  // Return State
  const [returnBookSearch, setReturnBookSearch] = useState('');
  const [returnLoanInfo, setReturnLoanInfo] = useState(null);
  const [bookCondition, setBookCondition] = useState('good');
  const [damageNotes, setDamageNotes] = useState('');

  // Reservations State
  const [reservations, setReservations] = useState([]);

  // QR Scanner State
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scanMode, setScanMode] = useState(''); // 'member' or 'book'

  useEffect(() => {
    loadLibrarySettings();
    if (activeTab === 'reservations') {
      loadPendingReservations();
    }
  }, [activeTab]);

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

  const loadPendingReservations = async () => {
    try {
      setLoading(true);
      const reservationsQuery = query(
        collection(db, 'book_reservations'),
        where('status', 'in', ['pending', 'ready']),
        orderBy('reserved_at', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(reservationsQuery);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReservations(data);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  // QR Code Scanning
  const handleQRScan = async (decodedText) => {
    try {
      const data = JSON.parse(decodedText);

      if (scanMode === 'member' && data.type === 'library_member') {
        await searchMemberById(data.member_id);
        setShowQRScanner(false);
        showMessage('success', `Member ${data.name} loaded successfully!`);
      } else if (scanMode === 'book') {
        await searchBookById(data.book_id || data.id);
        setShowQRScanner(false);
        showMessage('success', 'Book loaded successfully!');
      }
    } catch (error) {
      console.error('QR Scan error:', error);
      showMessage('error', 'Invalid QR code. Please try again.');
    }
  };

  const searchMemberById = async (memberId) => {
    try {
      setLoading(true);
      const membersQuery = query(
        collection(db, 'library_members'),
        where('member_id', '==', memberId)
      );
      const snapshot = await getDocs(membersQuery);

      if (!snapshot.empty) {
        const memberData = snapshot.docs[0].data();
        setSelectedMember({ id: snapshot.docs[0].id, ...memberData });
        setMemberSearch(memberId);
      } else {
        showMessage('error', 'Member not found');
      }
    } catch (error) {
      console.error('Error searching member:', error);
      showMessage('error', 'Error searching for member');
    } finally {
      setLoading(false);
    }
  };

  const searchBookById = async (bookId) => {
    try {
      setLoading(true);
      // Search in library_inventory
      const inventoryQuery = query(
        collection(db, 'library_inventory'),
        where('book_id', '==', bookId)
      );
      const snapshot = await getDocs(inventoryQuery);

      if (!snapshot.empty) {
        const bookData = snapshot.docs[0].data();
        setSelectedBook({ id: snapshot.docs[0].id, ...bookData });
        setBookSearch(bookId);
      } else {
        showMessage('error', 'Book not found in inventory');
      }
    } catch (error) {
      console.error('Error searching book:', error);
      showMessage('error', 'Error searching for book');
    } finally {
      setLoading(false);
    }
  };

  const handleMemberSearch = async () => {
    if (!memberSearch.trim()) return;
    await searchMemberById(memberSearch.trim());
  };

  const handleBookSearch = async () => {
    if (!bookSearch.trim()) return;
    await searchBookById(bookSearch.trim());
  };

  const handleCheckout = async () => {
    if (!selectedMember || !selectedBook) {
      showMessage('error', 'Please select both member and book');
      return;
    }

    // Validate member status
    if (selectedMember.status !== 'active') {
      showMessage('error', 'Member account is not active');
      return;
    }

    // Check membership expiry
    const expiryDate = new Date(selectedMember.membership_expiry);
    if (expiryDate < new Date()) {
      showMessage('error', 'Member membership has expired');
      return;
    }

    // Check if member has reached max books
    if (selectedMember.current_books_borrowed >= selectedMember.max_books_allowed) {
      showMessage('error', `Member has reached maximum limit of ${selectedMember.max_books_allowed} books`);
      return;
    }

    // Check for outstanding fines
    if (selectedMember.fine_balance > 0) {
      showMessage('error', `Member has outstanding fines of LKR ${selectedMember.fine_balance}`);
      return;
    }

    // Check book availability
    if (selectedBook.available_copies <= 0) {
      showMessage('error', 'No copies available for checkout');
      return;
    }

    setLoading(true);
    try {
      // Calculate due date
      const loanPeriod = librarySettings?.loan_period_days || 14;
      const checkoutDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + loanPeriod);

      // Create loan record
      const loanData = {
        loan_id: `LOAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        member_uid: selectedMember.uid,
        member_id: selectedMember.member_id,
        member_name: selectedMember.full_name,
        member_email: selectedMember.email,
        book_id: selectedBook.book_id,
        book_title: selectedBook.book_title || selectedBook.title,
        book_author: selectedBook.book_author || selectedBook.author,
        book_call_number: selectedBook.call_number || '',
        checkout_date: checkoutDate.toISOString(),
        due_date: dueDate.toISOString(),
        status: 'active', // active, returned, overdue
        renewal_count: 0,
        max_renewals: librarySettings?.max_renewals || 2,
        librarian_uid: currentUser.uid,
        librarian_email: currentUser.email,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };

      await addDoc(collection(db, 'book_loans'), loanData);

      // Update member record
      const memberRef = doc(db, 'library_members', selectedMember.id);
      await updateDoc(memberRef, {
        current_books_borrowed: increment(1),
        total_books_borrowed_lifetime: increment(1),
        updated_at: serverTimestamp()
      });

      // Update inventory
      const inventoryRef = doc(db, 'library_inventory', selectedBook.id);
      await updateDoc(inventoryRef, {
        available_copies: increment(-1),
        total_checkouts: increment(1),
        updated_at: serverTimestamp()
      });

      // Create borrowing history entry
      await addDoc(collection(db, 'borrowing_history'), {
        member_uid: selectedMember.uid,
        member_id: selectedMember.member_id,
        book_id: selectedBook.book_id,
        book_title: selectedBook.book_title || selectedBook.title,
        book_author: selectedBook.book_author || selectedBook.author,
        checkout_date: checkoutDate.toISOString(),
        due_date: dueDate.toISOString(),
        return_date: null,
        fine_amount: 0,
        rating: null,
        review: null,
        created_at: serverTimestamp()
      });

      // Create transaction log
      await addDoc(collection(db, 'library_transactions'), {
        transaction_type: 'checkout',
        member_uid: selectedMember.uid,
        member_id: selectedMember.member_id,
        book_id: selectedBook.book_id,
        book_title: selectedBook.book_title || selectedBook.title,
        loan_id: loanData.loan_id,
        librarian_uid: currentUser.uid,
        timestamp: serverTimestamp(),
        notes: `Book checked out to ${selectedMember.full_name}`
      });

      showMessage('success', `Book successfully checked out! Due date: ${dueDate.toLocaleDateString()}`);

      // Reset form
      setSelectedMember(null);
      setSelectedBook(null);
      setMemberSearch('');
      setBookSearch('');
    } catch (error) {
      console.error('Error during checkout:', error);
      showMessage('error', 'Failed to checkout book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const searchLoanForReturn = async () => {
    if (!returnBookSearch.trim()) return;

    setLoading(true);
    try {
      // Search for active loan by book ID or loan ID
      const loansQuery = query(
        collection(db, 'book_loans'),
        where('status', '==', 'active')
      );
      const snapshot = await getDocs(loansQuery);

      const loan = snapshot.docs.find(doc => {
        const data = doc.data();
        return data.book_id === returnBookSearch.trim() ||
               data.loan_id === returnBookSearch.trim();
      });

      if (loan) {
        const loanData = loan.data();

        // Get member info
        const memberQuery = query(
          collection(db, 'library_members'),
          where('member_id', '==', loanData.member_id)
        );
        const memberSnapshot = await getDocs(memberQuery);
        const memberData = memberSnapshot.docs[0]?.data();

        setReturnLoanInfo({
          id: loan.id,
          ...loanData,
          member: memberData
        });
        showMessage('success', 'Loan found! Please verify book condition.');
      } else {
        showMessage('error', 'No active loan found for this book');
        setReturnLoanInfo(null);
      }
    } catch (error) {
      console.error('Error searching loan:', error);
      showMessage('error', 'Error searching for loan');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!returnLoanInfo) {
      showMessage('error', 'Please search for a loan first');
      return;
    }

    setLoading(true);
    try {
      const returnDate = new Date();
      const dueDate = new Date(returnLoanInfo.due_date);
      const daysOverdue = Math.max(0, Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24)));

      // Calculate fine
      let fineAmount = 0;
      const dailyFine = librarySettings?.overdue_fine_per_day || 10;

      if (daysOverdue > 0) {
        fineAmount = daysOverdue * dailyFine;
      }

      // Add damage fine if applicable
      if (bookCondition === 'damaged') {
        fineAmount += librarySettings?.damage_fine || 500;
      } else if (bookCondition === 'lost') {
        fineAmount += librarySettings?.lost_book_fine || 2000;
      }

      // Update loan record
      const loanRef = doc(db, 'book_loans', returnLoanInfo.id);
      await updateDoc(loanRef, {
        status: 'returned',
        return_date: returnDate.toISOString(),
        days_overdue: daysOverdue,
        fine_amount: fineAmount,
        book_condition: bookCondition,
        damage_notes: damageNotes || null,
        returned_by_librarian: currentUser.uid,
        updated_at: serverTimestamp()
      });

      // Update member record
      const memberQuery = query(
        collection(db, 'library_members'),
        where('member_id', '==', returnLoanInfo.member_id)
      );
      const memberSnapshot = await getDocs(memberQuery);

      if (!memberSnapshot.empty) {
        const memberRef = memberSnapshot.docs[0].ref;
        const updateData = {
          current_books_borrowed: increment(-1),
          updated_at: serverTimestamp()
        };

        if (fineAmount > 0) {
          updateData.fine_balance = increment(fineAmount);
        }

        if (daysOverdue > 0) {
          updateData.overdue_count = increment(1);
        }

        await updateDoc(memberRef, updateData);
      }

      // Update inventory (only if book is not lost)
      if (bookCondition !== 'lost') {
        const inventoryQuery = query(
          collection(db, 'library_inventory'),
          where('book_id', '==', returnLoanInfo.book_id)
        );
        const inventorySnapshot = await getDocs(inventoryQuery);

        if (!inventorySnapshot.empty) {
          const inventoryRef = inventorySnapshot.docs[0].ref;
          await updateDoc(inventoryRef, {
            available_copies: increment(1),
            updated_at: serverTimestamp()
          });
        }
      }

      // Update borrowing history
      const historyQuery = query(
        collection(db, 'borrowing_history'),
        where('member_uid', '==', returnLoanInfo.member_uid),
        where('book_id', '==', returnLoanInfo.book_id),
        where('checkout_date', '==', returnLoanInfo.checkout_date)
      );
      const historySnapshot = await getDocs(historyQuery);

      if (!historySnapshot.empty) {
        const historyRef = historySnapshot.docs[0].ref;
        await updateDoc(historyRef, {
          return_date: returnDate.toISOString(),
          fine_amount: fineAmount
        });
      }

      // Create fine record if applicable
      if (fineAmount > 0) {
        await addDoc(collection(db, 'library_fines'), {
          member_uid: returnLoanInfo.member_uid,
          member_id: returnLoanInfo.member_id,
          member_name: returnLoanInfo.member_name,
          book_id: returnLoanInfo.book_id,
          book_title: returnLoanInfo.book_title,
          loan_id: returnLoanInfo.loan_id,
          fine_type: daysOverdue > 0 ? 'overdue' : bookCondition,
          amount: fineAmount,
          days_overdue: daysOverdue,
          status: 'unpaid',
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        });
      }

      // Create transaction log
      await addDoc(collection(db, 'library_transactions'), {
        transaction_type: 'return',
        member_uid: returnLoanInfo.member_uid,
        member_id: returnLoanInfo.member_id,
        book_id: returnLoanInfo.book_id,
        book_title: returnLoanInfo.book_title,
        loan_id: returnLoanInfo.loan_id,
        librarian_uid: currentUser.uid,
        timestamp: serverTimestamp(),
        notes: `Book returned. ${daysOverdue > 0 ? `${daysOverdue} days overdue.` : ''} ${fineAmount > 0 ? `Fine: LKR ${fineAmount}` : ''}`
      });

      let successMsg = 'Book returned successfully!';
      if (fineAmount > 0) {
        successMsg += ` Fine assessed: LKR ${fineAmount}`;
      }
      showMessage('success', successMsg);

      // Reset form
      setReturnLoanInfo(null);
      setReturnBookSearch('');
      setBookCondition('good');
      setDamageNotes('');
    } catch (error) {
      console.error('Error during return:', error);
      showMessage('error', 'Failed to process return. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const markReservationReady = async (reservationId) => {
    setLoading(true);
    try {
      const reservationRef = doc(db, 'book_reservations', reservationId);
      await updateDoc(reservationRef, {
        status: 'ready',
        ready_at: serverTimestamp(),
        notification_sent: false, // Trigger notification
        updated_at: serverTimestamp()
      });

      showMessage('success', 'Reservation marked as ready. Member will be notified.');
      loadPendingReservations();
    } catch (error) {
      console.error('Error updating reservation:', error);
      showMessage('error', 'Failed to update reservation');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Icons.LibraryBig className="w-10 h-10 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Librarian Desk</h1>
                <p className="text-cyan-100">Physical Library Management System</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/library-member-dashboard')}
              className="px-4 py-2 bg-white text-cyan-700 rounded-lg hover:bg-cyan-50 transition flex items-center gap-2"
            >
              <Icons.User className="w-4 h-4" />
              Member View
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <Icons.CheckCircle className="w-5 h-5" />
            ) : (
              <Icons.AlertCircle className="w-5 h-5" />
            )}
            <p>{message.text}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('checkout')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'checkout'
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icons.BookPlus className="w-5 h-5" />
                  Checkout
                </div>
              </button>
              <button
                onClick={() => setActiveTab('return')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'return'
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icons.BookCheck className="w-5 h-5" />
                  Return
                </div>
              </button>
              <button
                onClick={() => setActiveTab('reservations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reservations'
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icons.BookmarkPlus className="w-5 h-5" />
                  Reservations
                  {reservations.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                      {reservations.length}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* CHECKOUT TAB */}
            {activeTab === 'checkout' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Member Selection */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Icons.User className="w-5 h-5 text-cyan-600" />
                      Select Member
                    </h3>

                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={memberSearch}
                          onChange={(e) => setMemberSearch(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleMemberSearch()}
                          placeholder="Enter Member ID..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                        <button
                          onClick={handleMemberSearch}
                          disabled={loading}
                          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition disabled:opacity-50"
                        >
                          <Icons.Search className="w-5 h-5" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setScanMode('member');
                          setShowQRScanner(true);
                        }}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      >
                        <Icons.QrCode className="w-5 h-5" />
                        Scan Member QR Code
                      </button>

                      {selectedMember && (
                        <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Icons.User className="w-8 h-8 text-cyan-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{selectedMember.full_name}</h4>
                              <p className="text-sm text-gray-600">{selectedMember.member_id}</p>
                              <p className="text-sm text-gray-600">{selectedMember.email}</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  selectedMember.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {selectedMember.status}
                                </span>
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                                  Books: {selectedMember.current_books_borrowed}/{selectedMember.max_books_allowed}
                                </span>
                                {selectedMember.fine_balance > 0 && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                                    Fine: LKR {selectedMember.fine_balance}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Book Selection */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Icons.Book className="w-5 h-5 text-cyan-600" />
                      Select Book
                    </h3>

                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={bookSearch}
                          onChange={(e) => setBookSearch(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleBookSearch()}
                          placeholder="Enter Book ID or Call Number..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                        <button
                          onClick={handleBookSearch}
                          disabled={loading}
                          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition disabled:opacity-50"
                        >
                          <Icons.Search className="w-5 h-5" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setScanMode('book');
                          setShowQRScanner(true);
                        }}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      >
                        <Icons.QrCode className="w-5 h-5" />
                        Scan Book Barcode
                      </button>

                      {selectedBook && (
                        <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                              <Icons.BookOpen className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 line-clamp-2">{selectedBook.book_title || selectedBook.title}</h4>
                              <p className="text-sm text-gray-600">{selectedBook.book_author || selectedBook.author}</p>
                              <p className="text-sm text-gray-600 mt-1">Call #: {selectedBook.call_number}</p>
                              <div className="mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  selectedBook.available_copies > 0
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  Available: {selectedBook.available_copies}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleCheckout}
                    disabled={loading || !selectedMember || !selectedBook}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg font-semibold shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Icons.Loader2 className="w-6 h-6 animate-spin" />
                        Processing Checkout...
                      </>
                    ) : (
                      <>
                        <Icons.BookPlus className="w-6 h-6" />
                        Complete Checkout
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* RETURN TAB */}
            {activeTab === 'return' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Icons.Search className="w-5 h-5 text-cyan-600" />
                    Find Loan
                  </h3>

                  <div className="flex gap-2 mb-6">
                    <input
                      type="text"
                      value={returnBookSearch}
                      onChange={(e) => setReturnBookSearch(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchLoanForReturn()}
                      placeholder="Enter Book ID or Loan ID..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                    <button
                      onClick={searchLoanForReturn}
                      disabled={loading}
                      className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition disabled:opacity-50"
                    >
                      <Icons.Search className="w-5 h-5" />
                    </button>
                  </div>

                  {returnLoanInfo && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                      {/* Loan Details */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Loan Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Member</p>
                            <p className="font-medium">{returnLoanInfo.member_name}</p>
                            <p className="text-sm text-gray-500">{returnLoanInfo.member_id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Book</p>
                            <p className="font-medium">{returnLoanInfo.book_title}</p>
                            <p className="text-sm text-gray-500">{returnLoanInfo.book_author}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Checkout Date</p>
                            <p className="font-medium">{new Date(returnLoanInfo.checkout_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Due Date</p>
                            <p className={`font-medium ${
                              new Date(returnLoanInfo.due_date) < new Date() ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {new Date(returnLoanInfo.due_date).toLocaleDateString()}
                              {new Date(returnLoanInfo.due_date) < new Date() && ' (OVERDUE)'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Book Condition */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Book Condition
                        </label>
                        <select
                          value={bookCondition}
                          onChange={(e) => setBookCondition(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        >
                          <option value="good">Good Condition</option>
                          <option value="damaged">Damaged</option>
                          <option value="lost">Lost</option>
                        </select>
                      </div>

                      {/* Damage Notes */}
                      {(bookCondition === 'damaged' || bookCondition === 'lost') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes
                          </label>
                          <textarea
                            value={damageNotes}
                            onChange={(e) => setDamageNotes(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            placeholder="Describe the damage or circumstances..."
                          />
                        </div>
                      )}

                      {/* Process Return Button */}
                      <button
                        onClick={handleReturn}
                        disabled={loading}
                        className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2 font-semibold"
                      >
                        {loading ? (
                          <>
                            <Icons.Loader2 className="w-5 h-5 animate-spin" />
                            Processing Return...
                          </>
                        ) : (
                          <>
                            <Icons.BookCheck className="w-5 h-5" />
                            Complete Return
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* RESERVATIONS TAB */}
            {activeTab === 'reservations' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Pending Reservations</h3>
                  <button
                    onClick={loadPendingReservations}
                    disabled={loading}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <Icons.RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {reservations.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Icons.BookmarkCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No pending reservations</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reservations.map((reservation) => (
                      <div key={reservation.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                reservation.status === 'ready'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {reservation.status.toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-500">
                                Reserved {new Date(reservation.reserved_at.seconds * 1000).toLocaleDateString()}
                              </span>
                            </div>

                            <h4 className="font-semibold text-gray-900 mb-1">{reservation.book_title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{reservation.book_author}</p>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Member</p>
                                <p className="font-medium">{reservation.member_name}</p>
                                <p className="text-gray-500">{reservation.member_id}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Contact</p>
                                <p className="font-medium">{reservation.member_phone}</p>
                                <p className="text-gray-500">{reservation.member_email}</p>
                              </div>
                            </div>
                          </div>

                          {reservation.status === 'pending' && (
                            <button
                              onClick={() => markReservationReady(reservation.id)}
                              disabled={loading}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
                            >
                              <Icons.CheckCircle className="w-4 h-4" />
                              Mark Ready
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* QR Scanner Modal */}
        {showQRScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Scan QR Code</h3>
                <button
                  onClick={() => setShowQRScanner(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icons.X className="w-6 h-6" />
                </button>
              </div>
              <Html5QrcodePlugin
                fps={10}
                qrbox={250}
                disableFlip={false}
                qrCodeSuccessCallback={handleQRScan}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibrarianDesk;
