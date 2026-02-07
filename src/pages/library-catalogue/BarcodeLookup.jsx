/**
 * Barcode Lookup Component
 * Redirects QR code scans to the correct book detail page
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { catalogueService } from '../../services/libraryService';
import { Loader2 } from 'lucide-react';

const BarcodeLookup = () => {
  const { barcode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const lookupBook = async () => {
      try {
        // Lookup book by barcode
        const response = await catalogueService.getItemByBarcode(barcode);

        if (response.success && response.data) {
          // Redirect to the book detail page
          navigate(`/library/item/${response.data.id}`, { replace: true });
        } else {
          setError('Book not found with barcode: ' + barcode);
        }
      } catch (err) {
        console.error('Error looking up book:', err);
        setError('Failed to lookup book. Please try again.');
      }
    };

    if (barcode) {
      lookupBook();
    }
  }, [barcode, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/library')}
              className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
            >
              Browse Library Catalogue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Looking up book...</h2>
        <p className="text-gray-600">Barcode: {barcode}</p>
      </div>
    </div>
  );
};

export default BarcodeLookup;
