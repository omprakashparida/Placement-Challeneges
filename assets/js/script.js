// script.js

// Toggle Mobile Menu
const menuIcon = document.getElementById('menuIcon');
const navLinks = document.getElementById('navLinks');

if (menuIcon) {
  menuIcon.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuIcon.classList.toggle('active');
  });
}

// Smooth Scrolling
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: 'smooth',
    });
  }
}

// Apply scroll animation to feature cards
window.addEventListener('scroll', function () {
  const cards = document.querySelectorAll('.feature-card');
  cards.forEach((card) => {
    const cardTop = card.getBoundingClientRect().top;
    if (cardTop < window.innerHeight - 100) {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }
  });
});

// Set your actual backend URL
const BACKEND_URL = 'https://bug-free-succotash-jj4xq46g49g6cxr5-5500.app.github.dev';

// Signup Form Submission
const signupForm = document.getElementById('signup-form');

if (signupForm) {
  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    if (name === '' || email === '' || password === '') {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.status === 201) {
        alert(data.msg);
        window.location.href = 'login.html';
      } else {
        alert(data.msg || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration.');
    }
  });
}

// Login Form Submission
const loginForm = document.getElementById('login-form');

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (email === '' || password === '') {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the JWT token in localStorage
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        // Redirect to the homepage or dashboard
        window.location.href = 'index.html';
      } else {
        alert(data.msg || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during login.');
    }
  });
}

// Logout Functionality
const logoutBtn = document.getElementById('logout-btn');

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('You have been logged out.');
    window.location.href = 'login.html';
  });
}

// Check Authentication on Page Load
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const authLinks = document.querySelectorAll('.auth-link');
  const guestLinks = document.querySelectorAll('.guest-link');

  if (token) {
    // User is authenticated
    if (authLinks) {
      authLinks.forEach((link) => (link.style.display = 'block'));
    }
    if (guestLinks) {
      guestLinks.forEach((link) => (link.style.display = 'none'));
    }
  } else {
    // User is not authenticated
    if (authLinks) {
      authLinks.forEach((link) => (link.style.display = 'none'));
    }
    if (guestLinks) {
      guestLinks.forEach((link) => (link.style.display = 'block'));
    }
  }
});
