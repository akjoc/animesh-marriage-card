/* Native scrolling + a single, on-demand animation frame; no scroll hijacking. */
(() => {
  "use strict";
  const root = document.documentElement;
  const story = document.querySelector(".mandap-story");
  const stage = document.querySelector(".mandap-stage");
  const names = document.querySelector(".mandap-names");
  const toggle = document.querySelector("#motion-toggle");
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));
  const ease = (value) => {
    const t = clamp(value);
    return t * t * (3 - 2 * t);
  };
  let enabled = false;
  let frame = 0;
  let viewport = innerHeight;
  let storyTop = 0;
  let runway = 1;
  let pageRunway = 1;
  let revealObserver;
  let desiredMotion = true;
  try {
    desiredMotion = sessionStorage.getItem("wedding-motion") !== "off";
  } catch {
    /* Storage is optional. */
  }

  const revealElements = [
    ...document.querySelectorAll(
      [
        ".hero-copy > *",
        ".hero-art",
        ".date-ribbon",
        ".section-heading",
        ".invitation-text > *",
        ".event-card",
        ".additional-events",
        ".calendar-note",
        ".venue-card",
        ".countdown-copy",
        ".countdown > div",
        ".family-section > .lotus",
        ".family-section > .eyebrow",
        ".family-section > h2",
        ".family-intro",
        ".family-columns > div",
        ".family-signoff",
      ].join(","),
    ),
  ];
  revealElements.forEach((element) => {
    element.classList.add("story-reveal");
    const siblings = [...element.parentElement.children];
    const index = siblings.indexOf(element);
    const delay = element.matches(
      ".event-card, .venue-card, .countdown > div, .family-columns > div",
    )
      ? (index % 4) * 110
      : 0;
    element.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  const parallaxItems = [
    ...[...document.querySelectorAll(".hero-art")].map((element) => ({
      element,
      distance: 40,
    })),
    ...[...document.querySelectorAll(".corner-flower")].map((element) => ({
      element,
      distance: 65,
    })),
    ...[...document.querySelectorAll(".venue-visual")].map((element) => ({
      element,
      distance: 18,
    })),
  ];

  const petalLayer = document.querySelector(".mandap-petals");
  for (let i = 0; i < 20; i++) {
    const petal = document.createElement("i");
    petal.className = "mandap-petal";
    petal.style.setProperty("--left", `${(i * 17 + 3) % 100}%`);
    petal.style.setProperty("--size", `${7 + (i % 7)}px`);
    petal.style.setProperty("--duration", `${10 + (i % 6)}s`);
    petal.style.setProperty("--delay", `${-i * 1.3}s`);
    petal.style.setProperty("--drift", `${i % 2 ? 85 : -65}px`);
    petalLayer.appendChild(petal);
  }

  function measure() {
    viewport = innerHeight;
    storyTop = story.getBoundingClientRect().top + scrollY;
    runway = Math.max(1, story.offsetHeight - stage.offsetHeight);
    pageRunway = Math.max(1, root.scrollHeight - viewport);
    parallaxItems.forEach((item) => {
      // Measure stable parents, not the already-transformed artwork.
      const rect = item.element.parentElement.getBoundingClientRect();
      item.top = rect.top + scrollY;
      item.height = rect.height;
    });
    requestUpdate();
  }

  function update() {
    frame = 0;
    if (!enabled) return;
    const y = scrollY;
    const progress = clamp((y - storyTop) / runway);
    const gate = ease((progress - 0.035) / 0.7);
    const nameReveal = ease((progress - 0.22) / 0.42);
    const welcome = 1 - ease(progress / 0.22);
    const active = y < storyTop + story.offsetHeight && y + viewport > storyTop;
    stage.classList.toggle("scene-active", active);
    story.style.setProperty("--gate-angle", `${(gate * 104).toFixed(3)}deg`);
    story.style.setProperty("--gate-shift", `${(gate * 17).toFixed(3)}%`);
    story.style.setProperty(
      "--gate-opacity",
      (1 - ease((progress - 0.68) / 0.13)).toFixed(4),
    );
    story.style.setProperty("--welcome-opacity", welcome.toFixed(4));
    story.style.setProperty("--welcome-y", `${(progress * 110).toFixed(2)}px`);
    story.style.setProperty("--room-scale", (1.13 - gate * 0.13).toFixed(4));
    story.style.setProperty("--names-opacity", nameReveal.toFixed(4));
    story.style.setProperty(
      "--names-y",
      `${((1 - nameReveal) * 45).toFixed(2)}px`,
    );
    story.style.setProperty("--foliage-x", `${(gate * 35).toFixed(2)}px`);
    story.style.setProperty("--foliage-y", `${(gate * 28).toFixed(2)}px`);
    // Hidden interactive content must not trap keyboard users behind the gates.
    names.inert = nameReveal < 0.95;
    root.style.setProperty(
      "--reading-progress",
      clamp(y / pageRunway).toFixed(5),
    );
    parallaxItems.forEach(({ element, top, height, distance }) => {
      if (y + viewport < top - 100 || y > top + height + 100) return;
      const position = clamp((y + viewport - top) / (viewport + height));
      element.style.setProperty(
        "--parallax-y",
        `${((position - 0.5) * distance * 2).toFixed(2)}px`,
      );
    });
  }

  function requestUpdate() {
    if (enabled && !frame) frame = requestAnimationFrame(update);
  }

  function observeReveals() {
    revealObserver?.disconnect();
    if (!enabled || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Re-play on a deliberate return from below; never hide already-passed content.
          if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
            entry.target.classList.add("is-visible");
          } else if (entry.boundingClientRect.top > viewport) {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -25px 0px" },
    );
    revealElements.forEach((element) => revealObserver.observe(element));
  }

  function setMotion(next, keepPlace = false) {
    const previousHeight = story.offsetHeight;
    const previousY = scrollY;
    const oldBottom = story.getBoundingClientRect().bottom + previousY;
    enabled = next && !preference.matches;
    root.classList.toggle("cinematic", enabled);
    root.classList.toggle("motion-disabled", !enabled);
    toggle.hidden = false;
    toggle.disabled = preference.matches;
    toggle.setAttribute("aria-pressed", String(enabled));
    toggle.setAttribute(
      "aria-label",
      preference.matches
        ? "Animations disabled by your reduced-motion preference"
        : enabled
          ? "Turn off cinematic animations"
          : "Turn on cinematic animations",
    );
    toggle.querySelector(".motion-label").textContent = preference.matches
      ? "Reduced motion"
      : enabled
        ? "Motion on"
        : "Motion off";
    if (!enabled) {
      cancelAnimationFrame(frame);
      frame = 0;
      names.inert = false;
      stage.classList.remove("scene-active");
      parallaxItems.forEach(({ element }) =>
        element.style.removeProperty("--parallax-y"),
      );
    }
    observeReveals();
    measure();
    if (keepPlace) {
      const heightDifference = story.offsetHeight - previousHeight;
      // Preserve the current chapter when shortening or extending the intro.
      scrollTo({
        top:
          previousY >= oldBottom
            ? previousY + heightDifference
            : Math.min(previousY, story.offsetHeight - stage.offsetHeight),
        behavior: "instant",
      });
      measure();
    }
    if (enabled) update();
  }

  toggle.addEventListener("click", () => {
    desiredMotion = !enabled;
    try {
      sessionStorage.setItem("wedding-motion", desiredMotion ? "on" : "off");
    } catch {
      /* Private browsing may block storage. */
    }
    setMotion(desiredMotion, true);
  });
  preference.addEventListener("change", () => setMotion(desiredMotion, true));
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", measure, { passive: true });
  window.addEventListener("pageshow", measure);
  // Tabs and font loading can change document height without a viewport resize.
  if ("ResizeObserver" in window)
    new ResizeObserver(measure).observe(document.body);
  document.fonts?.ready.then(measure);

  document.querySelector(".mandap-skip").addEventListener("click", (event) => {
    event.preventDefault();
    document
      .querySelector("#home")
      .scrollIntoView({ behavior: "instant", block: "start" });
    document.querySelector("#invitation-title").focus({ preventScroll: true });
    requestUpdate();
  });

  // Immediate initial paint, including restored browser scroll positions.
  setMotion(desiredMotion);
})();
