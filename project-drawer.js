const projectDrawer = document.querySelector("[data-project-drawer]");

if (projectDrawer) {
  const openButtons = document.querySelectorAll("[data-project-open]");
  const closeButtons = projectDrawer.querySelectorAll("[data-project-close]");
  const panel = projectDrawer.querySelector(".project-drawer-panel");
  const form = projectDrawer.querySelector("[data-project-form]");
  const success = projectDrawer.querySelector("[data-project-success]");
  const firstField = projectDrawer.querySelector("[data-project-form] input, [data-project-form] textarea");
  const submitButton = form?.querySelector("[type='submit']");
  const drawerTransitionDuration = 720;
  let closeTimer;
  let openTimer;

  function getFormError() {
    if (!form) return null;

    let error = form.querySelector("[data-project-error]");

    if (!error) {
      error = document.createElement("p");
      error.className = "project-form-error";
      error.setAttribute("data-project-error", "");
      error.setAttribute("role", "alert");
      error.hidden = true;
      submitButton?.insertAdjacentElement("afterend", error);
    }

    return error;
  }

  function setFormError(message = "") {
    const error = getFormError();
    if (!error) return;

    error.textContent = message;
    error.hidden = !message;
  }

  function setSubmitState(isSubmitting) {
    if (!submitButton) return;

    submitButton.disabled = isSubmitting;
    submitButton.setAttribute("aria-busy", isSubmitting ? "true" : "false");
  }

  function buildSubmissionPayload() {
    const source = new FormData(form);
    const payload = new FormData();
    const needs = source.getAll("need").filter(Boolean).join(", ");

    payload.append("name", source.get("name") || "");
    payload.append("email", source.get("email") || "");
    payload.append("message", source.get("message") || "");
    payload.append("How can we help?", needs || "Not specified");
    payload.append("Page", window.location.href);
    payload.append("_subject", "New Ailume project request");
    payload.append("_template", "table");
    payload.append("_captcha", "false");

    return payload;
  }

  function setDrawerState(isOpen) {
    window.clearTimeout(closeTimer);
    window.clearTimeout(openTimer);

    if (isOpen) {
      projectDrawer.classList.add("is-visible");
      projectDrawer.setAttribute("aria-hidden", "false");
      document.body.classList.add("project-drawer-open");

      openTimer = window.setTimeout(() => {
        projectDrawer.classList.add("is-open");
      }, 20);

      window.setTimeout(() => firstField?.focus({ preventScroll: true }), 280);
      return;
    }

    projectDrawer.setAttribute("aria-hidden", isOpen ? "false" : "true");
    projectDrawer.classList.remove("is-open");
    document.body.classList.remove("project-drawer-open");

    closeTimer = window.setTimeout(() => {
      projectDrawer.classList.remove("is-visible");
      if (!form || !success) return;
      form.hidden = false;
      success.hidden = true;
      form.reset();
      setFormError("");
      setSubmitState(false);
    }, drawerTransitionDuration);
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

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.action || form.action.endsWith("#")) {
      setFormError("The form is not connected yet. Please email hello@ailume.agency.");
      return;
    }

    setFormError("");
    setSubmitState(true);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: buildSubmissionPayload(),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      form.hidden = true;
      if (success) success.hidden = false;
    } catch (error) {
      setFormError("Something went wrong. Please email hello@ailume.agency.");
    } finally {
      setSubmitState(false);
    }
  });
}
