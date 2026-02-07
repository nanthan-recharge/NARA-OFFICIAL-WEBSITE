
document.addEventListener('DOMContentLoaded', () => {

    // Sample Data
    const eiaData = {
        applications: [
            { id: 'EIA001', project: 'Offshore Wind Farm', applicant: 'Ocean Power Inc.', date: '2025-10-20', status: 'Pending' },
            { id: 'EIA002', project: 'Deep Sea Mining Exploration', applicant: 'GeoMarine Ltd.', date: '2025-10-18', status: 'Approved' },
            { id: 'EIA003', project: 'Coral Reef Restoration', applicant: 'Blue Reef Foundation', date: '2025-10-15', status: 'Approved' },
        ],
        stats: {
            active: 12,
            pending: 5,
            rejected: 3,
        }
    };

    const licenseData = {
        licenses: [
            { id: 'LIC001', type: 'Fishing', vessel: 'FV Poseidon', expiration: '2026-05-10' },
            { id: 'LIC002', type: 'Research', vessel: 'RV Explorer', expiration: '2025-12-22' },
        ],
        stats: {
            total: 50,
        }
    };

    const emergencyData = {
        emergencies: [
            { id: 'EMG001', location: '12.345 N, 67.890 E', severity: 'High', reported: '2025-10-22 14:30 UTC', status: 'Active' },
        ],
        stats: {
            active: 1,
        }
    };
    
    const complianceData = {
        rate: '95%',
        compliant: 475
    };


    // Populate Stats
    document.getElementById('eia-applications-value').textContent = eiaData.stats.active;
    document.getElementById('eia-applications-subtext').textContent = `+${eiaData.stats.pending} pending`;
    document.getElementById('active-licenses-value').textContent = licenseData.stats.total;
    document.getElementById('active-licenses-subtext').textContent = `${licenseData.stats.total} total`;
    document.getElementById('compliance-rate-value').textContent = complianceData.rate;
    document.getElementById('compliance-rate-subtext').textContent = `${complianceData.compliant} compliant`;
    document.getElementById('active-emergencies-value').textContent = emergencyData.stats.active;
    document.getElementById('active-emergencies-subtext').textContent = 'Live incidents';

    // Populate Tables
    const eiaTableBody = document.querySelector('#eia-table tbody');
    eiaData.applications.forEach(app => {
        const row = eiaTableBody.insertRow();
        row.innerHTML = `<td>${app.id}</td><td>${app.project}</td><td>${app.applicant}</td><td>${app.date}</td><td>${app.status}</td>`;
    });

    const emergencyTableBody = document.querySelector('#emergency-table tbody');
    emergencyData.emergencies.forEach(emergency => {
        const row = emergencyTableBody.insertRow();
        row.innerHTML = `<td>${emergency.id}</td><td>${emergency.location}</td><td>${emergency.severity}</td><td>${emergency.reported}</td><td>${emergency.status}</td>`;
    });

    // Chart
    const ctx = document.getElementById('eia-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Approved', 'Pending', 'Rejected'],
            datasets: [{
                label: 'EIA Application Status',
                data: [eiaData.stats.active, eiaData.stats.pending, eiaData.stats.rejected],
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
            }]
        }
    });

    // Modal Handling
    const eiaModal = document.getElementById('eia-modal');
    const licenseModal = document.getElementById('license-modal');
    const emergencyModal = document.getElementById('emergency-modal');

    const newEiaBtn = document.getElementById('new-eia-btn');
    const applyLicenseBtn = document.getElementById('apply-license-btn');
    const reportEmergencyBtn = document.getElementById('report-emergency-btn');

    const closeBtns = document.querySelectorAll('.close-btn');

    newEiaBtn.onclick = () => eiaModal.style.display = 'block';
    applyLicenseBtn.onclick = () => licenseModal.style.display = 'block';
    reportEmergencyBtn.onclick = () => emergencyModal.style.display = 'block';

    closeBtns.forEach(btn => {
        btn.onclick = () => {
            eiaModal.style.display = 'none';
            licenseModal.style.display = 'none';
            emergencyModal.style.display = 'none';
        };
    });

    window.onclick = (event) => {
        if (event.target == eiaModal || event.target == licenseModal || event.target == emergencyModal) {
            eiaModal.style.display = 'none';
            licenseModal.style.display = 'none';
            emergencyModal.style.display = 'none';
        }
    };
});
