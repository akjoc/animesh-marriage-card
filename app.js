"use strict";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const toast = document.querySelector("#toast");
let toastTimeout;
function notify(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("visible"), 4500);
}

// Navigation remains usable as ordinary anchor links on every screen size.
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");
function closeMenu() {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  nav.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
});
nav
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("open")) {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});

// The countdown uses an explicit India Standard Time offset, not the visitor's timezone.
const weddingDay = new Date("2026-11-20T00:00:00+05:30").getTime();
function updateCountdown() {
  const remaining = Math.max(0, weddingDay - Date.now());
  const values = {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor(remaining / 3600000) % 24,
    minutes: Math.floor(remaining / 60000) % 60,
    seconds: Math.floor(remaining / 1000) % 60,
  };
  for (const [id, value] of Object.entries(values)) {
    document.getElementById(id).textContent = String(value).padStart(2, "0");
  }
  if (!remaining) {
    const celebrationOver =
      Date.now() >= new Date("2026-11-21T00:00:00+05:30").getTime();
    document.getElementById("countdown-title").textContent = celebrationOver
      ? "Our forever has begun."
      : "Our forever begins today.";
  }
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Accessible day tabs: mouse, touch, arrows, Home, and End.
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab, focus = false) {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute("aria-controls")).hidden =
      !selected;
  });
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft")
      next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectTab(tabs[next], true);
    }
  });
});

// A real calendar download, with a separate entry for each printed programme item.
const royalDreams =
  "The Royal Dreams Banquet, A-1/23, Opp. Dashrath Puri Metro Station, Gate No. 1, Dwarka Sector-1A, Dabri Palam Road, New Delhi-110045";
const residence = "A-82, Dashrath Puri, New Delhi-110045";
const wisteria =
  "Wisteria, DDA Sports Complex, Gate No. 3, Sector-11, Dwarka, New Delhi-110075";
const programme = [
  {
    name: "Haldi",
    utc: "20261119T050000Z",
    location: royalDreams,
    description:
      "10:30 AM IST onwards. Celebrate the forthcoming wedding of Animesh & Dakshita.",
  },
  {
    name: "Chak",
    utc: "20261119T083000Z",
    location: royalDreams,
    description: "2:00 PM IST. With the Jain family.",
  },
  {
    name: "Ladies Sangeet",
    utc: "20261119T103000Z",
    location: royalDreams,
    description:
      "4:00 PM IST. A musical evening to celebrate Animesh & Dakshita.",
  },
  {
    name: "Dinner",
    utc: "20261119T130000Z",
    location: royalDreams,
    description: "6:30 PM IST. With the Jain family.",
  },
  {
    name: "Bhaat",
    utc: "20261119T143000Z",
    location: royalDreams,
    description: "8:00 PM IST. With the Jain family.",
  },
  {
    name: "Ghurchari",
    utc: "20261120T113000Z",
    location: residence,
    description: "5:00 PM IST. At our residence.",
  },
  {
    name: "Departure of Baraat",
    utc: "20261120T130000Z",
    location: residence,
    description:
      "6:30 PM IST. Departure from our residence to the wedding venue.",
  },
  {
    name: "Baraat re-assembly & wedding celebration",
    utc: "20261120T140000Z",
    location: wisteria,
    description:
      "7:30 PM IST. The Baraat will re-assemble near the venue and proceed to the bride’s place (Wisteria). The wedding ceremony time is not separately specified.",
  },
];
const calendarDialog = document.querySelector("#calendar-dialog");
let calendarTrigger;
document.querySelectorAll(".calendar-btn").forEach((button) =>
  button.addEventListener("click", () => {
    calendarTrigger = button;
    calendarDialog.showModal();
  }),
);
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => calendarDialog.close());
calendarDialog.addEventListener("click", (event) => {
  const bounds = calendarDialog.getBoundingClientRect();
  if (
    event.target === calendarDialog &&
    (event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom)
  )
    calendarDialog.close();
});
calendarDialog.addEventListener("close", () => calendarTrigger?.focus());
const googleDetails = `With Mrs. Renu Jain & Mr. Praveen Jain, celebrate Animesh & Dakshita. All times are India Standard Time (IST).\n\n19 November 2026 — ${royalDreams}\nHaldi: 10:30 AM onwards\nChak: 2:00 PM\nLadies Sangeet: 4:00 PM\nDinner: 6:30 PM\nBhaat: 8:00 PM\n\n20 November 2026\nGhurchari: 5:00 PM at ${residence}\nDeparture of Baraat: 6:30 PM from our residence\nBaraat re-assembles near the venue at 7:30 PM and proceeds to ${wisteria}.\n\nWe look forward to celebrating with you!`;
const calendarParams = new URLSearchParams({
  action: "TEMPLATE",
  text: "Animesh & Dakshita | Wedding Celebrations",
  dates: "20261119/20261121",
  details: googleDetails,
  location: "New Delhi, India",
  ctz: "Asia/Kolkata",
});
document.querySelector("#google-calendar").href =
  `https://calendar.google.com/calendar/render?${calendarParams}`;
