document.addEventListener("DOMContentLoaded", () => {
  // Fade-in effect logic
  const elements = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));

  // Typing effect logic
  const text = "I build technology for social impact.";
  const typingElement = document.getElementById("typing");
  let index = 0;

  function typeEffect() {
    if (typingElement && index < text.length) {
      typingElement.innerHTML += text.charAt(index);
      index++;
      setTimeout(typeEffect, 150);
    }
  }

  typeEffect();
  loadProjects();
});

async function loadProjects() {
  const container = document.getElementById('project-container');
  if (!container) return;

  try {
    const response = await fetch('projects.json');
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = '<p>No projects found.</p>';
      return;
    }

    container.innerHTML = data.map(project => `
      <div class="project-card fade-in show" data-year="${project.year}">
        <img src="${project.img}" alt="${project.title}">
        <h3>${project.title}</h3>
        <p>${project.desc}</p>
        <p class="tech">${project.tech}</p>
        <a href="${project.link}" target="_blank" class="view-btn">View Project →</a>
      </div>
    `).join('');
  } catch (error) {
    console.error("Error loading projects:", error);
    container.innerHTML = '<p>Unable to load projects right now.</p>';
  }
}

function filterProjects(year) {
  const cards = document.querySelectorAll(".project-card");
  cards.forEach(card => {
    if (year === "all" || card.dataset.year === year) {
      card.style.display = "flex";
      card.classList.add("show");
    } else {
      card.style.display = "none";
    }
  });
}

// for pictures
function moveCarousel(direction) {
  const carousel = document.getElementById('travel-carousel');
  if (!carousel) return;

  carousel.scrollBy({
    left: carousel.offsetWidth * direction,
    behavior: 'smooth'
  });
}

// contact form
function getSavedMessages() {
  const storageKey = 'portfolio_contact_messages';
  const stored = localStorage.getItem(storageKey);
  return stored ? JSON.parse(stored) : [];
}

function saveMessageLocally(message) {
  const storageKey = 'portfolio_contact_messages';
  const messages = getSavedMessages();
  messages.push({
    ...message,
    submittedAt: new Date().toISOString(),
  });
  localStorage.setItem(storageKey, JSON.stringify(messages));
}

function renderSavedMessages() {
  const container = document.getElementById('saved-messages');
  if (!container) return;

  const messages = getSavedMessages();
  if (messages.length === 0) {
    container.innerHTML = '<p>No saved messages yet.</p>';
    return;
  }

  container.innerHTML = messages.map(message => `
    <div class="message-card">
      <h4>${message.name}</h4>
      <p><strong>Email:</strong> ${message.email}</p>
      <p>${message.message}</p>
      <small>Saved: ${new Date(message.submittedAt).toLocaleString()}</small>
    </div>
  `).join('');
}

function clearSavedMessages() {
  localStorage.removeItem('portfolio_contact_messages');
  renderSavedMessages();
}

function toggleSavedMessagesSection() {
  const section = document.getElementById('saved-messages-section');
  if (!section) return;
  section.classList.toggle('hidden');
  if (!section.classList.contains('hidden')) {
    renderSavedMessages();
  }
}

const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const clearMessagesBtn = document.getElementById('clear-messages-btn');
const contactTitle = document.getElementById('contact-title');

if (contactTitle) {
  let secretClicks = 0;
  contactTitle.addEventListener('click', () => {
    secretClicks += 1;
    setTimeout(() => {
      secretClicks = 0;
    }, 1000);

    if (secretClicks === 5) {
      toggleSavedMessagesSection();
      secretClicks = 0;
      alert('Admin panel toggled.');
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'm') {
    toggleSavedMessagesSection();
    alert('Admin panel toggled.');
  }
});

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value,
    };

    saveMessageLocally(formData);
    renderSavedMessages();

    alert("Message saved. Thank you!");
    contactForm.reset();
    submitBtn.innerText = "Send Message";
    submitBtn.disabled = false;
  });
}

if (clearMessagesBtn) {
  clearMessagesBtn.addEventListener('click', clearSavedMessages);
}

window.filterProjects = filterProjects;
window.moveCarousel = moveCarousel;

renderSavedMessages();
