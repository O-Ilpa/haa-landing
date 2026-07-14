(function () {
  document.documentElement.classList.add("js");

  const cfg = window.HAA_CONFIG || {};
  const ctas = cfg.ctas || {};
  const icons = {
    arrow: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
    menu: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>',
    x: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    route: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h3a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h7"/></svg>',
    check: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m5 12 4 4L19 6"/></svg>',
    clipboard: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 4h8"/><path d="M9 2h6v4H9z"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m8 13 2 2 5-5"/></svg>',
    users: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    link: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1 0l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1"/></svg>',
    repeat: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></svg>',
    shield: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z"/><path d="m9 12 2 2 4-4"/></svg>'
  };

  function sanitize(value) {
    return String(value || "").replace(/[<>]/g, "").trim();
  }

  function audienceFromForm() {
    return document.querySelector("form[data-audience]")?.dataset.audience || "patient";
  }

  function ctaText() {
    return document.querySelector(".hero .button.primary")?.textContent?.trim() || "Get started";
  }

  function addButtonIcons() {
    document.querySelectorAll(".button").forEach((button) => {
      if (button.dataset.iconified) return;
      button.insertAdjacentHTML("beforeend", icons.arrow);
      button.dataset.iconified = "true";
    });
  }

  function pageIcon() {
    const audience = audienceFromForm();
    if (audience === "provider") return icons.clipboard;
    if (audience === "lawyer") return icons.link;
    if (audience === "investor") return icons.repeat;
    return icons.route;
  }

  function addVisualIcons() {
    document.querySelectorAll(".state").forEach((state) => {
      if (!state.dataset.iconified) {
        state.insertAdjacentHTML("afterbegin", pageIcon());
        state.dataset.iconified = "true";
      }
    });
    document.querySelectorAll(".step-number").forEach((step, index) => {
      if (!step.dataset.iconified) {
        const icon = index === 0 ? pageIcon() : index === 1 ? icons.users : icons.check;
        step.innerHTML = icon;
        step.dataset.iconified = "true";
      }
    });
  }

  function setLegalCopy() {
    document.querySelectorAll("[data-legal='emergency']").forEach((node) => {
      node.textContent = cfg.legal?.emergencyNotice || "";
    });
  }

  function setupMenu() {
    const menuButton = document.querySelector("[data-menu-button]");
    const navLinks = document.querySelector("[data-nav-links]");
    if (!menuButton || !navLinks) return;

    menuButton.innerHTML = `${icons.menu}<span>Menu</span>`;
    menuButton.setAttribute("aria-label", "Open navigation menu");
    let lastFocus = null;

    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function closeMenu() {
      navLinks.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.innerHTML = `${icons.menu}<span>Menu</span>`;
      menuButton.setAttribute("aria-label", "Open navigation menu");
      lastFocus?.focus();
    }

    function openMenu() {
      lastFocus = document.activeElement;
      navLinks.classList.add("open");
      document.body.classList.add("menu-open");
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.innerHTML = `${icons.x}<span>Close</span>`;
      menuButton.setAttribute("aria-label", "Close navigation menu");
      navLinks.querySelector("a")?.focus();
    }

    menuButton.addEventListener("click", () => {
      navLinks.classList.contains("open") ? closeMenu() : openMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (!navLinks.classList.contains("open")) return;
      if (event.key === "Escape") {
        closeMenu();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(navLinks.querySelectorAll(focusableSelector));
      focusable.push(menuButton);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  }

  function setupCtas() {
    document.querySelectorAll("[data-cta]").forEach((cta) => {
      if (cta.dataset.ctaBound) return;
      cta.dataset.ctaBound = "true";
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
  }

  function setupReveal() {
    const revealNodes = document.querySelectorAll("main > section:not(.hero), form, .step");
    revealNodes.forEach((node) => node.classList.add("reveal"));
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );
    revealNodes.forEach((node) => observer.observe(node));
  }

  function setupStateVisuals() {
    document.querySelectorAll("[data-state-visual]").forEach((visual) => {
      const states = Array.from(visual.querySelectorAll("[data-state]"));
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let index = 0;

      function setState(next) {
        index = next;
        states.forEach((state, i) => state.classList.toggle("active", i === index));
      }

      states.forEach((state, i) => {
        state.tabIndex = 0;
        state.addEventListener("focus", () => setState(i));
        state.addEventListener("click", () => setState(i));
      });

      setState(reduced ? states.length - 1 : 0);
    });
  }

  function setupPatientPath() {
    document.querySelectorAll("[data-word-path]").forEach((path) => {
      const buttons = Array.from(path.querySelectorAll("button"));
      const traveler = path.querySelector(".traveler");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      function setActive(i) {
        buttons.forEach((button, index) => {
          const active = index === i;
          button.setAttribute("aria-pressed", String(active));
          button.querySelector("p").hidden = !active;
        });
        if (traveler && buttons[0] && buttons[i]) {
          traveler.style.transform = `translateY(${buttons[i].offsetTop - buttons[0].offsetTop}px)`;
        }
      }

      buttons.forEach((button, i) => {
        button.addEventListener("click", () => setActive(i));
        button.addEventListener("focus", () => setActive(i));
      });

      if (reduced) {
        setActive(buttons.length - 1);
        return;
      }

      setActive(0);
    });
  }

  function setupProof() {
    document.querySelectorAll("[data-proof-strip]").forEach((strip) => {
      const keys = strip.getAttribute("data-proof-strip").split(",");
      const approved = keys.map((key) => cfg.publicClaims?.[key]).filter((claim) => claim?.approved);
      if (!approved.length) return;
      strip.classList.add("visible");
      strip.innerHTML = approved
        .map((claim) => `<div class="proof-item"><div class="proof-value">${claim.value}</div><div class="proof-label">${claim.label}</div></div>`)
        .join("");
    });
  }

  function setupStickyCta() {
    const heroButton = document.querySelector(".hero .button.primary");
    const final = document.querySelector(".final");
    if (!heroButton || !final || window.matchMedia("(min-width: 861px)").matches) return;
    if (!heroButton.dataset.cta && !document.getElementById("lead-form")) return;

    const sticky = document.createElement("div");
    sticky.className = "sticky-cta";
    const href = heroButton.getAttribute("href") || "#lead-form";
    const ctaAttr = heroButton.dataset.cta ? ` data-cta="${heroButton.dataset.cta}"` : ` href="${href}"`;
    sticky.innerHTML = `<a class="button primary"${ctaAttr}>${ctaText()}</a>`;
    document.body.appendChild(sticky);
    addButtonIcons();
    setupCtas();

    let heroVisible = true;
    let finalVisible = false;
    function update() {
      sticky.classList.toggle("visible", !heroVisible && !finalVisible && !document.body.classList.contains("menu-open"));
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === heroButton) heroVisible = entry.isIntersecting;
        if (entry.target === final) finalVisible = entry.isIntersecting;
      });
      update();
    }, { threshold: 0.2 });
    observer.observe(heroButton);
    observer.observe(final);
  }

  function setupForms() {
    document.querySelectorAll("form[data-audience]").forEach((form) => {
      const startedAt = Date.now();
      const status = form.querySelector(".form-status");
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        status.textContent = "";
        if (!form.reportValidity()) {
          form.querySelector(":invalid")?.scrollIntoView({ block: "center", behavior: "smooth" });
          return;
        }
        if (Date.now() - startedAt < 1200 || form.querySelector("[name='website']")?.value) {
          status.textContent = "Please try again.";
          return;
        }
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
  }

  setLegalCopy();
  setupMenu();
  addButtonIcons();
  addVisualIcons();
  setupCtas();
  setupReveal();
  setupStateVisuals();
  setupPatientPath();
  setupProof();
  setupStickyCta();
  setupForms();
})();
