import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';

/**
 * Professional PDF Export for NARA Lab Results
 * Includes official letterhead, logo, QR code, and branding
 */

const NARA_COLORS = {
  primary: '#1e3a8a',      // Dark blue
  secondary: '#10b981',     // Green
  accent: '#06b6d4',        // Cyan
  text: '#374151',          // Gray
  lightBg: '#f3f4f6'        // Light gray
};

/**
 * Add NARA letterhead to PDF
 */
const addLetterhead = async (doc, pageNumber, totalPages) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Header Background
  doc.setFillColor(NARA_COLORS.primary);
  doc.rect(0, 0, pageWidth, 35, 'F');

  // Try to add logo (if available)
  try {
    // Logo should be placed in /public/images/nara-logo.png
    const logoPath = '/images/nara-logo.png';
    doc.addImage(logoPath, 'PNG', 15, 8, 20, 20);
  } catch (error) {
    console.warn('Logo not found, continuing without logo');
  }

  // Organization Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('NARA', 40, 15);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('National Aquatic Resources Research & Development Agency', 40, 22);
  doc.text('Ministry of Fisheries', 40, 27);

  // Footer
  doc.setFillColor(NARA_COLORS.lightBg);
  doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
  
  doc.setTextColor(NARA_COLORS.text);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Crow Island, Colombo 15, Sri Lanka', 15, pageHeight - 12);
  doc.text('Tel: +94 11 2521000 | Email: info@nara.gov.lk | Web: www.nara.gov.lk', 15, pageHeight - 7);

  // Page number
  doc.setFontSize(8);
  doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 30, pageHeight - 10);

  // Reset text color
  doc.setTextColor(NARA_COLORS.text);
};

/**
 * Export single lab result as professional PDF
 */
