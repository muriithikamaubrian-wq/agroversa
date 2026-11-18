// Feed intake in kg or g, days feed lasts, FCR.
function intakeOn(g,d){const r=D.perf.filter(p=>p.gid==g.id&&p.fd&&p.d<=d).sort((a,b)=>a.d<b.d?1:-1)[0];return r?r.fd:(g.fd||0)}
function fcrData(g){const W=(D.wt||[]).filter(w=>w.gid==g.id).sort((a,b)=>a.d<b.d?-1:1);if(W.length<2)return[];const o=[];for(let i=1;i<W.length;i++){let feed=0;for(let t=new Date(W[0].d+'T00:00');t<new Date(W[i].d+'T00:00');t=new Date(t.getTime()+864e5))feed+=intakeOn(g,iso(t));const gain=(W[i].w-W[0].w)*g.n;if(gain>0&&feed>0)o.push([`Wk ${Math.round((new Date(W[i].d)-new Date(g.d))/6048e5)}`,feed/gain])}return o}
const intakeKg=(v,u,n)=>u=='flock'?v:u=='kg'?v*n:v*n/1000;
