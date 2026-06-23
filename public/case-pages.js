document.documentElement.classList.add("case-page-ready");

const reduceCaseMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const caseRevealItems = document.querySelectorAll("[data-case-reveal]");

if (reduceCaseMotion || !("IntersectionObserver" in window)) {
  caseRevealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const caseObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.12
    }
  );

  caseRevealItems.forEach((item, index) => {
    item.style.setProperty("--case-reveal-delay", `${Math.min(index, 8) * 70}ms`);
    caseObserver.observe(item);
  });
}

