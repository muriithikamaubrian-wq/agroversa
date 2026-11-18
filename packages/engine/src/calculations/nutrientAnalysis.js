// Nutrient totals, cost and feasibility (below a minimum = not feasible).
const syncN=()=>{N.length=0;D.nut.forEach(n=>N.push([n.k,n.l,n.u]))};
function calc(F){const a=A(F.an),ing=D.ing.filter(i=>F.sel[i.id]),x=i=>+F.x[i.id]||0,t={};N.forEach(([k])=>t[k]=ing.reduce((s,i)=>s+x(i)/100*i[k],0));
const cost=ing.reduce((s,i)=>s+x(i)/100*i.pr,0),sum=ing.reduce((s,i)=>s+x(i),0),w=[];let ok=true;
if(!ing.length){w.push(['bad','Select at least one ingredient.']);ok=false}
if(ing.length&&Math.abs(sum-100)>.05){w.push(['bad',`Inclusion totals ${f2(sum)}%. It must be 100%.`]);ok=false}
ing.forEach(i=>{if(x(i)>i.max+1e-9){w.push(['warn',`${i.n} is above its ${i.max}% limit.`])}const need=x(i)/100*F.batch;if(need>i.stock+1e-9)w.push(['warn',`${i.n}: batch needs ${f2(need)} kg but stock is ${f2(i.stock)} kg.`])});
if(!a){w.push(['bad','Choose an animal and stage in Animals.']);ok=false}
else N.forEach(([k,l,u])=>{if(!a.r[k])return;const[lo,hi]=a.r[k];if(t[k]<lo-1e-9){w.push(['bad',`${l} is below the required ${u=='%'?'percentage':'level'}.`]);ok=false}else if(t[k]>hi+1e-9){w.push(['warn',`${l} is above the maximum of ${hi}.`])}});
return{A:a,ing,t,cost,sum,w,ok}}
