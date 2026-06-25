function setBigTimePixelsViewportHeight() {
  document.documentElement.style.setProperty("--btp-viewport-height", `${window.innerHeight}px`);
}

setBigTimePixelsViewportHeight();
window.addEventListener("resize", setBigTimePixelsViewportHeight, { passive: true });
window.addEventListener("orientationchange", setBigTimePixelsViewportHeight, { passive: true });
