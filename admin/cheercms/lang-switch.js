/* =====================================================================
 * Cheer CMS · 共用语言切换器（右上角中/EN 按钮）
 * ---------------------------------------------------------------------
 * 用法：每个页面在 <body> 内任意位置（建议 header 右侧工具栏内）放
 *   <div id="lang-switch"></div>
 * 然后引入：
 *   <script src="lang-switch.js?v=YYYYMMDDHHMM"></script>
 *
 * 行为：
 *  - 自动根据当前 URL 文件名 + 全站 PAGE_MAP 推断"当前语言"和"另一语言对应的页面"。
 *  - 切换按钮文本固定为 "中 / EN"，点击会切到另一语言对应 URL，并把偏好写入 localStorage('cfd-lang')。
 *  - 如果一个页面只有中文版（如 index.html）或只有英文版，则按钮置灰提示。
 * ===================================================================== */
(function () {
  // 中文文件名 ↔ 英文文件名 的全站映射（仅业务页）。
  // index.html 是「双语自适应」文件，单独标注为同文件双语。
  const PAGE_MAP = [
    { zh: "广告位管理.html", en: "ad-placement-management.html" },
    { zh: "文章管理.html", en: "article-management.html" },
    { zh: "入金管理.html", en: "deposits.html" },
    { zh: "出金管理.html", en: "withdrawals.html" },
    { zh: "资金流水.html", en: "ledger.html" },
    { zh: "通道管理.html", en: "gateways.html" },
    { zh: "汇率管理.html", en: "exchange-rates.html" },
    { zh: "客户管理.html", en: "clients.html" },
    { zh: "资金管理.html", en: "balance-adjustment.html" },
    { zh: "代理申请.html", en: "applications.html" },
    { zh: "代理管理.html", en: "affiliates.html" },
    { zh: "返佣流水.html", en: "rebate-ledger.html" },
    { zh: "等级管理.html", en: "levels.html" },
    { zh: "返佣设置.html", en: "rebate-settings.html" },
    { zh: "划转审核.html", en: "transfer-approval.html" },
    { zh: "穿仓补偿.html", en: "loss-compensation.html" }
  ];
  // 双语共用同一份文件（切换仅 localStorage + reload）
  const BILINGUAL_SAME_FILE = ["index.html", "ct-level-config.html", "ct-master-management.html", "ct-copy-trading.html", "ct-profit-share.html", "ct-engine-log.html"];

  function getCurrentFile() {
    // 解码 URL，去掉路径与查询串，拿到当前文件名
    const path = window.location.pathname || "/";
    let name = decodeURIComponent(path.split("/").pop() || "");
    if (!name) name = "index.html";
    return name;
  }

  function detectLang(file) {
    // 命中映射，明确知道语言
    for (const pair of PAGE_MAP) {
      if (pair.zh === file) return { lang: "zh", pair: pair, sameFile: false };
      if (pair.en === file) return { lang: "en", pair: pair, sameFile: false };
    }
    // 同文件双语（如 index.html）：用 localStorage 偏好，默认中文
    if (BILINGUAL_SAME_FILE.indexOf(file) !== -1) {
      const stored = localStorage.getItem("cfd-lang") || "zh";
      return { lang: stored === "en" ? "en" : "zh", pair: null, sameFile: true, selfHref: file || "index.html" };
    }
    // 兜底
    return { lang: localStorage.getItem("cfd-lang") || "zh", pair: null, sameFile: false };
  }

  function buildSwitch(currentLang, otherHref, sameFile) {
    const isZh = currentLang === "zh";
    const disabled = !otherHref && !sameFile;
    let clickAttr;
    if (disabled) {
      clickAttr = "title='当前页面无对应翻译 / No translation for this page' style='cursor:not-allowed;opacity:0.6'";
    } else if (sameFile) {
      // 同文件双语：仅切 localStorage 并 reload
      clickAttr = "onclick=\"__cfdSwitchLang('" + (isZh ? "en" : "zh") + "','')\" style='cursor:pointer'";
    } else {
      clickAttr = "onclick=\"__cfdSwitchLang('" + (isZh ? "en" : "zh") + "','" + otherHref + "')\" style='cursor:pointer'";
    }

    // 一体化分段按钮：中 | EN
    return ''
      + '<div class="inline-flex items-center text-[12px] font-medium rounded-md border border-slate-200 overflow-hidden select-none" ' + clickAttr + '>'
      + '  <span class="px-2.5 py-1 transition-colors ' + (isZh ? "bg-primary text-white" : "text-slate-500 hover:text-primary") + '">中</span>'
      + '  <span class="px-2.5 py-1 transition-colors border-l border-slate-200 ' + (!isZh ? "bg-primary text-white" : "text-slate-500 hover:text-primary") + '">EN</span>'
      + '</div>';
  }

  window.__cfdSwitchLang = function (newLang, href) {
    try { localStorage.setItem("cfd-lang", newLang); } catch (e) {}
    if (href) {
      window.location.href = href;
    } else {
      // 同文件双语：刷新当前页
      window.location.reload();
    }
  };

  function render() {
    const slot = document.getElementById("lang-switch");
    if (!slot) return;
    const file = getCurrentFile();
    const info = detectLang(file);
    let otherHref = "";
    if (info.pair) {
      otherHref = info.lang === "zh" ? info.pair.en : info.pair.zh;
    }
    slot.innerHTML = buildSwitch(info.lang, otherHref, !!info.sameFile);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
