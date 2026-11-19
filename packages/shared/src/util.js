// Small helpers shared everywhere: ids, escaping, dates, number formatting.
const $=s=>document.querySelector(s),f2=v=>(+v||0).toFixed(2),E=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,9);
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const dc=decodeURIComponent,q=s=>encodeURIComponent(s).replace(/'/g,'%27'),storeOK=()=>{try{localStorage.setItem('av_t','1');return true}catch(e){return false}};
const p2=n=>String(n).padStart(2,'0'),iso=d=>`${d.getFullYear()}-${p2(d.getMonth()+1)}-${p2(d.getDate())}`,dd=k=>Math.round((new Date(k+'T00:00')-new Date(iso(new Date())+'T00:00'))/864e5);
const rel=n=>n<0?`${-n} day${n==-1?'':'s'} overdue`:n==0?'today':n==1?'tomorrow':`in ${n} days`,MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
