document.addEventListener("DOMContentLoaded", () => {
  // Each feature below is wrapped in try/catch so that if one fails
  // (e.g. a CDN script is blocked), the rest of the page still works.

  /* ------------------------------------------------------
     1) Navbar background on scroll + back-to-top visibility
  ------------------------------------------------------ */
  try {
    const nav = document.getElementById("mainNav");
    const backToTop = document.getElementById("backToTop");
    const onScroll = () => {
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
      if (backToTop) backToTop.classList.toggle("show", window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();

    if (backToTop) {
      backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  } catch (err) {
    console.error("Navbar/scroll feature failed:", err);
  }

  /* ------------------------------------------------------
     2) Close mobile menu after a link is clicked
  ------------------------------------------------------ */
  try {
    const navMenu = document.getElementById("navMenu");
    if (navMenu && typeof bootstrap !== "undefined") {
      const bsCollapse = new bootstrap.Collapse(navMenu, { toggle: false });
      document.querySelectorAll("#navMenu .nav-link").forEach((link) => {
        link.addEventListener("click", () => {
          if (navMenu.classList.contains("show")) bsCollapse.hide();
        });
      });
    }
  } catch (err) {
    console.error("Mobile menu feature failed:", err);
  }

  /* ------------------------------------------------------
     3) Active link highlighting while scrolling
  ------------------------------------------------------ */
  try {
    const sections = document.querySelectorAll("main .section, .hero-section");
    const navLinks = document.querySelectorAll("#navMenu .nav-link");

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => sectionObserver.observe(s));
  } catch (err) {
    console.error("Active nav-link feature failed:", err);
  }

  /* ------------------------------------------------------
     4) Hero typing effect
  ------------------------------------------------------ */
  try {
    const roles = [
      "توسعه‌دهنده فرانت‌اند",
      "علاقه‌مند به کد تمیز",
      "در حال یادگیری مداوم",
    ];
    const typedEl = document.getElementById("typedRole");

    if (typedEl) {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const type = () => {
        const current = roles[roleIndex];

        if (!deleting) {
          charIndex++;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(type, 1600);
            return;
          }
        } else {
          charIndex--;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
          }
        }
        setTimeout(type, deleting ? 45 : 85);
      };
      type();
    }
  } catch (err) {
    console.error("Typing effect failed:", err);
  }

  /* ------------------------------------------------------
     5) Hero cursor-reactive glow
  ------------------------------------------------------ */
  try {
    const heroSection = document.getElementById("hero");
    const heroGlow = document.querySelector(".hero-glow");
    if (heroSection && heroGlow && window.matchMedia("(pointer: fine)").matches) {
      heroSection.addEventListener("mousemove", (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        heroGlow.style.setProperty("--mx", `${x}%`);
        heroGlow.style.setProperty("--my", `${y}%`);
      });
    }
  } catch (err) {
    console.error("Hero glow feature failed:", err);
  }

  /* ------------------------------------------------------
     6) Scroll reveal animations (+ safety-net fallback)
  ------------------------------------------------------ */
  try {
    const revealItems = document.querySelectorAll('[data-animate="fade-up"]');
    revealItems.forEach((el) => {
      const delay = el.getAttribute("data-delay");
      if (delay) el.style.setProperty("--d", delay);
    });

    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealItems.forEach((el) => revealObserver.observe(el));

    // Safety net: if for any reason an item never gets revealed
    // (observer edge-cases, very short pages, etc.), force it visible
    // after a short delay so content is never permanently hidden.
    setTimeout(() => {
      document.querySelectorAll('[data-animate="fade-up"]:not(.in-view)').forEach((el) => {
        el.classList.add("in-view");
      });
    }, 1500);
  } catch (err) {
    console.error("Scroll reveal feature failed:", err);
    // If this feature errors entirely, force everything visible immediately.
    document.querySelectorAll('[data-animate="fade-up"]').forEach((el) => {
      el.classList.add("in-view");
    });
  }

  /* ------------------------------------------------------
     7) Contact form (front-end only — no backend)
  ------------------------------------------------------ */
  try {
    const form = document.getElementById("contactForm");
    const feedback = document.getElementById("formFeedback");

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.classList.add("was-validated");
          return;
        }
        feedback.textContent = "پیام شما ارسال شد. به‌زودی پاسخ می‌دهم!";
        form.reset();
        form.classList.remove("was-validated");
        setTimeout(() => (feedback.textContent = ""), 5000);
      });
    }
  } catch (err) {
    console.error("Contact form feature failed:", err);
  }

  /* ------------------------------------------------------
     8) Footer year
  ------------------------------------------------------ */
  try {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  } catch (err) {
    console.error("Footer year feature failed:", err);
  }
});
