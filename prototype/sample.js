(function(){
const ks=['career','finance','health','family','romance','fun','growth','spirituality','home','contribution'];
const oct={id:'2026-10',month:'2026-10',career:7,finance:6,health:5,family:8,romance:4,fun:6,growth:7,spirituality:7,home:6,contribution:5};
const nov={id:'2026-11',month:'2026-11',career:8,finance:6,health:6,family:8,romance:5,fun:7,growth:8,spirituality:8,home:7,contribution:6,win:'Signed two new clients for the 100-Day Build',god:'Peace during a stressful launch week',focus:'Move my body 4x a week'};
const days=[];for(let d=1;d<=21;d++){if(d%5===0)continue;const r={id:'2026-11-'+String(d).padStart(2,'0'),date:'2026-11-'+String(d).padStart(2,'0'),energy:3+(d%3)};ks.forEach((k,i)=>{r[k]=((d*7+i*3)%10)<6;});if(d===20)r.win='Morning walk + prayer before emails';days.push(r);}
window.SAMPLE={checkins:[oct,nov],goals:[{id:'career',goal:'Hit $20k months consistently',action:'Send 3 proposals'},{id:'health',goal:'Strong and energized',action:'Lift 3x a week'}],days,
weeks:[{id:'2026-11-02',week:'2026-11-02',score:6,win:'Launched the new offer page'},{id:'2026-11-09',week:'2026-11-09',score:7},{id:'2026-11-16',week:'2026-11-16',score:8,win:'Best sales week this year'}],
wins:[{id:'w1',text:'Booked a podcast guest spot',date:'2026-11-18',area:'career'},{id:'w2',text:'Said no to a project that drained me',date:'2026-11-12',area:'growth'}],
memories:[{id:'m1',date:'2026-11-15',title:'Sunset swim with the girls',note:'Laughed until my stomach hurt',imageId:'p0'},{id:'m2',date:'2026-11-08',title:'Sunday at church',note:'Felt so held',imageId:'p2'}],
letgo:[{id:'l1',text:'Scrolling before bed',instead:'Reading or prayer before bed',date:'2026-11-10',released:false},{id:'l2',text:'Saying yes to every client',date:'2026-11-01',released:true,releasedOn:'2026-11-14'}],
dream:[{id:'state',unlocked:true,name:'Hannah'},{id:'y1',photos:['p1','p3','p4','p5'],who:'I am a woman who runs a calm, profitable business',feel:'Peaceful, confident, free',day:'I wake up slow, pray, then create',step:'Block Friday afternoons for CEO time'}]};
})();
