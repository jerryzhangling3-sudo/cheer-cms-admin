/* Shared CMS navigation. Production is a read-only visual reference. */
(() => {
  'use strict';
  const locale = () => window.CMS_I18N.getLanguage();
  const zhLabels = {
    'System Mgmt':'系统管理','Resource Mgmt':'资源管理','Role Mgmt':'角色管理','User Mgmt':'系统用户管理','Log Mgmt':'日志管理','Workbench':'工作台','Customer Tickets':'客服工单','Customers':'客户管理','Client':'客户列表','Black List':'黑名单','White List':'白名单',
    'Trade':'交易管理','Trading Information':'交易信息','Funding':'资金管理','Cash Mgmt':'出入金管理','Deposits':'入金管理','Withdrawals':'出金管理','FX Rates':'汇率管理','Gateways':'通道管理',
    'Balances':'资金账户管理','Loss Compensation':'负余额补偿','Ledger':'资金流水','Islamic Account Fee':'伊斯兰账户费用','Account Dormant Mgmt':'休眠账户管理','Funding Adjustment':'资金调整','Providers':'服务商','Cobo':'Cobo','Reconciliation Reports':'对账报表',
    'Operations':'运营管理','Notification':'通知管理','Notification Scenes':'消息场景','Display Settings':'展示设置','Hot Trading':'热门交易','Ad Mgmt':'广告管理','Article Management':'文章管理',
    'Suspicious Risk Users':'可疑风险用户','Risk Mgmt':'风险管理','Risk Rules':'风控规则','Risk Limits':'风控限制','Risk Exposure Dashboard':'风险敞口看板','Quote Monitoring':'行情监控',
    'Partner':'代理管理','Applications':'代理申请','Affiliates':'代理管理','Transfer Approval':'划转审核','Rebate Ledger':'返佣流水','Tier Mgmt':'等级管理','Rebate Settings':'返佣设置',
    'Copytrading':'跟单交易','Level Configuration':'等级配置','Master Management':'高手管理','Copy Trading':'跟单管理','Profit Share Ledger':'分润流水','System Logs':'引擎日志'
  };
  const label = value => locale() === 'zh' ? (zhLabels[value] || window.CMS_I18N.t(value)) : value;
  const labelSpan = value => `<span data-cms-i18n-skip data-cms-label="${escape(value)}">${escape(label(value))}</span>`;
  const node = (label, path, options = {}) => ({ label, path, ...options });
  const group = (label, icon, children) => ({ label, icon, children });
  const menu = [
    group('Workbench', 'grid', [node('Customer Tickets', '/workbench/customer-tickets', { page: 'workbench' })]),
    group('Customers', 'users', [
      node('Client', '/customers/client-list', { page: 'customers', customer: 'client' }),
      node('Black List', '/customers/black-list', { page: 'customers', customer: 'black' }),
      node('White List', '/customers/white-list', { page: 'customers', customer: 'white' })
    ]),
    group('Trade', 'swap', [node('Trading Information', '/fund/trading-information', { page: 'trading-information' })]),
    group('Funding', 'wallet', [
      group('Cash Mgmt', null, [
        node('Deposits', '/fund/funding/deposits', { file: 'deposits.html', zh: '入金管理.html' }),
        node('Withdrawals', '/fund/funding/withdrawals', (window.CMS_DEMO ? { page: 'shared-withdrawals' } : { file: 'withdrawals.html', zh: '出金管理.html' })),
        node('FX Rates', '/fund/exchange-rates', { page: 'exchange' }),
        node('Gateways', '/fund/funding-channels', { file: 'gateways.html', zh: '通道管理.html' })
      ]),
      group('Balances', null, [
        node('Loss Compensation', '/fund/negative-balance-protection', { page: 'negative' }),
        node('Ledger', '/fund/fund-flows', (window.CMS_DEMO ? { page: 'shared-ledger' } : { file: 'ledger.html', zh: '资金流水.html' })),
        node('Islamic Account Fee', '/fund/islamic-overdue-fee', { page: 'islamic' }),
        node('Account Dormant Mgmt', '/fund/account-dormant-management', { file: 'account-dormant.html' }),
        node('Funding Adjustment', '/fund/funding-adjustment', { file: 'balance-adjustment.html', zh: '资金管理.html' })
      ]),
      group('Providers', null, [
        node('Cobo', '/fund/cobo', { file: 'cobo.html' }),
        node('Reconciliation Reports', '/fund/reconciliation-reports', { file: 'reconciliation-reports.html' })
      ])
    ]),
    group('Operations', 'cluster', [
      group('Notification', null, [node('Notification Scenes', '/data/notification/scenes', { page: 'message-center' })]),
      group('Display Settings', null, [node('Hot Trading', '/data/hot-trading', { page: 'hot-assets' })]),
      node('Ad Mgmt', '/operations/ad-placements', { page: 'ad-placement' }),
      node('Article Management', '/operations/articles', { page: 'article-management' })
    ]),
    group('Risk Mgmt', 'shield', [
      node('Risk Rules', '/risk/rules', { page: 'risk' }),
      node('Suspicious Risk Users', '/risk/related-users', { file: 'risk-related-users.html' }),
      node('Risk Limits', '/risk/limits', { page: 'risk-limit' }),
      node('Risk Exposure Dashboard', '/risk/exposure-dashboard', { page: 'exposure' }),
      node('Quote Monitoring', '/risk/quote-monitor', { page: 'quote-monitor' })
    ]),
    group('Partner', 'grid', [
      node('Applications', '/partner/applications', { file: 'applications.html', zh: '代理申请.html' }),
      node('Affiliates', '/partner/members', { file: 'affiliates.html', zh: '代理管理.html' }),
      node('Transfer Approval', '/partner/relation-transfer', { file: 'transfer-approval.html', zh: '划转审核.html' }),
      node('Rebate Ledger', '/partner/rebate-ledger', { file: 'rebate-ledger.html', zh: '返佣流水.html' }),
      node('Tier Mgmt', '/partner/tiers', { file: 'levels.html', zh: '等级管理.html' }),
      node('Rebate Settings', '/partner/rebate-configs', { file: 'rebate-settings.html', zh: '返佣设置.html' })
    ]),
    group('Copytrading', 'chart', [
      node('Level Configuration', '/copytrading/levels', { file: 'ct-level-config.html' }),
      node('Master Management', '/copytrading/masters', { file: 'ct-master-management.html' }),
      node('Copy Trading', '/copytrading/relations', { file: 'ct-copy-trading.html' }),
      node('Profit Share Ledger', '/copytrading/profit-share', { file: 'ct-profit-share.html' }),
      node('System Logs', '/copytrading/engine-logs', { file: 'ct-engine-log.html' })
    ])
,
    group('System Mgmt', 'shield', [node('Resource Mgmt', '/manager/resources', {page:'system-resources'}), node('Role Mgmt', '/manager/roles', {page:'system-roles'}), node('User Mgmt', '/manager/users', {page:'system-users'}), node('Log Mgmt', '/manager/logs', {page:'system-logs'})])
  ];
  const leaves = new Map();
  function collect(items, parents = []) {
    items.forEach(item => item.children ? collect(item.children, [...parents, item.label]) : leaves.set(item.path, { ...item, parents }));
  }
  collect(menu);
  window.CHEER_CMS_MENU = menu;
  window.CHEER_CMS_ROUTES = leaves;
  const icons = {
    grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M17 15a5 5 0 0 1 4 5"/>',
    swap: '<path d="M4 7h16l-4-4M20 17H4l4 4M20 7l-4 4M4 17l4-4"/>',
    wallet: '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 8h18M17 12h4v5h-4z"/>',
    cluster: '<rect x="9" y="3" width="6" height="6"/><rect x="2" y="16" width="6" height="6"/><rect x="16" y="16" width="6" height="6"/><path d="M12 9v4H5v3M12 13h7v3"/>',
    shield: '<path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6zM8 12l3 3 5-6"/>',
    chart: '<path d="M3 3v18h18M6 16l5-6 4 3 6-8"/>'
  };
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const svg = key => `<svg class="cms-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${icons[key] || ''}</svg>`;
  function render(items, level = 0) {
    return items.map((item, i) => item.children
      ? `<details class="cms-group cms-level-${level}" data-group="${escape(item.label)}"><summary>${item.icon ? svg(item.icon) : ''}${labelSpan(item.label)}<svg class="cms-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="m5 6 3 3 3-3"/></svg></summary><div class="cms-children">${render(item.children, level + 1)}</div></details>`
      : `<a class="cms-leaf cms-level-${level}" href="#${item.path}" data-route="${item.path}"${item.page ? ` data-page="${item.page}"` : ''}>${labelSpan(item.label)}</a>`).join('');
  }
  const sidebar = document.querySelector('.sidebar');
  sidebar.innerHTML = `<a class="cms-brand" href="#/workbench/customer-tickets" aria-label="Cheer Trade Administrator"><svg width="27" height="28" viewBox="0 0 28 28" aria-hidden="true"><path fill="#ffc247" d="m3 8 16-5v15L3 23z"/><path fill="#ec9412" d="m7 11 16-5v15L7 26z"/><path fill="#ffdc83" d="m3 8 4 3 16-5-4-3z"/><path stroke="white" fill="none" d="m10 15 8-2v7l-8 2z"/></svg><span><strong>Cheer Trade</strong><small>Administrator</small></span></a><nav aria-label="Main navigation" id="cms-navigation">${render(menu)}</nav>`;
  const content = document.querySelector('main.main');
  const modulePanel = document.createElement('section');
  modulePanel.className = 'cms-module-panel';
  modulePanel.hidden = true;
  modulePanel.innerHTML = '<div class="cms-module-loading" role="status">Loading…</div><iframe id="cms-module-frame" title="CMS module" hidden></iframe><div class="cms-module-error" hidden role="alert">Unable to load this page. <button type="button">Retry</button></div>';
  content.append(modulePanel);
  const frame = modulePanel.querySelector('iframe');
  const loading = modulePanel.querySelector('.cms-module-loading');
  const error = modulePanel.querySelector('.cms-module-error');
  const aliases = {
    '#page/workbench': '/workbench/customer-tickets', '#page/customers': '/customers/client-list',
    '#page/trading-information': '/fund/trading-information', '#page/hot-assets': '/data/hot-trading',
    '#page/exchange': '/fund/exchange-rates', '#page/negative': '/fund/negative-balance-protection',
    '#page/islamic': '/fund/islamic-overdue-fee', '#operations/ad-placement': '/operations/ad-placements',
    '#customers/client-list': '/customers/client-list',
    '#operations/article-management': '/operations/articles', '#operations/message-center': '/data/notification/scenes',
    '#risk/exposure': '/risk/exposure-dashboard', '#risk/quote-monitor': '/risk/quote-monitor',
    '#risk/rules': '/risk/rules', '#risk/limits': '/risk/limits'
  };
  let currentPath = '';
  let loadTimer;
  function setActive(route) {
    document.querySelectorAll('.cms-group').forEach(group => { group.open = route.parents.includes(group.dataset.group); });
    document.querySelectorAll('.cms-leaf').forEach(link => {
      const active = link.dataset.route === route.path;
      link.classList.toggle('cms-selected', active);
      if (active) {
        link.setAttribute('aria-current', 'page');
        let parent = link.parentElement;
        while (parent && parent !== sidebar) { if (parent.tagName === 'DETAILS') parent.open = true; parent = parent.parentElement; }
      } else link.removeAttribute('aria-current');
    });
    document.title = `${label(route.label)} · Cheer Trade Administrator`;
    document.querySelector('#cms-current-title').textContent = [...route.parents, route.label].map(label).join(' / ');
    requestAnimationFrame(() => document.querySelector('.cms-selected')?.scrollIntoView({block:'nearest'}));
  }
  function route() {
    const query = new URLSearchParams(location.hash.split('?')[1] || '');
    let path = aliases[location.hash] || location.hash.slice(1).split('?')[0] || '/workbench/customer-tickets';
    if (path.startsWith('/customers/client-list/')) {
      query.set('uid', decodeURIComponent(path.slice('/customers/client-list/'.length)));
      path = '/customers/client-list';
    }
    const target = leaves.get(path);
    if (!target) { location.hash = '/workbench/customer-tickets'; return; }
    currentPath = path;
    setActive(target);
    document.body.classList.toggle('cms-show-module', !!target.file);
    modulePanel.hidden = !target.file;
    if (target.file) {
      localStorage.setItem('cfd-lang', locale());
      document.querySelectorAll('.page.is-active').forEach(panel => panel.classList.remove('is-active'));
      const url = new URL(`cheercms/${target.file}`, location.href.split('#')[0]);
      query.forEach((value, key) => url.searchParams.set(key, value));
      url.searchParams.set('embedded', '1');
      if(path === '/risk/related-users') url.searchParams.set('liveOnly', '20261127-1');
      url.searchParams.set('v', path === '/copytrading/masters' ? '20261110-master-restrict1' : '20261102-bi1');
      if (frame.src !== url.href) {
        loading.hidden = false; error.hidden = true; frame.hidden = true;
        frame.src = url.href;
        clearTimeout(loadTimer);
        loadTimer = setTimeout(() => { if (frame.hidden) { loading.hidden = true; error.hidden = false; } }, 20000);
      }
    } else {
      if (typeof window.switchPage === 'function') window.switchPage(target.page);
      if (target.customer && typeof window.switchCustomerPage === 'function') window.switchCustomerPage(target.customer);
      if (target.customer === 'client' && query.get('uid') && typeof window.openCustomerDetailPage === 'function') window.openCustomerDetailPage(query.get('uid'), query.get('name') || query.get('uid'), query.get('tab'));
    }
    history.replaceState({ cmsPath: path }, '', `#${path}${query.size ? '?' + query.toString() : ''}`);
    setActive(target);
  }
  frame.addEventListener('load', () => {
    clearTimeout(loadTimer);
    try {
      const doc = frame.contentDocument;
      if (!doc || !doc.querySelector('main')) throw new Error('Page unavailable');
      doc.documentElement.classList.add('cms-embedded');
      const actualFile = decodeURIComponent(new URL(frame.contentWindow.location.href).pathname.split('/').pop());
      const target = [...leaves.values()].find(item => item.file === actualFile || item.zh === actualFile);
      if (target && target.path !== currentPath) {
        currentPath = target.path;
        history.replaceState({ cmsPath: currentPath }, '', '#' + currentPath + frame.contentWindow.location.search.replace(/[?&]embedded=1/g, '').replace(/^&/, '?'));
        setActive(target);
      }
      frame.contentWindow.CMS_I18N?.setLanguage(locale(), false);
      loading.hidden = true; error.hidden = true; frame.hidden = false;
    } catch (_) { loading.hidden = true; error.hidden = false; }
  });
  error.querySelector('button').addEventListener('click', () => { frame.src = frame.src; error.hidden = true; loading.hidden = false; });
  sidebar.addEventListener('click', event => {
    const link = event.target.closest('[data-route]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (location.hash === '#' + link.dataset.route) route();
    else location.hash = link.dataset.route;
  });
  // Legacy customer links and module links continue to resolve inside the CMS.
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== frame.contentWindow || event.data?.type !== 'cheer-cms-navigate') return;
    if (leaves.has(event.data.path)) location.hash = event.data.path + (event.data.query || '');
  });
  document.addEventListener('click',event=>{
    if(!event.target.closest('[data-cc-back]'))return;
    const saved=window.CMS_RISK_RETURN;
    const query=new URLSearchParams(location.hash.split('?')[1]||'');
    if(!saved||!location.hash.startsWith('#/customers/client-list?')||query.get('uid')!==saved.uid)return;
    event.preventDefault();event.stopImmediatePropagation();window.CMS_RISK_RETURN=null;
    location.hash='/risk/related-users';
    requestAnimationFrame(()=>{if(location.hash.startsWith('#/risk/related-users'))saved.restore()});
  },true);
  window.addEventListener('hashchange',()=>{
    const saved=window.CMS_RISK_RETURN;if(!saved)return;
    const query=new URLSearchParams(location.hash.split('?')[1]||'');
    if(!location.hash.startsWith('#/customers/client-list?')||query.get('uid')!==saved.uid)window.CMS_RISK_RETURN=null;
  });
  window.addEventListener('hashchange', route);
  const oldAccount = document.querySelector('.main-account');
  const header = document.createElement('header');
  header.className = 'cms-header';
  header.innerHTML = '<button class="cms-sidebar-toggle" type="button" aria-label="Toggle navigation" aria-expanded="true">☰</button><span id="cms-current-title" data-cms-i18n-skip></span><div class="cms-language" role="group" aria-label="Language" data-cms-i18n-skip><button type="button" data-language="zh">中文</button><button type="button" data-language="en">EN</button></div>';
  if (oldAccount) header.append(oldAccount);
  document.querySelector('.shell').append(header);
  header.querySelector('button').addEventListener('click', event => { const collapsed = document.body.classList.toggle('cms-sidebar-collapsed'); event.currentTarget.setAttribute('aria-expanded', String(!collapsed)); });
  function updateLanguage() {
    document.querySelectorAll('[data-cms-label]').forEach(el => {el.textContent = label(el.dataset.cmsLabel);});
    header.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === locale())));
    const target = leaves.get(currentPath);
    if(target) {
      document.title = `${label(target.label)} · Cheer Trade Administrator`;
      document.querySelector('#cms-current-title').textContent = [...target.parents,target.label].map(label).join(' / ');
    }
  }
  header.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>window.CMS_I18N.setLanguage(button.dataset.language)));
  window.addEventListener('cms-languagechange', updateLanguage);
  route();
  updateLanguage();
  document.documentElement.classList.remove('cms-booting');
})();
