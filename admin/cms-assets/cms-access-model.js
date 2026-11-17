/* Static CMS review model. No QA API calls or real account credentials. */
(function(root){
'use strict';
const subset=(a,b)=>a.every(x=>b.includes(x));
function descendants(roles,id){const found=new Set();const walk=x=>roles.filter(r=>r.parent===x).forEach(r=>{if(!found.has(r.id)){found.add(r.id);walk(r.id);}});walk(id);return [...found];}
function validateRole(roles,candidate,resourceIds){
 if(!candidate.name.trim())return {code:'name'};
 if(roles.some(r=>r.id!==candidate.id&&r.name.trim().toLowerCase()===candidate.name.trim().toLowerCase()))return {code:'duplicate'};
 const original=roles.find(r=>r.id===candidate.id);
 if(original?.system && (candidate.parent || !candidate.enabled || !subset(resourceIds,candidate.permissions)))return {code:'system'};
 if(candidate.parent===candidate.id||descendants(roles,candidate.id).includes(candidate.parent))return {code:'cycle'};
 const parent=roles.find(r=>r.id===candidate.parent);
 if(candidate.parent&&!parent)return {code:'parent'};
 if(parent&&!subset(candidate.permissions,parent.permissions))return {code:'excess',permissions:candidate.permissions.filter(p=>!parent.permissions.includes(p))};
 if(!subset(candidate.permissions,resourceIds))return {code:'resource'};
 const children=roles.filter(r=>r.parent===candidate.id&&!subset(r.permissions,candidate.permissions));
 if(children.length)return {code:'children',roles:children.map(r=>r.name)};
 return null;
}
function effective(roles,id,seen=new Set()){
 const role=roles.find(r=>r.id===id);if(!role||!role.enabled||seen.has(id))return [];
 if(!role.parent)return role.permissions;
 seen.add(id);const upper=effective(roles,role.parent,seen);return role.permissions.filter(p=>upper.includes(p));
}
function userPermissions(user,roles){return [...new Set(user.roles.flatMap(id=>effective(roles,id)))];}
function filterUsers(users,roles,{q='',valid=false,permission='',role=''}={}){return users.filter(u=>u.username.toLowerCase().includes(q.toLowerCase())&&(!valid||(u.enabled&&userPermissions(u,roles).length>0))&&(!permission||userPermissions(u,roles).includes(permission))&&(!role||u.roles.includes(role)));}
const api={subset,descendants,validateRole,effective,userPermissions,filterUsers};
if(typeof module!=='undefined')module.exports=api;else root.CMSAccessModel=api;
})(globalThis);
