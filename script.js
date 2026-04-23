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
      setTimeout(typeEffect, 80);
    }
  }

  typeEffect();
});

// 3. Filter logic
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