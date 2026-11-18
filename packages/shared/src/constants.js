// Fixed lists: default nutrients, units, sections, stage-duration days.
const DN=[['cp','Crude protein','%'],['me','Energy (ME)','kcal/kg'],['ca','Calcium','%'],['p','Phosphorus','%'],['lys','Lysine','%']];
const N=DN.map(x=>x.slice());
const SEC={dashboard:'Dashboard',animals:'Animals',inventory:'Inventory',formulations:'Formulations',productivity:'Productivity',reports:'Reports'};
const UN={g:['kg',.001],kg:['kg',1],t:['kg',1000],mL:['L',.001],L:['L',1],egg:['tray',1/30],tray:['tray',1]},UL={g:'g',kg:'kg',t:'tonne',mL:'mL',L:'L',egg:'eggs',tray:'trays'};
const DAYS={day:1,week:7,month:30},durTxt=a=>a&&a.dur?`${a.dur.f} ${a.dur.fu}${a.dur.f==1?'':'s'} to ${a.dur.t} ${a.dur.tu}${a.dur.t==1?'':'s'}`:'';
