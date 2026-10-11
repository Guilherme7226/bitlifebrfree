/* CAMINHOS: personagens 2D, pets e trajetorias politicas/criminais.
   Ficcao interativa: sem procedimentos para atividades ilegais reais. */
(function(){
'use strict';
const POLITICS=[
 {id:'vereador',name:'Vereador',cost:9000,age:18,stat:40,requires:null},
 {id:'prefeito',name:'Prefeito',cost:35000,age:21,stat:53,requires:'vereador'},
 {id:'governador',name:'Governador',cost:145000,age:30,stat:70,requires:'prefeito'},
 {id:'presidente',name:'Presidente da República',cost:400000,age:35,stat:83,requires:'governador'}
];
const PETS=[
 {id:'cachorro',name:'Cachorro',icon:'🐕',adopt:0,buy:850,max:17},
 {id:'gato',name:'Gato',icon:'🐈',adopt:0,buy:600,max:19},
 {id:'coelho',name:'Coelho',icon:'🐇',adopt:0,buy:250,max:12},
 {id:'passaro',name:'Pássaro',icon:'🐦',adopt:0,buy:380,max:17},
 {id:'peixe',name:'Peixe',icon:'🐠',adopt:0,buy:95,max:9}
];
const CRIMES=[
 {id:'furto',name:'Furto',amount:[200,1900],risk:.33,penalty:[1,3],fine:900,stage:'ladrao'},
 {id:'roubo',name:'Roubo',amount:[2500,13000],risk:.58,penalty:[3,7],fine:6000,stage:'ladrao'},
 {id:'trafico',name:'Tráfico fictício',amount:[4500,22000],risk:.67,penalty:[5,12],fine:12000,stage:'traficante'}
];
const FIRST=['Adriana','Alice','Antônio','Beatriz','Bruna','Caio','Carlos','Daniela','Davi','Eduardo','Elisa','Fernanda','Gabriel','Helena','Igor','Isabela','João','Júlia','Larissa','Leandro','Luana','Marcos','Marina','Mateus','Nina','Paula','Rafael','Raquel','Renato','Sofia','Thiago','Vitória'];
const LAST=['Almeida','Barbosa','Costa','Ferreira','Gomes','Lima','Martins','Mendes','Oliveira','Ribeiro','Rocha','Santos','Silva','Souza'];
const hash=v=>{let h=2166136261;for(const c of String(v)){h=Math.imul(h^c.charCodeAt(0),16777619)}return h>>>0};
const clamp100=v=>Math.min(100,Math.max(0,Number(v)||0));
const text=v=>escapeHTML(String(v??''));
function ensure(g){
 if(!g)return;
 if(!g.extra||typeof g.extra!=='object')g.extra={};
 const e=g.extra;
 if(!e.politics2||typeof e.politics2!=='object')e.politics2={integrity:65,experience:[],scandals:0,evidence:0,barredUntil:0,loyalty:40};
 const p=e.politics2;
 if(!Array.isArray(p.experience))p.experience=[];
 if(e.office&&!p.experience.includes(e.office))p.experience.push(e.office); // previous political victories
 if(!Array.isArray(e.pets))e.pets=[];
 if(!Number.isInteger(e.petSequence)||e.petSequence<1)e.petSequence=1;
 if(!e.crimeStory||typeof e.crimeStory!=='object')e.crimeStory={stage:null,level:0,attempts:0,cases:[],served:0,lastJudgement:''};
 if(!Array.isArray(e.crimeStory.cases))e.crimeStory.cases=[];
 if(!Array.isArray(g.people))g.people=[];
 for(const [idx,person] of g.people.entries()){
  if(typeof person.name!=='string'||!person.name.trim()){
   const z=hash('npc'+idx+g.name);
   person.name=FIRST[z%FIRST.length]+' '+LAST[(z>>>8)%LAST.length];
  }
 }
}
function portrait(name,role='',id=0,large=false){
 const h=hash(String(name)+'|'+String(role)+'|'+String(id));
 const skin=['#edbf99','#8c5135','#c98860','#f3d0ab','#ab6b47','#d9a375'][h%6];
 const shirt=['#526ad2','#1b998b','#c57645','#924bc4','#c15b79','#4d92a8','#bb8853'][(h>>>4)%7];
 const hair=['#22243c','#554032','#a06632','#2f2625','#5e352e','#b9a077'][(h>>>7)%6];
 const back=['#e3eafa','#e4f2ed','#f6ece5','#efe5f7','#e9f0f8'][(h>>>9)%5];
 const eyes=((h>>>13)%3)===1?'#513f36':'#252a40';
 const w=large?100:76;
 const glasses=((h>>>15)%5)===1;
 const curl=((h>>>20)%3)===1;
 const accessory=String(role).includes('Professor')?'<path d="M28 58h20" stroke="#f4cc48" stroke-width="5"/>':'';
 return '<svg viewBox="0 0 76 76" width="'+w+'" height="'+w+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Retrato 2D de '+text(name)+'" class="character-portrait">'+
 '<rect width="76" height="76" rx="15" fill="'+back+'"/>'+
 '<path d="M7 76q5-23 31-23t31 23" fill="'+shirt+'"/>'+
 '<rect x="33" y="47" width="10" height="11" rx="4" fill="'+skin+'"/>'+
 '<ellipse cx="38" cy="31" rx="19" ry="22" fill="'+skin+'"/>'+
 '<path d="M18 31q-2-22 15-24 24-7 28 20-7-6-12-11-10 10-30 11" fill="'+hair+'"/>'+
 (curl?'<circle cx="23" cy="13" r="6" fill="'+hair+'"/><circle cx="41" cy="10" r="6" fill="'+hair+'"/>':'')+
 '<ellipse cx="31" cy="32" rx="2" ry="3" fill="'+eyes+'"/><ellipse cx="46" cy="32" rx="2" ry="3" fill="'+eyes+'"/>'+
 '<path d="M33 45q5 4 10 0" fill="none" stroke="#965e55" stroke-width="2.3" stroke-linecap="round"/>'+
 (glasses?'<g fill="none" stroke="#39495a" stroke-width="2"><rect x="24" y="27" width="13" height="10" rx="3"/><rect x="40" y="27" width="13" height="10" rx="3"/><path d="M37 30h3"/></g>':'')+
 accessory+
 '</svg>';
}
function petPortrait(p){
 const source=PETS.find(x=>x.id===p.species);
 const icon=source?.icon||'🐾';
 const bg=['#dcedfa','#e9f6e5','#fff0e3','#f3ebfb'][hash(p.name)%4];
 return '<div class="pet-portrait" aria-label="'+text(p.name)+', '+text(source?.name||'animal')+'" style="background:'+bg+'"><span aria-hidden="true">'+icon+'</span></div>';
}
function jail(g,offence,years,fine=0){
 ensure(g);const e=g.extra;
 e.prison=Math.max(1,years);e.record=(e.record||0)+1;
 e.reputation=clamp100((e.reputation||30)-rand(18,35));
 e.crimeStory.lastJudgement='Condenação: '+offence+' — '+years+' ano(s) de prisão';
 e.crimeStory.cases=[];
 g.cash-=Math.min(Math.max(0,g.cash),fine);
 g.stats.felicidade=clamp100(g.stats.felicidade-22);
 g.stats.saude=clamp100(g.stats.saude-8);
 g.actions=0;
 // Incapacidade para ocupar cargo público ou manter emprego na prisão.
 e.office=null;e.officeYears=0;
 if(g.job){
  window.CaminhosPaths?.leave(g);
  g.job=null;g.jobYears=0;
 }
 if(e.company)e.company.level=Math.max(1,(e.company.level||1)-1);
 noteAnnual('Condenação judicial', 'Você recebeu uma sentença fictícia de '+years+' ano(s) por '+offence+'. Seu emprego/cargo público terminou e uma multa de '+brl(fine)+' foi aplicada.');
}
function prisonAnnual(g){
 ensure(g);const e=g.extra;
 if(e.prison>0){
  e.prison--;e.crimeStory.served++;
  g.actions=0;g.stats.felicidade=clamp100(g.stats.felicidade-4);
  if(e.prison===0)noteAnnual('Liberdade','Você cumpriu sua pena. Agora pode tentar reconstruir sua vida.');
  else noteAnnual('Cumprindo pena','Você passou mais um ano na prisão. Restam '+e.prison+' ano(s).');
 }
}
function annual(g){
 ensure(g);
 const e=g.extra;
 prisonAnnual(g);
 const p=e.politics2;
 if(e.office){
   e.officeYears=(e.officeYears||0)+1;
   const award={vereador:58000,prefeito:120000,governador:210000,presidente:400000};
   g.cash+=award[e.office]||0;
   p.loyalty=clamp100(p.loyalty+rand(-5,7));
   e.reputation=clamp100(e.reputation+rand(-4,6));
   if(p.evidence>0&&Math.random()<.2+Math.min(.5,p.evidence/130)){
    const investigated=p.evidence;
    p.evidence=0;p.scandals++;p.integrity=clamp100(p.integrity-15);
    if(Math.random()<.65){p.barredUntil=g.age+8;jail(g,'corrupção no cargo público',rand(3,9),Math.round(investigated*1400));}
    else noteAnnual('Investigação política','Uma investigação sobre suspeitas de corrupção não resultou em condenação, mas afetou sua imagem.');
   }
   if(e.office&&e.officeYears>=4){
    noteAnnual('Fim de mandato','O mandato de '+e.office+' terminou. Você pode continuar sua carreira política.');
    e.office=null;e.officeYears=0;
   }
 }
 if(e.crimeStory.cases.length&&e.prison===0){
  const remaining=[];
  for(const pending of e.crimeStory.cases){
   if(Math.random()<Math.min(.85,.2+pending.heat*.45)){
    if(Math.random()<.74)jail(g,pending.title,rand(...pending.penalty),pending.fine);
    else noteAnnual('Investigação encerrada','Você foi investigado por '+pending.title+', mas o caso foi arquivado nesta simulação.');
   }else remaining.push(pending);
   if(e.prison>0)break;
  }
  if(e.prison===0)e.crimeStory.cases=remaining;
 }
 const pets=e.pets;
 for(let i=pets.length-1;i>=0;i--){
  const pet=pets[i];
  pet.age++;pet.hunger=clamp100(pet.hunger-rand(12,21));
  pet.happiness=clamp100(pet.happiness-rand(7,14));
  pet.health=clamp100(pet.health+(pet.hunger<25?-rand(9,18):rand(-5,3)));
  const species=PETS.find(v=>v.id===pet.species);
  const chance=pet.age>(species?.max||14)?Math.min(.8,.12+(pet.age-(species?.max||14))*.16):pet.health<12?.26:0;
  if(Math.random()<chance){
   noteAnnual('Adeus ao pet','Seu companheiro '+pet.name+' faleceu. Você guarda boas lembranças.');
   pets.splice(i,1);
  }
 }
}
function politicalRequirements(g,p){
 ensure(g);const e=g.extra,s=e.politics2;
 if(g.age<p.age)return 'Idade mínima: '+p.age+' anos';
 if(g.stats.carisma<p.stat)return 'Carisma necessário: '+p.stat;
 if(e.prison>0)return 'Não pode se candidatar enquanto preso';
 if(s.barredUntil>g.age)return 'Inelegível até '+s.barredUntil+' anos';
 if((e.record||0)>2)return 'Antecedentes impedem a candidatura';
 if(p.requires&&!s.experience.includes(p.requires))return 'Conquiste o cargo de '+POLITICS.find(v=>v.id===p.requires)?.name+' primeiro';
 if(e.office)return 'Termine seu mandato antes de disputar outra eleição';
 if(g.cash<p.cost)return 'Campanha exige '+brl(p.cost);
 return '';
}
function election(g,id){
 const p=POLITICS.find(x=>x.id===id);if(!p)return;
 const reason=politicalRequirements(g,p);if(reason)return showToast(reason);
 if(g.pendingEvent)return showEvent();
 if(!useExtraAction())return;
 const e=g.extra,s=e.politics2;g.cash-=p.cost;
 const chance=Math.min(.88,.18+g.stats.carisma*.0034+(e.reputation||30)*.0026+s.loyalty*.0017-(id==='presidente'?.25:id==='governador'?.15:0));
 if(Math.random()<chance){
  e.office=id;e.officeYears=0;
  if(!s.experience.includes(id))s.experience.push(id);
  e.reputation=clamp100((e.reputation||30)+15);
  logLine('Vitória eleitoral','Você venceu a eleição para '+p.name+'. Seu próximo objetivo pode ser conquistar o cargo seguinte.');
 }else{
  e.reputation=clamp100((e.reputation||30)+3);s.loyalty=clamp100(s.loyalty+4);
  logLine('Eleições','Você não venceu a disputa para '+p.name+'. Pode tentar novamente.');
 }
 save();render();
}
function politicalDecision(g,action){
 ensure(g);const e=g.extra,p=e.politics2;
 if(e.prison>0)return showToast('Não é possível atuar na política enquanto estiver preso.');
 if(!g.alive||g.age<18)return;
 if(g.pendingEvent)return showEvent();
 if(!e.office&&action!=='grassroots')return showToast('Conquiste uma eleição para administrar um mandato.');
 if(!useExtraAction())return;
 if(action==='honest'){
  p.integrity=clamp100(p.integrity+12);p.loyalty=clamp100(p.loyalty+6);
  e.reputation=clamp100(e.reputation+8);g.stats.disciplina=clamp100(g.stats.disciplina+4);
  logLine('Gestão honesta','Você priorizou serviços públicos e transparência, elevando sua confiança pública.');
 }else if(action==='corrupt'){
  const loot=rand(6000,35000)*(POLITICS.findIndex(v=>v.id===e.office)+1);
  g.cash+=loot;p.integrity=clamp100(p.integrity-20);p.evidence+=rand(15,35);
  e.reputation=clamp100(e.reputation-5);
  if(Math.random()<.34+(p.evidence/160)){
   const damage=p.evidence;p.evidence=0;p.scandals++;p.barredUntil=g.age+8;
   jail(g,'corrupção',rand(3,10),loot+damage*1500);
  }else logLine('Desvio de conduta','Você aceitou vantagens ilegais fictícias de '+brl(loot)+'. Surgiram suspeitas e risco de investigação.');
 }else if(action==='audit'){
  p.integrity=clamp100(p.integrity+6);p.evidence=Math.max(0,p.evidence-6);
  e.reputation=clamp100(e.reputation+5);
  logLine('Prestação de contas','Você apresentou seu trabalho publicamente. As suspeitas existentes não foram apagadas automaticamente.');
 }else if(action==='grassroots'){
  e.reputation=clamp100(e.reputation+rand(4,9));p.loyalty=clamp100(p.loyalty+rand(5,10));
  g.stats.carisma=clamp100(g.stats.carisma+3);
  logLine('Campanha comunitária','Você ouviu moradores e se envolveu em ações comunitárias.');
 }
 save();render();
}
function renderPolitics(g){
 ensure(g);const e=g.extra,s=e.politics2;
 const current=POLITICS.find(x=>x.id===e.office);
 const rank=POLITICS.filter(x=>s.experience.includes(x.id)).map(x=>x.name);
 return displayTitle('🏛️ Carreira política','Avance de vereador a presidente, governe com integridade ou arrisque escândalos e prisão.')+
 '<div class="politics-hero"><div><small>CARGO ATUAL</small><strong>'+text(current?.name||'Nenhum mandato')+'</strong></div>'+
 '<div><small>REPUTAÇÃO</small><strong>'+(e.reputation||0)+'/100</strong></div>'+
 '<div><small>INTEGRIDADE</small><strong>'+s.integrity+'/100</strong></div>'+
 '<div><small>MANDATO</small><strong>'+(current?e.officeYears+'/4':'—')+'</strong></div></div>'+
 '<div class="card"><h3>Minha evolução</h3><p>'+text(rank.length?rank.join(' → '):'Ainda não foi eleito.')+'</p>'+
 '<p>Escândalos: '+s.scandals+' · Antecedentes: '+(e.record||0)+(s.barredUntil>g.age?' · Inelegível até '+s.barredUntil+' anos':'')+'</p>'+
 '<div class="mini-buttons"><button type="button" class="secondary-button" data-world-action="grassroots" '+(e.prison>0?'disabled':'')+'>🤝 Participar da comunidade</button></div></div>'+
 (current?'<div class="card"><h3>Decisões do mandato</h3><p>Suas decisões políticas podem melhorar sua reputação, gerar investigações ou acabar com seu mandato.</p>'+
 '<div class="world-actions">'+
 '<button class="secondary-button" data-world-action="honest" '+(!g.alive?'disabled':'')+'>✅ Governar honestamente</button>'+
 '<button class="secondary-button" data-world-action="audit" '+(!g.alive?'disabled':'')+'>📊 Prestar contas</button>'+
 '<button class="secondary-button" data-world-action="corrupt" '+(!g.alive?'disabled':'')+'>⚠️ Aceitar vantagem ilegal</button></div>'+
 '<p class="tiny-note">Corrupção é ilegal e pode causar investigação, perda de cargo, multa e prisão.</p></div>':'')+
 '<div class="section-title">Evolução política</div><div class="world-card-grid">'+POLITICS.map(p=>{
  const reason=politicalRequirements(g,p);
  return '<article class="world-card"><h3>🗳️ '+p.name+'</h3><p>Idade '+p.age+'+ · Carisma '+p.stat+'+ · Campanha '+brl(p.cost)+'</p>'+
  '<p>'+text(p.requires?'Depois de '+POLITICS.find(v=>v.id===p.requires)?.name:'Primeiro cargo da trajetória')+'</p>'+
  '<button type="button" class="secondary-button" data-world-action="election" data-id="'+p.id+'" '+(reason||!g.alive?'disabled':'')+'>Disputar eleição</button>'+
  (reason?'<small>'+text(reason)+'</small>':'')+'</article>';
 }).join('')+'</div>';
}
function crimeAction(g,id){
 ensure(g);const d=CRIMES.find(x=>x.id===id);if(!d)return;
 const e=g.extra,record=e.crimeStory;
 if(!g.alive||g.age<16)return showToast('Disponível a partir dos 16 anos.');
 if(e.prison>0)return showToast('Você está preso e não pode cometer outro delito.');
 if(g.pendingEvent)return showEvent();
 if(!useExtraAction())return;
 record.attempts++;record.stage=d.stage;
 const detected=Math.random()<Math.min(.92,d.risk+record.level*.035);
 g.stats.felicidade=clamp100(g.stats.felicidade-5);
 if(detected){
  const years=rand(...d.penalty);
  jail(g,d.name,years,d.fine);
 }else{
  const loot=rand(...d.amount);g.cash+=loot;
  record.level=Math.min(8,record.level+1);
  record.cases.push({title:d.name,heat:d.risk,penalty:d.penalty,fine:d.fine});
  logLine('Risco criminal','Uma ação criminosa fictícia rendeu '+brl(loot)+'. Mesmo sem flagrante, há investigação e risco de condenação posterior.');
 }
 save();render();
}
function renderCrime(g){
 ensure(g);const e=g.extra,c=e.crimeStory;
 return displayTitle('⚖️ Crimes e consequências','Trajetórias de ladrão ou traficante são fictícias, com investigação e consequências judiciais.')+
 '<div class="card"><h3>⚖️ Ficha judicial</h3><p>Antecedentes: '+(e.record||0)+' · Pena restante: '+(e.prison||0)+' ano(s) · Anos cumpridos: '+c.served+
 ' · Investigações em aberto: '+c.cases.length+'</p><p>'+text(c.lastJudgement||'Sem condenações até o momento.')+'</p>'+
 (e.prison>0?'<div class="notice">🔒 Você está cumprindo pena. Durante esse período não pode exercer profissão, comprar bens, estudar ou fazer atividades normais. Avance os anos para cumprir a sentença.</div>':'')+'</div>'+
 '<div class="card"><h3>Trajetória criminal</h3><p>Perfil: '+text(c.stage==='traficante'?'Traficante fictício':c.stage==='ladrao'?'Ladrão':'Sem envolvimento')+
 ' · Experiência: '+c.level+'/8 · Tentativas: '+c.attempts+'</p><p>Esta opção apresenta somente escolhas narrativas e riscos, sem ensinar crimes.</p></div>'+
 '<div class="world-card-grid">'+CRIMES.map(d=>'<div class="world-card"><h3>⚠️ '+d.name+'</h3>'+
 '<p>Risco alto de investigação, multa, perda do emprego e prisão.</p>'+
 '<button class="secondary-button" type="button" data-world-action="crime" data-id="'+d.id+'" '+(g.age<16||e.prison>0||!g.alive?'disabled':'')+'>Escolher este caminho</button></div>').join('')+'</div>';
}
function createPet(g,id,source){
 ensure(g);const type=PETS.find(p=>p.id===id);if(!type)return;
 const e=g.extra;if(!g.alive||e.prison>0)return showToast('Não é possível cuidar ou adquirir pets enquanto estiver preso.');
 if(g.age<10)return showToast('Você pode adotar pets com sua família a partir dos 10 anos.');
 if(e.pets.length>=6)return showToast('Limite de seis animais por partida.');
 
 if(g.pendingEvent)return showEvent();
 const charge=source==='buy'?type.buy:type.adopt;
 if(g.cash<charge)return showToast('Dinheiro insuficiente para o animal.');
 let nickname='';try{nickname=String(prompt('Qual o nome do seu '+type.name.toLowerCase()+'?','Pipoca')||'').trim()}catch{nickname='Pipoca'}
 if(!nickname)return showToast('O pet precisa de um nome.');
 nickname=nickname.slice(0,22);
 g.cash-=charge;
 e.pets.push({id:e.petSequence++,species:id,name:nickname,age:0,health:85,hunger:75,happiness:75,training:0,source});
 logLine(source==='buy'?'Novo companheiro':'Adoção de pet','Você '+(source==='buy'?'comprou':'adotou')+' '+nickname+', um '+type.name.toLowerCase()+'.');
 save();render();
}
function petAction(g,id,act){
 ensure(g);const p=g.extra.pets.find(x=>x.id===Number(id));if(!p)return;
 if(g.extra.prison>0||!g.alive)return showToast('Não é possível cuidar de pets enquanto estiver preso.');
 
 if(g.pendingEvent)return showEvent();
 const cost=act==='vet'?380:act==='feed'?70:0;
 if(g.cash<cost)return showToast('Saldo insuficiente.');
 g.cash-=cost;
 if(act==='feed'){p.hunger=clamp100(p.hunger+42);p.health=clamp100(p.health+5);}
 else if(act==='play'){p.happiness=clamp100(p.happiness+24);p.hunger=clamp100(p.hunger-7);g.stats.felicidade=clamp100(g.stats.felicidade+5);}
 else if(act==='vet'){p.health=clamp100(p.health+35);p.happiness=clamp100(p.happiness+7);}
 else if(act==='train'){p.training=clamp100(p.training+15);p.happiness=clamp100(p.happiness+5);}
 else return;
 logLine('Cuidando de '+p.name,'Você '+({feed:'alimentou',play:'brincou com',vet:'levou ao veterinário',train:'treinou'}[act])+' seu pet.');
 save();render();
}
function renderPets(g){
 ensure(g);const e=g.extra;
 const people=e.pets.map(p=>{
  const type=PETS.find(x=>x.id===p.species);
  return '<article class="pet-card">'+petPortrait(p)+'<div class="pet-details"><h3>'+text(p.name)+'</h3>'+
   '<p>'+text(type?.name||'Pet')+' · '+p.age+' ano(s)</p>'+
   '<div class="pet-bars"><span>❤️ Saúde '+p.health+'/100</span><span>🍎 Alimentação '+p.hunger+'/100</span><span>😊 Felicidade '+p.happiness+'/100</span><span>🎓 Treino '+p.training+'/100</span></div>'+
   '<div class="mini-buttons">'+[
    ['feed','🍎 Alimentar'],['play','🎾 Brincar'],['vet','🩺 Veterinário'],['train','🎓 Treinar']
   ].map(([id,label])=>'<button class="secondary-button" data-world-action="pet-care" data-id="'+p.id+'" data-choice="'+id+'" '+(e.prison>0?'disabled':'')+'>'+label+'</button>').join('')+'</div></div></article>';
 }).join('');
 return displayTitle('🐾 Meus pets','Adote ou compre animais, dê nomes e cuide deles ao longo dos anos.')+
 '<div class="card"><h3>Minha família de animais</h3><p>'+e.pets.length+' de 6 pets. Animais precisam de alimentação, companhia e cuidados anuais.</p></div>'+
 (e.pets.length?'<div class="pet-grid">'+people+'</div>':'<div class="notice">Você ainda não tem pets. Escolha uma espécie para adotar ou comprar.</div>')+
 '<div class="section-title">Adoção e compra</div><div class="world-card-grid">'+PETS.map(p=>
  '<div class="world-card"><h3>'+p.icon+' '+p.name+'</h3><p>Adotar: grátis · Comprar: '+brl(p.buy)+'</p>'+
  '<div class="mini-buttons"><button class="secondary-button" data-world-action="pet-add" data-id="'+p.id+'" data-choice="adopt" '+(e.prison>0||g.age<10||!g.alive||e.pets.length>=6?'disabled':'')+'>Adotar</button>'+
  '<button class="secondary-button" data-world-action="pet-add" data-id="'+p.id+'" data-choice="buy" '+(e.prison>0||g.age<10||!g.alive||e.pets.length>=6||g.cash<p.buy?'disabled':'')+'>Comprar</button></div></div>').join('')+'</div>';
}
document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-world-action]');
 if(!b||typeof game==='undefined'||!game)return;
 const a=b.dataset.worldAction,id=b.dataset.id;
 if(a==='election')election(game,id);
 if(['honest','corrupt','audit','grassroots'].includes(a))politicalDecision(game,a);
 if(a==='crime')crimeAction(game,id);
 if(a==='pet-add')createPet(game,id,b.dataset.choice);
 if(a==='pet-care')petAction(game,id,b.dataset.choice);
});
window.CaminhosWorld={ensure,portrait,petPortrait,annual,renderPolitics,renderCrime,renderPets,
 politicalRequirements,election,politicalDecision,crimeAction,jail,petAction,createPet,services:POLITICS};
})();
