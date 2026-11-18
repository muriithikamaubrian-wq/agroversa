// Pop-up windows and the delete confirmation.
function modal(h,w){const m=document.getElementById('md');m.innerHTML=`<div class="mb" role="dialog" aria-modal="true" style="${w?'width:min(880px,100%)':''}">${h}</div>`;m.classList.add('on');const f=m.querySelector('input:not([type=hidden]),button');f&&f.focus()}
function closeM(){const m=document.getElementById('md');m.classList.remove('on');m.innerHTML=''}
addEventListener('keydown',e=>{if(e.key=='Escape')closeM()});
function ask(msg,fn,arg){modal(`<p>${E(msg)}</p><div class="row" style="justify-content:flex-end"><button onclick="closeM()">Cancel</button><button class="pri" style="background:var(--bad);border-color:var(--bad)" onclick="closeM();${fn}('${arg}')">Delete</button></div>`)}
