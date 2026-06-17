document.documentElement.classList.add("blog-page-ready");

const reduceBlogMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const blogRevealItems = document.querySelectorAll("[data-blog-reveal]");

if (reduceBlogMotion || !("IntersectionObserver" in window)) {
  blogRevealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const blogObserver = new IntersectionObserver(
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

  blogRevealItems.forEach((item, index) => {
    item.style.setProperty("--blog-reveal-delay", `${Math.min(index, 8) * 70}ms`);
    blogObserver.observe(item);
  });
}

