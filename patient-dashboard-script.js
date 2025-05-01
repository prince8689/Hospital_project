// Patient Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = today.toLocaleDateString('hi-IN', options);

    // Initialize progress bar for waiting time
    const waitProgress = document.getElementById('wait-progress');
    const waitTime = parseInt(document.getElementById('wait-time').textContent);
    const maxWaitTime = 60; // Maximum expected wait time in minutes
    const progressPercentage = (waitTime / maxWaitTime) * 100;
    waitProgress.style.width = `${progressPercentage}%`;

    // Appointment Modal Functionality
    const appointmentModal = document.getElementById('appointment-modal');
    const bookAppointmentBtn = document.getElementById('book-appointment-btn');
    const cancelAppointmentBtn = document.getElementById('cancel-appointment-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    bookAppointmentBtn.addEventListener('click', function() {
        appointmentModal.style.display = 'block';
    });
    
    cancelAppointmentBtn.addEventListener('click', function() {
        appointmentModal.style.display = 'none';
    });
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Department selection changes available doctors
    const departmentSelect = document.getElementById('department');
    const doctorSelect = document.getElementById('doctor');
    
    departmentSelect.addEventListener('change', function() {
        const department = this.value;
        doctorSelect.disabled = department === '';
        
        // Clear previous options
        doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
        
        if (department) {
            // Add doctors based on department selected
            const doctors = getDoctorsByDepartment(department);
            doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = doctor.name;
                doctorSelect.appendChild(option);
            });
        }
    });

    // Doctor selection changes available time slots
    const appointmentDateInput = document.getElementById('appointment-date');
    const appointmentTimeSelect = document.getElementById('appointment-time');
    
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    appointmentDateInput.min = tomorrow.toISOString().split('T')[0];
    
    // Enable time selection only after doctor and date are selected
    doctorSelect.addEventListener('change', function() {
        appointmentDateInput.disabled = this.value === '';
    });
    
    appointmentDateInput.addEventListener('change', function() {
        const doctorId = doctorSelect.value;
        const selectedDate = this.value;
        
        appointmentTimeSelect.disabled = !selectedDate;
        
        // Clear previous time slots
        appointmentTimeSelect.innerHTML = '<option value="">Select Time</option>';
        
        if (selectedDate && doctorId) {
            // Add available time slots for selected doctor and date
            const timeSlots = getAvailableTimeSlots(doctorId, selectedDate);
            timeSlots.forEach(slot => {
                const option = document.createElement('option');
                option.value = slot;
                option.textContent = slot;
                appointmentTimeSelect.appendChild(option);
            });
        }
    });

    // Appointment form submission
    const appointmentForm = document.getElementById('appointment-form');
    
    appointmentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const department = departmentSelect.value;
        const doctorId = doctorSelect.value;
        const doctorName = doctorSelect.options[doctorSelect.selectedIndex].text;
        const appointmentDate = appointmentDateInput.value;
        const appointmentTime = appointmentTimeSelect.value;
        const appointmentReason = document.getElementById('appointment-reason').value;
        
        // Create new appointment
        const newAppointment = {
            doctor: doctorName,
            department: department,
            date: formatDate(appointmentDate),
            time: appointmentTime,
            location: getDoctorLocation(doctorId),
            reason: appointmentReason
        };
        
        // Add to appointments list (in a real app, this would be sent to a server)
        addAppointmentToList(newAppointment);
        
        // Close modal and reset form
        appointmentModal.style.display = 'none';
        appointmentForm.reset();
        doctorSelect.disabled = true;
        appointmentDateInput.disabled = true;
        appointmentTimeSelect.disabled = true;
        
        // Show success message
        showNotification('Appointment booked successfully!', 'success');
    });

    // Profile modal functionality
    const profileLinks = document.querySelectorAll('a[href="#profile"]');
    const profileModal = document.getElementById('profile-modal');
    
    profileLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            profileModal.style.display = 'block';
        });
    });
    
    // Profile modal functionality
const profileForm = document.getElementById('profile-form');

profileForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get updated profile data
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    // Validate first name and last name
    const nameRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        alert('Name can only contain letters and spaces.');
        return;
    }

    // Validate phone number
    const phoneRegex = /^\d{10}$/; // Only 10 digits
    if (!phoneRegex.test(phone)) {
        alert('Phone number must be a 10-digit number.');
        return;
    }

    // Validate email
    const emailRegex = /^[a-z][a-z0-9._%+-]*@gmail\.com$/; // Lowercase letters and must end with gmail.com
    if (!emailRegex.test(email)) {
        alert('Email must be in lowercase and end with @gmail.com.');
        return;
    }

    // Update displayed name (in a real app, this would be sent to a server)
    document.getElementById('patient-name').textContent = `${firstName} ${lastName}`;
    document.getElementById('welcome-name').textContent = firstName;

    // Close modal
    profileModal.style.display = 'none';

    // Show success message
    showNotification('Profile updated successfully!', 'success');
});

    // Cancel and reschedule appointment buttons
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    const rescheduleButtons = document.querySelectorAll('.reschedule-btn');
    
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const appointmentItem = this.closest('.appointment-item');
            
            // Show confirmation dialog
            if (confirm('Are you sure you want to cancel this appointment?')) {
                // Remove appointment (in a real app, this would be sent to a server)
                appointmentItem.remove();
                
                // Show success message
                showNotification('Appointment cancelled successfully!', 'info');
            }
        });
    });
    
    rescheduleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const appointmentItem = this.closest('.appointment-item');
            const doctorInfo = appointmentItem.querySelector('h4').textContent;
            
            // Extract doctor and department info
            const doctorMatch = doctorInfo.match(/(Dr\. .+) - (.+)/);
            const doctorName = doctorMatch[1];
            const department = doctorMatch[2];
            
            // Pre-fill appointment form with current appointment details
            const departmentOption = Array.from(departmentSelect.options).find(option => 
                option.textContent.toLowerCase() === department.toLowerCase()
            );
            
            if (departmentOption) {
                departmentSelect.value = departmentOption.value;
                // Trigger change event to load doctors
                const event = new Event('change');
                departmentSelect.dispatchEvent(event);
                
                // Pre-select the doctor if available
                setTimeout(() => {
                    const doctorOption = Array.from(doctorSelect.options).find(option => 
                        option.textContent.includes(doctorName)
                    );
                    
                    if (doctorOption) {
                        doctorSelect.value = doctorOption.value;
                        // Enable date selection
                        appointmentDateInput.disabled = false;
                    }
                }, 100);
            }
            
            // Open appointment modal
            appointmentModal.style.display = 'block';
            
            // Remove the current appointment after opening the modal
            if (confirm('Are you sure you want to reschedule this appointment?')) {
                appointmentItem.remove();
            }
        });
    });

    // View medical record buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const recordTitle = this.closest('.record-item').querySelector('h4').textContent;
            
            // In a real app, this would fetch and display the actual record
            alert(`Viewing ${recordTitle}. In a complete implementation, this would open the full medical record.`);
        });
    });

    // Health resources read more buttons
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const resourceTitle = this.closest('.resource-item').querySelector('h4').textContent;
            
            // In a real app, this would open the full article
            alert(`Reading more about "${resourceTitle}". In a complete implementation, this would open the full article.`);
        });
    });

    // Real-time waiting time update simulation
    simulateWaitingTimeUpdates();

    // Simulate periodic notifications
    simulateNotifications();

    // Handle navigation menu clicks
    const navLinks = document.querySelectorAll('.sidebar a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // For demo purposes, we'll just highlight the active link
            // In a real app, this would load different content sections
            navLinks.forEach(link => link.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
            
            // If not navigating to profile (which shows modal)
            if (this.getAttribute('href') !== '#profile') {
                event.preventDefault();
                // Show a message for demo purposes
                const section = this.getAttribute('href').substring(1);
                alert(`Navigating to ${section} section. In a complete implementation, this would load the ${section} content.`);
            }
        });
    });

    // Logout button functionality
    const logoutBtn = document.querySelector('.logout-btn');
    
    logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            // In a real app, this would perform a logout action
            alert('You have been logged out. In a complete implementation, this would redirect to the login page.');
        }
    });
});

// Helper Functions

// Get doctors by department
function getDoctorsByDepartment(department) {
    // In a real app, this would come from an API
    const doctorsByDepartment = {
        cardiology: [
            { id: 'c1', name: 'Dr. Priya Sharma' },
            { id: 'c2', name: 'Dr. Rajiv Mehta' }
        ],
        orthopedics: [
            { id: 'o1', name: 'Dr. Vikram Patel' },
            { id: 'o2', name: 'Dr. Shikha Gupta' }
        ],
        neurology: [
            { id: 'n1', name: 'Dr. Amit Singh' },
            { id: 'n2', name: 'Dr. Neha Verma' }
        ],
        pediatrics: [
            { id: 'p1', name: 'Dr. Manish Kumar' },
            { id: 'p2', name: 'Dr. Pooja Jain' }
        ],
        dermatology: [
            { id: 'd1', name: 'Dr. Sanjay Malhotra' },
            { id: 'd2', name: 'Dr. Deepika Shah' }
        ]
    };
    
    return doctorsByDepartment[department] || [];
}

