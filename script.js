/* Progressive enhancement: navigation, project previews and subtle scroll reveals. */
(() => {
  "use strict";
  document.documentElement.classList.add("js");
  document.getElementById("year").textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const header = document.querySelector(".site-header");
  const clamp = (value) => Math.max(0, Math.min(1, value));

  const projects = {
    saleena: {
      title: "Saleena Pickles",
      category: "Packaging design",
      image: "assets/saleena.webp",
      alt: "Saleena Pickles mango jars with green packaging",
      description:
        "A packaging identity brought to life through green labels, ingredient-led imagery, and a warm product presentation. Selected work from the Marzi Media portfolio.",
    },
    eyouth: {
      title: "e.youth Mathrubhumi",
      category: "Logo & branding",
      image: "assets/eyouth.webp",
      alt: "e.youth Mathrubhumi branding across social media and merchandise",
      description:
        "A cohesive green visual identity, explored across social media, stationery, and merchandise. Selected work from the Marzi Media portfolio.",
    },
    urban: {
      title: "Urban Culture",
      category: "Packaging design",
      image: "assets/urban-culture.webp",
      alt: "Urban Culture cosmetic packaging and campaign imagery",
      description:
        "A dark, expressive packaging direction with purple accents and fashion-led imagery. Selected work from the Marzi Media portfolio.",
    },
    english: {
      title: "English Debate Club",
      category: "Logo & branding",
      image: "assets/english-debate.webp",
      alt: "English Debate Club identity in blue across digital and physical applications",
      description:
        "A distinctive blue identity carried through digital touchpoints, signage, and printed materials. Selected work from the Marzi Media portfolio.",
    },
  };
  const projectDialog = document.getElementById("project-dialog");
  const openDialog = (dialog) => {
    dialog.showModal();
    document.body.classList.add("modal-open");
  };
  document.querySelectorAll("[data-project]").forEach((button) => {
    button.addEventListener("click", () => {
      const project = projects[button.dataset.project];
      document.getElementById("dialog-title").textContent = project.title;
      document.getElementById("dialog-category").textContent = project.category;
      document.getElementById("dialog-description").textContent =
        project.description;
      const image = document.getElementById("dialog-image");
      image.src = project.image;
      image.alt = project.alt;
      openDialog(projectDialog);
    });
  });
  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog
      .querySelector("[data-close]")
      .addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () =>
      document.body.classList.remove("modal-open"),
    );
    // Close only when a click falls outside the actual dialog rectangle.
    dialog.addEventListener("click", (event) => {
      const bounds = dialog.getBoundingClientRect();
      if (
        event.target === dialog &&
        (event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom)
      )
        dialog.close();
    });
  });
  document
    .getElementById("dialog-contact")
    .addEventListener("click", () => projectDialog.close());

  // Chapter menu. The native modal dialog handles focus containment, Escape and page inertness.
  const menu = document.getElementById("site-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  // The close button sits exactly over the menu button, so the asterisk appears to become a cross.
  const placeMenuClose = () => {
    const bounds = menuToggle.getBoundingClientRect();
    menu.style.setProperty("--toggle-x", `${bounds.left}px`);
    menu.style.setProperty("--toggle-y", `${bounds.top}px`);
    menu.style.setProperty("--toggle-size", `${bounds.width}px`);
  };
  menuToggle.addEventListener("click", () => {
    placeMenuClose();
    openDialog(menu);
    menuToggle.setAttribute("aria-expanded", "true");
  });
  menu.addEventListener("close", () =>
    menuToggle.setAttribute("aria-expanded", "false"),
  );
  menu.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    // Close first; the link's native navigation then scrolls to the chapter.
    menu.close();
    document.body.classList.remove("modal-open");
    // Continue keyboard navigation from the destination instead of the menu button.
    const target = document.querySelector(link.hash);
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.addEventListener("blur", () => target.removeAttribute("tabindex"), {
      once: true,
    });
  });

  // One scheduled viewport update handles the header, chapter navigation and crew motion.
  const chapterRail = document.querySelector(".chapter-rail");
  const chapterLinks = [...chapterRail.querySelectorAll("a")];
  const menuLinks = [...menu.querySelectorAll(".menu-list a")];
  const railFills = chapterLinks.map((link) => ({
    fill: link.querySelector(".rail-fill"),
    value: "",
  }));
  const tickerTrack = document.querySelector(".chapter-ticker-track");
  const [ringRight, ringLeft] = menuToggle.querySelectorAll(
    ".menu-progress-half > span",
  );
  let sectionPositions = [];
  let darkBands = [];
  let headerHeight = header.offsetHeight;
  let maxScroll = 1;
  let activeIndex = null;
  let railTheme = "";
  let ringValue = "";
  let scrolled = false;
  let headerHidden = false;
  let lastScrollY = window.scrollY;
  let frame = 0;
  let renderCrew = () => {};
  let measureCrew = () => {};
  let renderScenes = () => {};
  const setHeaderHidden = (hidden) => {
    if (hidden === headerHidden) return;
    headerHidden = hidden;
    header.classList.toggle("is-hidden", hidden);
  };
  header.addEventListener("focusin", () => setHeaderHidden(false));
  // Every value comes from cached geometry and the scroll position; nothing here reads layout.
  const renderChapters = (y) => {
    const reading = y + headerHeight + 72;
    const index = sectionPositions.findLastIndex(({ top }) => top <= reading);
    if (index !== activeIndex) {
      activeIndex = index;
      [chapterLinks, menuLinks].forEach((links) =>
        links.forEach((link, i) => {
          if (i === index) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        }),
      );
      tickerTrack.style.setProperty("--chapter", index + 1);
    }
    sectionPositions.forEach(({ top }, i) => {
      const end = sectionPositions[i + 1]?.top ?? maxScroll + headerHeight + 72;
      const value = clamp((reading - top) / Math.max(1, end - top)).toFixed(3);
      const item = railFills[i];
      if (value === item.value) return;
      item.value = value;
      item.fill.style.transform = `scaleY(${value})`;
    });
    const probe = y + window.innerHeight / 2;
    const theme = darkBands.some(
      ({ top, bottom }) => probe >= top && probe < bottom,
    )
      ? "dark"
      : "light";
    if (theme !== railTheme) {
      railTheme = theme;
      chapterRail.dataset.theme = theme;
    }
    const progress = clamp(y / maxScroll);
    const first = Math.min(1, progress * 2);
    const second = Math.max(0, progress * 2 - 1);
    const ring = `${first.toFixed(3)} ${second.toFixed(3)}`;
    if (ring === ringValue) return;
    ringValue = ring;
    ringRight.style.transform = `rotate(${(180 * first - 135).toFixed(1)}deg)`;
    ringRight.style.opacity = first > 0 ? "1" : "0";
    ringLeft.style.transform = `rotate(${(180 * second + 45).toFixed(1)}deg)`;
    ringLeft.style.opacity = second > 0 ? "1" : "0";
  };
  const updateViewport = () => {
    frame = 0;
    const y = window.scrollY;
    renderScenes(y);
    renderCrew(y);
    renderChapters(y);
    if (scrolled !== y > 16) {
      scrolled = y > 16;
      header.classList.toggle("is-scrolled", scrolled);
    }
    // Reading downwards tucks the desktop header away; scrolling up brings it back.
    const delta = y - lastScrollY;
    if (Math.abs(delta) > 8) {
      lastScrollY = y;
      setHeaderHidden(
        delta > 0 &&
          y > window.innerHeight * 0.6 &&
          !header.contains(document.activeElement),
      );
    }
  };
  const scheduleViewport = () => {
    if (!frame) frame = window.requestAnimationFrame(updateViewport);
  };
  // All scrubbed scenes share geometry, visibility tracking, and the existing frame scheduler.
  // Progress always derives from scroll position: no timers, inertia, or scroll interception.
  const createScrollScenes = () => {
    const sceneConfig = [
      { selector: ".hero", mode: "exit" },
      { selector: ".project", enter: 0.95, leave: 0.35 },
      { selector: ".services", enter: 0.8, leave: 0.25 },
      { selector: ".about-lead", enter: 0.85, leave: 0.25 },
      { selector: ".reasons", enter: 0.95, leave: 0.35 },
      { selector: ".contact-section", enter: 0.9, leave: 0.2 },
      { selector: ".site-footer", enter: 1, leave: 0.85 },
    ];
    const scenes = sceneConfig.flatMap((config) =>
      [...document.querySelectorAll(config.selector)].map((element) => ({
        ...config,
        element,
        start: 0,
        distance: 1,
        last: null,
      })),
    );
    const sceneByElement = new Map(
      scenes.map((scene) => [scene.element, scene]),
    );
    const visible = new Set();
    let observer;
    let enabled = false;

    const story = document.querySelector(".about-copy > p:first-child");
    if (story) {
      let wordIndex = 0;
      const content = document.createDocumentFragment();
      story.textContent
        .split(/(\s+)/)
        .filter(Boolean)
        .forEach((token) => {
          if (!token.trim()) content.append(document.createTextNode(token));
          else {
            const word = document.createElement("span");
            word.className = "story-word";
            word.textContent = token;
            word.style.setProperty("--word-index", wordIndex++);
            content.append(word);
          }
        });
      story.replaceChildren(content);
      story.style.setProperty("--word-count", wordIndex);
    }
    const draw = (scene, y) => {
      const progress = clamp((y - scene.start) / scene.distance);
      const value = progress.toFixed(4);
      if (value === scene.last) return;
      scene.last = value;
      scene.element.style.setProperty("--scene-progress", value);
    };
    const measure = () => {
      if (!enabled) return;
      const height = window.innerHeight;
      const y = window.scrollY;
      const measurements = scenes.map((scene) => {
        const bounds = scene.element.getBoundingClientRect();
        const top = bounds.top + y;
        return scene.mode === "exit"
          ? {
              scene,
              start: Math.max(0, top - header.offsetHeight),
              distance: bounds.height,
            }
          : {
              scene,
              start: top - height * scene.enter,
              distance: bounds.height + height * (scene.enter - scene.leave),
            };
      });
      measurements.forEach(({ scene, start, distance }) => {
        scene.start = start;
        scene.distance = Math.max(1, distance);
        draw(scene, y);
      });
    };
    const stop = () => {
      enabled = false;
      observer?.disconnect();
      visible.clear();
      document.documentElement.classList.remove("scroll-motion");
      scenes.forEach((scene) => {
        scene.element.style.removeProperty("--scene-progress");
        scene.last = null;
      });
    };
    const configure = () => {
      stop();
      if (reduceMotion.matches || !("IntersectionObserver" in window)) return;
      enabled = true;
      measure();
      document.documentElement.classList.add("scroll-motion");
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const scene = sceneByElement.get(entry.target);
            draw(scene, window.scrollY);
            if (entry.isIntersecting) visible.add(scene);
            else visible.delete(scene);
          });
          scheduleViewport();
        },
        { rootMargin: "160px 0px" },
      );
      scenes.forEach((scene) => observer.observe(scene.element));
    };
    return {
      measure,
      configure,
      stop,
      render: (y) => {
        if (enabled) visible.forEach((scene) => draw(scene, y));
      },
    };
  };
  const scrollScenes = createScrollScenes();
  renderScenes = scrollScenes.render;
  scrollScenes.configure();
  reduceMotion.addEventListener("change", scrollScenes.configure);
  window.addEventListener("pagehide", () => {
    window.cancelAnimationFrame(frame);
    frame = 0;
    scrollScenes.stop();
  });
  const measureSections = () => {
    scrollScenes.measure();
    measureCrew();
    const pageTop = (element) =>
      element.getBoundingClientRect().top + window.scrollY;
    headerHeight = header.offsetHeight;
    maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    sectionPositions = chapterLinks.map((link) => ({
      top: pageTop(document.querySelector(link.hash)),
    }));
    // The rail switches to its dark capsule while its centre passes over dark sections.
    darkBands = [...document.querySelectorAll(".services, .site-footer")].map(
      (element) => ({
        top: pageTop(element),
        bottom: pageTop(element) + element.offsetHeight,
      }),
    );
    if (menu.open) placeMenuClose();
    scheduleViewport();
  };
  window.addEventListener("scroll", scheduleViewport, { passive: true });
  window.addEventListener("resize", measureSections, { passive: true });
  if ("ResizeObserver" in window)
    new ResizeObserver(measureSections).observe(document.querySelector("main"));
  document
    .querySelectorAll("details")
    .forEach((detail) => detail.addEventListener("toggle", measureSections));
  document.fonts.ready.then(measureSections);
  window.addEventListener("pageshow", () => {
    scrollScenes.configure();
    measureSections();
  });
  measureSections();

  // Crew rows follow page scrolling directly on every screen size: scrolling down advances them,
  // scrolling up reverses them, and stopping holds them still. Where ViewTimeline is supported the
  // browser's compositor moves the rows in step with scrolling, so busy main-thread frames cannot
  // stall them. Elsewhere, each scheduled frame writes one transform from cached geometry without
  // reading layout. Keyboard focus and reduced motion give static, horizontally scrollable rows.
  const crew = document.querySelector(".crew-showcase");
  if (crew) {
    const rows = [...crew.querySelectorAll(".crew-row")];
    const compositorTimeline = "ViewTimeline" in window;
    let tracks = [];
    let crewTop = 0;
    let crewHeight = 1;
    let inView = !("IntersectionObserver" in window);
    let near = inView;
    const travel = (distance) => -distance * 0.8;
    // Portraits stay lazy for the first paint. Within one viewport of the wall, every portrait and
    // copy loads, so none waits for horizontal lazy loading while the rows move.
    const loadPortraits = () =>
      crew.querySelectorAll("img").forEach((image) => {
        image.loading = "eager";
      });
    measureCrew = () => {
      const bounds = crew.getBoundingClientRect();
      crewTop = bounds.top + window.scrollY;
      crewHeight = Math.max(1, bounds.height);
    };
    // Fallback path. Progress matches the ViewTimeline "cover" range used below.
    renderCrew = (y) => {
      if (compositorTimeline || !inView || !tracks.length) return;
      const viewport = window.innerHeight;
      const progress = Math.max(
        0,
        Math.min(1, (y + viewport - crewTop) / (viewport + crewHeight)),
      );
      tracks.forEach((item, index) => {
        if (item.row.contains(document.activeElement)) return;
        const direction = index % 2 === 0 ? progress : 1 - progress;
        const value = `${(travel(item.distance) * direction).toFixed(2)}px`;
        if (value === item.value) return;
        item.value = value;
        item.track.style.setProperty("--crew-offset", value);
      });
    };
    const layoutCrew = () => {
      crew.classList.remove("crew-ready");
      tracks.forEach(({ animation }) => animation?.cancel());
      tracks = [];
      rows.forEach((row) => {
        row
          .querySelectorAll("[data-crew-clone]")
          .forEach((copy) => copy.remove());
        row.querySelector(".crew-track").style.removeProperty("--crew-offset");
      });
      if (reduceMotion.matches) return;
      // Measure all original groups before appending visual copies.
      tracks = rows.map((row) => ({
        row,
        track: row.querySelector(".crew-track"),
        group: row.querySelector(".crew-group"),
        distance: row.querySelector(".crew-group").getBoundingClientRect()
          .width,
        width: row.clientWidth,
        value: "",
      }));
      tracks.forEach(({ track, group, distance, width }) => {
        if (!distance) return;
        // Copies cover the row width plus the full travel, so the track edge never shows.
        const copies = Math.ceil(width / distance);
        for (let i = 0; i < copies; i++) {
          const copy = group.cloneNode(true);
          copy.dataset.crewClone = "";
          copy.setAttribute("aria-hidden", "true");
          copy.inert = true;
          track.append(copy);
        }
      });
      if (near) loadPortraits();
      measureCrew();
      if (compositorTimeline) {
        // Zero inset keeps the range independent of the page's scroll-padding.
        const timeline = new ViewTimeline({ subject: crew, inset: "0px" });
        tracks.forEach((item, index) => {
          const start = "translate3d(0px, 0, 0)";
          const end = `translate3d(${travel(item.distance)}px, 0, 0)`;
          item.animation = item.track.animate(
            { transform: index % 2 === 0 ? [start, end] : [end, start] },
            { timeline, fill: "both", easing: "linear" },
          );
          if (item.row.contains(document.activeElement))
            item.animation.cancel();
        });
      }
      crew.classList.add("crew-ready");
      scheduleViewport();
    };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          crew.classList.toggle("is-in-view", inView);
          if (inView) scheduleViewport();
        },
        { rootMargin: "120px" },
      ).observe(crew);
      const nearObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          near = true;
          loadPortraits();
          nearObserver.disconnect();
        },
        { rootMargin: "100% 0px" },
      );
      nearObserver.observe(crew);
    }
    rows.forEach((row, index) => {
      row.addEventListener("focusin", () => tracks[index]?.animation?.cancel());
      row.addEventListener("focusout", () => {
        row.scrollLeft = 0;
        tracks[index]?.animation?.play();
        scheduleViewport();
      });
    });
    const crewWidths = () =>
      [
        crew.clientWidth,
        ...rows.map(
          (row) =>
            row.querySelector(".crew-group").getBoundingClientRect().width,
        ),
      ].join(",");
    layoutCrew();
    document.fonts.ready.then(layoutCrew);
    reduceMotion.addEventListener("change", layoutCrew);
    if ("ResizeObserver" in window) {
      let previousWidths = crewWidths();
      const observer = new ResizeObserver(() => {
        const widths = crewWidths();
        if (widths !== previousWidths) {
          previousWidths = widths;
          layoutCrew();
        }
      });
      observer.observe(crew);
      rows.forEach((row) => observer.observe(row.querySelector(".crew-group")));
    } else window.addEventListener("resize", layoutCrew);
  }

  // Reveal once, with short, bounded sibling delays. Unsupported browsers keep visible content.
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const pending = new Set();
    const reveal = (element, immediate = false) => {
      observer.unobserve(element);
      pending.delete(element);
      element.classList.remove("reveal-pending");
      if (!immediate) element.classList.add("reveal-visible");
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting, boundingClientRect }) => {
          // Fast scrolling past a section must not leave its content hidden.
          if (isIntersecting || boundingClientRect.bottom < 0)
            reveal(target, !isIntersecting);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -24px 0px" },
    );
    document.querySelectorAll("[data-stagger]").forEach((group) => {
      [...group.children]
        .filter((child) => child.hasAttribute("data-reveal"))
        .forEach((element, index) => {
          element.style.setProperty(
            "--reveal-delay",
            `${Math.min(index * 65, 195)}ms`,
          );
        });
    });
    document.querySelectorAll("[data-reveal]").forEach((element) => {
      if (element.getBoundingClientRect().bottom < 0) return;
      pending.add(element);
      element.classList.add("reveal-pending");
      observer.observe(element);
      element.addEventListener("animationend", (event) => {
        if (
          event.target === element &&
          event.animationName === "reveal-enter"
        ) {
          element.classList.remove("reveal-visible");
          element.style.removeProperty("--reveal-delay");
        }
      });
    });
    document.addEventListener("focusin", (event) => {
      const element = event.target.closest("[data-reveal]");
      if (element) {
        reveal(element, true);
        element.classList.remove("reveal-visible");
      }
    });
    reduceMotion.addEventListener("change", (event) => {
      if (!event.matches) return;
      observer.disconnect();
      pending.forEach((element) => reveal(element, true));
      document
        .querySelectorAll(".reveal-visible")
        .forEach((element) => element.classList.remove("reveal-visible"));
    });
  }
})();
