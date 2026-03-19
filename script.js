(() => {
  const STORAGE_KEY = "theme";
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const toggleText = document.getElementById("themeToggleText");

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    // Button should describe the action (what it will switch to)
    const nextLabel = theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
    if (toggleText) toggleText.textContent = nextLabel;
    if (toggle) toggle.setAttribute("aria-label", nextLabel);
  }

  function getSavedTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === "dark" || saved === "light" ? saved : null;
    } catch {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }

  const initial = getSavedTheme() ?? getSystemTheme();
  applyTheme(initial);

  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || getSystemTheme();
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      saveTheme(next);
    });
  }

  // Contact form -> mailto (more reliable than form action="mailto:")
  const contactForm = document.getElementById("contactForm");
  const contactNote = document.getElementById("contactNote");
  const QA_EMAIL = "okaiisaac57@gmail.com";

  function buildMailto({ name, email, message }) {
    const subject = "QA Testing Request";
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "What I need tested:",
      message,
    ].join("\n");

    return `mailto:${QA_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const name = String(fd.get("name") ?? "").trim();
      const email = String(fd.get("email") ?? "").trim();
      const message = String(fd.get("message") ?? "").trim();

      const mailto = buildMailto({ name, email, message });
      // Triggers the mail app if configured
      window.location.href = mailto;

      // Fallback note for browsers without mail client configured / blocked mailto
      if (contactNote) {
        contactNote.innerHTML =
          `If your browser doesn’t open email automatically, send it to ` +
          `<a class="text-link" href="mailto:${QA_EMAIL}?subject=${encodeURIComponent("QA Testing Request")}">${QA_EMAIL}</a>` +
          ` and paste your message.`;
      }
    });
  }
})();

