import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * PDF Export Utilities for Government Services
 * Generates professional PDFs with NARA branding
 */

// NARA Brand Colors
const COLORS = {
  primary: [12, 126, 175], // Teal
  secondary: [46, 125, 50], // Green
  accent: [33, 150, 243], // Blue
  text: [33, 33, 33],
  textLight: [117, 117, 117],
  border: [189, 189, 189]
};

/**
 * Add NARA Header to PDF
 */
const addHeader = (doc, title) => {
  // Header background
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, 210, 40, 'F');
  
  // NARA Logo placeholder (would use actual logo if available)
  doc.setFillColor(255, 255, 255);
  doc.circle(20, 20, 10, 'F');
  
  // Organization name
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('NARA', 35, 18);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('National Aquatic Resources', 35, 24);
  doc.text('Research & Development Agency', 35, 28);
  
  // Document title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const pageWidth = doc.internal.pageSize.width;
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, pageWidth - titleWidth - 15, 24);
};

/**
 * Add Footer to PDF
 */
const addFooter = (doc, pageNumber) => {
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  
  // Footer line
  doc.setDrawColor(...COLORS.border);
  doc.line(15, pageHeight - 25, pageWidth - 15, pageHeight - 25);
  
  // Footer text
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.textLight);
  doc.setFont('helvetica', 'normal');
  doc.text('Crow Island, Colombo 15, Sri Lanka', 15, pageHeight - 18);
  doc.text('Tel: +94 11 2521000 | Email: info@nara.gov.lk | Web: www.nara.gov.lk', 15, pageHeight - 13);
  
  // Page number
  doc.text(`Page ${pageNumber}`, pageWidth - 30, pageHeight - 13);
  
  // Generation timestamp
  const timestamp = new Date().toLocaleString();
  doc.text(`Generated: ${timestamp}`, pageWidth / 2 - 30, pageHeight - 13);
};

/**
 * Export EIA Application to PDF
 */
