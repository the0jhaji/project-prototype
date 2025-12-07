/* ============================================
   MindCare - Mental Health Consultation Website
   Complete JavaScript Functionality
   ============================================ */

/* ============================================
   DOM Element Selection
   ============================================ */

const darkModeToggle = document.getElementById('darkModeToggle');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const bookingForm = document.getElementById('bookingForm');

/* ============================================
   Dark Mode Implementation
   ============================================ */

// Initialize dark mode on page load
function initDarkMode() {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode === 'true' || (!savedMode && prefersDark)) {
        document.body.classList.add('dark-mode');
        updateDarkModeButton(true);
    }
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateDarkModeButton(isDarkMode);
}

// Update button text based on mode
function updateDarkModeButton(isDarkMode) {
    if (darkModeToggle) {
        darkModeToggle.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
        darkModeToggle.setAttribute('aria-pressed', isDarkMode);
    }
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
}

/* ============================================
   Mobile Menu Toggle
   ============================================ */

function initMobileMenu() {
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const isOpen = navLinks.classList.contains('active');
            menuBtn.setAttribute('aria-expanded', isOpen);
        });
    }

    // Close menu when a link is clicked
    const navLinksArray = navLinks.querySelectorAll('.nav-link');
    navLinksArray.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (menuBtn) {
                menuBtn.setAttribute('aria-expanded', false);
            }
        });
    });
}

/* ============================================
   Form Validation
   ============================================ */

function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const age = document.getElementById('age').value;
    const doctor = document.getElementById('doctor').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const consultationType = document.querySelector('input[name="consultationType"]:checked');

    const errors = {};

    // Name validation
    if (!name || name.length < 2) {
        errors.name = 'Please enter a valid name (at least 2 characters)';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.email = 'Please enter a valid email address';
    }

    // Age validation
    if (!age || age < 1 || age > 120) {
        errors.age = 'Please enter a valid age between 1 and 120';
    }

    // Doctor selection
    if (!doctor) {
        errors.doctor = 'Please select a doctor';
    }

    // Consultation type
    if (!consultationType) {
        errors.consultationType = 'Please select a consultation type';
    }

    // Date validation
    if (!date) {
        errors.date = 'Please select a date';
    }

    // Time validation
    if (!time) {
        errors.time = 'Please select a time';
    }

    return errors;
}

/* ============================================
   Error Message Display
   ============================================ */

function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.textContent = '';
        error.classList.remove('show');
    });

    // Remove error classes from inputs
    const inputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    inputs.forEach(input => {
        input.classList.remove('error');
    });
}

function displayErrorMessages(errors) {
    Object.keys(errors).forEach(fieldName => {
        const errorElement = document.getElementById(fieldName + 'Error');
        const inputElement = document.getElementById(fieldName);

        if (errorElement) {
            errorElement.textContent = errors[fieldName];
            errorElement.classList.add('show');
        }

        if (inputElement) {
            inputElement.classList.add('error');
            inputElement.setAttribute('aria-invalid', true);
        }
    });
}

/* ============================================
   Booking Form Submission
   ============================================ */

function initBookingForm() {
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Clear previous errors
            clearErrorMessages();

            // Validate form
            const errors = validateForm();

            if (Object.keys(errors).length > 0) {
                displayErrorMessages(errors);
                return;
            }

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                age: document.getElementById('age').value,
                doctor: document.getElementById('doctor').value,
                consultationType: document.querySelector('input[name="consultationType"]:checked').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                concern: document.getElementById('concern').value
            };

            // Save booking
            saveBooking(formData);

            // Show confirmation
            showConfirmation();

            // Reset form
            bookingForm.reset();
        });
    }
}

/* ============================================
   Save Booking to LocalStorage
   ============================================ */

function saveBooking(bookingData) {
    let bookings = JSON.parse(localStorage.getItem('mindcareBookings')) || [];

    const booking = {
        bookingId: 'BOOK-' + Date.now(),
        ...bookingData,
        bookedAt: new Date().toISOString()
    };

    bookings.push(booking);
    localStorage.setItem('mindcareBookings', JSON.stringify(bookings));

    console.log('Booking saved:', booking);
}

/* ============================================
   Show Confirmation Message
   ============================================ */

