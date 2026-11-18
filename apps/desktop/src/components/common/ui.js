// Small shared interface helpers.
const chips=()=>Object.entries(SEC).slice(1).map(([k,v])=>`<a class="chip" href="#${k}">${v}</a>`).join('');
function tg(id,b){const e=document.getElementById('d_'+id);e.hidden=!e.hidden;b.classList.toggle('open',!e.hidden);b.setAttribute('aria-expanded',String(!e.hidden))}
