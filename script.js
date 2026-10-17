const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
function closeMenu() {
  menu.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
}
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
});
nav
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menu.focus();
  }
});
window.matchMedia("(min-width: 541px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});
document.querySelectorAll("[data-filter]").forEach((button) =>
  button.addEventListener("click", () => {
    document
      .querySelectorAll("[data-filter]")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
    document.querySelectorAll("[data-category]").forEach((project) => {
      project.hidden =
        button.dataset.filter !== "all" &&
        project.dataset.category !== button.dataset.filter;
    });
  }),
);
function preference(key, value) {
  document.body.dataset[key] = value;
  document
    .querySelectorAll(`button[data-${key}]`)
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset[key] === value),
      ),
    );
  try {
    localStorage.setItem(`portfolio-${key}`, value);
  } catch {}
  document.querySelector('meta[name="theme-color"]').content =
    document.body.dataset.theme === "dark" ? "#09090b" : "#ffffff";
}
for (const [key, values, fallback] of [
  ["theme", ["light", "dark"], "light"],
  ["accent", ["default", "blue", "green", "violet"], "default"],
]) {
  let saved;
  try {
    saved = localStorage.getItem(`portfolio-${key}`);
  } catch {}
  preference(key, values.includes(saved) ? saved : fallback);
  document
    .querySelectorAll(`button[data-${key}]`)
    .forEach((button) =>
      button.addEventListener("click", () =>
        preference(key, button.dataset[key]),
      ),
    );
}
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      nav.querySelectorAll("a").forEach((link) => {
        if (link.hash === `#${entry.target.id}`)
          link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    });
  },
  { rootMargin: "-10% 0px -60% 0px" },
);
document
  .querySelectorAll("section[id]")
  .forEach((section) => observer.observe(section));