export const exportEIAToPDF = (application) => {
  try {
    const doc = new jsPDF();
    let yPos = 50;
    
    // Header
    addHeader(doc, 'EIA APPLICATION');
    
    // Application ID
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text(`Application ID: ${application.applicationId}`, 15, yPos);
    yPos += 10;
    
    // Status badge
    doc.setFontSize(10);
    const statusColor = application.status === 'approved' ? COLORS.secondary : 
                       application.status === 'rejected' ? [211, 47, 47] : 
                       [255, 152, 0];
    doc.setFillColor(...statusColor);
    doc.roundedRect(150, yPos - 7, 45, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(application.status.toUpperCase(), 155, yPos - 2);
    yPos += 15;
    
    // Project Information
    doc.setFontSize(14);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('PROJECT INFORMATION', 15, yPos);
    yPos += 10;
    
    const projectInfo = [
      ['Project Name', application.projectName],
      ['Project Type', application.projectType],
      ['Location', `${application.location}, ${application.district}`],
      ['Estimated Budget', `LKR ${Number(application.estimatedBudget || 0).toLocaleString()}`],
      ['Duration', `${application.projectDuration} months`],
      ['Start Date', new Date(application.startDate).toLocaleDateString()],
      ['End Date', application.endDate ? new Date(application.endDate).toLocaleDateString() : 'N/A']
    ];
    
    doc.autoTable({
      startY: yPos,
      head: [],
      body: projectInfo,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: COLORS.textLight, cellWidth: 50 },
        1: { textColor: COLORS.text }
      }
    });
    
    yPos = doc.lastAutoTable.finalY + 15;
    
    // Project Description
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('PROJECT DESCRIPTION', 15, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'normal');
    const splitDescription = doc.splitTextToSize(application.description, 180);
    doc.text(splitDescription, 15, yPos);
    yPos += splitDescription.length * 5 + 10;
    
    // Environmental Impact
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
      addHeader(doc, 'EIA APPLICATION');
      yPos = 50;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('ENVIRONMENTAL IMPACT ASSESSMENT', 15, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'normal');
    const splitImpact = doc.splitTextToSize(application.environmentalImpact, 180);
    doc.text(splitImpact, 15, yPos);
    yPos += splitImpact.length * 5 + 10;
    
    // Mitigation Measures
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
      addHeader(doc, 'EIA APPLICATION');
      yPos = 50;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('MITIGATION MEASURES', 15, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'normal');
    const splitMitigation = doc.splitTextToSize(application.mitigationMeasures, 180);
    doc.text(splitMitigation, 15, yPos);
    yPos += splitMitigation.length * 5 + 10;
    
    // Applicant Information
    if (yPos > 230) {
      doc.addPage();
      yPos = 20;
      addHeader(doc, 'EIA APPLICATION');
      yPos = 50;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('APPLICANT INFORMATION', 15, yPos);
    yPos += 10;
    
    const applicantInfo = [
      ['Name', application.applicantName],
      ['Organization', application.applicantOrganization],
      ['Email', application.contactEmail],
      ['Phone', application.contactPhone],
      ['Submitted', new Date(application.submittedAt?.toDate ? application.submittedAt.toDate() : application.submittedAt).toLocaleString()]
    ];
    
    doc.autoTable({
      startY: yPos,
      head: [],
      body: applicantInfo,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: COLORS.textLight, cellWidth: 50 },
        1: { textColor: COLORS.text }
      }
    });
    
    // Documents
    if (application.documents && application.documents.length > 0) {
      yPos = doc.lastAutoTable.finalY + 15;
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
        addHeader(doc, 'EIA APPLICATION');
        yPos = 50;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(...COLORS.primary);
      doc.setFont('helvetica', 'bold');
      doc.text('SUPPORTING DOCUMENTS', 15, yPos);
      yPos += 10;
      
      const docList = application.documents.map((doc, idx) => [
        `${idx + 1}`,
        doc.name,
        `${(doc.size / 1024).toFixed(2)} KB`
      ]);
      
      doc.autoTable({
        startY: yPos,
        head: [['#', 'Document Name', 'Size']],
        body: docList,
        theme: 'striped',
        headStyles: { fillColor: COLORS.primary, textColor: [255, 255, 255] },
        styles: { fontSize: 9, cellPadding: 3 }
      });
    }
    
    // Footer
    addFooter(doc, 1);
    
    // Save PDF
    const filename = `NARA_EIA_${application.applicationId}_${Date.now()}.pdf`;
    doc.save(filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('PDF generation error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export License Certificate to PDF
 */
export const exportLicenseToPDF = (license) => {
  try {
    const doc = new jsPDF();
    
    // Certificate Header
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, 210, 50, 'F');
    
    // Logo placeholder
    doc.setFillColor(255, 255, 255);
    doc.circle(105, 25, 15, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('NARA', 105, 30, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('National Aquatic Resources Research & Development Agency', 105, 40, { align: 'center' });
    
    // Certificate Title
    doc.setFontSize(20);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('LICENSE CERTIFICATE', 105, 70, { align: 'center' });
    
    // License Type
    doc.setFontSize(16);
    doc.setTextColor(...COLORS.secondary);
    const licenseTypeName = license.licenseType === 'fishing' ? 'Fishing License' :
                           license.licenseType === 'anchoring' ? 'Anchoring License' :
                           'Industrial License';
    doc.text(licenseTypeName, 105, 85, { align: 'center' });
    
    // License Number (if issued)
    if (license.licenseNumber) {
      doc.setFontSize(14);
      doc.setTextColor(...COLORS.text);
      doc.setFont('helvetica', 'bold');
      doc.text(`License No: ${license.licenseNumber}`, 105, 100, { align: 'center' });
    } else {
      doc.setFontSize(12);
      doc.setTextColor(...COLORS.textLight);
      doc.text(`Application ID: ${license.applicationId}`, 105, 100, { align: 'center' });
    }
    
    let yPos = 120;
    
    // Licensee Information
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.5);
    doc.rect(20, yPos, 170, 60);
    
    yPos += 10;
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('LICENSED TO:', 25, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${license.applicantName}`, 25, yPos);
    yPos += 8;
    doc.text(`NIC: ${license.applicantNIC}`, 25, yPos);
    yPos += 8;
    doc.text(`Address: ${license.applicantAddress}`, 25, yPos);
    yPos += 8;
    doc.text(`Contact: ${license.contactPhone} | ${license.contactEmail}`, 25, yPos);
    
    yPos += 20;
    
    // License Details
    if (license.vesselName) {
      doc.setFontSize(12);
      doc.setTextColor(...COLORS.primary);
      doc.setFont('helvetica', 'bold');
      doc.text('VESSEL INFORMATION:', 25, yPos);
      yPos += 10;
      
      doc.setFontSize(11);
      doc.setTextColor(...COLORS.text);
      doc.setFont('helvetica', 'normal');
      doc.text(`Vessel Name: ${license.vesselName}`, 25, yPos);
      yPos += 8;
      doc.text(`Registration No: ${license.vesselRegNo}`, 25, yPos);
      yPos += 15;
    }
    
    if (license.businessName) {
      doc.setFontSize(12);
      doc.setTextColor(...COLORS.primary);
      doc.setFont('helvetica', 'bold');
      doc.text('BUSINESS INFORMATION:', 25, yPos);
      yPos += 10;
      
      doc.setFontSize(11);
      doc.setTextColor(...COLORS.text);
      doc.setFont('helvetica', 'normal');
      doc.text(`Business Name: ${license.businessName}`, 25, yPos);
      yPos += 8;
      doc.text(`Registration No: ${license.businessRegNo}`, 25, yPos);
      yPos += 15;
    }
    
    // Operation Area
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('AUTHORIZED OPERATION:', 25, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'normal');
    doc.text(`Area: ${license.operationArea}`, 25, yPos);
    yPos += 8;
    const splitDesc = doc.splitTextToSize(license.operationDescription, 160);
    doc.text(splitDesc, 25, yPos);
    yPos += splitDesc.length * 6 + 10;
    
    // Validity Period
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos, 170, 25, 'F');
    yPos += 8;
    
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'bold');
    doc.text('Valid From:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(license.validFrom).toLocaleDateString(), 70, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Valid Until:', 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(license.validUntil).toLocaleDateString(), 70, yPos);
    
    yPos += 20;
    
    // Status
    const statusColor = license.status === 'active' ? COLORS.secondary :
                       license.status === 'expired' ? [211, 47, 47] :
                       [255, 152, 0];
    doc.setFillColor(...statusColor);
    doc.roundedRect(20, yPos, 40, 10, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(license.status.toUpperCase(), 25, yPos + 7);
    
    // Footer
    addFooter(doc, 1);
    
    // Save PDF
    const filename = license.licenseNumber ? 
      `NARA_License_${license.licenseNumber}_${Date.now()}.pdf` :
      `NARA_License_Application_${license.applicationId}_${Date.now()}.pdf`;
    doc.save(filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('PDF generation error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export Emergency Report to PDF
 */
export const exportEmergencyToPDF = (incident) => {
  try {
    const doc = new jsPDF();
    let yPos = 50;
    
    // Header with urgent styling
    doc.setFillColor(211, 47, 47);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('⚠ EMERGENCY INCIDENT REPORT', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('NARA - National Aquatic Resources Research & Development Agency', 105, 30, { align: 'center' });
    
    // Incident ID
    doc.setFontSize(14);
    doc.setTextColor(211, 47, 47);
    doc.setFont('helvetica', 'bold');
    doc.text(`Incident ID: ${incident.incidentId}`, 15, yPos);
    
    // Severity Badge
    const severityColors = {
      critical: [211, 47, 47],
      high: [255, 152, 0],
      medium: [255, 193, 7],
      low: [76, 175, 80]
    };
    doc.setFillColor(...severityColors[incident.severity]);
    doc.roundedRect(150, yPos - 7, 45, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(incident.severity.toUpperCase(), 155, yPos - 2);
    
    yPos += 15;
    
    // Incident Title
    doc.setFontSize(16);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'bold');
    const splitTitle = doc.splitTextToSize(incident.title, 180);
    doc.text(splitTitle, 15, yPos);
    yPos += splitTitle.length * 8 + 10;
    
    // Key Information
    const keyInfo = [
      ['Incident Type', incident.incidentType.replace('_', ' ').toUpperCase()],
      ['Status', incident.status.toUpperCase()],
      ['Reported', new Date(incident.reportedAt?.toDate ? incident.reportedAt.toDate() : incident.reportedAt).toLocaleString()],
      ['Location', `${incident.location}, ${incident.district}`]
    ];
    
    if (incident.coordinates) {
      keyInfo.push(['GPS Coordinates', incident.coordinates]);
    }
    
    doc.autoTable({
      startY: yPos,
      head: [],
      body: keyInfo,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [240, 240, 240], cellWidth: 50 },
        1: { textColor: COLORS.text }
      }
    });
    
    yPos = doc.lastAutoTable.finalY + 15;
    
    // Description
    doc.setFontSize(12);
    doc.setTextColor(211, 47, 47);
    doc.setFont('helvetica', 'bold');
    doc.text('INCIDENT DESCRIPTION', 15, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'normal');
    const splitDesc = doc.splitTextToSize(incident.description, 180);
    doc.text(splitDesc, 15, yPos);
    yPos += splitDesc.length * 5 + 15;
    
    // Immediate Action
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(211, 47, 47);
    doc.setFont('helvetica', 'bold');
    doc.text('IMMEDIATE ACTION TAKEN', 15, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'normal');
    const splitAction = doc.splitTextToSize(incident.immediateAction, 180);
    doc.text(splitAction, 15, yPos);
    yPos += splitAction.length * 5 + 15;
    
    // Reporter Information
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(211, 47, 47);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTED BY', 15, yPos);
    yPos += 10;
    
    const reporterInfo = [
      ['Name', incident.reporterName],
      ['Contact', incident.reporterContact],
      ['Email', incident.reporterEmail || 'N/A']
    ];
    
    doc.autoTable({
      startY: yPos,
      head: [],
      body: reporterInfo,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: COLORS.textLight, cellWidth: 50 },
        1: { textColor: COLORS.text }
      }
    });
    
    // Emergency Contact
    yPos = doc.lastAutoTable.finalY + 20;
    doc.setFillColor(211, 47, 47);
    doc.rect(15, yPos, 180, 30, 'F');
    
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('EMERGENCY HOTLINE: 1915', 105, yPos, { align: 'center' });
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Available 24/7 for Marine Emergencies', 105, yPos, { align: 'center' });
    
    // Footer
    addFooter(doc, 1);
    
    // Save PDF
    const filename = `NARA_Emergency_${incident.incidentId}_${Date.now()}.pdf`;
    doc.save(filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('PDF generation error:', error);
    return { success: false, error: error.message };
  }
};

export default {
  exportEIAToPDF,
  exportLicenseToPDF,
  exportEmergencyToPDF
};
