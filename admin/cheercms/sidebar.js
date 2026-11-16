/* =====================================================================
 * Cheer CMS · 共用侧栏渲染器（双语支持）
 * ---------------------------------------------------------------------
 * 单一信息源（Single Source of Truth）：所有页面共用一份 SIDEBAR_MENU。
 *
 * 使用方式（每个原型页面在 </body> 之前引入）：
 *   <script src="sidebar.js"></script>
 *   <script>
 *     // 中文页面（默认 lang='zh'，如 index.html）：
 *     initSidebar({ activePath: "资金管理 / 出入金管理 / 入金管理" });
 *
 *     // 英文页面（lang='en'，activePath 用英文标题拼接）：
 *     initSidebar({ activePath: "Funding / Cash Management / Deposits", lang: "en" });
 *   </script>
 *
 * 新增一个原型页：
 *   1) 复制现有页面为 <新模块>.html
 *   2) 修改其 initSidebar 的 activePath
 *   3) 回到本文件 SIDEBAR_MENU，给对应叶子节点加 href: "<新模块>.html"
 *   完成。所有页面侧栏立即联动。
 * ===================================================================== */
(function () {
  const SIDEBAR_MENU = [
    {
      title: "客户管理", titleEn: "Customer",
      icon: "fa-users",
      children: [
        {
          title: "客户管理", titleEn: "Customer",
          href: "客户管理.html", hrefEn: "clients.html"
        },
        { title: "黑名单管理", titleEn: "Blacklist" },
        { title: "白名单管理", titleEn: "Whitelist" },
        { title: "验证码管理", titleEn: "Verification Code" },
        { title: "订单查询", titleEn: "Order Lookup" }
      ]
    },
    {
      title: "资金管理", titleEn: "Funding",
      icon: "fa-wallet",
      children: [
        {
          title: "出入金管理", titleEn: "Cash Management",
          children: [
            { title: "入金管理", titleEn: "Deposits", href: "入金管理.html", hrefEn: "deposits.html" },
            { title: "出金管理", titleEn: "Withdrawals", href: "出金管理.html", hrefEn: "withdrawals.html" },
            { title: "汇率管理", titleEn: "FX Rates", href: "汇率管理.html", hrefEn: "exchange-rates.html" },
            { title: "通道管理", titleEn: "Gateways", href: "通道管理.html", hrefEn: "gateways.html" }
          ]
        },
        {
          title: "资金管理", titleEn: "Balances",
          children: [
            { title: "穿仓补偿", titleEn: "Loss Compensation", href: "穿仓补偿.html", hrefEn: "loss-compensation.html" },
            { title: "资金流水", titleEn: "Ledger", href: "资金流水.html", hrefEn: "ledger.html" },
            { title: "伊斯兰账户管理费", titleEn: "Islamic Account Fee" },
            { title: "资金管理", titleEn: "Balance Adjustment", href: "资金管理.html", hrefEn: "balance-adjustment.html" }
          ]
        }
      ]
    },
    {
      title: "风险管理", titleEn: "Risk",
      icon: "fa-shield-halved",
      children: [{ title: "风险预警", titleEn: "Risk Alerts" }]
    },
    {
      title: "内容管理", titleEn: "Content",
      icon: "fa-file-lines",
      children: [
        {
          title: "消息管理", titleEn: "Messaging",
          children: [
            { title: "站内信", titleEn: "In-app Message" },
            { title: "Push", titleEn: "Push" }
          ]
        },
        { title: "多语言管理", titleEn: "Localization" }
      ]
    },
    {
      title: "运营管理", titleEn: "Operations",
      icon: "fa-bullhorn",
      children: [
        { title: "广告位管理", titleEn: "Ad Placement Management", href: "广告位管理.html", hrefEn: "ad-placement-management.html" },
        { title: "文章管理", titleEn: "Article Management", href: "文章管理.html", hrefEn: "article-management.html" }
      ]
    },
    {
      title: "Partner", titleEn: "Partner",
      icon: "fa-handshake",
      children: [
        { title: "代理申请", titleEn: "Applications", href: "代理申请.html", hrefEn: "applications.html" },
        { title: "代理管理", titleEn: "Affiliates", href: "代理管理.html", hrefEn: "affiliates.html" },
        { title: "划转审核", titleEn: "Transfer Approval", href: "划转审核.html", hrefEn: "transfer-approval.html" },
        { title: "返佣流水", titleEn: "Rebate Ledger", href: "返佣流水.html", hrefEn: "rebate-ledger.html" },
        { title: "等级管理", titleEn: "Tier Management", href: "等级管理.html", hrefEn: "levels.html" },
        { title: "返佣设置", titleEn: "Rebate Settings", href: "返佣设置.html", hrefEn: "rebate-settings.html" }
      ]
    },
    {
      title: "Copytrading", titleEn: "Copytrading",
      icon: "fa-users-viewfinder",
      children: [
        { title: "等级配置", titleEn: "Level Configuration", href: "ct-level-config.html", hrefEn: "ct-level-config.html" },
        { title: "高手管理", titleEn: "Master Management", href: "ct-master-management.html", hrefEn: "ct-master-management.html" },
        { title: "跟单管理", titleEn: "Copy Trading", href: "ct-copy-trading.html", hrefEn: "ct-copy-trading.html" },
        { title: "分润流水", titleEn: "Profit Share Ledger", href: "ct-profit-share.html", hrefEn: "ct-profit-share.html" },
        { title: "系统日志", titleEn: "System Logs", href: "ct-engine-log.html", hrefEn: "ct-engine-log.html" }
      ]
    },
    {
      title: "品种管理", titleEn: "Symbols",
      icon: "fa-chart-line",
      children: [
        { title: "拆合股", titleEn: "Stock Split" },
        { title: "分红", titleEn: "Dividends" },
        { title: "品类管理", titleEn: "Categories" },
        { title: "Tab管理", titleEn: "Tabs" },
        { title: "品种配置", titleEn: "Symbol Config" }
      ]
    },
    {
      title: "报表管理", titleEn: "Reports",
      icon: "fa-chart-pie",
      children: [
        { title: "合规报告类", titleEn: "Compliance Reports" },
        { title: "财务类", titleEn: "Finance Reports" },
        { title: "运营市场", titleEn: "Operations Reports" }
      ]
    },
    { title: "活动", titleEn: "Promotions", icon: "fa-gift", children: [] },
    {
      title: "后台权限", titleEn: "Admin Access",
      icon: "fa-user-lock",
      children: [
        {
          title: "角色", titleEn: "Roles",
          children: [
            {
              title: "数据权限", titleEn: "Data Permissions",
              children: [
                { title: "脱敏", titleEn: "Masked" },
                { title: "全量", titleEn: "Full Access" }
              ]
            },
            { title: "操作权限(功能)", titleEn: "Function Permissions" },
            { title: "页面权限", titleEn: "Page Permissions" },
            { title: "层级关系管理", titleEn: "Hierarchy" }
          ]
        },
        {
          title: "用户", titleEn: "Users",
          children: [{ title: "ID管理", titleEn: "ID Management" }]
        }
      ]
    }
  ];

  // 外部可读取，供 index 模块清单等场景复用同一份配置
  window.SIDEBAR_MENU = SIDEBAR_MENU;

  let activePath = "";
  let lang = "zh";

  function labelOf(item) {
    return lang === "en" ? (item.titleEn || item.title) : item.title;
  }

  function renderMenu(items, level, parentPath) {
    let html = "";
    items.forEach(function (item, index) {
      const hasChildren = item.children && item.children.length > 0;
      const label = labelOf(item);
      const currentPath = parentPath ? parentPath + " / " + label : label;
      const itemId = "menu-" + level + "-" + index + "-" + Math.random().toString(36).slice(2, 7);
      const levelClass = "menu-level-" + level;
      const isSelected = !!activePath && currentPath === activePath;
      const itemHref = lang === "en" ? (item.hrefEn || item.href) : item.href;
      const hasHref = !!itemHref && !hasChildren;

      const safeHref = itemHref ? String(itemHref).replace(/'/g, "\\'") : "";
      const clickAction = hasHref
        ? "window.location.href='" + safeHref + "'"
        : "__sidebarToggle('" + itemId + "', " + hasChildren + ")";

      html += '<div class="menu-item-wrapper">';
      html += '<div class="flex items-center justify-between py-3 pr-4 ' + levelClass +
              ' cursor-pointer hover:bg-sidebarHover hover:text-white transition-colors group relative ' +
              (isSelected ? "text-primary bg-sidebarHover font-semibold" : "") +
              '" onclick="' + clickAction + '" id="btn-' + itemId + '">';

      html += '<div class="flex items-center gap-3">';
      if (level === 1) {
        html += '<i class="fa-solid ' + (item.icon || "fa-circle-dot") +
                ' w-5 text-center text-slate-400 group-hover:text-primary transition-colors ' +
                (isSelected ? "text-primary" : "") + '"></i>';
      } else {
        html += '<div class="w-5 flex justify-center"><div class="w-1.5 h-1.5 rounded-full ' +
                (isSelected ? "bg-primary" : "bg-slate-600") +
                ' group-hover:bg-primary transition-colors"></div></div>';
      }
      html += '<span class="' + (level === 1 ? "font-medium" : "text-sm") + '">' + label + "</span>";
      if (hasHref) {
        html += '<span class="ml-1 text-[9px] px-1.5 py-[1px] rounded bg-emerald-500/15 text-emerald-400 font-semibold tracking-wider">DONE</span>';
      }
      html += "</div>";

      if (hasChildren) {
        const isExpanded = !!activePath && activePath.indexOf(currentPath) === 0;
        html += '<i class="fa-solid fa-chevron-right text-[10px] text-slate-500 chevron' + (isExpanded ? " rotated" : "") + '" id="chevron-' + itemId + '"></i>';
      }
      if (level === 1 && isSelected) {
        html += '<div class="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>';
      }
      html += "</div>";

      if (hasChildren) {
        const isExpanded = !!activePath && activePath.indexOf(currentPath) === 0;
        html += '<div class="submenu-container bg-[#080d17] ' + (isExpanded ? "expanded" : "") + '" id="sub-' + itemId + '">';
        html += renderMenu(item.children, level + 1, currentPath);
        html += "</div>";
      }
      html += "</div>";
    });
    return html;
  }

  window.__sidebarToggle = function (itemId, hasChildren) {
    if (!hasChildren) return;
    const sub = document.getElementById("sub-" + itemId);
    const chevron = document.getElementById("chevron-" + itemId);
    if (sub) sub.classList.toggle("expanded");
    if (chevron) chevron.classList.toggle("rotated");
  };

  window.initSidebar = function (opts) {
    opts = opts || {};
    activePath = opts.activePath || "";
    lang = opts.lang === "en" ? "en" : "zh";
    const nav = document.getElementById("sidebar-nav");
    if (nav) nav.innerHTML = renderMenu(SIDEBAR_MENU, 1, "");
  };

  /* -------------------------------------------------------------------
   * injectSidebar(opts)
   * 在 #sidebar-root 内注入完整侧栏（Logo + 导航 + 账号块）。
   * 这是 2026-07 后的统一入口：改一次 sidebar.js，29 页全联动。
   * ------------------------------------------------------------------- */
  window.injectSidebar = function (opts) {
    opts = opts || {};
    activePath = opts.activePath || "";
    lang = opts.lang === "en" ? "en" : "zh";

    const root = document.getElementById("sidebar-root");
    if (!root) {
      // 降级：老页面仍用 sidebar-nav
      return window.initSidebar(opts);
    }

    root.innerHTML =
      '<aside class="w-72 bg-sidebar text-slate-300 flex flex-col h-full shadow-xl z-20 flex-shrink-0">' +
        // Logo
        '<div class="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">' +
          '<div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white mr-3 shadow-lg shadow-blue-500/30">' +
            '<i class="fa-solid fa-chart-line"></i>' +
          '</div>' +
          '<span class="text-white font-bold text-lg tracking-wide">Cheer CMS</span>' +
        '</div>' +
        // 导航菜单
        '<nav class="flex-1 overflow-y-auto py-4" id="sidebar-nav">' +
          renderMenu(SIDEBAR_MENU, 1, "") +
        '</nav>' +
        // 账号块
        '<div class="p-4 border-t border-slate-800 shrink-0">' +
          '<div class="flex items-center gap-3">' +
            '<div class="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white">AD</div>' +
            '<div class="flex-1 overflow-hidden">' +
              '<p class="text-sm text-white font-medium truncate">Admin Super</p>' +
              '<p class="text-xs text-slate-500 truncate">admin@cheer-cms.com</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</aside>';
  };
})();