export const exportLabResultToPDF = async (result) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPos = 45; // Start below header

    // Add letterhead
    await addLetterhead(doc, 1, 1);

    // Document Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(NARA_COLORS.primary);
    doc.text('Laboratory Test Result Report', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Result ID & Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(NARA_COLORS.text);
    doc.text(`Report ID: ${result.id}`, 15, yPos);
    doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, pageWidth - 60, yPos);
    yPos += 10;

    // Separator Line
    doc.setDrawColor(NARA_COLORS.accent);
    doc.setLineWidth(0.5);
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 10;

    // Test Information Section
    doc.setFillColor(NARA_COLORS.lightBg);
    doc.rect(15, yPos, pageWidth - 30, 8, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(NARA_COLORS.primary);
    doc.text('Test Information', 17, yPos + 6);
    yPos += 15;

    // Test details
    const testInfo = [
      ['Test Type:', result.testType || 'N/A'],
      ['Sample Type:', result.sampleType || 'N/A'],
      ['Sample ID:', result.sampleId || 'N/A'],
      ['Status:', result.status || 'N/A'],
      ['Project:', result.projectName || 'N/A'],
      ['Location:', result.location || 'N/A'],
      ['Researcher:', result.researcherName || 'N/A']
    ];

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(NARA_COLORS.text);

    testInfo.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 70, yPos);
      yPos += 7;
    });

    yPos += 5;

    // Timeline Section
    doc.setFillColor(NARA_COLORS.lightBg);
    doc.rect(15, yPos, pageWidth - 30, 8, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(NARA_COLORS.primary);
    doc.text('Timeline', 17, yPos + 6);
    yPos += 15;

    const timeline = [
      ['Submitted:', result.createdAt ? new Date(result.createdAt).toLocaleString() : 'N/A'],
      ['Received:', result.receivedAt ? new Date(result.receivedAt).toLocaleString() : 'N/A'],
      ['Completed:', result.completedAt ? new Date(result.completedAt).toLocaleString() : 'N/A']
    ];

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(NARA_COLORS.text);

    timeline.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 70, yPos);
      yPos += 7;
    });

    yPos += 5;

    // Test Parameters Table (if available)
    if (result.parameters && result.parameters.length > 0) {
      doc.setFillColor(NARA_COLORS.lightBg);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(NARA_COLORS.primary);
      doc.text('Test Parameters & Results', 17, yPos + 6);
      yPos += 12;

      const tableData = result.parameters.map(param => [
        param.name || 'N/A',
        param.value || 'N/A',
        param.unit || '-',
        param.method || 'N/A',
        param.status || 'N/A'
      ]);

      doc.autoTable({
        startY: yPos,
        head: [['Parameter', 'Value', 'Unit', 'Method', 'Status']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: NARA_COLORS.primary,
          textColor: '#FFFFFF',
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 9,
          textColor: NARA_COLORS.text
        },
        alternateRowStyles: {
          fillColor: NARA_COLORS.lightBg
        },
        margin: { left: 15, right: 15 }
      });

      yPos = doc.lastAutoTable.finalY + 10;
    }

    // Notes Section (if available)
    if (result.notes) {
      if (yPos > 240) {
        doc.addPage();
        await addLetterhead(doc, 2, 2);
        yPos = 45;
      }

      doc.setFillColor(NARA_COLORS.lightBg);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(NARA_COLORS.primary);
      doc.text('Notes & Observations', 17, yPos + 6);
      yPos += 12;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(NARA_COLORS.text);
      const splitNotes = doc.splitTextToSize(result.notes, pageWidth - 40);
      doc.text(splitNotes, 20, yPos);
      yPos += splitNotes.length * 5 + 10;
    }

    // QR Code for Verification
    try {
      const verificationURL = `https://nara-web-73384.web.app/lab-results/verify/${result.id}`;
      const qrDataURL = await QRCode.toDataURL(verificationURL, { width: 80, margin: 1 });

      if (yPos > 220) {
        doc.addPage();
        await addLetterhead(doc, 2, 2);
        yPos = 45;
      }

      doc.setFillColor(NARA_COLORS.lightBg);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(NARA_COLORS.primary);
      doc.text('Verification', 17, yPos + 6);
      yPos += 15;

      doc.addImage(qrDataURL, 'PNG', 20, yPos, 40, 40);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Scan QR code to verify', 20, yPos + 45);
      doc.text('this report\'s authenticity', 20, yPos + 50);
      
      doc.setFontSize(8);
      doc.setTextColor(NARA_COLORS.text);
      doc.text(`Verification URL:`, 70, yPos + 10);
      doc.text(verificationURL, 70, yPos + 15, { maxWidth: pageWidth - 90 });
    } catch (error) {
      console.error('Error adding QR code:', error);
    }

    // Digital Signature Placeholder
    const signatureY = doc.internal.pageSize.height - 60;
    doc.setDrawColor(NARA_COLORS.text);
    doc.line(pageWidth - 80, signatureY, pageWidth - 20, signatureY);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Authorized Signatory', pageWidth - 80, signatureY + 5);
    doc.setFontSize(8);
    doc.text('NARA Laboratory Services', pageWidth - 80, signatureY + 10);

    // Save PDF
    const filename = `NARA_Lab_Result_${result.id}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);

    return {
      success: true,
      filename
    };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Export multiple results as combined PDF report
 */
export const exportMultipleResultsToPDF = async (results) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let currentPage = 1;
    const totalPages = results.length + 1; // Cover + results

    // Cover Page
    await addLetterhead(doc, currentPage, totalPages);

    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(NARA_COLORS.primary);
    doc.text('Laboratory Results', pageWidth / 2, 80, { align: 'center' });
    doc.text('Comprehensive Report', pageWidth / 2, 95, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(NARA_COLORS.text);
    doc.text(`Total Results: ${results.length}`, pageWidth / 2, 120, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 130, { align: 'center' });

    // Summary Table
    const summaryData = results.map((r, idx) => [
      idx + 1,
      r.testType || 'N/A',
      r.sampleId || 'N/A',
      r.status || 'N/A',
      r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'
    ]);

    doc.autoTable({
      startY: 150,
      head: [['#', 'Test Type', 'Sample ID', 'Status', 'Date']],
      body: summaryData,
      theme: 'grid',
      headStyles: {
        fillColor: NARA_COLORS.primary,
        textColor: '#FFFFFF'
      },
      margin: { left: 15, right: 15 }
    });

    // Individual result pages
    for (let i = 0; i < results.length; i++) {
      doc.addPage();
      currentPage++;
      
      const result = results[i];
      let yPos = 45;

      await addLetterhead(doc, currentPage, totalPages);

      // Result details (simplified for multi-result PDF)
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(NARA_COLORS.primary);
      doc.text(`Result ${i + 1}: ${result.testType || 'Lab Test'}`, 15, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(NARA_COLORS.text);
      
      const details = [
        ['Sample ID:', result.sampleId || 'N/A'],
        ['Sample Type:', result.sampleType || 'N/A'],
        ['Status:', result.status || 'N/A'],
        ['Date:', result.createdAt ? new Date(result.createdAt).toLocaleDateString() : 'N/A']
      ];

      details.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 60, yPos);
        yPos += 7;
      });
    }

    // Save PDF
    const filename = `NARA_Lab_Results_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);

    return {
      success: true,
      filename,
      resultCount: results.length
    };
  } catch (error) {
    console.error('Error generating combined PDF:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
