const CONFIG = {
  stats: [
    { value: 1800, suffix: "+", label: "Community Members" },
    { value: 99, suffix: "+", label: "Business Resources" },
    { value: 89, suffix: "+", label: "Seller Resources" },
    { value: null, suffix: "", label: "Community Access", live: true }
  ],
  // Replace only with verified, publishable figures before launch.
  heroMetrics: { profit: 12987, premiumBuyers: 52 }
};

const statsGrid = document.getElementById("statsGrid");
statsGrid.innerHTML = CONFIG.stats.map((s) => `
  <div class="stat">
    <span class="stat-number ${s.live ? "live" : "counter"}"
      ${s.live ? "" : `data-target="${s.value}" data-suffix="${s.suffix}"`}>${s.live ? '<span class="live-dot"></span>24/7' : "0"}</span>
    <span class="stat-label">${s.label}</span>
  </div>
`).join("");

const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => navbar.classList.toggle("scrolled", window.scrollY > 12), { passive: true });

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

function animateCounter(el) {
  const target = Number(el.dataset.target || 0);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const duration = 1200;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + Math.round(target * eased).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    if (entry.target.classList.contains("counter")) {
      animateCounter(entry.target);
    }
    obs.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal, .counter").forEach(el => observer.observe(el));

const toast = document.getElementById("toast");
let toastTimer;
document.querySelectorAll("[data-toast]").forEach(btn => {
  btn.addEventListener("click", () => {
    toast.textContent = btn.dataset.toast;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  });
});

// Gentle stagger for cards in grids.
document.querySelectorAll(".feature-grid,.resource-grid,.supplier-grid,.product-grid,.review-grid,.stats-grid").forEach(grid => {
  [...grid.children].forEach((el, i) => el.style.transitionDelay = `${Math.min(i * 70, 280)}ms`);
});

// Prevent placeholder navigation from jumping to nowhere.
document.querySelectorAll('a[href="#marketplace"]').forEach(a => {
  a.addEventListener("click", e => {
    if (a.textContent.includes("View Product")) e.preventDefault();
  });
});
