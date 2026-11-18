// Draws the current screen and starts the app.
function render(){applyTheme();const r=$('#root');if(!U||!users().some(u=>u.un==U)){U=null;r.innerHTML=authView();$('#af').onsubmit=e=>submitAuth(e).catch(x=>setErr({form:'Something went wrong: '+((x&&x.message)||x)}));$('#af').oninput=reqCheck;reqCheck();return}
if(!D)load();const h=location.hash.slice(1),s=(SEC[h]||h=='notifications'||h=='preferences')?h:'dashboard';r.innerHTML=shell(V[s](),s);if(QAP&&s=='productivity'){QAP=false;qaChoose()}}
addEventListener('hashchange',()=>{MSG='';SCS=false;NEWF=false;if(U)render()});
render();