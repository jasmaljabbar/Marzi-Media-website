/* Progressive enhancement for the home and work pages: footer year, the WhatsApp contact form and
   the scroll-linked crew rows. Every feature works, in a simpler form, without this file. */
(() => {
  "use strict";
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Contact form. There is no backend: submitting opens WhatsApp with the details written out,
  // ready for the visitor to send. The browser checks the required fields first.
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = (name) => form.elements[name].value.trim();
      const lines = [
        "Hi Marzi Media,",
        `My name is ${value("name")}. Phone / WhatsApp: ${value("phone")}.`,
      ];
      if (value("service")) lines.push(`Service: ${value("service")}.`);
      if (value("message")) lines.push("", value("message"));
      const url = `${form.action}?text=${encodeURIComponent(lines.join("\n"))}`;
      // "noopener" would make window.open return null, hiding a blocked pop-up, so the opener is
      // cleared by hand. A blocked pop-up falls back to opening WhatsApp in the same tab.
      const chat = window.open(url, "_blank");
      if (chat) chat.opener = null;
      else window.location.href = url;
    });
  }

  // Crew rows follow page scrolling: scrolling down advances them, scrolling up reverses them and
  // stopping holds them still. Where ViewTimeline exists the compositor runs the motion; elsewhere
  // one transform per animation frame is written from cached geometry. Keyboard focus and reduced
  // motion give static, horizontally scrollable rows.
  const crew = document.querySelector(".crew");
  if (!crew) return;
  const rows = [...crew.querySelectorAll(".crew-row")];
  const compositorTimeline = "ViewTimeline" in window;
  const travel = (distance) => -distance * 0.8;
  let tracks = [];
  let crewTop = 0;
  let crewHeight = 1;
  let inView = !("IntersectionObserver" in window);
  let near = inView;
  let frame = 0;

  // Portraits stay lazy for the first paint; within one viewport of the wall all of them load, so
  // none waits for horizontal lazy loading while the rows move.
  const loadPortraits = () =>
    crew.querySelectorAll("img").forEach((image) => {
      image.loading = "eager";
    });
  const measureCrew = () => {
    const bounds = crew.getBoundingClientRect();
    crewTop = bounds.top + window.scrollY;
    crewHeight = Math.max(1, bounds.height);
  };
  const renderCrew = () => {
    frame = 0;
    if (compositorTimeline || !inView || !tracks.length) return;
    const viewport = window.innerHeight;
    const progress = Math.max(
      0,
      Math.min(1, (window.scrollY + viewport - crewTop) / (viewport + crewHeight)),
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
  const scheduleCrew = () => {
    if (!frame) frame = window.requestAnimationFrame(renderCrew);
  };

  const layoutCrew = () => {
    crew.classList.remove("crew-ready");
    tracks.forEach(({ animation }) => animation?.cancel());
    tracks = [];
    rows.forEach((row) => {
      row.querySelectorAll("[data-crew-clone]").forEach((copy) => copy.remove());
      row.querySelector(".crew-track").style.removeProperty("--crew-offset");
    });
    if (reduceMotion.matches) return;
    // Measure every original group before appending visual copies.
    tracks = rows.map((row) => ({
      row,
      track: row.querySelector(".crew-track"),
      group: row.querySelector(".crew-group"),
      distance: row.querySelector(".crew-group").getBoundingClientRect().width,
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
        if (item.row.contains(document.activeElement)) item.animation.cancel();
      });
    }
    crew.classList.add("crew-ready");
    scheduleCrew();
  };

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        crew.classList.toggle("is-in-view", inView);
        if (inView) {
          measureCrew();
          scheduleCrew();
        }
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
  if (!compositorTimeline)
    window.addEventListener("scroll", scheduleCrew, { passive: true });

  rows.forEach((row, index) => {
    row.addEventListener("focusin", () => tracks[index]?.animation?.cancel());
    row.addEventListener("focusout", () => {
      row.scrollLeft = 0;
      tracks[index]?.animation?.play();
      scheduleCrew();
    });
  });

  // Layout work waits until the wall is near, so it never competes with the first paint.
  const crewWidths = () =>
    [
      crew.clientWidth,
      ...rows.map((row) => row.querySelector(".crew-group").getBoundingClientRect().width),
    ].join(",");
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    layoutCrew();
    reduceMotion.addEventListener("change", layoutCrew);
    if ("ResizeObserver" in window) {
      let previousWidths = crewWidths();
      const observer = new ResizeObserver(() => {
        const widths = crewWidths();
        if (widths === previousWidths) {
          measureCrew();
          return;
        }
        previousWidths = widths;
        layoutCrew();
      });
      observer.observe(crew);
      rows.forEach((row) => observer.observe(row.querySelector(".crew-group")));
    } else window.addEventListener("resize", layoutCrew);
  };
  if ("IntersectionObserver" in window) {
    const startObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        startObserver.disconnect();
        document.fonts.ready.then(start);
      },
      { rootMargin: "150% 0px" },
    );
    startObserver.observe(crew);
  } else start();
})();
