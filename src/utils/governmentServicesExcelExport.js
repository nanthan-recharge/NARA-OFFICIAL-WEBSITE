import * as XLSX from 'xlsx';

/**
 * Excel Export Utilities for Government Services
 * Exports data to Excel format with proper formatting
 */

/**
 * Export EIA Applications to Excel
 */
export const exportEIAToExcel = (applications) => {
  try {
    // Prepare data for Excel
    const excelData = applications.map((app, index) => ({
      'No.': index + 1,
      'Application ID': app.applicationId || 'N/A',
      'Project Name': app.projectName || '',
      'Project Type': app.projectType || '',
      'Location': `${app.location}, ${app.district}`,
      'Budget (LKR)': app.estimatedBudget || 0,
      'Duration (months)': app.projectDuration || 0,
      'Start Date': app.startDate ? new Date(app.startDate).toLocaleDateString() : 'N/A',
      'Applicant': app.applicantName || '',
      'Organization': app.applicantOrganization || '',
      'Contact Email': app.contactEmail || '',
      'Contact Phone': app.contactPhone || '',
      'Status': app.status || 'pending',
      'Submitted': app.submittedAt ? new Date(app.submittedAt.toDate ? app.submittedAt.toDate() : app.submittedAt).toLocaleString() : 'N/A',
      'Documents': app.documents ? app.documents.length : 0
    }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Add main data sheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    const colWidths = [
      { wch: 5 },   // No.
      { wch: 20 },  // Application ID
      { wch: 30 },  // Project Name
      { wch: 20 },  // Project Type
      { wch: 25 },  // Location
      { wch: 15 },  // Budget
      { wch: 12 },  // Duration
      { wch: 12 },  // Start Date
      { wch: 20 },  // Applicant
      { wch: 25 },  // Organization
      { wch: 25 },  // Email
      { wch: 15 },  // Phone
      { wch: 12 },  // Status
      { wch: 20 },  // Submitted
      { wch: 10 }   // Documents
    ];
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, 'EIA Applications');
    
    // Add summary sheet
    const summary = [
      ['NARA - EIA Applications Report', ''],
      ['Generated', new Date().toLocaleString()],
      ['', ''],
      ['Summary Statistics', ''],
      ['Total Applications', applications.length],
      ['Pending', applications.filter(a => a.status === 'pending').length],
      ['Approved', applications.filter(a => a.status === 'approved').length],
      ['Rejected', applications.filter(a => a.status === 'rejected').length],
      ['', ''],
      ['Total Budget (LKR)', applications.reduce((sum, a) => sum + (Number(a.estimatedBudget) || 0), 0).toLocaleString()]
    ];
    
    const wsSummary = XLSX.utils.aoa_to_sheet(summary);
    wsSummary['!cols'] = [{ wch: 30 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
    
    // Generate filename
    const filename = `NARA_EIA_Applications_${Date.now()}.xlsx`;
    
    // Write file
    XLSX.writeFile(wb, filename);
    
    return { success: true, filename, count: applications.length };
  } catch (error) {
    console.error('Excel export error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export License Applications to Excel
 */
export const exportLicensesToExcel = (licenses) => {
  try {
    // Prepare data
    const excelData = licenses.map((license, index) => ({
      'No.': index + 1,
      'Application ID': license.applicationId || 'N/A',
      'License Number': license.licenseNumber || 'Pending',
      'License Type': license.licenseType ? license.licenseType.replace('_', ' ').toUpperCase() : '',
      'Applicant Name': license.applicantName || '',
      'NIC': license.applicantNIC || '',
      'Contact': license.contactPhone || '',
      'Email': license.contactEmail || '',
      'Vessel Name': license.vesselName || 'N/A',
      'Vessel Reg No': license.vesselRegNo || 'N/A',
      'Business Name': license.businessName || 'N/A',
      'Business Reg No': license.businessRegNo || 'N/A',
      'Operation Area': license.operationArea || '',
      'Valid From': license.validFrom ? new Date(license.validFrom).toLocaleDateString() : 'N/A',
      'Valid Until': license.validUntil ? new Date(license.validUntil).toLocaleDateString() : 'N/A',
      'Status': license.status || 'pending',
      'Fee (LKR)': license.licenseFee || 0,
      'Payment Status': license.paymentStatus || 'pending',
      'Submitted': license.submittedAt ? new Date(license.submittedAt.toDate ? license.submittedAt.toDate() : license.submittedAt).toLocaleString() : 'N/A'
    }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Add main data sheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    const colWidths = [
      { wch: 5 },   // No.
      { wch: 25 },  // Application ID
      { wch: 20 },  // License Number
      { wch: 15 },  // License Type
      { wch: 20 },  // Applicant
      { wch: 15 },  // NIC
      { wch: 15 },  // Contact
      { wch: 25 },  // Email
      { wch: 20 },  // Vessel Name
      { wch: 15 },  // Vessel Reg
      { wch: 25 },  // Business Name
      { wch: 15 },  // Business Reg
      { wch: 25 },  // Operation Area
      { wch: 12 },  // Valid From
      { wch: 12 },  // Valid Until
      { wch: 12 },  // Status
      { wch: 12 },  // Fee
      { wch: 15 },  // Payment Status
      { wch: 20 }   // Submitted
    ];
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, 'License Applications');
    
    // Add summary sheet
    const summary = [
      ['NARA - License Applications Report', ''],
      ['Generated', new Date().toLocaleString()],
      ['', ''],
      ['Summary Statistics', ''],
      ['Total Applications', licenses.length],
      ['Pending', licenses.filter(l => l.status === 'pending').length],
      ['Active', licenses.filter(l => l.status === 'active').length],
      ['Expired', licenses.filter(l => l.status === 'expired').length],
      ['', ''],
      ['By License Type', ''],
      ['Fishing', licenses.filter(l => l.licenseType === 'fishing').length],
      ['Anchoring', licenses.filter(l => l.licenseType === 'anchoring').length],
      ['Industrial', licenses.filter(l => l.licenseType === 'industrial').length],
      ['', ''],
      ['Revenue Statistics', ''],
      ['Total Fees (LKR)', licenses.reduce((sum, l) => sum + (Number(l.licenseFee) || 0), 0).toLocaleString()],
      ['Paid', licenses.filter(l => l.paymentStatus === 'paid').length],
      ['Pending Payment', licenses.filter(l => l.paymentStatus === 'pending').length]
    ];
    
    const wsSummary = XLSX.utils.aoa_to_sheet(summary);
    wsSummary['!cols'] = [{ wch: 30 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
    
    // Generate filename
    const filename = `NARA_License_Applications_${Date.now()}.xlsx`;
    
    // Write file
    XLSX.writeFile(wb, filename);
    
    return { success: true, filename, count: licenses.length };
  } catch (error) {
    console.error('Excel export error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export Emergency Incidents to Excel
 */
export const exportEmergenciesToExcel = (incidents) => {
  try {
    // Prepare data
    const excelData = incidents.map((incident, index) => ({
      'No.': index + 1,
      'Incident ID': incident.incidentId || 'N/A',
      'Title': incident.title || '',
      'Type': incident.incidentType ? incident.incidentType.replace('_', ' ').toUpperCase() : '',
      'Severity': incident.severity ? incident.severity.toUpperCase() : '',
      'Status': incident.status ? incident.status.toUpperCase() : '',
      'Location': incident.location || '',
      'District': incident.district || '',
      'GPS Coordinates': incident.coordinates || 'N/A',
      'Description': incident.description || '',
      'Immediate Action': incident.immediateAction || '',
      'Reporter Name': incident.reporterName || '',
      'Reporter Contact': incident.reporterContact || '',
      'Reporter Email': incident.reporterEmail || 'N/A',
      'Reported At': incident.reportedAt ? new Date(incident.reportedAt.toDate ? incident.reportedAt.toDate() : incident.reportedAt).toLocaleString() : 'N/A',
      'Photos': incident.photos ? incident.photos.length : 0,
      'Response Team': incident.responseTeam || 'Not Assigned',
      'Resolution Date': incident.resolutionDate ? new Date(incident.resolutionDate).toLocaleString() : 'Ongoing'
    }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Add main data sheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    const colWidths = [
      { wch: 5 },   // No.
      { wch: 25 },  // Incident ID
      { wch: 30 },  // Title
      { wch: 20 },  // Type
      { wch: 12 },  // Severity
      { wch: 12 },  // Status
      { wch: 25 },  // Location
      { wch: 15 },  // District
      { wch: 20 },  // GPS
      { wch: 40 },  // Description
      { wch: 40 },  // Action
      { wch: 20 },  // Reporter Name
      { wch: 15 },  // Reporter Contact
      { wch: 25 },  // Reporter Email
      { wch: 20 },  // Reported At
      { wch: 8 },   // Photos
      { wch: 20 },  // Response Team
      { wch: 20 }   // Resolution
    ];
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, 'Emergency Incidents');
    
    // Add summary sheet
    const summary = [
      ['NARA - Emergency Incidents Report', ''],
      ['Generated', new Date().toLocaleString()],
      ['', ''],
      ['Summary Statistics', ''],
      ['Total Incidents', incidents.length],
      ['Active', incidents.filter(i => i.status === 'active').length],
      ['Resolved', incidents.filter(i => i.status === 'resolved').length],
      ['', ''],
      ['By Severity', ''],
      ['Critical', incidents.filter(i => i.severity === 'critical').length],
      ['High', incidents.filter(i => i.severity === 'high').length],
      ['Medium', incidents.filter(i => i.severity === 'medium').length],
      ['Low', incidents.filter(i => i.severity === 'low').length],
      ['', ''],
      ['By Type', ''],
      ['Oil Spill', incidents.filter(i => i.incidentType === 'oil_spill').length],
      ['Vessel Accident', incidents.filter(i => i.incidentType === 'vessel_accident').length],
      ['Marine Pollution', incidents.filter(i => i.incidentType === 'marine_pollution').length],
      ['Illegal Fishing', incidents.filter(i => i.incidentType === 'illegal_fishing').length],
      ['Other', incidents.filter(i => !['oil_spill', 'vessel_accident', 'marine_pollution', 'illegal_fishing'].includes(i.incidentType)).length]
    ];
    
    const wsSummary = XLSX.utils.aoa_to_sheet(summary);
    wsSummary['!cols'] = [{ wch: 30 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
    
    // Generate filename
    const filename = `NARA_Emergency_Incidents_${Date.now()}.xlsx`;
    
    // Write file
    XLSX.writeFile(wb, filename);
    
    return { success: true, filename, count: incidents.length };
  } catch (error) {
    console.error('Excel export error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export Combined Report (All sections)
 */
export const exportCombinedReport = (data) => {
  try {
    const wb = XLSX.utils.book_new();
    
    // Summary sheet
    const summary = [
      ['NARA - Government Services Combined Report', ''],
      ['Generated', new Date().toLocaleString()],
      ['', ''],
      ['Overview', ''],
      ['Total EIA Applications', data.eia?.length || 0],
      ['Total License Applications', data.licenses?.length || 0],
      ['Total Emergency Incidents', data.emergencies?.length || 0],
      ['', ''],
      ['Status Summary', ''],
      ['Pending Items', (data.eia?.filter(a => a.status === 'pending').length || 0) + (data.licenses?.filter(l => l.status === 'pending').length || 0)],
      ['Active Emergencies', data.emergencies?.filter(e => e.status === 'active').length || 0],
      ['', ''],
      ['Contact Information', ''],
      ['Organization', 'NARA - National Aquatic Resources Research & Development Agency'],
      ['Address', 'Crow Island, Colombo 15, Sri Lanka'],
      ['Phone', '+94 11 2521000'],
      ['Email', 'info@nara.gov.lk'],
      ['Website', 'www.nara.gov.lk']
    ];
    
    const wsSummary = XLSX.utils.aoa_to_sheet(summary);
    wsSummary['!cols'] = [{ wch: 40 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
    
    // Add individual sheets if data exists
    if (data.eia && data.eia.length > 0) {
      const eiaData = data.eia.map((app, i) => ({
        'No.': i + 1,
        'Application ID': app.applicationId,
        'Project Name': app.projectName,
        'Type': app.projectType,
        'Status': app.status,
        'Budget': app.estimatedBudget,
        'Applicant': app.applicantName
      }));
      const wsEIA = XLSX.utils.json_to_sheet(eiaData);
      XLSX.utils.book_append_sheet(wb, wsEIA, 'EIA Applications');
    }
    
    if (data.licenses && data.licenses.length > 0) {
      const licenseData = data.licenses.map((lic, i) => ({
        'No.': i + 1,
        'Application ID': lic.applicationId,
        'License Type': lic.licenseType,
        'Applicant': lic.applicantName,
        'Status': lic.status,
        'Valid From': lic.validFrom ? new Date(lic.validFrom).toLocaleDateString() : 'N/A',
        'Valid Until': lic.validUntil ? new Date(lic.validUntil).toLocaleDateString() : 'N/A'
      }));
      const wsLic = XLSX.utils.json_to_sheet(licenseData);
      XLSX.utils.book_append_sheet(wb, wsLic, 'Licenses');
    }
    
    if (data.emergencies && data.emergencies.length > 0) {
      const emergencyData = data.emergencies.map((inc, i) => ({
        'No.': i + 1,
        'Incident ID': inc.incidentId,
        'Title': inc.title,
        'Type': inc.incidentType,
        'Severity': inc.severity,
        'Status': inc.status,
        'Location': inc.location,
        'Reported': inc.reportedAt ? new Date(inc.reportedAt.toDate ? inc.reportedAt.toDate() : inc.reportedAt).toLocaleString() : 'N/A'
      }));
      const wsEmg = XLSX.utils.json_to_sheet(emergencyData);
      XLSX.utils.book_append_sheet(wb, wsEmg, 'Emergencies');
    }
    
    // Generate filename
    const filename = `NARA_Combined_Report_${Date.now()}.xlsx`;
    
    // Write file
    XLSX.writeFile(wb, filename);
    
    return { 
      success: true, 
      filename,
      counts: {
        eia: data.eia?.length || 0,
        licenses: data.licenses?.length || 0,
        emergencies: data.emergencies?.length || 0
      }
    };
  } catch (error) {
    console.error('Excel export error:', error);
    return { success: false, error: error.message };
  }
};

export default {
  exportEIAToExcel,
  exportLicensesToExcel,
  exportEmergenciesToExcel,
  exportCombinedReport
};
