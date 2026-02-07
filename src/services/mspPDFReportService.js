/**
 * MSP PDF Report Generation Service
 * Creates professional PDF reports with maps, statistics, and research data
 * Uses jsPDF library
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

/**
 * Generate comprehensive PDF report for MSP project
 */
export const generatePDFReport = async (projectData, mapElement, options = {}) => {
  try {
    // Initialize PDF (A4 size, portrait)
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = margin;

    // ==================== PAGE 1: COVER PAGE ====================

    // Add NARA logo (if provided)
    if (options.logoUrl) {
      pdf.addImage(options.logoUrl, 'PNG', margin, yPos, 30, 30);
    }

    // Title
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Marine Spatial Planning', pageWidth / 2, yPos + 40, { align: 'center' });

    pdf.setFontSize(20);
    pdf.text('Research Report', pageWidth / 2, yPos + 50, { align: 'center' });

    // Project name
    yPos += 70;
    pdf.setFontSize(18);
    pdf.setTextColor(0, 102, 204);
    pdf.text(projectData.name || 'Untitled Project', pageWidth / 2, yPos, { align: 'center' });

    // Metadata
    yPos += 20;
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');

    const metadata = [
      `Researcher: ${projectData.researcher || 'Not specified'}`,
      `Date: ${new Date(projectData.date).toLocaleDateString()}`,
      `Project Type: ${projectData.type || 'General'}`,
      `Status: ${projectData.status || 'Draft'}`,
      `Report Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
    ];

    metadata.forEach((line, idx) => {
      pdf.text(line, pageWidth / 2, yPos + (idx * 8), { align: 'center' });
    });

    // Description
    if (projectData.description) {
      yPos += 60;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      const splitDesc = pdf.splitTextToSize(projectData.description, pageWidth - 2 * margin);
      pdf.text(splitDesc, pageWidth / 2, yPos, { align: 'center' });
    }

    // Footer
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('National Aquatic Resources Research and Development Agency', pageWidth / 2, pageHeight - 20, { align: 'center' });
    pdf.text('www.nara.ac.lk', pageWidth / 2, pageHeight - 15, { align: 'center' });

    // ==================== PAGE 2: EXECUTIVE SUMMARY ====================

    pdf.addPage();
    yPos = margin;

    // Section header
    addSectionHeader(pdf, 'Executive Summary', yPos);
    yPos += 15;

    // Statistics summary
    const stats = calculateStatistics(projectData.shapes || []);

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');

    const summaryData = [
      ['Total Zones', stats.totalShapes.toString()],
      ['Total Area', `${stats.totalArea} km²`],
      ['Total Distance', `${stats.totalDistance} km`],
      ['Zone Types', stats.uniqueTypes.toString()],
      ['Data Points', (projectData.shapes?.length || 0).toString()]
    ];

    pdf.autoTable({
      startY: yPos,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [0, 102, 204], textColor: 255 },
      margin: { left: margin, right: margin },
      styles: { fontSize: 10 }
    });

    yPos = pdf.lastAutoTable.finalY + 10;

    // Zone type breakdown
    if (stats.zonesByType && Object.keys(stats.zonesByType).length > 0) {
      yPos += 5;
      addSubsectionHeader(pdf, 'Zone Type Distribution', yPos);
      yPos += 10;

      const typeData = Object.entries(stats.zonesByType).map(([type, count]) => [
        formatZoneType(type),
        count.toString(),
        `${((count / stats.totalShapes) * 100).toFixed(1)}%`
      ]);

      pdf.autoTable({
        startY: yPos,
        head: [['Zone Type', 'Count', 'Percentage']],
        body: typeData,
        theme: 'striped',
        headStyles: { fillColor: [0, 102, 204], textColor: 255 },
        margin: { left: margin, right: margin },
        styles: { fontSize: 10 }
      });

      yPos = pdf.lastAutoTable.finalY;
    }

    // ==================== PAGE 3: MAP VIEW ====================

    pdf.addPage();
    yPos = margin;

    addSectionHeader(pdf, 'Study Area Map', yPos);
    yPos += 15;

    // Capture map as image
    if (mapElement) {
      try {
        const canvas = await html2canvas(mapElement, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 2 * margin;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Check if image fits on page
        if (imgHeight > pageHeight - yPos - margin) {
          // Scale down to fit
          const scaledHeight = pageHeight - yPos - margin - 10;
          const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
          pdf.addImage(imgData, 'PNG', (pageWidth - scaledWidth) / 2, yPos, scaledWidth, scaledHeight);
          yPos += scaledHeight;
        } else {
          pdf.addImage(imgData, 'PNG', margin, yPos, imgWidth, imgHeight);
          yPos += imgHeight;
        }

        // Map caption
        yPos += 5;
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'italic');
        pdf.text(`Figure 1: Overview map showing ${stats.totalShapes} research zones`, pageWidth / 2, yPos, { align: 'center' });
      } catch (error) {
        console.error('Error capturing map:', error);
        pdf.setFontSize(10);
        pdf.text('Map capture unavailable', pageWidth / 2, yPos, { align: 'center' });
      }
    } else {
      pdf.setFontSize(10);
      pdf.text('Map not available', pageWidth / 2, yPos, { align: 'center' });
    }

    // ==================== PAGE 4+: DETAILED ZONE DATA ====================

    if (projectData.shapes && projectData.shapes.length > 0) {
      pdf.addPage();
      yPos = margin;

      addSectionHeader(pdf, 'Detailed Zone Information', yPos);
      yPos += 15;

      projectData.shapes.forEach((shape, index) => {
        // Check if we need a new page
        if (yPos > pageHeight - 40) {
          pdf.addPage();
          yPos = margin;
        }

        // Zone header
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 102, 204);
        pdf.text(`Zone ${index + 1}: ${shape.label || 'Unnamed'}`, margin, yPos);
        yPos += 8;

        // Zone details
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);

        const zoneDetails = [
          [`Type: ${formatZoneType(shape.zoneType || 'custom')}`],
          [`Color: ${shape.color || 'N/A'}`],
          [`Created: ${shape.createdAt ? new Date(shape.createdAt).toLocaleString() : 'N/A'}`]
        ];

        // Add geometry-specific details
        if (shape.type === 'polygon' || shape.type === 'rectangle') {
          const area = calculatePolygonArea(shape.positions);
          zoneDetails.push([`Area: ${area.toFixed(2)} km²`]);
        } else if (shape.type === 'circle') {
          const area = Math.PI * shape.radius * shape.radius / 1000000;
          zoneDetails.push([`Area: ${area.toFixed(2)} km²`]);
          zoneDetails.push([`Radius: ${shape.radius.toFixed(0)} m`]);
        } else if (shape.type === 'line') {
          const distance = calculateLineDistance(shape.positions);
          zoneDetails.push([`Length: ${distance.toFixed(2)} km`]);
        }

        pdf.autoTable({
          startY: yPos,
          body: zoneDetails,
          theme: 'plain',
          margin: { left: margin + 5 },
          styles: { fontSize: 9 },
          columnStyles: { 0: { cellWidth: 'auto' } }
        });

        yPos = pdf.lastAutoTable.finalY + 5;

        // Research data (if available)
        if (shape.data && Object.keys(shape.data).length > 0) {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Research Data:', margin + 5, yPos);
          yPos += 6;

          const dataEntries = Object.entries(shape.data)
            .filter(([key, value]) => value !== null && value !== undefined && value !== '')
            .map(([key, value]) => [
              formatFieldName(key),
              formatFieldValue(value)
            ]);

          if (dataEntries.length > 0) {
            pdf.autoTable({
              startY: yPos,
              body: dataEntries,
              theme: 'plain',
              margin: { left: margin + 10 },
              styles: { fontSize: 8 },
              columnStyles: {
                0: { cellWidth: 60, fontStyle: 'bold' },
                1: { cellWidth: 'auto' }
              }
            });

            yPos = pdf.lastAutoTable.finalY;
          }
        }

        yPos += 10;
      });
    }

    // ==================== FINAL PAGE: APPENDIX ====================

    pdf.addPage();
    yPos = margin;

    addSectionHeader(pdf, 'Appendix', yPos);
    yPos += 15;

    // Methodology
    addSubsectionHeader(pdf, 'Methodology', yPos);
    yPos += 8;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    const methodology = [
      'Data collection: Research-Enhanced Marine Spatial Planning Viewer',
      'Coordinate system: WGS84 (EPSG:4326)',
      'Area calculations: Spherical Earth model',
      'Distance calculations: Haversine formula',
      'Map tiles: OpenStreetMap contributors'
    ];

    methodology.forEach(line => {
      pdf.text(`• ${line}`, margin + 5, yPos);
      yPos += 6;
    });

    // Tags
    if (projectData.tags && projectData.tags.length > 0) {
      yPos += 10;
      addSubsectionHeader(pdf, 'Tags', yPos);
      yPos += 8;

      pdf.setFontSize(9);
      pdf.text(projectData.tags.join(', '), margin + 5, yPos);
      yPos += 10;
    }

    // Export information
    yPos += 10;
    addSubsectionHeader(pdf, 'Document Information', yPos);
    yPos += 8;

    pdf.setFontSize(8);
    pdf.text(`Generated by: NARA Research-Enhanced MSP Viewer`, margin + 5, yPos);
    pdf.text(`Report ID: ${projectData.id}`, margin + 5, yPos + 5);
    pdf.text(`Version: 2.0`, margin + 5, yPos + 10);
    pdf.text(`Generated: ${new Date().toISOString()}`, margin + 5, yPos + 15);

    // Add page numbers
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 10);
    }

    // Save PDF
    const filename = `${projectData.name.replace(/\s+/g, '_')}_Report_${Date.now()}.pdf`;
    pdf.save(filename);

    console.log('✅ PDF report generated:', filename);
    return { success: true, filename };

  } catch (error) {
    console.error('❌ Error generating PDF report:', error);
    return { success: false, error: error.message };
  }
};

// ==================== HELPER FUNCTIONS ====================

function addSectionHeader(pdf, title, yPos) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;

  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 102, 204);
  pdf.text(title, margin, yPos);

  // Underline
  pdf.setDrawColor(0, 102, 204);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
}

function addSubsectionHeader(pdf, title, yPos) {
  const margin = 15;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(title, margin, yPos);
}

function calculateStatistics(shapes) {
  const totalShapes = shapes.length;

  const totalArea = shapes.reduce((sum, shape) => {
    if (shape.type === 'polygon' || shape.type === 'rectangle') {
      return sum + calculatePolygonArea(shape.positions);
    } else if (shape.type === 'circle') {
      return sum + (Math.PI * shape.radius * shape.radius / 1000000);
    }
    return sum;
  }, 0);

  const totalDistance = shapes.reduce((sum, shape) => {
    if (shape.type === 'line') {
      return sum + calculateLineDistance(shape.positions);
    }
    return sum;
  }, 0);

  const zonesByType = shapes.reduce((acc, shape) => {
    const type = shape.zoneType || 'custom';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const uniqueTypes = Object.keys(zonesByType).length;

  return {
    totalShapes,
    totalArea: totalArea.toFixed(2),
    totalDistance: totalDistance.toFixed(2),
    zonesByType,
    uniqueTypes
  };
}

function calculatePolygonArea(positions) {
  if (!positions || positions.length < 3) return 0;

  const toRad = (deg) => deg * Math.PI / 180;
  let area = 0;
  const R = 6371000; // Earth's radius in meters

  for (let i = 0; i < positions.length; i++) {
    const p1 = positions[i];
    const p2 = positions[(i + 1) % positions.length];

    const lat1 = toRad(p1[0]);
    const lat2 = toRad(p2[0]);
    const lon1 = toRad(p1[1]);
    const lon2 = toRad(p2[1]);

    area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  area = Math.abs(area * R * R / 2) / 1000000; // Convert to km²
  return area;
}

function calculateLineDistance(positions) {
  if (!positions || positions.length < 2) return 0;

  let totalDistance = 0;
  const R = 6371; // Earth's radius in km

  for (let i = 0; i < positions.length - 1; i++) {
    const lat1 = positions[i][0] * Math.PI / 180;
    const lat2 = positions[i + 1][0] * Math.PI / 180;
    const lon1 = positions[i][1] * Math.PI / 180;
    const lon2 = positions[i + 1][1] * Math.PI / 180;

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    totalDistance += R * c;
  }

  return totalDistance;
}

function formatZoneType(type) {
  const typeMap = {
    research_zone: 'Research Zone',
    fish_survey: 'Fish Survey',
    sampling_station: 'Sampling Station',
    protected_area: 'Protected Area',
    fishing_zone: 'Fishing Zone',
    monitoring_station: 'Monitoring Station',
    habitat_survey: 'Habitat Survey',
    vessel_track: 'Vessel Track',
    pollution_zone: 'Pollution Zone',
    aquaculture: 'Aquaculture',
    custom: 'Custom Zone'
  };

  return typeMap[type] || type;
}

function formatFieldName(name) {
  return name
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

function formatFieldValue(value) {
  if (Array.isArray(value)) {
    return value.join(', ');
  } else if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2);
  } else if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return String(value);
}

export default {
  generatePDFReport
};
