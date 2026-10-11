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
  if(p.age>=78&&Math.random()<Math.min(.85,(p.age-76)*.018)){distributeMemberEstate(g,p,false);}
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
// Cada personagem mantem seu proprio patrimonio. Um neto nao recebe bens do
// avo diretamente enquanto o pai/mae daquela linha estiver vivo.
function emptyEstate(){return {cash:0,savings:0,properties:0,assets:[],debt:0}}
function estateOf(member){
 if(!member.estate||typeof member.estate!=='object')member.estate=emptyEstate();
 if(!Array.isArray(member.estate.assets))member.estate.assets=[];
 return member.estate;
}
function cloneAsset(a){return {...a}}
function grossEstate(e){
 const approx=e.assets.reduce((sum,a)=>sum+Math.max(0,Number(a.basisValue)||0)*(Number.isFinite(a.share)?a.share:1),0);
 return Math.max(0,e.cash)+Math.max(0,e.savings)+Math.max(0,e.properties)*75000+approx;
}
function snapshot(g){
 const assets=(g.extra?.assetInventory||[]).map(a=>{
  const current=window.CaminhosExtras?.worth?.(a,g);
  const fraction=Number.isFinite(a.share)?a.share:1;
  return {...a,basisValue:fraction>0?Math.round((current||0)/fraction):0};
 });
 const cash=Math.max(0,Number(g.cash)||0);
 const savings=Math.max(0,Number(g.savings)||0);
 const properties=Math.max(0,Number(g.properties)||0);
 const debt=Math.max(0,(Number(g.extra?.everyday?.debt)||0)+Math.max(0,-(Number(g.cash)||0)));
 return {cash,savings,properties,assets,debt:Math.min(debt,cash+savings+properties*75000+assets.reduce((sum,a)=>sum+Math.max(0,Number(a.basisValue)||0)*(Number(a.share)||1),0))};
}
function heirsForBranch(d,member){
 const children=(member.children||[]).map(id=>find(d,id)).filter(Boolean);
 return children.filter(c=>c.alive||heirsForBranch(d,c).length>0);
}
function allocatePart(e,ratio){
 return {cash:e.cash*ratio,savings:e.savings*ratio,properties:e.properties*ratio,
   debt:e.debt*ratio,assets:e.assets.map(a=>({...a,share:(Number.isFinite(a.share)?a.share:1)*ratio}))};
}
function addToEstate(target,portion){
 target.cash+=portion.cash;target.savings+=portion.savings;target.properties+=portion.properties;
 target.debt+=portion.debt;target.assets.push(...portion.assets.map(cloneAsset));
}
function applyToPlayer(g,portion){
 g.cash+=portion.cash;g.savings+=portion.savings;g.properties+=portion.properties;
 if(!g.extra.assetInventory)g.extra.assetInventory=[];
 if(!Number.isInteger(g.extra.assetSequence))g.extra.assetSequence=1;
 for(const asset of portion.assets){
  g.extra.assetInventory.push({...cloneAsset(asset),id:g.extra.assetSequence++,age:g.age});
 }
 if(!g.extra.everyday)g.extra.everyday={};
 g.extra.everyday.debt=(g.extra.everyday.debt||0)+portion.debt;
}
function allocateBranch(d,person,portion,g,ledger,depth=0){
 if(depth>25)return;
 if(person.alive){
  if(person.id===d.activeId&&g.alive){applyToPlayer(g,portion)}
  else addToEstate(estateOf(person),portion);
  ledger.push({id:person.id,name:person.name,amount:portion.cash+portion.savings+portion.properties*75000,
   debt:portion.debt,assets:portion.assets.length});
  return;
 }
 const branches=heirsForBranch(d,person);
 if(!branches.length)return;
 for(const branch of branches)allocateBranch(d,branch,allocatePart(portion,1/branches.length),g,ledger,depth+1);
}
function distributeMemberEstate(g,member,sourceActive){
 if(member.estateDistributed)return member.inheritanceSummary||null;
 const d=ensure(g);
 // Fotografia dos bens no instante da morte; as propriedades de parentes
 // nao sao misturadas com a conta bancária do personagem jogavel.
 const e=sourceActive?snapshot(g):estateOf(member);
 member.alive=false;
 member.estateDistributed=true;
 const heirs=heirsForBranch(d,member);
 const ledger=[];
 if(heirs.length){
  for(const heir of heirs)allocateBranch(d,heir,allocatePart(e,1/heirs.length),g,ledger);
 }
 member.inheritanceSummary={from:member.name,heirs:ledger,branches:heirs.length,
   gross:grossEstate(e),debt:e.debt,unclaimed:heirs.length===0};
 member.estate=emptyEstate();
 if(sourceActive){
  d.lastInheritance=member.inheritanceSummary;
 }else if(ledger.some(x=>x.id===d.activeId)){
  const amount=ledger.filter(x=>x.id===d.activeId).reduce((s,x)=>s+x.amount,0);
  noteAnnual('Herança familiar',member.name+' faleceu e você recebeu sua parte da herança: '+brl(amount)+'.');
 }
 return member.inheritanceSummary;
}
function inheritanceFor(g,id){
 const d=ensure(g),p=find(d,id);
 if(!p)return null;
 // Esta carteira pertence exclusivamente ao personagem. Se o pai estiver
 // vivo, o neto nao recebe a parte pertencente a ele.
 return estateOf(p);
}
function recordDeath(g){
 const d=ensure(g),p=find(d,d.activeId);
 if(p){p.age=g.age;distributeMemberEstate(g,p,true)}
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
 const d=ensure(g),heir=candidates(g).find(p=>p.id===Number(id));
 if(!heir)return false;
 const old={name:g.name,age:g.age};
 // Somente bens pertencentes ao herdeiro; nada de herdar o avo novamente
 // nem receber antecipadamente o patrimonio de um pai vivo.
 const estate=inheritanceFor(g,heir.id);
 const inherited={cash:estate.cash,savings:estate.savings,properties:estate.properties,
   debt:estate.debt,assets:estate.assets.map(cloneAsset)};
 heir.estate=emptyEstate();
 d.activeId=heir.id;d.transitions++;
 g.name=heir.name;g.age=heir.age;g.alive=true;g.actions=3;g.job=null;g.jobYears=0;
 g.university=null;g.degree=[];g.partnerId=null;g.children=(heir.children||[]).length;
 g.cash=inherited.cash;g.savings=inherited.savings;g.properties=inherited.properties;
 g.stats={saude:rnd(65,85),felicidade:rnd(50,78),inteligencia:rnd(43,75),carisma:rnd(35,70),disciplina:rnd(40,75)};
 g.people=d.members.filter(p=>p.id!==heir.id&&p.alive&&(p.parentId===heir.id||p.id===heir.parentId||p.parentId===heir.parentId)).slice(0,35)
 .map((p,i)=>({id:i+1,name:p.name,role:p.parentId===heir.id?'Filho(a)':p.id===heir.parentId?'Pai/Mãe':'Parente',emoji:'👨‍👩‍👧',bond:rnd(45,85)}));
 g.extra=extraData({});g.extra.dynasty=d;
 g.extra.assetInventory=inherited.assets.map((a,i)=>({...a,id:i+1,age:g.age}));
 g.extra.assetSequence=inherited.assets.length+1;
 if(!g.extra.everyday)g.extra.everyday={};
 g.extra.everyday.debt=inherited.debt;
 const inheritValue=Math.max(0,inherited.cash+inherited.savings+inherited.properties*75000+
 inherited.assets.reduce((sum,a)=>sum+(a.basisValue||0)*(a.share??1),0)-inherited.debt);
 g.history=[{age:g.age,title:'O legado continua',description:'Depois da morte de '+old.name+' aos '+old.age+' anos, você assumiu '+heir.name+', geração '+heir.generation+'. Patrimônio pessoal herdado: '+brl(inheritValue)+'. O patrimônio de parentes vivos continua com eles.'}];
 g.lastEvent=g.history[0].description;g.pendingEvent=null;g.lastAIYear=-1;
 return true;
}
window.CaminhosDynasty={ensure,birth,onAnnual,recordDeath,candidates,render,chooseHeir,relationship,inheritanceFor,distributeMemberEstate};
})();