/**
 * Sacred Heart Youth Group - Marian Pilgrimage to Osmotherley
 * Saturday, 31 October 2026
 */

// ============================================================================
// GOOGLE SHEETS WEB APP URL
// Follow the 2-minute setup instructions in google_apps_script.js or GOOGLE_SHEET_SETUP.md
// and paste your Web App URL here:
// ============================================================================
const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyjh-vMEc07Twf5kC5OWcZdL4KD9ScyGv6qHO0AWHVLjDlebAjXUWdndUBi3FQMYo8U/exec"; 

document.addEventListener('DOMContentLoaded', () => {

  // Countdown to Saturday 31 October 2026, 11:00 AM
  const targetDate = new Date('2026-10-31T11:00:00+01:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      document.getElementById('daysCount').textContent = '00';
      document.getElementById('hoursCount').textContent = '00';
      document.getElementById('minsCount').textContent = '00';
      document.getElementById('secsCount').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    document.getElementById('daysCount').textContent = pad(days);
    document.getElementById('hoursCount').textContent = pad(hours);
    document.getElementById('minsCount').textContent = pad(minutes);
    document.getElementById('secsCount').textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Registration Form Handling
  const form = document.getElementById('pilgrimageForm');
  const confirmationBox = document.getElementById('confirmationBox');
  const submitBtn = document.getElementById('regSubmitBtn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = (document.getElementById('fullName')?.value || '').trim();
      const phoneNumber = (document.getElementById('phoneNumber')?.value || '').trim();
      const emailAddress = (document.getElementById('emailAddress')?.value || '').trim();
      const partySize = document.getElementById('partySize')?.value || '1';
      const transport = document.getElementById('transportSelection')?.value || 'driving-independent';
      const intentions = (document.getElementById('intentions')?.value || '').trim();

      const newRegistration = {
        fullName,
        phoneNumber,
        emailAddress,
        partySize,
        transport,
        intentions,
        timestamp: new Date().toLocaleString('en-GB')
      };

      // Set Loading UI on Submit Button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Recording Registration...</span> <span class="spinner-dot">⏳</span>`;
      }

      // 1. Submit directly to Google Sheet if Web App URL is configured
      if (GOOGLE_SHEET_WEB_APP_URL && GOOGLE_SHEET_WEB_APP_URL.trim() !== '') {
        try {
          await fetch(GOOGLE_SHEET_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', // Google Apps Script redirects with 302, mode: 'no-cors' succeeds silently
            cache: 'no-cache',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(newRegistration)
          });
        } catch (fetchErr) {
          console.warn('Google Sheet submission warning:', fetchErr);
        }
      }

      // 2. Always save locally as a guaranteed backup
      try {
        const stored = JSON.parse(localStorage.getItem('osmotherley_registrations') || '[]');
        stored.push(newRegistration);
        localStorage.setItem('osmotherley_registrations', JSON.stringify(stored));
      } catch (storageErr) {
        console.error('Local backup storage error:', storageErr);
      }

      // 3. Smoothly hide form and reveal confirmation
      form.style.display = 'none';
      if (confirmationBox) {
        confirmationBox.style.display = 'block';
        confirmationBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

});
