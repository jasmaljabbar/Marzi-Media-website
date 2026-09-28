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
  // "exit" runs while an element scrolls out below the header; "center" reaches 0.5 when an
  // element's centre meets the viewport's; "pin" runs while a tall track holds its sticky stage;
  // other scenes run between their enter and leave lines.
  const createScrollScenes = () => {
    const sceneConfig = [
      { selector: ".opening", mode: "pin" },
      { selector: ".hero", mode: "exit" },
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
        if (scene.mode === "exit")
          return {
            scene,
            start: Math.max(0, top - header.offsetHeight),
            distance: bounds.height,
          };
        if (scene.mode === "pin")
          return { scene, start: top, distance: bounds.height - height };
        if (scene.mode === "center")
          return {
            scene,
            start: top + bounds.height / 2 - height,
            distance: height,
          };
        return {
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
  // The opening sits outside main, and its track grows when scroll scenes switch on.
  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(measureSections);
    document
      .querySelectorAll("main, .opening")
      .forEach((element) => resizeObserver.observe(element));
  }
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

  // Opening: the load entrance is CSS and the scroll split is the "pin" scene above. Here the
  // hero headline is held until the hero arrives, and on desktop one pointer loop eases the mark's
  // tilt toward the pointer, running only while the opening is on screen.
  const opening = document.querySelector(".opening");
  const hero = document.querySelector(".hero");
  if (opening && hero) {
    if ("IntersectionObserver" in window) {
      const heroObserver = new IntersectionObserver(
        (entries) => {
          const arrived = entries.some(
            ({ isIntersecting, boundingClientRect }) =>
              isIntersecting || boundingClientRect.bottom < 0,
          );
          if (!arrived) return;
          hero.classList.add("hero-entered");
          heroObserver.disconnect();
        },
        { rootMargin: "0px 0px -15% 0px" },
      );
      heroObserver.observe(hero);
    } else hero.classList.add("hero-entered");

    const stage = opening.querySelector(".opening-stage");

    // Tool cards fly from their place around the mark to a slot beside their discipline, then to
    // the row under the brand line. CSS mixes the offsets by scroll progress; here they are
    // measured from layout positions (offsetLeft and offsetTop ignore transforms), only when the
    // stage size or fonts change, never in the scroll frame.
    const tools = [...opening.querySelectorAll(".tool")];
    const centreInStage = (element) => {
      let x = element.offsetWidth / 2;
      let y = element.offsetHeight / 2;
      for (let node = element; node && node !== stage; node = node.offsetParent) {
        x += node.offsetLeft;
        y += node.offsetTop;
      }
      return [x, y];
    };
    const measureTools = () => {
      tools.forEach((tool) => {
        const slot = (container) =>
          centreInStage(
            opening.querySelector(
              `${container} [data-slot="${tool.dataset.tool}"]`,
            ),
          );
        const [x, y] = centreInStage(tool);
        const [bx, by] = slot(".opening-words");
        const [qx, qy] = slot(".quote-tools");
        tool.style.setProperty("--bx", `${(bx - x).toFixed(1)}px`);
        tool.style.setProperty("--by", `${(by - y).toFixed(1)}px`);
        tool.style.setProperty("--qx", `${(qx - x).toFixed(1)}px`);
        tool.style.setProperty("--qy", `${(qy - y).toFixed(1)}px`);
      });
    };
    if ("ResizeObserver" in window)
      new ResizeObserver(measureTools).observe(stage);
    else window.addEventListener("resize", measureTools, { passive: true });
    document.fonts.ready.then(measureTools);
    measureTools();
    // The cards' load entrance waits for the welcome to finish. A visitor who scrolls sooner
    // should not find them missing, so the first scroll skips it.
    const skipToolEntrance = () => {
      if (window.scrollY <= 0) return;
      opening.classList.add("opening-scrolled");
      window.removeEventListener("scroll", skipToolEntrance);
    };
    window.addEventListener("scroll", skipToolEntrance, { passive: true });
    skipToolEntrance();

    const tiltQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 761px)",
    );
    const tilt = { x: 0, y: 0, targetX: 0, targetY: 0, value: "" };
    let tiltOn = false;
    let openingInView = true;
    let tiltFrame = 0;
    let tiltTime = 0;
    const stepTilt = (time) => {
      const elapsed = tiltTime ? Math.min(64, time - tiltTime) : 16.7;
      tiltTime = time;
      const settle = 1 - 0.93 ** (elapsed / 16.7);
      const approach = (from, to) => {
        const next = from + (to - from) * settle;
        return Math.abs(to - next) < 0.001 ? to : next;
      };
      tilt.x = approach(tilt.x, tilt.targetX);
      tilt.y = approach(tilt.y, tilt.targetY);
      const value = `${tilt.x.toFixed(3)} ${tilt.y.toFixed(3)}`;
      if (value === tilt.value) {
        tiltFrame = 0;
        tiltTime = 0;
        return;
      }
      tilt.value = value;
      stage.style.setProperty("--tilt-x", tilt.x.toFixed(3));
      stage.style.setProperty("--tilt-y", tilt.y.toFixed(3));
      tiltFrame = window.requestAnimationFrame(stepTilt);
    };
    const startTilt = () => {
      if (!tiltFrame) tiltFrame = window.requestAnimationFrame(stepTilt);
    };
    window.addEventListener(
      "pointermove",
      (event) => {
        if (!tiltOn || !openingInView || event.pointerType !== "mouse") return;
        tilt.targetX = clamp(event.clientX / window.innerWidth) * 2 - 1;
        tilt.targetY = clamp(event.clientY / window.innerHeight) * 2 - 1;
        startTilt();
      },
      { passive: true },
    );
    document.documentElement.addEventListener("pointerleave", () => {
      tilt.targetX = 0;
      tilt.targetY = 0;
      if (tiltOn) startTilt();
    });
    if ("IntersectionObserver" in window)
      new IntersectionObserver(([entry]) => {
        openingInView = entry.isIntersecting;
      }).observe(opening);
    const configureTilt = () => {
      tiltOn = tiltQuery.matches && !reduceMotion.matches;
      if (tiltOn) return;
      window.cancelAnimationFrame(tiltFrame);
      tiltFrame = 0;
      tiltTime = 0;
      Object.assign(tilt, { x: 0, y: 0, targetX: 0, targetY: 0, value: "" });
      stage.style.removeProperty("--tilt-x");
      stage.style.removeProperty("--tilt-y");
    };
    configureTilt();
    reduceMotion.addEventListener("change", configureTilt);
    tiltQuery.addEventListener("change", configureTilt);
  }

  // Selected work: one-time heading, image and panel entrances, card-wide hover, and a subtle
  // pointer parallax. Images open with a masked slide from the left (CSS); on tall desktop screens
  // the cards stick and stack (CSS). Without JavaScript or with reduced motion, every part stays
  // visible and static.
  const work = document.querySelector(".work-section");
  if (work) {
    const cards = [...work.querySelectorAll(".project")].map((card) => ({
      button: card.querySelector(".project-image"),
      meta: card.querySelector(".project-meta"),
      cursor: { x: 0, y: 0, targetX: 0, targetY: 0, value: "" },
    }));
    const targets = [work.querySelector(".section-heading")];
    cards.forEach(({ button, meta }) => {
      // Two stacked copies let the title roll on hover; the second is hidden from assistive technology.
      const title = meta.querySelector("h3");
      const copy = document.createElement("span");
      copy.className = "title-copy";
      copy.textContent = title.textContent.trim();
      const echo = copy.cloneNode(true);
      echo.setAttribute("aria-hidden", "true");
      const roll = document.createElement("span");
      roll.className = "title-roll";
      roll.append(copy, echo);
      title.replaceChildren(roll);
      // The caption opens the same preview; the image button remains the one keyboard control.
      meta.addEventListener("click", () => button.click());
      targets.push(button, meta);
    });

    let workObserver = null;
    const revealWork = (element, delay = 0) => {
      workObserver?.unobserve(element);
      element.style.setProperty("--work-stagger", `${delay}ms`);
      element.classList.add("is-revealed");
    };
    const configureWork = () => {
      workObserver?.disconnect();
      workObserver = null;
      if (reduceMotion.matches || !("IntersectionObserver" in window)) {
        work.classList.remove("work-motion");
        targets.forEach((element) => revealWork(element));
        return;
      }
      workObserver = new IntersectionObserver(
        (entries) => {
          let order = 0;
          entries.forEach(({ target, isIntersecting, boundingClientRect }) => {
            // Items arriving together open in document order (left tile, then right); items
            // already scrolled past appear at once.
            if (isIntersecting) revealWork(target, Math.min(order++ * 160, 320));
            else if (boundingClientRect.bottom < 0) revealWork(target);
          });
        },
        { rootMargin: "0px 0px -10% 0px" },
      );
      targets
        .filter((element) => !element.classList.contains("is-revealed"))
        .forEach((element) => workObserver.observe(element));
      work.classList.add("work-motion");
    };
    work.addEventListener("focusin", (event) => {
      const card = cards.find(({ button }) => button === event.target);
      if (card) [card.button, card.meta].forEach((element) => revealWork(element));
    });

    // One pointer loop eases each image's parallax offset and stops once every image settles.
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    let pointerOn = false;
    let pointerFrame = 0;
    let pointerTime = 0;
    const approach = (from, to, rate) => {
      const next = from + (to - from) * rate;
      return Math.abs(to - next) < 0.001 ? to : next;
    };
    const stepPointer = (time) => {
      const elapsed = pointerTime ? Math.min(64, time - pointerTime) : 16.7;
      pointerTime = time;
      const settle = 1 - 0.9 ** (elapsed / 16.7);
      let moving = false;
      cards.forEach(({ button, cursor }) => {
        cursor.x = approach(cursor.x, cursor.targetX, settle);
        cursor.y = approach(cursor.y, cursor.targetY, settle);
        const value = `${cursor.x.toFixed(3)} ${cursor.y.toFixed(3)}`;
        if (value === cursor.value) return;
        cursor.value = value;
        button.style.setProperty("--cursor-x", cursor.x.toFixed(3));
        button.style.setProperty("--cursor-y", cursor.y.toFixed(3));
        moving = true;
      });
      pointerFrame = moving ? window.requestAnimationFrame(stepPointer) : 0;
      if (!pointerFrame) pointerTime = 0;
    };
    const startPointer = () => {
      if (!pointerFrame) pointerFrame = window.requestAnimationFrame(stepPointer);
    };
    cards.forEach(({ button, cursor }) => {
      button.addEventListener("pointermove", (event) => {
        if (!pointerOn || event.pointerType !== "mouse") return;
        const bounds = button.getBoundingClientRect();
        cursor.targetX = clamp((event.clientX - bounds.left) / bounds.width) * 2 - 1;
        cursor.targetY = clamp((event.clientY - bounds.top) / bounds.height) * 2 - 1;
        startPointer();
      });
      button.addEventListener("pointerleave", () => {
        cursor.targetX = 0;
        cursor.targetY = 0;
        if (pointerOn) startPointer();
      });
    });
    const configurePointer = () => {
      pointerOn = pointerQuery.matches && !reduceMotion.matches;
      if (pointerOn) return;
      window.cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
      pointerTime = 0;
      cards.forEach(({ button, cursor }) => {
        Object.assign(cursor, { x: 0, y: 0, targetX: 0, targetY: 0, value: "" });
        button.style.removeProperty("--cursor-x");
        button.style.removeProperty("--cursor-y");
      });
    };

    const configureAll = () => {
      configureWork();
      configurePointer();
    };
    configureAll();
    reduceMotion.addEventListener("change", configureAll);
    pointerQuery.addEventListener("change", configurePointer);
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
