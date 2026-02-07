import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * QR Code Component for Lab Result Verification
 * Generates QR code linking to result verification page
 */
const ResultQRCode = ({ resultId, size = 200, showDownload = true }) => {
  const { t } = useTranslation('labResults');
  const [downloaded, setDownloaded] = useState(false);

  // Generate verification URL
  const verificationURL = `https://nara-web-73384.web.app/lab-results/verify/${resultId}`;

  // Download QR code as image
  const downloadQRCode = () => {
    const svg = document.getElementById(`qr-code-${resultId}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = size + 100;
    canvas.height = size + 150;

    img.onload = () => {
      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // NARA branding
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('NARA Laboratory Results', canvas.width / 2, 30);

      // QR Code
      ctx.drawImage(img, 50, 50, size, size);

      // Result ID
      ctx.fillStyle = '#374151';
      ctx.font = '14px Arial';
      ctx.fillText(`Result ID: ${resultId}`, canvas.width / 2, size + 80);

      // Instructions
      ctx.font = '12px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('Scan to verify authenticity', canvas.width / 2, size + 105);

      // Download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `NARA_QR_${resultId}.png`;
        link.click();
        URL.revokeObjectURL(url);
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 2000);
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-2xl shadow-lg border-2 border-gray-100">
      {/* Header */}
      <div className="text-center">
        <h4 className="font-bold text-gray-900 mb-1">Result Verification</h4>
        <p className="text-sm text-gray-600">Scan QR code to verify authenticity</p>
      </div>

      {/* QR Code */}
      <div className="p-4 bg-white rounded-xl border-4 border-blue-600">
        <QRCodeSVG
          id={`qr-code-${resultId}`}
          value={verificationURL}
          size={size}
          level="H"
          includeMargin={true}
          imageSettings={{
            src: "/logo192.png",
            height: 40,
            width: 40,
            excavate: true
          }}
        />
      </div>

      {/* Result ID */}
      <div className="text-center">
        <p className="text-xs text-gray-500 mb-1">Result ID</p>
        <p className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-4 py-2 rounded-lg">
          {resultId}
        </p>
      </div>

      {/* Actions */}
      {showDownload && (
        <div className="flex gap-2 w-full">
          <motion.button
            onClick={downloadQRCode}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
              downloaded
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {downloaded ? (
              <>
                <Icons.Check size={18} />
                Downloaded
              </>
            ) : (
              <>
                <Icons.Download size={18} />
                Download QR
              </>
            )}
          </motion.button>

          <button
            onClick={() => navigator.clipboard.writeText(verificationURL)}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
            title="Copy verification URL"
          >
            <Icons.Copy size={18} />
          </button>
        </div>
      )}

      {/* URL Preview */}
      <div className="w-full pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-1">Verification URL:</p>
        <p className="text-xs text-blue-600 break-all font-mono bg-blue-50 px-3 py-2 rounded-lg">
          {verificationURL}
        </p>
      </div>
    </div>
  );
};

export default ResultQRCode;
