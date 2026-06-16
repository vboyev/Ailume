const projectDrawer = document.querySelector("[data-project-drawer]");

if (projectDrawer) {
  const openButtons = document.querySelectorAll("[data-project-open]");
  const closeButtons = projectDrawer.querySelectorAll("[data-project-close]");
  const panel = projectDrawer.querySelector(".project-drawer-panel");
  const form = projectDrawer.querySelector("[data-project-form]");
  const success = projectDrawer.querySelector("[data-project-success]");
  const firstField = projectDrawer.querySelector("[data-project-form] input, [data-project-form] textarea");

  function setDrawerState(isOpen) {
    projectDrawer.setAttribute("aria-hidden", isOpen ? "false" : "true");
    projectDrawer.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("project-drawer-open", isOpen);

    if (isOpen) {
      window.setTimeout(() => firstField?.focus({ preventScroll: true }), 280);
      return;
    }

    window.setTimeout(() => {
      if (!form || !success) return;
      form.hidden = false;
      success.hidden = true;
      form.reset();
    }, 280);
  }

  openButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      setDrawerState(true);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => setDrawerState(false));
  });

  projectDrawer.addEventListener("click", (event) => {
    if (event.target === projectDrawer) {
      setDrawerState(false);
    }
  });

  panel?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && projectDrawer.getAttribute("aria-hidden") === "false") {
      setDrawerState(false);
    }
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    form.hidden = true;
    if (success) success.hidden = false;
  });
}
