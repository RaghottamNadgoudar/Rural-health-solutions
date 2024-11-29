document.getElementById('patientForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const patientData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value || 'Not provided',
        aadhar: document.getElementById('aadhar').value || 'Not provided',
        symptoms: document.getElementById('symptoms').value,
        verified: false,
        timestamp: new Date().toISOString()
    };

    // Validate phone number
    if (!/^\d{10}$/.test(patientData.phone)) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }

    // Validate Aadhar if provided
    if (patientData.aadhar !== 'Not provided' && !/^\d{12}$/.test(patientData.aadhar)) {
        alert('Please enter a valid 12-digit Aadhar number');
        return;
    }

    // Get existing patients and add new patient
    const allPatients = JSON.parse(localStorage.getItem('allPatients') || '[]');
    allPatients.push(patientData);
    localStorage.setItem('allPatients', JSON.stringify(allPatients));
    
    // Store current patient ID for verification status
    localStorage.setItem('currentPatientIndex', allPatients.length - 1);
    
    alert('Information submitted successfully!');
    e.target.reset();
});

// Check for verification status periodically
setInterval(() => {
    const currentIndex = localStorage.getItem('currentPatientIndex');
    if (currentIndex === null) return;
    
    const allPatients = JSON.parse(localStorage.getItem('allPatients') || '[]');
    const currentPatient = allPatients[currentIndex];
    
    if (!currentPatient) return;
    
    const badge = document.getElementById('verificationBadge');
    if (currentPatient.verified) {
        badge.textContent = 'Verified';
        badge.classList.add('verified');
    } else {
        badge.textContent = 'Pending';
        badge.classList.remove('verified');
    }
}, 1000);
