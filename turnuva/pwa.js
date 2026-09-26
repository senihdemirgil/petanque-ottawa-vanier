"use strict";
(() => {
  let deferredPrompt = null;
  const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

  function installButton(){ return document.getElementById("installAppBtn"); }
  function showInstallButton(){ const b=installButton(); if(b && !isStandalone()) b.classList.remove("hidden"); }
  function hideInstallButton(){ const b=installButton(); if(b) b.classList.add("hidden"); }

  async function registerSW(){
    if (!("serviceWorker" in navigator)) return;
    if (!(location.protocol === "https:" || location.hostname === "localhost")) return;
    try {
      const reg = await navigator.serviceWorker.register("./sw.js", {scope:"./"});
      reg.update().catch(()=>{});
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;
        location.reload();
      });
    } catch (err) {
      console.warn("PWA service worker registration failed", err);
    }
  }

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredPrompt = event;
    showInstallButton();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    hideInstallButton();
  });

  document.addEventListener("DOMContentLoaded", () => {
    registerSW();
    const btn = installButton();
    if (!btn) return;
    if (isStandalone()) { hideInstallButton(); return; }
    if (isIOS()) showInstallButton();

    btn.addEventListener("click", async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        try { await deferredPrompt.userChoice; } catch (_) {}
        deferredPrompt = null;
        hideInstallButton();
        return;
      }
      if (isIOS()) {
        alert("iPhone / iPad: tap the Share button in Safari, then choose ‘Add to Home Screen’.\n\nSur iPhone / iPad : touchez Partager dans Safari, puis ‘Sur l’écran d’accueil’. ");
      } else {
        alert("Use your browser’s Install app / Add to Home Screen option.\n\nUtilisez l’option Installer l’application / Ajouter à l’écran d’accueil de votre navigateur.");
      }
    });
  });
})();