function showConfirmation() {
    const confirmationDiv = document.createElement('div');
    confirmationDiv.className = 'confirmation-message';
    confirmationDiv.setAttribute('role', 'alert');
    confirmationDiv.innerHTML = `
        <p>✅ Booking confirmed! We've sent a confirmation email. Our team will contact you shortly.</p>
    `;

    confirmationDiv.style.cssText = `
        background: #27ae60;
        color: white;
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 8px;
        animation: fadeIn 0.3s ease-in;
    `;

    bookingForm.insertBefore(confirmationDiv, bookingForm.firstChild);

    // Remove after 5 seconds
    setTimeout(() => {
        confirmationDiv.remove();
    }, 5000);
}

/* ============================================
   Scroll to Booking Section
   ============================================ */

function scrollToBooking(doctorName) {
    const bookingSection = document.getElementById('booking');
    const doctorSelect = document.getElementById('doctor');

    if (doctorSelect) {
        doctorSelect.value = doctorName;
    }

    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        doctorSelect.focus();
    }
}

/* ============================================
   Resource Tabs Switching
   ============================================ */

function switchTab(event, tabName) {
    event.preventDefault();

    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
        button.setAttribute('aria-selected', 'false');
    });

    // Show selected tab content
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to clicked button
    event.target.classList.add('active');
    event.target.setAttribute('aria-selected', 'true');
}

/* ============================================
   FAQ Accordion Toggle
   ============================================ */

function toggleFAQ(button) {
    const faqItem = button.parentElement;

    // Close other FAQ items
    const allFaqItems = document.querySelectorAll('.faq-item');
    allFaqItems.forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
        }
    });

    // Toggle current item
    faqItem.classList.toggle('active');
}

/* ============================================
   Font Size Adjustment
   ============================================ */

function toggleFontSize() {
    document.body.classList.toggle('font-large');
    
    const isFontLarge = document.body.classList.contains('font-large');
    localStorage.setItem('fontSizePreference', isFontLarge ? 'large' : 'normal');
}

function loadFontSizePreference() {
    const fontPreference = localStorage.getItem('fontSizePreference');
    if (fontPreference === 'large') {
        document.body.classList.add('font-large');
    }
}

/* ============================================
   Keyboard Navigation
   ============================================ */

function initKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        // Close menu on Escape key
        if (event.key === 'Escape') {
            navLinks.classList.remove('active');
            if (menuBtn) {
                menuBtn.setAttribute('aria-expanded', false);
                menuBtn.focus();
            }
        }
    });
}

/* ============================================
   Smooth Scroll for Anchor Links
   ============================================ */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   Scroll Animations (Intersection Observer)
   ============================================ */

function initScrollAnimations() {
    const cards = document.querySelectorAll('.doctor-card, .resource-card, .selfcare-card');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        observer.observe(card);
    });
}

/* ============================================
   Accessibility Improvements
   ============================================ */

function improveAccessibility() {
    // Add ARIA labels to interactive elements
    const buttons = document.querySelectorAll('button[type="submit"]');
    buttons.forEach((button, index) => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', 'Submit form');
        }
    });

    // Associate form labels properly
    const labels = document.querySelectorAll('label');
    labels.forEach(label => {
        const input = label.nextElementSibling;
        if (input && input.id && !label.getAttribute('for')) {
            label.setAttribute('for', input.id);
        }
    });
}

/* ============================================
   High Contrast Mode Detection
   ============================================ */

function detectHighContrastMode() {
    if (window.matchMedia('(prefers-contrast: more)').matches) {
        document.body.style.fontWeight = '600';
        document.body.style.letterSpacing = '0.5px';
    }
}

/* ============================================
   DOMContentLoaded - Initialize All Functions
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode
    initDarkMode();

    // Initialize mobile menu
    initMobileMenu();

    // Initialize booking form
    initBookingForm();

    // Load font size preference
    loadFontSizePreference();

    // Initialize keyboard navigation
    initKeyboardNavigation();

    // Initialize smooth scroll
    initSmoothScroll();

    // Initialize scroll animations
    initScrollAnimations();

    // Improve accessibility
    improveAccessibility();

    // Detect high contrast mode
    detectHighContrastMode();

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    console.log('MindCare website initialized successfully');
});

/* ============================================
   Additional Utility Functions
   ============================================ */

// Get all bookings from localStorage
function getBookings() {
    return JSON.parse(localStorage.getItem('mindcareBookings')) || [];
}

// Clear all bookings (for testing)
function clearAllBookings() {
    localStorage.removeItem('mindcareBookings');
    console.log('All bookings cleared');
}

// Log all bookings (for debugging)
function logBookings() {
    const bookings = getBookings();
    console.log('Current bookings:', bookings);
    return bookings;
}
