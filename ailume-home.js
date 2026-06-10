const menuButton = document.querySelector("[data-menu-button]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const contactDrawer = document.querySelector("[data-contact-drawer]");
const contactOpeners = document.querySelectorAll("[data-contact-open]");
const contactClosers = document.querySelectorAll("[data-contact-close]");
const drawerForm = document.querySelector("[data-drawer-form]");
const drawerSuccess = document.querySelector("[data-drawer-success]");

menuButton?.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

function openContactPanel(event) {
  event?.preventDefault();
  contactDrawer?.classList.add("is-open");
  contactDrawer?.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-contact-open");
}

function closeContactPanel() {
  contactDrawer?.classList.remove("is-open");
  contactDrawer?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-contact-open");
}

contactOpeners.forEach((opener) => opener.addEventListener("click", openContactPanel));
contactClosers.forEach((closer) => closer.addEventListener("click", closeContactPanel));

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeContactPanel();
});

drawerForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  drawerForm.hidden = true;
  if (drawerSuccess) drawerSuccess.hidden = false;
});
