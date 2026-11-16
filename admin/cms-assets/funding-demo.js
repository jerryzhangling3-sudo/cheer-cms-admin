(() => {
  'use strict';
  const root=document.getElementById('funding-view'),dialog=document.getElementById('funding-dialog');
  const file=location.pathname.split('/').pop();
  const esc=value=>String(value??'—').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const key='cheer-cms-funding-demo-v1';
  const initial={rules:[{id:1,name:'Countdown to disabling trading permissions for Live accounts',description:'Used to filter inactive users and disable their transaction permissions.',enabled:true,reminder:7,days:90,history:[]},{id:2,name:'Demo account hibernation countdown',description:'Used to manage demo account resources occupied by inactive users.',enabled:true,reminder:3,days:30,history:[]}],notifications:{email:'ops@example.com',time:'09:00',enabled:true}};
  let state;
  try{state=JSON.parse(localStorage.getItem(key))||initial;}catch(_){state=initial;}
  function notify(text){const toast=document.getElementById('funding-toast');toast.textContent=text;toast.hidden=false;setTimeout(()=>toast.hidden=true,2500);}
  function save(next){try{localStorage.setItem(key,JSON.stringify(next));state=next;return true;}catch(_){notify('Unable to save. Browser storage is full or unavailable.');return false;}}
  function table(columns,rows){return `<div class="table-wrap"><table><thead><tr>${columns.map(x=>`<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(row=>`<tr>${row.map(cell=>`<td>${cell}</td>`).join('')}</tr>`).join(''):`<tr><td class="empty" colspan="${columns.length}">No data</td></tr>`}</tbody></table></div>`;}
  function badge(status){const type=/complete|success|enabled|ready|collected|available/i.test(status)?'success':/fail|disabled|error/i.test(status)?'failed':'pending';return `<span class="badge ${type}">${esc(status)}</span>`;}
  function modal(title,body,onSave){document.getElementById('dialog-title').textContent=title;document.getElementById('dialog-content').innerHTML=body;const saveButton=document.getElementById('dialog-save');saveButton.hidden=!onSave;saveButton.onclick=onSave||null;dialog.showModal();}
  function detail(title,values){modal(title,`<dl>${Object.entries(values).map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`);}
  const input=(label,placeholder='',type='text')=>`<label>${esc(label)}<input data-filter="${esc(label)}" placeholder="${esc(placeholder)}" type="${type}"></label>`;
  const select=(label,values)=>`<label>${esc(label)}<select data-filter="${esc(label)}"><option value="">All</option>${values.map(value=>`<option>${esc(value)}</option>`).join('')}</select></label>`;
  function dormant(){
    document.title='Account Dormant Management';
    root.innerHTML=`<h1>Account Dormant Management</h1><p>Configure inactivity countdowns for Live and Demo trading accounts</p><div class="tabs"><button role="tab" aria-selected="true">Account Dormant Settings</button></div><div class="filters">${input('Rule Name','Enter rule name')}${select('Status',['Enabled','Disabled'])}<button id="reset">Reset</button></div><div id="rule-table"></div>`;
    const render=()=>{const query=root.querySelector('input').value.toLowerCase(),status=root.querySelector('select').value;const rules=state.rules.filter(row=>row.name.toLowerCase().includes(query)&&(!status||status===(row.enabled?'Enabled':'Disabled')));document.getElementById('rule-table').innerHTML=table(['ID','Rule Name','Status','Operation'],rules.map(row=>[esc(row.id),`${esc(row.name)}<small>${esc(row.description)}</small>`,badge(row.enabled?'Enabled':'Disabled'),`<button class="link" data-edit="${row.id}">Edit</button>`]));};
    root.oninput=render;root.onchange=render;
    root.onclick=event=>{if(event.target.id==='reset'){root.querySelector('input').value='';root.querySelector('select').value='';render();}if(event.target.dataset.edit)editRule(Number(event.target.dataset.edit));};render();
  }
  function editRule(id){
    const rule=state.rules.find(row=>row.id===id);
    root.innerHTML=`<div class="head"><div><h1>Edit Rule</h1><p>Last edited: ${esc(rule.history.at(-1)?.time||'—')} · admin</p></div><button id="back">← Back to Settings</button></div><div class="rule-info"><span>Rule Name</span><strong>${esc(rule.name)}</strong><span>Rules Description</span><div>${esc(rule.description)}</div></div><h2>Trigger Conditions</h2><div class="conditions"><div class="condition"><div>Remind the user before the countdown ends<small><p>Send the inactivity warning before enforcement.</p></small></div><label><input aria-label="Reminder days" id="reminder" type="number" min="0" value="${rule.reminder}">Days</label></div><div class="condition"><div>User's last transaction time is greater than or equal to<small><p>Apply the rule after this many inactive days.</p></small></div><label><input aria-label="Inactive days" id="inactive" type="number" min="1" value="${rule.days}">Days</label></div></div><div class="actions"><button id="pause">${rule.enabled?'Pause Rule':'Enable Rule'}</button><button id="save-rule" class="primary">Save</button></div><h2>Change History</h2>${table(['ID','Version','Change','Updated Time','Operator'],rule.history.map((h,i)=>[esc(i+1),esc(i+1),esc(h.change),esc(h.time),'admin']))}`;
    root.oninput=null;root.onchange=null;
    root.onclick=event=>{
      if(event.target.id==='back')return dormant();
      if(!['pause','save-rule'].includes(event.target.id))return;
      const reminder=Number(document.getElementById('reminder').value),days=Number(document.getElementById('inactive').value);
      if(!Number.isInteger(reminder)||!Number.isInteger(days)||days<1||reminder<0||reminder>=days)return notify('Reminder days must be non-negative and less than inactive days.');
      const next=JSON.parse(JSON.stringify(state)),changed=next.rules.find(row=>row.id===id);
      changed.reminder=reminder;changed.days=days;
      if(event.target.id==='pause')changed.enabled=!changed.enabled;
      changed.history.push({time:new Date().toLocaleString('en-GB',{hour12:false}),change:event.target.id==='pause'?(changed.enabled?'Rule enabled':'Rule paused'):`Reminder ${reminder} days; inactive ${days} days`});
      if(save(next)){notify('Rule saved');editRule(id);}
    };
  }
  const transactions=[['Deposit','DEMO_TX_20261102_001','Completed','External address','Funding wallet','1,250.00 USDT','TRON','2026-11-02 09:20:00'],['Withdrawal','DEMO_TX_20261102_002','Processing','Funding wallet','External address','320.00 USDT','ETH','2026-11-02 10:15:00'],['Collection','DEMO_TX_20261101_003','Failed','Address pool','Funding wallet','75.00 USDT','TRON','2026-11-01 16:40:00']];
  const tabs={
    'Transactions':{columns:['Type','Transaction','Status','Source','Destination','Amount','Network','Created','Action'],rows:transactions},
    'Funding Wallet':{columns:['Chain','Token ID','Asset','Total','Available','Pending','Locked','Frozen'],rows:[['TRON','TRON_USDT','USDT','25,000.00','24,000.00','500.00','500.00','0.00'],['ETH','ETH_USDT','USDT','8,500.00','8,000.00','500.00','0.00','0.00']]},
    'Gas Wallet':{columns:['Chain','Token ID','Asset','Total','Available','Pending','Locked','Frozen'],rows:[['TRON','TRX','TRX','1,200.00','1,100.00','100.00','0.00','0.00'],['ETH','ETH','ETH','0.85','0.80','0.05','0.00','0.00']]},
    'Address Pool':{columns:['Chain','Address Pool','Shared With','Available Addresses','Low Watermark','Target Stock','Refill Status','Last Error'],rows:[['TRON','DEMO_POOL_TRON','Funding','128','30','200','Ready','—'],['ETH','DEMO_POOL_ETH','Funding','64','20','100','Ready','—']]},
    'Webhook Events':{columns:['Event','Status','Time','Action'],rows:[['DEMO_EVENT_001 · transaction.completed','Success','2026-11-02 09:20:02'],['DEMO_EVENT_002 · transaction.processing','Pending','2026-11-02 10:15:01']]},
    'Failed Requests':{columns:['Request','Time','Action',''],rows:[['DEMO_REQUEST_001 · collection','2026-11-01 16:40:00','Collection request failed','—']]}
  };
  let selectedTab='Transactions';
  function cobo(){
    document.title='Cobo Provider';
    const def=tabs[selectedTab];
    root.innerHTML=`<h1>Cobo Provider</h1><p>Provider transactions, wallet balances and reconciliation events</p><div class="tabs" role="tablist">${Object.keys(tabs).map(tab=>`<button role="tab" aria-selected="${tab===selectedTab}" data-tab="${esc(tab)}">${esc(tab)}</button>`).join('')}</div><div class="filters">${selectedTab==='Transactions'?select('Wallet',['Funding','Gas'])+select('Type',['Deposit','Withdrawal','Collection'])+select('Status',['Completed','Processing','Failed'])+input('Chain ID','e.g. SETH')+input('Token ID','e.g. SETH_USDT')+input('Created time','Start date','date')+input('End date','','date')+select('Identifier field',['Transaction ID','Request ID','Transaction Hash'])+input('Exact identifier','Transaction ID, request ID or transaction hash'):selectedTab==='Webhook Events'?select('Endpoint',['Default'])+select('Status',['Success','Pending','Failed'])+input('Event type','Event type')+input('Event time','','date')+input('Search','Event ID'):input('Search','Search '+selectedTab.toLowerCase())}<button id="reset">Reset</button><button id="search">${selectedTab==='Address Pool'?'Refresh':'Search'}</button></div><div id="cobo-table"></div><div class="footer" id="count"></div>`;
    const render=()=>{
      const values=[...root.querySelectorAll('[data-filter]')].map(el=>({label:el.dataset.filter,value:el.value.trim().toLowerCase()})).filter(x=>x.value);
      const rows=def.rows.filter(row=>values.every(filter=>{if(['Identifier field','Endpoint'].includes(filter.label))return true;if(['Created time','End date','Event time'].includes(filter.label)){const date=row.find(value=>/^\d{4}-\d{2}-\d{2}/.test(value))?.slice(0,10)||'';return filter.label==='End date'?date<=filter.value:date>=filter.value;}if(filter.label==='Token ID')return (row[6]+'_'+row[5]?.split(' ').at(-1)).toLowerCase().includes(filter.value);return row.join(' ').toLowerCase().includes(filter.value);}));
      document.getElementById('cobo-table').innerHTML=table(def.columns,rows.map((row,i)=>{const cells=row.map((cell,j)=>/Status/.test(def.columns[j])?badge(cell):esc(cell));const action=def.columns.indexOf('Action');if(action>=0)cells[action]=`<button class="link" data-details="${def.rows.indexOf(row)}">Details</button>`;return cells;}));document.getElementById('count').textContent=`Total ${rows.length} records`;
    };
    root.oninput=render;root.onchange=render;root.onclick=event=>{if(event.target.dataset.tab){selectedTab=event.target.dataset.tab;cobo();}if(event.target.id==='search'){render();if(selectedTab==='Address Pool')notify('Address pool refreshed');}if(event.target.id==='reset'){root.querySelectorAll('[data-filter]').forEach(el=>el.value='');render();}if(event.target.dataset.details!==undefined){const row=def.rows[Number(event.target.dataset.details)];detail(selectedTab==='Transactions'?'Transaction Details':'Event Details',Object.fromEntries(row.map((value,i)=>[def.columns[i],value])));}};render();
  }
  const reports=[['2026-11-01','Daily','Cobo / Funding','USDT','Provider','12,500.00','3,200.00','Collected'],['2026-11-01','Daily','Bank Wire / AED','AED','Account','24,000.00','8,000.00','Collected'],['2026-11-02','Daily','Cobo / Funding','USDT','Provider','1,250.00','320.00','Processing']];
  function reconciliation(){
    document.title='Reconciliation Reports';
    const columns=['Report date (UTC)','Type','Provider / Account','Currency','Source','Deposits','Withdrawals (net)','Collection status','Actions'];
    root.innerHTML=`<div class="head"><div><h1>Reconciliation Reports</h1><p>Review daily provider and account reconciliation reports</p></div><button id="settings">Notification Settings</button></div><div class="filters">${select('Type',['Daily'])}${input('Start Time','','date')}${input('End Time','','date')}${select('Provider / Account',['Cobo / Funding','Bank Wire / AED'])}${select('Currency',['USDT','AED','USD'])}<button id="reset">Reset</button></div><div id="reports"></div>`;
    const render=()=>{const controls=[...root.querySelectorAll('[data-filter]')];const rows=reports.filter(row=>controls.every(el=>!el.value||(el.dataset.filter==='Start Time'?row[0]>=el.value:el.dataset.filter==='End Time'?row[0]<=el.value:row.includes(el.value))));document.getElementById('reports').innerHTML=table(columns,rows.map(row=>[...row.map((value,i)=>i===7?badge(value):esc(value)),`<button class="link" data-report="${reports.indexOf(row)}">View</button>`]));};
    root.oninput=render;root.onchange=render;root.onclick=event=>{
      if(event.target.id==='reset'){root.querySelectorAll('[data-filter]').forEach(el=>el.value='');render();}
      if(event.target.dataset.report!==undefined){const row=reports[Number(event.target.dataset.report)];detail('Report Details',Object.fromEntries(row.map((value,i)=>[columns[i],value])));}
      if(event.target.id==='settings')modal('Notification Settings',`<label>Email<input id="notify-email" type="email" value="${esc(state.notifications.email)}"></label><label>Send time (UTC)<input id="notify-time" type="time" value="${esc(state.notifications.time)}"></label><label>Notifications<select id="notify-enabled"><option value="true" ${state.notifications.enabled?'selected':''}>Enabled</option><option value="false" ${!state.notifications.enabled?'selected':''}>Disabled</option></select></label>`,()=>{const email=document.getElementById('notify-email');if(!email.checkValidity()||!email.value)return email.reportValidity();const next=JSON.parse(JSON.stringify(state));next.notifications={email:email.value,time:document.getElementById('notify-time').value,enabled:document.getElementById('notify-enabled').value==='true'};if(save(next)){dialog.close();notify('Notification settings saved');}});
    };render();
  }
  if(file==='account-dormant.html')dormant();else if(file==='cobo.html')cobo();else reconciliation();
})();
