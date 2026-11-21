(function(){
const store=window.SAMPLE;const calcs={};const draws={};const ons=[];
const memo={};
function data(id){if(store[id])return{status:'ok',data:store[id]};const c=calcs[id];if(!c)return{status:'missing',data:[]};if(!(id in memo)){memo[id]=c.fn(...c.inputs.map(i=>data(i).data));}return{status:'ok',data:memo[id]};}
function runDraws(){for(const [n,fn] of Object.entries(draws)){document.querySelectorAll(`[data-draw=${n}]`).forEach(el=>{if(el.closest('[hidden]'))return;try{fn(el)}catch(e){console.error(n,e)}});}}
window.dash={data,calc:(id,o)=>{calcs[id]=o;},draw:(n,fn)=>{if(fn)draws[n]=typeof fn==='function'?fn:(el)=>{const m=fn.mount?fn.mount(el):null;fn.update&&fn.update(el,m);};else runDraws();},onData:(fn)=>{ons.push(fn);},colors:['#B1E287'],setLink:()=>{},params:()=>({})};
window.claude={use:()=>Promise.resolve(null)};
window.__run=()=>{ons.forEach(f=>f());runDraws();};
})();
