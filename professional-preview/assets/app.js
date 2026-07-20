(() => {
  const config = window.GLOBALLINK_CONFIG || {};
  const menuButton = document.querySelector("[data-menu-button]");
  const menuPanel = document.querySelector("[data-menu-panel]");
  const tabs = [...document.querySelectorAll("[data-tab]")];
  const panels = [...document.querySelectorAll("[data-panel]")];

  if (menuButton && menuPanel) {
    menuButton.addEventListener("click", () => {
      const open = menuPanel.hidden;
      menuPanel.hidden = !open;
      menuButton.setAttribute("aria-expanded", String(open));
    });
    menuPanel.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menuPanel.hidden = true;
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      tabs.forEach(item => {
        const active = item === tab;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });
      panels.forEach(panel => {
        panel.hidden = panel.dataset.panel !== target;
      });
    });
  });

  document.querySelectorAll("[data-scroll-partners]").forEach(button => {
    button.addEventListener("click", () => {
      document.getElementById("partners")?.scrollIntoView({behavior:"smooth", block:"start"});
    });
  });

  document.querySelectorAll(".faq-button").forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const answer = item.querySelector(".faq-answer");
      const open = !item.classList.contains("open");
      item.classList.toggle("open", open);
      button.setAttribute("aria-expanded", String(open));
      answer.hidden = !open;
    });
  });

  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, {threshold:0.12})
    : null;

  document.querySelectorAll(".reveal").forEach(el => {
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add("visible");
  });

  const trackLocal = partner => {
    try {
      const key = "globallink_affiliate_clicks";
      const current = JSON.parse(localStorage.getItem(key) || "{}");
      current[partner] = (current[partner] || 0) + 1;
      localStorage.setItem(key, JSON.stringify(current));
    } catch (_) {}
  };

  document.querySelectorAll("[data-affiliate]").forEach(link => {
    link.addEventListener("click", () => {
      const partner = link.dataset.affiliate;
      const category = link.dataset.category;
      trackLocal(partner);

      if (typeof window.gtag === "function") {
        window.gtag("event", "affiliate_click", {
          partner_name: partner,
          partner_category: category,
          outbound_url: link.href
        });
      }
    });
  });

  if (config.gaMeasurementId && /^G-[A-Z0-9]+$/i.test(config.gaMeasurementId)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.gaMeasurementId)}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){window.dataLayer.push(arguments);};
    window.gtag("js", new Date());
    window.gtag("config", config.gaMeasurementId, {anonymize_ip:true});
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
