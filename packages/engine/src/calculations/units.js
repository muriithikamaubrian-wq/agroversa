// Output units: kg, g, tonne, mL, L, eggs, trays (30 eggs) and how they are shown.
const ou=p=>{const[b,f]=UN[p.u||'kg'];return{b,q:p.o*f}},pf=p=>{const x=ou(p);return x.q>0&&p.f>0?`${f2(p.f/x.q)} kg per ${x.b}`:'—'};
const trays=n=>{n=Math.round(n);const t=Math.floor(n/30),e=n%30;return(t?`${t} tray${t==1?'':'s'}`:'')+(t&&e?' ':'')+(e||!t?`${e} egg${e==1?'':'s'}`:'')};
const outStr=p=>p.u=='egg'?`${p.o} eggs (${trays(p.o)})`:`${p.o} ${UL[p.u||'kg']}`;