// Get available time slots for doctor on a specific date
function getAvailableTimeSlots(doctorId, date) {
    // In a real app, this would come from an API based on doctor's schedule
    // For demo, we'll generate some random time slots
    const morningSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '11:30 AM'];
    const afternoonSlots = ['01:00 PM', '02:15 PM', '03:30 PM', '04:45 PM'];
    
    // Use doctor ID and date to create a deterministic but varied schedule
    const dateParts = date.split('-');
    const dateNum = parseInt(dateParts[2]) + parseInt(doctorId.substring(1));
    
    // Create a subset of available slots based on the date and doctor
    const availableSlots = [];
    
    // Add some morning slots
    for (let i = 0; i < morningSlots.length; i++) {
        if ((dateNum + i) % 3 !== 0) { // Simulate some slots being taken
            availableSlots.push(morningSlots[i]);
        }
    }
    
    // Add some afternoon slots
    for (let i = 0; i < afternoonSlots.length; i++) {
        if ((dateNum + i) % 4 !== 0) { // Simulate some slots being taken
            availableSlots.push(afternoonSlots[i]);
        }
    }
    
    return availableSlots;
}

// Get doctor location
function getDoctorLocation(doctorId) {
    // In a real app, this would come from an API
    const locations = {
        'c1': 'Room 302, 3rd Floor',
        'c2': 'Room 304, 3rd Floor',
        'o1': 'Room 205, 2nd Floor',
        'o2': 'Room 207, 2nd Floor',
        'n1': 'Room 401, 4th Floor',
        'n2': 'Room 403, 4th Floor',
        'p1': 'Room 105, 1st Floor',
        'p2': 'Room 107, 1st Floor',
        'd1': 'Room 501, 5th Floor',
        'd2': 'Room 503, 5th Floor'
    };
    
    return locations[doctorId] || 'TBD';
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = new Intl.DateTimeFormat('en', { month: 'long' }).format(date);
    const year = date.getFullYear();
    
    return `${day} ${month}, ${year}`;
}

