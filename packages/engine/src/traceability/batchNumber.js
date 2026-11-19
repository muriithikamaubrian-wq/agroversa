// Batch numbers such as B.S-001-151126 (SC. prefix for scaled feeds).
const ini=s=>s.trim().split(/\s+/).map(w=>w[0].toUpperCase()).join('.'),ddmmyy=()=>{const d=new Date();return p2(d.getDate())+p2(d.getMonth()+1)+String(d.getFullYear()).slice(2)};