function escapeICS(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}
// RFC 5545 content lines are folded at 75 UTF-8 octets, without splitting characters.
function foldICS(line) {
  const encoder = new TextEncoder();
  let result = "",
    length = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (length + size > 75) {
      result += "\r\n ";
      length = 1;
    }
    result += char;
    length += size;
  }
  return result;
}
document.querySelector("#download-calendar").addEventListener("click", () => {
  const stamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Animesh and Dakshita//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Animesh & Dakshita - Wedding Celebrations",
  ];
  programme.forEach((event, index) =>
    lines.push(
      "BEGIN:VEVENT",
      `UID:ad-wedding-2026-${index}@marriage-card`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${event.utc}`,
      `SUMMARY:${escapeICS(`Animesh & Dakshita - ${event.name}`)}`,
      `LOCATION:${escapeICS(event.location)}`,
      `DESCRIPTION:${escapeICS(event.description)}`,
      "END:VEVENT",
    ),
  );
  lines.push("END:VCALENDAR");
  const blob = new Blob([lines.map(foldICS).join("\r\n") + "\r\n"], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Animesh-and-Dakshita-Wedding.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  calendarDialog.close();
  notify("Your calendar file is ready. Open it to add the celebrations.");
});

// Start music on the first scroll. Browsers may require a subsequent tap/key
// before allowing audible playback; never override a guest's manual pause.
const audio = document.querySelector("#bg-music");
const musicButton = document.querySelector("#music-toggle");
let audioPending = false;
let automaticMusic = true;
let scrollMusicAttempted = false;
let musicNeedsGesture = false;
const initialScrollY = window.scrollY;

function updateMusic() {
  const playing = !audio.paused;
  musicButton.setAttribute("aria-pressed", String(playing));
  musicButton.setAttribute(
    "aria-label",
    playing ? "Pause celebration music" : "Play celebration music",
  );
  musicButton.querySelector(".music-label").textContent = playing
    ? "Music on"
    : musicNeedsGesture ? "Tap for music" : "A little music?";
}

function stopAutomaticMusic() {
  automaticMusic = false;
  window.removeEventListener("scroll", onMusicScroll);
  window.removeEventListener("wheel", onMusicWheel);
  window.removeEventListener("touchmove", onMusicTouchMove);
  document.removeEventListener("keydown", onMusicKey);
  document.removeEventListener("pointerup", onMusicGesture);
}

async function startMusic(manual = false) {
  if (audioPending || !audio.paused) return;
  audioPending = true;
  musicNeedsGesture = false;
  try {
    audio.volume = 0.35;
    await audio.play();
    stopAutomaticMusic();
  } catch (error) {
    // A blocked autoplay attempt is expected on some browsers, not a media error.
    musicNeedsGesture = (manual || automaticMusic) && error.name === "NotAllowedError";
    if (manual) notify("Music could not play. Please try again.");
  } finally {
    audioPending = false;
    updateMusic();
  }
}

function startMusicOnScroll() {
  if (!automaticMusic || scrollMusicAttempted) return;
  scrollMusicAttempted = true;
  void startMusic();
}
function onMusicScroll() {
  if (window.scrollY !== initialScrollY) startMusicOnScroll();
}
function onMusicWheel(event) {
  if (event.deltaY !== 0 && !event.ctrlKey) startMusicOnScroll();
}
function onMusicTouchMove() {
  startMusicOnScroll();
}
function onMusicKey(event) {
  if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.target.closest("input, textarea, select, button, a, [contenteditable]")) return;
  if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
    if (automaticMusic && musicNeedsGesture) void startMusic();
    else startMusicOnScroll();
  }
}
function onMusicGesture(event) {
  // Let the music button's own click handler control playback without a race.
  if (event.target.closest("#music-toggle")) return;
  if (automaticMusic && musicNeedsGesture) void startMusic();
}
window.addEventListener("scroll", onMusicScroll, { passive: true });
window.addEventListener("wheel", onMusicWheel, { passive: true });
window.addEventListener("touchmove", onMusicTouchMove, { passive: true });
document.addEventListener("keydown", onMusicKey);
document.addEventListener("pointerup", onMusicGesture);

musicButton.addEventListener("click", () => {
  stopAutomaticMusic();
  musicNeedsGesture = false;
  if (audioPending) {
    audio.pause();
    updateMusic();
    return;
  }
  if (!audio.paused) {
    audio.pause();
    updateMusic();
  } else {
    void startMusic(true);
  }
});
audio.addEventListener("play", updateMusic);
audio.addEventListener("pause", updateMusic);
audio.addEventListener("error", () => {
  musicNeedsGesture = false;
  stopAutomaticMusic();
  updateMusic();
  notify("Music is unavailable right now. Please try again later.");
});

// Use the native share sheet when available, otherwise copy a clean invitation URL.
document.querySelector("#share-invite").addEventListener("click", async () => {
  const url = `${location.origin}${location.pathname}`;
  const data = {
    title: "Animesh & Dakshita | Wedding Invitation",
    text: "Join us for our wedding celebrations on 19–20 November 2026 in New Delhi.",
    url,
  };
  try {
    if (navigator.share) await navigator.share(data);
    else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      notify("Invitation link copied. Share a little joy!");
    } else window.prompt("Copy this invitation link to share:", url);
  } catch (error) {
    if (error.name !== "AbortError")
      notify(
        "Unable to share. You can copy the invitation URL from your address bar.",
      );
  }
});

if (!reducedMotion.matches) {
  const petalLayer = document.querySelector(".floating-petals");
  for (let i = 0; i < 10; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${8 + i * 8}%`;
    petal.style.setProperty("--duration", `${9 + (i % 4) * 2}s`);
    petal.style.setProperty("--delay", `${-i * 2.7}s`);
    petalLayer.appendChild(petal);
  }
}
