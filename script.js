(function () {
  const cfg = window.HAA_CONFIG || {};
  const ctas = cfg.ctas || {};
  const icons = {
    arrow: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
    menu: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>',
    pulse: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h4l2-6 4 12 2-6h6"/></svg>',
    check: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
    link: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1"/></svg>',
    loop: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M17 2v5h-5"/><path d="M7 22v-5h5"/><path d="M19 9a7 7 0 0 0-12-3"/><path d="M5 15a7 7 0 0 0 12 3"/></svg>'
  };

  function sanitize(value) {
    return String(value || "").replace(/[<>]/g, "").trim();
  }

  function addButtonIcons() {
    document.querySelectorAll(".button").forEach((button) => {
      if (button.dataset.iconified) return;
      button.insertAdjacentHTML("beforeend", icons.arrow);
      button.dataset.iconified = "true";
    });
  }

  function addVisualIcons() {
    const stateIcon = document.body.querySelector(".hero.dark") ? icons.loop : icons.check;
    document.querySelectorAll(".state").forEach((state) => {
      if (!state.dataset.iconified) {
        state.insertAdjacentHTML("afterbegin", stateIcon);
        state.dataset.iconified = "true";
      }
    });
    document.querySelectorAll(".step-number").forEach((step, index) => {
      if (!step.dataset.iconified) {
        step.innerHTML = index === 0 ? icons.pulse : index === 1 ? icons.link : icons.check;
        step.dataset.iconified = "true";
      }
    });
    if (menuButton && !menuButton.dataset.iconified) {
      menuButton.insertAdjacentHTML("afterbegin", icons.menu);
      menuButton.dataset.iconified = "true";
    }
  }

  document.querySelectorAll("[data-legal='emergency']").forEach((node) => {
    node.textContent = cfg.legal?.emergencyNotice || "";
  });

  const menuButton = document.querySelector("[data-menu-button]");
  const navLinks = document.querySelector("[data-nav-links]");
  addButtonIcons();
  addVisualIcons();

  const revealNodes = document.querySelectorAll("main > section:not(.hero), form, .step");
  revealNodes.forEach((node) => node.classList.add("reveal"));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  }

  if (menuButton && navLinks) {
    let lastFocus = null;
    menuButton.addEventListener("click", () => {
      const open = !navLinks.classList.contains("open");
      lastFocus = document.activeElement;
      navLinks.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      menuButton.setAttribute("aria-expanded", String(open));
      if (open) navLinks.querySelector("a")?.focus();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        document.body.classList.remove("menu-open");
        menuButton.setAttribute("aria-expanded", "false");
        lastFocus?.focus();
      }
    });
  }

  document.querySelectorAll("[data-cta]").forEach((cta) => {
    const audience = cta.getAttribute("data-cta");
    const url = ctas[audience];
    if (url) {
      cta.setAttribute("href", url);
      return;
    }
    cta.setAttribute("href", "#lead-form");
    cta.addEventListener("click", (event) => {
      event.preventDefault();
      document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.querySelector("#lead-form input, #lead-form select, #lead-form textarea")?.focus();
    });
  });

  document.querySelectorAll("[data-state-visual]").forEach((visual) => {
    const states = Array.from(visual.querySelectorAll("[data-state]"));
    let index = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function setState(next) {
      index = next;
      states.forEach((state, i) => state.classList.toggle("active", i === index));
    }
    states.forEach((state, i) => {
      state.tabIndex = 0;
      state.addEventListener("focus", () => setState(i));
      state.addEventListener("click", () => setState(i));
    });
    setState(0);
    if (!reduced && states.length > 1) {
      window.setInterval(() => {
        if (!document.hidden) setState((index + 1) % states.length);
      }, 2800);
    }
  });

  document.querySelectorAll("[data-word-path]").forEach((path) => {
    const buttons = Array.from(path.querySelectorAll("button"));
    const traveler = path.querySelector(".traveler");
    function setActive(i) {
      buttons.forEach((button, index) => {
        const active = index === i;
        button.setAttribute("aria-pressed", String(active));
        button.querySelector("p").hidden = !active;
      });
      if (traveler) traveler.style.transform = `translateY(${i * 112}px)`;
    }
    buttons.forEach((button, i) => {
      button.addEventListener("click", () => setActive(i));
      button.addEventListener("focus", () => setActive(i));
    });
    setActive(0);
  });

  document.querySelectorAll("[data-proof-strip]").forEach((strip) => {
    const keys = strip.getAttribute("data-proof-strip").split(",");
    const approved = keys.map((key) => cfg.publicClaims?.[key]).filter((claim) => claim?.approved);
    if (!approved.length) return;
    strip.classList.add("visible");
    strip.innerHTML = approved
      .map((claim) => `<div class="proof-item"><div class="proof-value">${claim.value}</div><div class="proof-label">${claim.label}</div></div>`)
      .join("");
  });

  document.querySelectorAll("form[data-audience]").forEach((form) => {
    const startedAt = Date.now();
    const status = form.querySelector(".form-status");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      status.textContent = "";
      if (Date.now() - startedAt < 1200 || form.querySelector("[name='website']")?.value) {
        status.textContent = "Please try again.";
        return;
      }
      if (!form.reportValidity()) return;
      const webhook = ctas.leadWebhook;
      if (!webhook) {
        status.textContent = "Development setup needed: add LEAD_WEBHOOK_URL in config.js before forms can submit.";
        return;
      }
      const data = Object.fromEntries(new FormData(form).entries());
      Object.keys(data).forEach((key) => (data[key] = sanitize(data[key])));
      data.audience = form.dataset.audience;
      const submit = form.querySelector("button[type='submit']");
      submit.disabled = true;
      submit.textContent = "Sending...";
      try {
        const response = await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Submission failed");
        status.textContent = "Received. We will follow up soon.";
        form.reset();
      } catch {
        status.textContent = "We could not send this yet. Your details are still here; please try again.";
      } finally {
        submit.disabled = false;
        submit.textContent = submit.dataset.label || "Submit";
        submit.dataset.iconified = "";
        addButtonIcons();
      }
    });
  });
})();
