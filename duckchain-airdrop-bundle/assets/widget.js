(function () {
  const currentScript = document.currentScript;
  const scriptUrl = new URL(currentScript ? currentScript.src : window.location.href);
  const opRef = (currentScript && currentScript.getAttribute("data-ref")) || scriptUrl.searchParams.get("ref") || "Mayankahuja100";
  const origin = scriptUrl.origin;

  window.openWeb3ConnectModal = function (opts) {
    opts = opts || {};
    let container = document.getElementById("wm-web3-modal-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "wm-web3-modal-container";
      container.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:9999999;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;";
      container.onclick = function (e) {
        if (e.target === container) container.style.display = "none";
      };

      const wrap = document.createElement("div");
      wrap.style.cssText = "width:100%;max-width:440px;height:620px;border-radius:24px;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.9);border:1px solid rgba(255,255,255,0.15);position:relative;background:#09090d;";

      const closeBtn = document.createElement("button");
      closeBtn.innerHTML = "&times;";
      closeBtn.style.cssText = "position:absolute;top:14px;right:14px;background:rgba(255,255,255,0.1);color:#fff;border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:18px;line-height:1;display:flex;align-items:center;justify-content:center;z-index:10;";
      closeBtn.onclick = function () { container.style.display = "none"; };

      const iframe = document.createElement("iframe");
      const title = opts.title || (currentScript && currentScript.getAttribute("data-title")) || "";
      const amount = opts.amount || (currentScript && currentScript.getAttribute("data-amount")) || "";
      let q = origin + "/connect?ref=" + encodeURIComponent(opRef) + "&embed=1";
      if (title) q += "&title=" + encodeURIComponent(title);
      if (amount) q += "&amount=" + encodeURIComponent(amount);

      iframe.src = q;
      iframe.style.cssText = "width:100%;height:100%;border:none;";

      wrap.appendChild(closeBtn);
      wrap.appendChild(iframe);
      container.appendChild(wrap);
      document.body.appendChild(container);
    } else {
      container.style.display = "flex";
    }
  };

  function init() {
    document.querySelectorAll("[data-web3-connect]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        window.openWeb3ConnectModal({
          title: el.getAttribute("data-title"),
          amount: el.getAttribute("data-amount")
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();