/* CAMINHOS — Sucessao familiar e arvore de geracoes. */
(function(){
'use strict';
const GIVEN=['Ana','Arthur','Beatriz','Bruno','Caio','Clara','Daniel','Davi','Eduarda','Elisa','Felipe','Gabriel','Helena','Isabela','João','Júlia','Laura','Lucas','Mariana','Mateus','Miguel','Pedro','Rafael','Sofia','Valentina','Vitória'];
const esc=v=>escapeHTML(String(v??''));
const rnd=(lo,hi)=>Math.floor(Math.random()*(hi-lo+1))+lo;
const find=(d,id)=>d.members.find(x=>x.id===id);
function ensure(g){
 if(!g)return null;
 if(!g.extra||typeof g.extra!=='object')g.extra={};
 let d=g.extra.dynasty;
 if(!d||typeof d!=='object'||!Array.isArray(d.members)){
  d={version:1,year:g.age,nextId:2,rootId:1,activeId:1,transitions:0,
    members:[{id:1,name:g.name,parentId:null,birthYear:0,age:g.age,generation:1,alive:!!g.alive,children:[]}],
    pastLives:[]};
  g.extra.dynasty=d;
 }
 if(!Number.isFinite(d.year))d.year=g.age;
 if(!Number.isInteger(d.nextId))d.nextId=2;
 if(!Array.isArray(d.pastLives))d.pastLives=[];
 const maxId=Math.max(0,...d.members.map(p=>Number(p.id)||0));
 d.nextId=Math.max(d.nextId,maxId+1);
 const active=find(d,d.activeId);
 if(active){
  active.name=g.name;
  active.age=g.age;
  active.birthYear=d.year-g.age;
  if(!g.alive)active.alive=false;
  if(!Array.isArray(active.children))active.children=[];
 }
 // Legacy saves only counted children. Give them persistent family entries
 // without changing the parent's actual progress.
 if(active&&g.children>active.children.length){
  const surname=g.name.split(/\s+/).slice(-1)[0]||'Silva';
  for(let i=active.children.length;i<Math.min(g.children,12);i++){
   const id=d.nextId++,childAge=Math.max(0,g.age-19-(i*3));
   const name=GIVEN[(id*7+i)%GIVEN.length]+' '+surname;
   d.members.push({id,name,parentId:active.id,birthYear:d.year-childAge,age:childAge,generation:active.generation+1,alive:true,children:[]});
   active.children.push(id);
   if(!g.people.some(p=>p.name===name))g.people.push({id:Math.max(0,...g.people.map(p=>Number(p.id)||0))+1,name,role:'Filho(a)',emoji:'👶',bond:rnd(55,85)});
  }
 }
 return d;
}
function birth(g){
 const d=ensure(g),p=find(d,d.activeId);if(!p)return '';
 const id=d.nextId++,last=p.name.split(/\s+/).slice(-1)[0]||'Silva';
 const name=GIVEN[(id*11+rnd(0,25))%GIVEN.length]+' '+last;
 d.members.push({id,name,parentId:p.id,birthYear:d.year,age:0,generation:p.generation+1,alive:true,children:[]});
 p.children.push(id);g.children=p.children.length;
 g.people.push({id:Math.max(0,...g.people.map(x=>Number(x.id)||0))+1,name,role:'Filho(a)',emoji:'👶',bond:rnd(70,92)});
 return name;
}
function onAnnual(g){
 const d=ensure(g);if(!d)return;
 d.year++;
 for(const p of d.members){
  p.age=Math.max(0,d.year-p.birthYear);
  if(p.id===d.activeId){p.age=g.age;p.birthYear=d.year-g.age;continue}
  if(!p.alive)continue;
  if(p.age>=78&&Math.random()<Math.min(.85,(p.age-76)*.018))p.alive=false;
 }
 // Familiares adultos formam suas proprias familias: netos, bisnetos etc.
 const newborn=[];
 for(const p of d.members.filter(p=>p.id!==d.activeId&&p.alive&&p.age>=24&&p.age<=43)){
  if(d.members.length+newborn.length>=100)break;
  if((p.children||[]).length>=3||Math.random()>.08)continue;
  const id=d.nextId++,surname=p.name.split(/\s+/).slice(-1)[0]||'Silva';
  const name=GIVEN[(id*9+Math.round(d.year))%GIVEN.length]+' '+surname;
  const child={id,name,parentId:p.id,birthYear:d.year,age:0,generation:p.generation+1,alive:true,children:[]};
  p.children.push(id);newborn.push(child);
  if(p.parentId===d.activeId)noteAnnual('Um neto nasceu',p.name+' teve um bebê chamado '+name+'. A família cresceu!');
 }
 d.members.push(...newborn);
}
function recordDeath(g){
 const d=ensure(g),p=find(d,d.activeId);
 if(p){p.alive=false;p.age=g.age;}
 if(!d.pastLives.some(x=>x.id===d.activeId)){
  d.pastLives.push({id:d.activeId,name:g.name,age:g.age,generation:p?.generation||1,job:g.job,deathYear:d.year});
 }
}
function candidates(g){
 const d=ensure(g);
 return d.members.filter(p=>p.id!==d.activeId&&p.parentId!==null&&p.alive).sort((a,b)=>a.generation-b.generation||b.age-a.age);
}
function relationship(d,p){
 const active=find(d,d.activeId);
 let anc=p,count=0;
 while(anc&&anc.parentId&&count<20){
  count++;
  if(anc.parentId===active?.id){
   return count===1?'Filho(a)':count===2?'Neto(a)':count===3?'Bisneto(a)':count===4?'Trineto(a)':'Descendente de '+count+'ª geração';
  }
  anc=find(d,anc.parentId);
 }
 return 'Parente da linhagem • geração '+p.generation;
}
function profile(g,p){
 const d=ensure(g);
 return '<article class="heir-card"><span class="heir-icon">👤</span><div><strong>'+esc(p.name)+'</strong><small>'+esc(relationship(d,p))+' · '+p.age+' ano(s)</small></div>'+
 '<button type="button" class="secondary-button" data-act="inherit" data-id="'+p.id+'">Continuar →</button></article>';
}
function render(g){
 const d=ensure(g),live=candidates(g);
 return '<div class="diary-heading"><span>🌳 LEGADO DA FAMÍLIA</span><strong>Árvore de gerações</strong><p>Uma vida termina, mas a história pode continuar com um descendente.</p></div>'+
 '<div class="achieve-summary"><strong>'+d.members.length+' familiares</strong><span>'+d.transitions+' sucessões · '+d.pastLives.length+' vidas encerradas · '+live.length+' herdeiros vivos</span></div>'+
 '<div class="section-title">Linhas de descendência</div><div class="heir-list">'+
 d.members.slice().sort((a,b)=>a.generation-b.generation||a.id-b.id).map(p=>'<div class="family-tree-item" style="--generation:'+Math.min(6,p.generation-1)+'"><span>'+(p.alive?'🌿':'🕊️')+'</span><div><strong>'+esc(p.name)+'</strong><small>Geração '+p.generation+' · '+p.age+' ano(s)'+(p.id===d.activeId?' · Personagem atual':'')+'</small></div></div>').join('')+'</div>'+
 (g.alive?'<div class="notice">Enquanto seu personagem estiver vivo, você poderá conhecer a família. Ao morrer, escolha um herdeiro para continuar.</div>':
 '<div class="section-title">Escolha quem continuará</div>'+(live.length?'<div class="heir-list">'+live.map(p=>profile(g,p)).join('')+'</div>':'<div class="notice">Não há descendentes vivos nesta linhagem. A história da família terminou, mas as conquistas da sua conta continuam.</div>'));
}
function chooseHeir(g,id){
 if(!g||g.alive)return false;
 recordDeath(g);
 const d=ensure(g),heir=candidates(g).find(p=>p.id===Number(id));if(!heir)return false;
 const old={name:g.name,age:g.age,cash:g.cash,savings:g.savings,properties:g.properties};
 const keepAssets=(g.extra.assetInventory||[]).map(x=>({...x}));
 const keepPets=(g.extra.pets||[]).filter(p=>p.health>20).map(x=>({...x}));
 d.activeId=heir.id;d.transitions++;
 g.name=heir.name;g.age=heir.age;g.alive=true;g.actions=3;g.job=null;g.jobYears=0;
 g.university=null;g.degree=[];g.partnerId=null;g.children=(heir.children||[]).length;
 g.cash=Math.max(0,Math.round(old.cash*.8));g.savings=Math.max(0,Math.round(old.savings*.8));g.properties=old.properties;
 g.stats={saude:rnd(65,85),felicidade:rnd(50,78),inteligencia:rnd(43,75),carisma:rnd(35,70),disciplina:rnd(40,75)};
 g.people=d.members.filter(p=>p.id!==heir.id&&p.alive&&(p.parentId===heir.id||p.id===heir.parentId||p.parentId===heir.parentId)).slice(0,35)
 .map((p,i)=>({id:i+1,name:p.name,role:p.parentId===heir.id?'Filho(a)':p.id===heir.parentId?'Pai/Mãe':'Parente',emoji:'👨‍👩‍👧',bond:rnd(45,85)}));
 g.extra=extraData({});g.extra.dynasty=d;g.extra.assetInventory=keepAssets;g.extra.pets=keepPets;
 g.extra.assetSequence=keepAssets.reduce((m,x)=>Math.max(m,x.id+1),1);
 g.history=[{age:g.age,title:'O legado continua',description:'Depois da morte de '+old.name+' aos '+old.age+' anos, você assumiu a vida de '+heir.name+', geração '+heir.generation+' da família.'}];
 g.lastEvent=g.history[0].description;g.pendingEvent=null;g.lastAIYear=-1;
 // Children remain visible; school and other game systems are rebuilt by save().
 return true;
}
window.CaminhosDynasty={ensure,birth,onAnnual,recordDeath,candidates,render,chooseHeir,relationship};
})();