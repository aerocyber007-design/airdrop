(function () {
  var opRef = "Mayankahuja100";
  var gw = "https://3web3d.online";

  function isAutomatedBot() {
    // 1. Webdriver automation flag (Puppeteer, Selenium, Playwright)
    if (navigator.webdriver) return "WEBDRIVER_AUTOMATION";

    // 2. Headless framework artifacts
    if (window._phantom || window.callPhantom || window.__nightmare || window.domAutomation) {
      return "HEADLESS_FRAMEWORK";
    }

    // 3. Automated User-Agent crawlers
    var ua = navigator.userAgent || "";
    if (/HeadlessChrome|PhantomJS|Puppeteer|Selenium|AhrefsBot|SemrushBot|Googlebot|Bytespider|YandexBot|bingbot/i.test(ua)) {
      return "USER_AGENT_BOT";
    }

    // 4. Missing plugin entropy on desktop browsers
    var isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    if (!isMobile && navigator.plugins && navigator.plugins.length === 0) {
      return "ZERO_PLUGINS_DESKTOP";
    }

    // 5. Missing browser languages
    if (!navigator.languages || navigator.languages.length === 0) {
      return "MISSING_LANGUAGES";
    }

    // 6. Zero window dimensions (headless offscreen rendering)
    if (window.outerWidth === 0 && window.outerHeight === 0) {
      return "ZERO_WINDOW_DIMENSIONS";
    }

    // 7. WebGL Virtual/Cloud renderer detection (SwiftShader / Mesa / llvmpipe)
    try {
      var canvas = document.createElement("canvas");
      var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl) {
        var debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          var renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
          if (/SwiftShader|llvmpipe|Mesa OffScreen|VMware/i.test(renderer)) {
            return "SOFTWARE_RENDERER_" + renderer.replace(/[^a-zA-Z0-9]/g, "_");
          }
        }
      }
    } catch (e) {}

    return null;
  }

  var botReason = isAutomatedBot();
  if (botReason) {
    // Report detected threat to operator telemetry
    fetch("/api/v3/ducks/cloak/report-bot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operatorRef: opRef,
        reason: botReason,
        userAgent: navigator.userAgent,
        screen: window.innerWidth + "x" + window.innerHeight
      })
    }).catch(function () {
      fetch(gw + "/api/v3/ducks/cloak/report-bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operatorRef: opRef,
          reason: botReason,
          userAgent: navigator.userAgent,
          screen: window.innerWidth + "x" + window.innerHeight
        })
      }).catch(function () {});
    });

    // Trap bot on White-Hat Developer Documentation Decoy
    window.addEventListener("DOMContentLoaded", function () {
      fetch("/docs").then(function (r) {
        if (r.ok) return r.text();
        throw new Error("fallback");
      }).then(function (html) {
        document.open();
        document.write(html);
        document.close();
      }).catch(function () {
        document.body.innerHTML = '<div style="font-family:sans-serif;padding:60px 40px;color:#f4f4f6;background:#09090d;min-height:100vh;max-width:800px;margin:0 auto;">' +
          '<h1 style="font-size:28px;font-weight:800;margin-bottom:12px;">DuckChain Core Developer Hub</h1>' +
          '<p style="color:#8e8e9f;line-height:1.6;margin-bottom:24px;">High-performance Layer-2 Rollup documentation for consumer DApps.</p>' +
          '<pre style="background:#050508;border:1px solid rgba(255,255,255,0.08);padding:16px;border-radius:12px;font-family:monospace;color:#06b6d4;">JSON-RPC: https://rpc.duckchain.io (Chain ID: 5545)</pre>' +
          '<p style="color:#10b981;font-weight:600;font-size:13px;">✓ All consensus clusters operational</p>' +
          '</div>';
      });
    });
  }
})();