// Add appointment to the list
function addAppointmentToList(appointment) {
    const appointmentsList = document.querySelector('.appointments-list');
    
    const appointmentItem = document.createElement('div');
    appointmentItem.className = 'appointment-item';
    
    appointmentItem.innerHTML = `
        <div class="appointment-info">
            <h4>${appointment.doctor} - ${appointment.department.charAt(0).toUpperCase() + appointment.department.slice(1)}</h4>
            <p><i class="fas fa-calendar"></i> ${appointment.date}</p>
            <p><i class="fas fa-clock"></i> ${appointment.time}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${appointment.location}</p>
            ${appointment.reason ? `<p><i class="fas fa-comment-medical"></i> ${appointment.reason}</p>` : ''}
        </div>
        <div class="appointment-actions">
            <button class="secondary-btn cancel-btn">Cancel</button>
            <button class="secondary-btn reschedule-btn">Reschedule</button>
        </div>
    `;
    
    // Insert new appointment at the top
    appointmentsList.insertBefore(appointmentItem, appointmentsList.firstChild);
    
    // Add event listeners to new buttons
    const cancelBtn = appointmentItem.querySelector('.cancel-btn');
    const rescheduleBtn = appointmentItem.querySelector('.reschedule-btn');
    
    cancelBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            appointmentItem.remove();
            showNotification('Appointment cancelled successfully!', 'info');
        }
    });
    
    rescheduleBtn.addEventListener('click', function() {
        // Open appointment modal
        document.getElementById('appointment-modal').style.display = 'block';
        
        // Remove the current appointment
        if (confirm('Are you sure you want to reschedule this appointment?')) {
            appointmentItem.remove();
        }
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notificationList = document.querySelector('.notification-list');
    
    const notificationItem = document.createElement('div');
    notificationItem.className = 'notification-item';
    
    let iconClass = 'info';
    if (type === 'success') {
        iconClass = 'check-circle';
    } else if (type === 'warning') {
        iconClass = 'exclamation-triangle';
    } else if (type === 'error') {
        iconClass = 'times-circle';
    }
    
    notificationItem.innerHTML = `
        <div class="notification-icon ${type}"><i class="fas fa-${iconClass}"></i></div>
        <div class="notification-content">
            <p>${message}</p>
            <span class="notification-time">Just now</span>
        </div>
    `;
    
    // Insert at the top of the list
    notificationList.insertBefore(notificationItem, notificationList.firstChild);
    
    // Remove after 10 seconds
    setTimeout(() => {
        notificationItem.style.opacity = '0';
        setTimeout(() => {
            notificationItem.remove();
        }, 500);
    }, 10000);
}

// Simulate real-time waiting time updates
function simulateWaitingTimeUpdates() {
    const waitTimeElement = document.getElementById('wait-time');
    const queuePositionElement = document.getElementById('queue-position');
    const statusBadge = document.querySelector('.status-badge');
    const waitProgress = document.getElementById('wait-progress');
    
    setInterval(() => {
        // Randomly update waiting time
        let currentWaitTime = parseInt(waitTimeElement.textContent);
        let currentQueuePosition = parseInt(queuePositionElement.textContent);
        
        // 50% chance of decreasing waiting time and queue position
        if (Math.random() > 0.5) {
            currentWaitTime = Math.max(0, currentWaitTime - Math.floor(Math.random() * 3));
            currentQueuePosition = Math.max(0, currentQueuePosition - Math.floor(Math.random() * 2));
            
            waitTimeElement.textContent = currentWaitTime;
            queuePositionElement.textContent = currentQueuePosition;
            
            // Update progress bar
            const maxWaitTime = 60;
            const progressPercentage = (currentWaitTime / maxWaitTime) * 100;
            waitProgress.style.width = `${progressPercentage}%`;
            
            // Change status when position reaches 0
            if (currentQueuePosition === 0) {
                statusBadge.textContent = 'Being Served';
                statusBadge.classList.remove('in-queue');
                statusBadge.classList.add('being-served');
            }
        }
    }, 15000); // Update every 15 seconds
}

// Simulate periodic notifications
function simulateNotifications() {
    const notificationMessages = [
        { message: "Your blood test results have been uploaded. Check your medical records.", type: "info" },
        { message: "Don't forget your medication at 8:00 PM.", type: "reminder" },
        { message: "Free health check-up camp next weekend. Register now!", type: "info" },
        { message: "Dr. Priya Sharma has added notes to your last visit.", type: "info" },
        { message: "Your prescription has been renewed. You can collect it from the pharmacy.", type: "medication" }
    ];
    
    // Add a random notification every 30-60 seconds
    setInterval(() => {
        if (Math.random() > 0.5) { // 50% chance of showing a notification
            const randomIndex = Math.floor(Math.random() * notificationMessages.length);
            const notification = notificationMessages[randomIndex];
            
            showCustomNotification(notification.message, notification.type);
        }
    }, Math.random() * 30000 + 30000);
}

// Show custom notification with different icons
function showCustomNotification(message, type) {
    const notificationList = document.querySelector('.notification-list');
    
    const notificationItem = document.createElement('div');
    notificationItem.className = 'notification-item';
    
    let iconClass = 'info-circle';
    if (type === 'reminder') {
        iconClass = 'bell';
    } else if (type === 'medication') {
        iconClass = 'pills';
    }
    
    notificationItem.innerHTML = `
        <div class="notification-icon ${type}"><i class="fas fa-${iconClass}"></i></div>
        <div class="notification-content">
            <p>${message}</p>
            <span class="notification-time">Just now</span>
        </div>
    `;
    
    // Insert at the top of the list
    notificationList.insertBefore(notificationItem, notificationList.firstChild);
    
    // Update notification times for all items
    updateNotificationTimes();
}

// Update notification times
function updateNotificationTimes() {
    const notificationTimes = document.querySelectorAll('.notification-time');
    
    notificationTimes.forEach((timeElement, index) => {
        // Skip the "Just now" notification
        if (index > 0) {
            let timeText = timeElement.textContent;
            let newText = timeText;
            
            if (timeText === 'Just now') {
                newText = '1 minute ago';
            } else if (timeText.includes('minute')) {
                const minutes = parseInt(timeText);
                if (minutes < 59) {
                    newText = `${minutes + 1} minutes ago`;
                } else {
                    newText = '1 hour ago';
                }
            } else if (timeText.includes('hour')) {
                const hours = parseInt(timeText);
                if (hours < 23) {
                    newText = `${hours + 1} hours ago`;
                } else {
                    newText = '1 day ago';
                }
            }
            
            timeElement.textContent = newText;
        }
    });
}
