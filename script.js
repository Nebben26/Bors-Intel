document.documentElement.classList.add("js");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll("[data-reveal]");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -7%", threshold: 0.08 },
  );

  revealItems.forEach((item) => observer.observe(item));
}

const copyButtons = document.querySelectorAll("[data-copy]");
const copyStatus = document.querySelector("[data-copy-status]");

const fallbackCopy = (value) => {
  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();
};

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    const originalLabel = button.textContent;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        fallbackCopy(value);
      }

      button.textContent = "Copied";
      if (copyStatus) copyStatus.textContent = `${value} copied to clipboard.`;

      window.setTimeout(() => {
        button.textContent = originalLabel;
        if (copyStatus) copyStatus.textContent = "";
      }, 2200);
    } catch {
      if (copyStatus) copyStatus.textContent = `Copy failed. Select ${value} manually.`;
    }
  });
});

// Keep the main portfolio intact while making the contract path impossible to miss.
if (document.body.classList.contains("homepage-focused")) {
  const headerActions = document.querySelector(".header-actions");
  const heroActions = document.querySelector(".hero-actions");
  const contactActions = document.querySelector(".contact-actions");

  if (headerActions && !headerActions.querySelector('[href="/contract/"]')) {
    const contractLink = document.createElement("a");
    contractLink.className = "header-link";
    contractLink.href = "/contract/";
    contractLink.innerHTML = 'Contract work <span aria-hidden="true">↗</span>';
    headerActions.prepend(contractLink);
  }

  if (heroActions && !heroActions.querySelector('[href="/contract/"]')) {
    const contractButton = document.createElement("a");
    contractButton.className = "button button-secondary";
    contractButton.href = "/contract/";
    contractButton.innerHTML = 'Contract availability <span aria-hidden="true">→</span>';
    heroActions.appendChild(contractButton);
  }

  if (contactActions && !contactActions.querySelector('[href="/contract/"]')) {
    const contractButton = document.createElement("a");
    contractButton.className = "button button-outline-light";
    contractButton.href = "/contract/";
    contractButton.innerHTML = 'Contract availability <span aria-hidden="true">→</span>';
    contactActions.appendChild(contractButton);
  }
}
