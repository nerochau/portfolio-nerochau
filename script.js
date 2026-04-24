document.addEventListener("DOMContentLoaded", () => {
  // 1. Fade-in effect logic
  const elements = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));

  // 2. Typing effect logic
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
});

// 3. Filter logic

async function loadProjects() {
  try {
    const response = await fetch('projects.json');
    const data = await response.json();           
    
    const container = document.getElementById('project-container');
    container.innerHTML = data.map(project => `
      <div class="project-card fade-in show" data-year="${project.year}">
        <img src = "${project.img}" alt="${project.title}">
        <h3>${project.title}</h3>
        <p>${project.desc}</p>
        <p class="tech">${project.tech}</p>
        <a href="${project.link}" target="_blank" class="view-btn">View Project →</a>
      </div>
    `).join('');
  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadProjects);

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

// need to figure out the hobby
async function loadHobbies() {
  const response = await fetch('hobbies.json');
  const data = await response.json();
  const container = document.getElementById('hobby-container'); // Make sure this ID exists in HTML

  container.innerHTML = data.map(hobby => {
    if (hobby.type === "carousel") {
      return `
        <div class="project-card travel-card">
          <div class="carousel" id="travel-carousel">
            <div class="carousel-track">
              ${hobby.images.map(img => `
                <div class="carousel-item">
                  <img src="${img.url}" alt="${img.label}">
                  <span class="country-label">${img.label}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="card-content">
            <div class="carousel-controls">
              <button class="nav-btn prev" onclick="moveCarousel(-1)">&#10094;</button>
              <button class="nav-btn next" onclick="moveCarousel(1)">&#10095;</button>
            </div>
            <h3>${hobby.title}</h3>
            <p>${hobby.desc}</p>
            <span class="tech">${hobby.tech}</span>
          </div>
        </div>`;
    }
    // You can add more 'if' statements here for YouTube or Entrepreneurship
  }).join('');
}

// Call both on load
document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
  loadHobbies();
});

// Scrolling
function moveCarousel(direction) {
  const carousel = document.getElementById('travel-carousel');
  // Scroll by the width of the carousel container
  carousel.scrollBy({
    left: carousel.offsetWidth * direction,
    behavior: 'smooth'
  });
}