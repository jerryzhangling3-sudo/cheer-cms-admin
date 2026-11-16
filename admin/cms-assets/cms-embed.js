(() => {
  'use strict';
  const file = decodeURIComponent(location.pathname.split('/').pop());
  const fileRoutes = {
    'account-dormant.html':'/fund/account-dormant-management','cobo.html':'/fund/cobo','reconciliation-reports.html':'/fund/reconciliation-reports',
    'deposits.html':'/fund/funding/deposits','入金管理.html':'/fund/funding/deposits',
    'withdrawals.html':'/fund/funding/withdrawals','出金管理.html':'/fund/funding/withdrawals',
    'gateways.html':'/fund/funding-channels','通道管理.html':'/fund/funding-channels',
    'ledger.html':'/fund/fund-flows','资金流水.html':'/fund/fund-flows',
    'balance-adjustment.html':'/fund/funding-adjustment','资金管理.html':'/fund/funding-adjustment',
    'applications.html':'/partner/applications','代理申请.html':'/partner/applications',
    'affiliates.html':'/partner/members','代理管理.html':'/partner/members',
    'transfer-approval.html':'/partner/relation-transfer','划转审核.html':'/partner/relation-transfer',
    'rebate-ledger.html':'/partner/rebate-ledger','返佣流水.html':'/partner/rebate-ledger',
    'levels.html':'/partner/tiers','等级管理.html':'/partner/tiers',
    'rebate-settings.html':'/partner/rebate-configs','返佣设置.html':'/partner/rebate-configs',
    'ct-level-config.html':'/copytrading/levels','ct-master-management.html':'/copytrading/masters',
    'ct-copy-trading.html':'/copytrading/relations','ct-profit-share.html':'/copytrading/profit-share',
    'ct-engine-log.html':'/copytrading/engine-logs',
    'clients.html':'/customers/client-list','客户管理.html':'/customers/client-list'
  };
  if (self !== top) document.documentElement.classList.add('cms-embedded');
  else if (fileRoutes[file]) {
    const query = new URLSearchParams(location.search); query.delete('embedded');
    location.replace('../#' + fileRoutes[file] + (query.size ? '?' + query.toString() : ''));
    return;
  }
  function ready() {
    if ((file === 'clients.html' || file === '客户管理.html') && self !== top) {
      const query = new URLSearchParams(location.search); query.delete('embedded');
      top.postMessage({ type:'cheer-cms-navigate', path:'/customers/client-list', query: query.size ? '?' + query.toString() : '' }, location.origin);
      return;
    }
    // Preserve existing form handlers. Only align labels and missing display columns.
    const renames = {
      'affiliates.html': {'Partner UID':'UID','3-Level Active Clients':'Valid Clients','3-Level Team Clients':'Team Size','3-Level Rolling Margin':'Rolling Margin'},
      'rebate-ledger.html': {'Deal ID':'Order ID','Rebate Depth (max 3)':'Settlement Tier'},
      'balance-adjustment.html': {'LedgerID':'TxID'},
      'gateways.html': {'Actions':'Action'},
      'levels.html': {'3-Level Active Clients ≥':'Active Clients ≥','3-Level Team Margin (USD) ≥':'Team Margin (USD) ≥'}
    };
    const table = document.querySelector('main table');
    const titles={'applications.html':'Applications','affiliates.html':'Affiliates','transfer-approval.html':'Transfer Approval','levels.html':'Tier Management','rebate-settings.html':'Rebate Settings','ledger.html':'Ledger','balance-adjustment.html':'Balance Adjustment'};
    const heading=document.querySelector('main h1');
    if(heading&&titles[file])heading.textContent=titles[file];
    document.querySelectorAll('input[placeholder="Exact match byID"]').forEach(input=>input.placeholder='Exact match by ID');
    if (table && renames[file]) table.querySelectorAll('thead th').forEach(th => { const name=th.textContent.trim();if (renames[file][name]) th.textContent=renames[file][name]; });
    document.addEventListener('click', event => {
      const anchor = event.target.closest('a[href]');
      if (!anchor || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const url = new URL(anchor.href, location.href);
      const targetFile = decodeURIComponent(url.pathname.split('/').pop());
      if (url.origin === location.origin && fileRoutes[targetFile] && self !== top) {
        event.preventDefault();
        const query = url.searchParams; query.delete('embedded');
        top.postMessage({ type:'cheer-cms-navigate', path:fileRoutes[targetFile], query: query.size ? '?' + query.toString() : '' }, location.origin);
      }
    }, true);
    if (file === 'deposits.html' && table) {
      const head = table.querySelector('thead tr');
      const headers = [...head.children];
      const ref = headers.find(th => th.textContent.trim().startsWith('Ref ID'));
      if (ref) {
        ['Available Amount','Restricted Amount'].forEach(text => { const th=document.createElement('th');th.textContent=text;head.insertBefore(th,ref); });
        table.querySelectorAll('tbody tr').forEach(row => {
          if (row.children.length !== headers.length) return;
          const referenceCell=row.children[8],net=row.children[7]?.textContent.trim()||'—';
          [net,'0.00'].forEach(text => { const td=document.createElement('td');td.className='cms-data-added text-right';td.textContent=text;row.insertBefore(td,referenceCell); });
        });
      }
      const inputs=[...document.querySelectorAll('main input')];
      const status=document.querySelector('main select');
      const rows=[...table.querySelectorAll('tbody tr')];
      const filter=()=>{
        const uid=(inputs[0]?.value||'').trim().toLowerCase(),tx=(inputs[1]?.value||'').trim().toLowerCase();
        const range=(inputs[2]?.value||'').match(/\d{4}-\d{2}-\d{2}/g)||[];
        let visible=0;
        rows.forEach(row=>{
          const text=row.textContent.toLowerCase(),cells=row.children,date=cells[2]?.textContent.trim().slice(0,10)||'';
          const show=(!uid||cells[1]?.textContent.trim().toLowerCase()===uid)&&(!tx||cells[0]?.textContent.toLowerCase().includes(tx))&&(!status?.value||status.value==='all'||text.includes(status.value))&&(!range[0]||date>=range[0])&&(!range[1]||date<=range[1]);
          row.hidden=!show;if(show)visible++;
        });
        const count=[...document.querySelectorAll('main span')].find(el=>/^Total \d+ deposits$/.test(el.textContent.trim()));
        if(count)count.textContent=`Total ${visible} deposits`;
      };
      inputs.forEach(input=>input.addEventListener('input',filter));status?.addEventListener('change',filter);
      const buttons=[...document.querySelectorAll('main button')];
      const reset=buttons.find(button=>button.textContent.trim()==='Reset');
      if(reset)reset.onclick=()=>{inputs.forEach(input=>input.value='');status.value='all';filter();};
      const exportButton=buttons.find(button=>button.textContent.trim()==='Search');
      if(exportButton){
        exportButton.textContent='Export CSV';
        exportButton.onclick=()=>{
          const escape=value=>'"'+value.replace(/"/g,'""')+'"';
          const csv=[...table.rows].filter(row=>!row.hidden).map(row=>[...row.cells].map(cell=>escape(cell.textContent.trim().replace(/\s+/g,' '))).join(',')).join('\r\n');
          const url=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'}));
          const link=document.createElement('a');link.href=url;link.download='deposits.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
        };
      }
      buttons.filter(button=>/^[12]$/.test(button.textContent.trim())||button.querySelector('.fa-chevron-right,.fa-chevron-left')).forEach(button=>{button.disabled=true;button.setAttribute('aria-label','All demo records are on this page');});
      rows.forEach(row=>{const uid=row.children[1];if(uid){uid.style.cursor='pointer';uid.addEventListener('click',()=>top.postMessage({type:'cheer-cms-navigate',path:'/customers/client-list',query:'?uid='+encodeURIComponent(uid.textContent.trim())},location.origin));}});
      filter();
    }
    if (file === 'withdrawals.html' && table) {
      const head=table.querySelector('thead tr');
      const statusCell=[...head.children].find(th=>th.textContent.trim()==='Status');
      const riskCell=[...head.children].find(th=>th.textContent.trim()==='Risk Status');
      if(statusCell&&riskCell)head.insertBefore(statusCell,riskCell);
      const th=document.createElement('th');th.textContent='Finance Status';head.insertBefore(th,head.lastElementChild);
      const adaptRows=()=>table.querySelectorAll('tbody tr').forEach(row=>{
        if(row.children.length!==14)return;
        row.insertBefore(row.children[12],row.children[10]);
        const cell=document.createElement('td');cell.textContent='—';row.insertBefore(cell,row.lastElementChild);
      });
      adaptRows();
      new MutationObserver(adaptRows).observe(table.querySelector('tbody'),{childList:true});
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',ready);else ready();
})();
