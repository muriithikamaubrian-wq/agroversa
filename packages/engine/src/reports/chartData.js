// Shapes recorded data for the report graphs and the records table.
const byDate=(L,f)=>{const m={};L.forEach(p=>m[p.d]=(m[p.d]||0)+f(p));return Object.entries(m).sort((a,b)=>a[0]<b[0]?-1:1)},sd=t=>String(t).split(',')[0];
const pRange=()=>{const days=PR=='all'?0:+PR;return D.perf.filter(p=>(PG=='all'||p.gid==PG)&&(!days||(dd(p.d)>-days&&dd(p.d)<=0)))};
const pSum=L=>{const m={};L.forEach(p=>{const x=ou(p);m[x.b]=(m[x.b]||0)+x.q});const o=[];if(m.tray)o.push(trays(m.tray*30));if(m.kg)o.push(f2(m.kg)+' kg');if(m.L)o.push(f2(m.L)+' L');return L.length?`${L.length} record${L.length>1?'s':''}${o.length?' · '+o.join(' · '):''}`:'No records in this period'};
const ddm=t=>p2(t.getDate())+'/'+p2(t.getMonth()+1),inRange=k=>RT=='all'||(dd(k)>-(+RT)&&dd(k)<=0),avgByDate=L=>{const m={};L.forEach(r=>(m[r[0]]=m[r[0]]||[]).push(r[1]));return Object.entries(m).map(([k,a])=>[k,a.reduce((s,v)=>s+v,0)/a.length])},dIso=s=>{const t=new Date(s);return isNaN(t)?'':iso(t)};
