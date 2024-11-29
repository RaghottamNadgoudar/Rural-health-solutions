function updatePatientsList() {
    // Get all patients data
    const allPatientsData = JSON.parse(localStorage.getItem('allPatients') || '[]');
    const patientsListDiv = document.getElementById('patientsList');
    
    if (allPatientsData.length === 0) {
        patientsListDiv.innerHTML = '<p>No patients available</p>';
        return;
    }

    patientsListDiv.innerHTML = allPatientsData.map((patient, index) => `
        <div class="patient-card ${patient.verified ? 'verified' : ''}" onclick="showPatientDetails(${index})">
            <div class="patient-summary">
                <h3>${patient.name}</h3>
                <p>Age: ${patient.age}</p>
                <p>Submitted: ${new Date(patient.timestamp).toLocaleString()}</p>
            </div>
            <div class="status-badge ${patient.verified ? 'verified' : 'pending'}">
                ${patient.verified ? 'Verified' : 'Pending'}
            </div>
        </div>
    `).join('');
}

function showPatientDetails(index) {
    const allPatientsData = JSON.parse(localStorage.getItem('allPatients') || '[]');
    const patientData = allPatientsData[index];
    const patientDetails = document.getElementById('patientDetails');
    
    if (patientData) {
        patientDetails.innerHTML = `
            <div class="info-row">
                <strong>Name:</strong> ${patientData.name}
            </div>
            <div class="info-row">
                <strong>Age:</strong> ${patientData.age}
            </div>
            <div class="info-row">
                <strong>Phone:</strong> ${patientData.phone}
            </div>
            <div class="info-row">
                <strong>Email:</strong> ${patientData.email}
            </div>
            <div class="info-row">
                <strong>Aadhar:</strong> ${patientData.aadhar}
            </div>
            <div class="info-row">
                <strong>Symptoms:</strong> ${patientData.symptoms}
            </div>
            <div class="info-row">
                <strong>Submitted:</strong> ${new Date(patientData.timestamp).toLocaleString()}
            </div>
        `;
        
        // Update verify button to include patient index
        const verifyBtn = document.getElementById('verifyBtn');
        verifyBtn.onclick = () => verifyPatient(index);
        verifyBtn.style.display = patientData.verified ? 'none' : 'block';
    }
}

function verifyPatient(index) {
    const allPatientsData = JSON.parse(localStorage.getItem('allPatients') || '[]');
    allPatientsData[index].verified = true;
    localStorage.setItem('allPatients', JSON.stringify(allPatientsData));
    alert('Diagnosis verified!');
    updatePatientsList();
    showPatientDetails(index);
}

// Update patient information periodically
setInterval(updatePatientsList, 1000);
updatePatientsList();
