/* CAMINHOS — Bens e Escola. Sem dependências externas; integra com game.js. */
(function(){
'use strict';
const CATALOG=[
 ['apto','imoveis','🏢','Apartamento compacto',120000,1900,.018],
 ['casa','imoveis','🏠','Casa de bairro',260000,3600,.023],
 ['sobrado','imoveis','🏘️','Sobrado',390000,5200,.025],
 ['praia','imoveis','🌴','Casa de praia',570000,8500,.027],
 ['sitio','imoveis','🌾','Sítio',680000,12500,.021],
 ['cobertura','imoveis','🏙️','Cobertura',1100000,22500,.032],
 ['mansao','imoveis','🏰','Mansão',3000000,78000,.035],
 ['resort','imoveis','🏨','Resort particular',8000000,190000,.022],
 ['usado','carros','🚙','Carro usado',28000,2700,-.075],
 ['hatch','carros','🚗','Hatch popular',69000,4100,-.08],
 ['sedan','carros','🚘','Sedã executivo',155000,9200,-.085],
 ['suv','carros','🚙','SUV de luxo',310000,16000,-.09],
 ['eletrico','carros','🔋','Carro elétrico',235000,6800,-.083],
 ['esportivo','carros','🏎️','Superesportivo',1400000,76000,-.11],
 ['colecao','carros','🏁','Clássico de coleção',420000,26000,.018],
 ['scooter','motos','🛵','Scooter urbana',14000,800,-.09],
 ['custom','motos','🏍️','Moto custom',56000,3300,-.075],
 ['superbike','motos','🏍️','Superbike',145000,11500,-.1],
 ['jetski','nautica','🌊','Jet ski',72000,7500,-.09],
 ['lancha','nautica','🛥️','Lancha',350000,39000,-.065],
 ['veleiro','nautica','⛵','Veleiro',620000,53000,-.04],
 ['iate','nautica','🛳️','Iate de luxo',7500000,790000,-.055],
 ['barco','nautica','🚤','Barco de pesca',110000,11500,-.06],
 ['ultraleve','aeronaves','🛩️','Ultraleve',180000,23000,-.06],
 ['monomotor','aeronaves','✈️','Avião monomotor',950000,140000,-.06],
 ['helicoptero','aeronaves','🚁','Helicóptero',3200000,470000,-.085],
 ['jato','aeronaves','🛫','Jato particular',22000000,2400000,-.09],
 ['padaria','empresas','🥖','Padaria',45000,0,0],
 ['barbearia','empresas','✂️','Barbearia',35000,0,0],
 ['restaurante','empresas','🍽️','Restaurante',160000,0,0],
 ['mercado','empresas','🛒','Supermercado',320000,0,0],
 ['transportadora','empresas','🚚','Transportadora',520000,0,0],
 ['hotel','empresas','🏨','Hotel',2000000,0,0],
 ['companhia','empresas','✈️','Companhia aérea',15000000,0,0]
];
const TYPES={
 todos:'Todos',imoveis:'🏠 Imóveis',carros:'🚗 Carros',motos:'🏍️ Motos',
 nautica:'🛥️ Navios e barcos',aeronaves:'✈️ Aviões',empresas:'🏢 Empresas'
};
let filter='todos';
const item=id=>CATALOG.find(x=>x[0]===id);
const clean=v=>escapeHTML(String(v??''));
const owned=(g)=>Array.isArray(g.extra?.assetInventory)?g.extra.assetInventory:[];
function ensure(g){
 if(!g)return;
 if(!g.extra||typeof g.extra!=='object')g.extra={};
 const e=g.extra;
 if(!Array.isArray(e.assetInventory))e.assetInventory=[];
 if(!Number.isSafeInteger(e.assetSequence)||e.assetSequence<1)e.assetSequence=1;
 if(!e.school||typeof e.school!=='object'||Array.isArray(e.school)){
   e.school={name:'Escola Municipal de '+String(g.city||'sua cidade').split(',')[0],
     average:rand(55,74),discipline:rand(58,82),projects:0,awards:0,events:0,finished:false,yearProcessed:-1};
 }
 // Versoes antigas chamavam todos os ex-colegas de "Amizade".
 // Preserve amizades antigas; personagens novos precisam de convite aceito.
 for(const person of g.people){
  if(person.role==='Amizade'&&typeof person.friend!=='boolean')person.friend=true;
 }
 if(g.age>=4&&g.age<18&&!e.school.finished && !g.people.some(p=>p.role==='Colega'||p.role==='Professor(a)')){
   const used=new Set(g.people.map(p=>p.name));
   const pool=['Marina','Eduarda','João','Caio','Júlia','Thiago','Bianca','Isabela','Felipe','Rafaela','Lucas','André','Luísa','Renan','Sofia','Pedro'];
   const people=['Colega','Colega','Colega','Colega','Professor(a)','Professor(a)'];
   const names=[];
   for(const role of people){
     let name=pool.find(n=>!used.has(n)&&!names.includes(n));
     if(!name)name='Pessoa '+(names.length+1);
     names.push(name);used.add(name);
     const id=Math.max(0,...g.people.map(p=>Number(p.id)||0))+1;
     g.people.push({id,name,role,emoji:role==='Colega'?'🧑‍🎓':'👩‍🏫',bond:rand(37,71),friend:false,schoolmate:true});
   }
 }
 initClubs(g);
}

const SCHOOL_CLUBS=[
 ['ciencias','🔬','Clube de Ciências'],
 ['esportes','⚽','Clube Esportivo'],
 ['teatro','🎭','Clube de Teatro'],
 ['musica','🎵','Clube de Música'],
 ['debate','🗣️','Clube de Debate']
];
function initClubs(g){
 const s=g.extra.school;
 if(s.clubs&&typeof s.clubs==='object'&&Array.isArray(s.clubs.list))return;
 if(g.age<4||g.age>=18||s.finished)return;
 const existing=g.people.filter(p=>p.role==='Colega');
 const used=new Set(g.people.map(p=>p.name));
 const pool=['Gabriel','Vitor','Melissa','Bruna','Rafael','Camila','Yasmin','Diego','Fernanda','Henrique','Beatriz','Daniela'];
 while(existing.length<10){
  const index=existing.length;
  const name=pool.find(n=>!used.has(n))||'Estudante '+(index+1);
  used.add(name);
  const id=Math.max(0,...g.people.map(p=>Number(p.id)||0))+1;
  const person={id,name,role:'Colega',emoji:'🧑‍🎓',bond:rand(35,67),friend:false,schoolmate:true};
  g.people.push(person);existing.push(person);
 }
 s.clubs={
  activeId:null,popularity:0,prestige:20,participation:0,status:'Fora do clube',joinedAge:null,
  lastActivityYear:-1,activityCount:0,lastElectionYear:-1,
  list:SCHOOL_CLUBS.map(([id,emoji,name],i)=>({
   id,emoji,name,members:Array.from({length:4},(_,j)=>existing[(i*2+j)%existing.length].id)
  }))
 };
}
function clubFeedback(g,title,story){
 const s=g.extra.school,cl=s.clubs;
 logLine(title,story);
 save();render();
 showModal('<div class="relationship-result"><div class="relationship-result-icon">🏅</div>'+
  '<div class="card-kicker">VIDA ESCOLAR · CLUBE</div><h2 id="modalTitle">'+clean(title)+'</h2>'+
  '<p>'+clean(story)+'</p>'+
  '<div class="relationship-result-score"><span>Sua popularidade no clube</span><strong>'+Math.round(cl.popularity)+'/100</strong></div>'+
  '<div class="relationship-result-info"><span>Função: <b>'+clean(cl.status)+'</b></span>'+
  '<span>Prestígio do clube: '+Math.round(cl.prestige)+'/100</span>'+
  '<span>Participações: '+Math.round(cl.participation)+'</span></div>'+
  '<button type="button" class="secondary-button relationship-result-close" data-act="dismiss-result">Entendi</button></div>');
}
function schoolClubAction(g,action,id){
 ensure(g);initClubs(g);
 const s=g.extra.school,cl=s.clubs;
 if(!cl||!g.alive||g.age<4||g.age>17||s.finished)return showToast('Clubes estão disponíveis durante a vida escolar.');
 if(g.pendingEvent)return showEvent();
 if(g.extra?.prison>0)return showToast('Você não pode participar enquanto está preso.');
 const current=cl.list.find(v=>v.id===cl.activeId);
 if(action==='join'){
  const target=cl.list.find(v=>v.id===id);
  if(!target)return;
  if(current)return showToast('Saia do clube atual antes de participar de outro.');
  cl.activeId=target.id;cl.joinedAge=g.age;cl.popularity=rand(12,25);
  cl.prestige=rand(18,35);cl.participation=0;cl.status='Integrante';
  cl.activityCount=0;cl.lastActivityYear=g.age;
  return clubFeedback(g,'Você entrou no '+target.name,
   'Você agora faz parte do clube e conheceu seus integrantes. Participe para ganhar popularidade e concorrer à liderança.');
 }
 if(!current)return showToast('Entre em um clube escolar primeiro.');
 if(action==='leave'){
  const old=current.name;
  cl.activeId=null;cl.status='Fora do clube';cl.popularity=0;cl.participation=0;
  return clubFeedback(g,'Você saiu do '+old,
   'Você decidiu deixar o clube. Para crescer em outro, será necessário participar novamente.');
 }
 const yearCount=cl.lastActivityYear===g.age?cl.activityCount:0;
 if(action==='practice'||action==='organize'||action==='help'){
  cl.activityCount=yearCount+1;cl.lastActivityYear=g.age;
  cl.participation++;
  // A repeticao reduz o ganho por acao, mas não ha um limite anual.
  const penalty=Math.floor(yearCount/4);
  let pop=0,prestige=0,story='',title='';
  if(action==='practice'){
   pop=Math.max(0,rand(4,9)-penalty);prestige=rand(0,2);
   statChange({inteligencia:current.id==='ciencias'||current.id==='debate'?2:0,
     felicidade:2,saude:current.id==='esportes'?2:0});
   title='Encontro do '+current.name;
   story='Você participou das atividades e aprendeu mais com os outros alunos.';
  }else if(action==='help'){
   pop=Math.max(0,rand(5,11)-penalty);prestige=rand(1,3);
   title='Você ajudou o clube';
   story='Você organizou materiais, apoiou os colegas e ganhou reconhecimento.';
  }else{
   const success=Math.random()<Math.max(.15,Math.min(.9,.38+cl.popularity/190));
   pop=success?Math.max(0,rand(8,15)-penalty):rand(-5,-2);
   prestige=success?rand(5,11):-rand(2,5);
   title=success?'Evento do clube foi um sucesso':'O evento do clube teve problemas';
   story=success?'Você ajudou a organizar um evento que impressionou a escola.':
    'O evento não saiu como esperado, mas você aprendeu com a experiência.';
  }
  cl.popularity=clamp(cl.popularity+pop);
  cl.prestige=clamp(cl.prestige+prestige);
  for(const mid of current.members){
   const member=g.people.find(p=>p.id===mid);if(!member)continue;
   if(action==='organize'&&pop<0)member.bond=clamp(member.bond-1);
   else member.bond=clamp(member.bond+(cl.participation%2===0?1:0));
  }
  if(cl.popularity>=45&&cl.participation>=3&&cl.status==='Integrante'){
   cl.status='Coordenador(a)';
   story+=' Você conquistou o cargo de coordenador(a) do clube.';
  }
  if(cl.status==='Líder'&&cl.popularity<25){
   cl.status='Integrante';story+=' Os integrantes decidiram substituir você na liderança.';
  }
  return clubFeedback(g,title,story+' Popularidade: '+(pop>=0?'+':'')+pop+'.');
 }
 if(action==='campaign'){
  if(cl.popularity<40)return showToast('Você precisa de popularidade 40/100 para buscar apoio.');
  if(cl.status==='Líder')return showToast('Você já lidera o clube.');
  const member=g.people.find(p=>p.id===current.members[Math.floor(Math.random()*current.members.length)]);
  const supported=member&&(member.bond>=45)&&Math.random()<.7;
  const gain=supported?rand(3,7):rand(-4,-1);
  cl.popularity=clamp(cl.popularity+gain);
  if(member)member.bond=clamp(member.bond+(supported?2:-3));
  return clubFeedback(g,supported?'Apoio à sua candidatura':'Faltou apoio no clube',
    member?(supported?member.name+' apoiou sua candidatura a líder.':member.name+' não gostou da campanha e preferiu outro candidato.'):
    'Você tentou reunir apoio, mas ainda precisa conversar com outros integrantes.');
 }
 if(action==='leader'){
  if(cl.status==='Líder')return showToast('Você já é líder.');
  if(cl.popularity<65||cl.participation<5)return showToast('Para concorrer: popularidade de 65 e 5 participações.');
  if(cl.lastElectionYear===g.age)return showToast('Já houve eleição neste ano. Tente novamente no próximo.');
  cl.lastElectionYear=g.age;
  const votes=current.members.filter(mid=>(g.people.find(p=>p.id===mid)?.bond||0)>=50).length;
  const elected=Math.random()<Math.max(.12,Math.min(.91,.22+cl.popularity/170+votes*.045));
  if(elected){cl.status='Líder';cl.popularity=clamp(cl.popularity+10);cl.prestige=clamp(cl.prestige+6);
   statChange({felicidade:8});}
  else{cl.popularity=clamp(cl.popularity-7);}
  return clubFeedback(g,elected?'Você foi eleito(a) líder!':'Você perdeu a eleição',
   elected?'Os integrantes do '+current.name+' votaram em você! Agora você poderá liderar atividades e melhorar o prestígio do clube.':
    'Outra pessoa venceu a eleição. Fortaleça sua popularidade e a relação com os membros para tentar novamente no próximo ano.');
 }
}
function renderClubs(g){
 const s=g.extra.school,cl=s.clubs;
 if(!cl)return '';
 const active=cl.list.find(x=>x.id===cl.activeId);
 const allowed=g.age>=4&&g.age<18&&!s.finished&&g.alive&&!g.pendingEvent&&!g.extra?.prison;
 let html='<div class="section-title">🏅 Clubes escolares <small>Atividades e liderança</small></div>';
 if(!active){
  html+='<div class="notice">Escolha um clube, conheça alunos e construa sua reputação. Os clubes não adicionam automaticamente pessoas a Relacionamentos.</div>';
  html+='<div class="school-club-list">'+cl.list.map(v=>
   '<div class="card school-club-card"><div class="school-club-heading"><span class="school-club-emoji">'+v.emoji+'</span>'+
   '<div><strong>'+clean(v.name)+'</strong><small>'+v.members.length+' integrantes · eleição de liderança</small></div></div>'+
   '<button type="button" class="secondary-button" data-life-extra="club" data-id="join" data-club="'+v.id+'" '+(!allowed?'disabled':'')+'>Participar do clube</button></div>'
  ).join('')+'</div>';
  return html;
 }
 html+='<div class="card school-club-card"><div class="school-club-heading"><span class="school-club-emoji">'+active.emoji+'</span>'+
  '<div><strong>'+clean(active.name)+'</strong><small>'+clean(cl.status)+'</small></div></div>'+
  '<div class="school-club-stats">'+
  '<span>Popularidade <b>'+Math.round(cl.popularity)+'/100</b></span>'+
  '<div class="retro-relationship-track"><span style="width:'+clamp(cl.popularity)+'%"></span></div>'+
  '<span>Prestígio <b>'+Math.round(cl.prestige)+'/100</b></span>'+
  '<div class="retro-relationship-track"><span style="width:'+clamp(cl.prestige)+'%"></span></div>'+
  '<span>Participações <b>'+Math.round(cl.participation)+'</b></span></div>'+
  '<div class="school-club-actions">'+[
   ['practice','📚 Participar da reunião'],['help','🤝 Ajudar os integrantes'],
   ['organize','🎉 Organizar um evento'],['campaign','🗣️ Buscar votos'],
   ['leader','🏅 Candidatar-se a líder'],['leave','🚪 Sair do clube']
  ].map(([action,label])=>'<button type="button" class="secondary-button" data-life-extra="club" data-id="'+action+'" '+
    (!allowed||action==='leader'&&(cl.popularity<65||cl.participation<5||cl.status==='Líder')||
     action==='campaign'&&(cl.popularity<40||cl.status==='Líder')?'disabled':'')+'>'+label+'</button>').join('')+'</div>'+
  '<p class="muted small">Liderança: 65 de popularidade e 5 participações. Fazer amizades com os colegas aumenta suas chances.</p></div>';
 html+='<div class="section-title">Alunos do clube <small>'+active.members.length+'</small></div><div class="school-list">'+
  active.members.map(mid=>{
   const p=g.people.find(p=>Number(p.id)===Number(mid));if(!p)return '';
   return '<div class="school-person"><div class="school-icon portrait-holder">'+
     (window.CaminhosWorld?.portrait(p.name,p.role,p.id)||clean(p.emoji))+'</div><div><strong>'+clean(p.name)+'</strong>'+
     '<small>Vínculo '+Math.round(p.bond)+'/100 · '+(p.friend?'💚 Amigo(a)':'Conhecido(a)')+'</small></div>'+
     '<button type="button" class="secondary-button" data-ui-person="'+Number(p.id)+'" '+(!g.alive?'disabled':'')+'>Interagir →</button></div>';
  }).join('')+'</div>';
 return html;
}

function lifeStageSchool(g){
 if(g.age<4)return 'Pré-escola disponível a partir dos 4 anos';
 if(g.age<=5)return 'Educação infantil';
 if(g.age<=10)return 'Ensino fundamental I';
 if(g.age<=14)return 'Ensino fundamental II';
 if(g.age<=17)return 'Ensino médio';
 return 'Escola concluída';
}
function annual(g){
 ensure(g);const e=g.extra;
 if(e.assetYear!==g.age){
   e.assetYear=g.age;
   let maintenance=0,profit=0;
   for(const a of owned(g)){
     const product=item(a.type);
     if(!product)continue;
     const years=Math.max(0,g.age-a.age);
     a.years=years;
     if(product[1]==='empresas'){
       // Custos e faturamento ficcionais; empresas podem dar lucro ou prejuízo.
       const level=Math.max(1,Number(a.level)||1);
       const revenue=Math.round(product[4]*(0.19+Math.random()*.24)*level);
       const operating=Math.round(product[4]*.17*level+Math.max(1,Number(a.employees)||1)*950);
       const change=Math.round((revenue-operating)*Math.max(0,Math.min(1,Number.isFinite(a.share)?a.share:1)));
       a.profit=(Number(a.profit)||0)+change;
       profit+=change;
     }else{
       maintenance+=Math.round(product[5]*(1+years*.035)*Math.max(0,Math.min(1,Number.isFinite(a.share)?a.share:1)));
     }
   }
   if(profit||maintenance){
     g.cash+=profit-maintenance;
     noteAnnual('Bens e empresas','Receitas e resultados das empresas: '+brl(profit)+'; manutenção de bens: '+brl(maintenance)+'.');
   }
 }
 const s=e.school;
 if(g.age>=4 && g.age<=17 && s.yearProcessed!==g.age){
   s.yearProcessed=g.age;
   const evolution=rand(-7,6)+Math.round((g.stats.inteligencia-50)/16)+Math.round((g.stats.inteligencia-50)/26);
   s.average=clamp(s.average+evolution);
   if(s.average>=85){s.awards++;noteAnnual('Destaque escolar','Você recebeu reconhecimento por seu desempenho na escola.')}
   if(g.age===4)noteAnnual('Primeiro dia na escola', 'Você começou a educação infantil e conheceu colegas e professores.');
   if(g.age===6)noteAnnual('Ensino fundamental','Você começou o ensino fundamental!');
   if(g.age===15)noteAnnual('Ensino médio','Você entrou no ensino médio, com novas matérias e desafios.');
 }
 if(g.age>=18&&!s.finished){
   s.finished=true;
   g.people.forEach(p=>{if(p.role==='Colega')p.role='Ex-colega';else if(p.role==='Professor(a)')p.role='Ex-professor(a)'});
   noteAnnual('Fim da escola','Você concluiu a escola com média '+s.average+'/100 e '+s.awards+' destaque(s). Os contatos continuam conhecidos; apenas amizades aceitas aparecem em Relacionamentos.');
 }
}
// Convites aleatorios de amizade de colegas conhecidos com bom vinculo.
function friendshipInvite(g){
 ensure(g);
 if(!g?.alive||g.age<4||g.extra?.prison>0)return null;
 const e=g.extra;
 if(e.friendshipInvitationYear===g.age)return null;
 e.friendshipInvitationYear=g.age;
 const possible=g.people.filter(p=>!p.friend&&['Colega','Ex-colega','Conhecido'].includes(p.role)&&
  Number(p.bond)>=65&&(Number(p.irritation)||0)<30&&p.friendRequestYear!==g.age);
 if(!possible.length||Math.random()>=.26)return null;
 const person=choose(possible);
 return {source:'friendship',personId:Number(person.id),title:person.name+' quer sua amizade',
  story:person.name+' gosta de passar tempo com você e perguntou se vocês podem ser amigos. Você deseja aceitar?',
  choices:[
   {text:'Aceitar a amizade',delta:{felicidade:5},accept:true},
   {text:'Recusar educadamente',delta:{felicidade:-1},accept:false}
  ]};
}
function friendshipDecision(g,id,accept){
 const person=g?.people?.find(p=>Number(p.id)===Number(id));
 if(!person)return false;
 person.friendRequestYear=g.age;
 if(accept){
  person.friend=true;
  person.friendSince=g.age;
  person.bond=clamp(person.bond+6);
 }else{
  person.bond=clamp(person.bond-3);
 }
 return true;
}
function wealth(g){
 ensure(g);
 return g.cash+g.savings+(Number(g.properties)||0)*75000+owned(g).reduce((sum,a)=>sum+worth(a,g),0);
}
function worth(a,g){
 const p=item(a.type);
 if(!p)return 0;
 const years=Math.max(0,g.age-(Number(a.age)||0));
 const share=Math.max(0,Math.min(1,Number.isFinite(a.share)?a.share:1));
 const basis=Number(a.basisValue);
 if(Number.isFinite(basis)&&basis>=0){
   const increase=p[1]==='empresas'?.016:p[6];
   return Math.max(0,Math.round(basis*Math.pow(1+increase,years)*share));
 }
 const full=p[1]==='empresas'
   ?Math.max(p[4]*.2,Math.round(p[4]*(.72+.15*(a.level||1))+(Number(a.profit)||0)*.3))
   :Math.max(p[4]*.13,Math.round(p[4]*Math.pow(1+p[6],years)));
 return Math.round(full*share);
}
function renderSchool(g){
 ensure(g);const s=g.extra.school, schoolPeople=g.people.filter(p=>['Colega','Ex-colega','Professor(a)','Ex-professor(a)'].includes(p.role)||(p.schoolmate===true&&p.role==='Amizade'));
 if(g.age<4)return displayTitle('Minha escola','Sua jornada escolar começará aos 4 anos.')+
 '<div class="card"><h3>🧸 Os primeiros anos</h3><p>Você ainda está em casa com sua família. Avance até os 4 anos para conhecer colegas e professores.</p></div>';
 const current=g.age<=17&&!s.finished;
 const teachers=schoolPeople.filter(p=>p.role.toLowerCase().includes('professor'));
 const mates=schoolPeople.filter(p=>p.role==='Colega'||p.role==='Ex-colega'||p.schoolmate===true&&p.role==='Amizade').slice(0,8);
 const personCard=p=>'<div class="school-person">'+
 '<div class="school-icon portrait-holder">'+(window.CaminhosWorld?.portrait(p.name,p.role,p.id)||clean(p.emoji))+'</div>'+
 '<div><strong>'+clean(p.name)+'</strong><small>'+clean(p.role)+' · Vínculo '+Math.round(p.bond)+'/100'+
 (p.friend===true?' · 💚 Amigo(a)':' · Conhecido(a)')+'</small></div>'+
 '<button type="button" class="secondary-button" data-ui-person="'+Number(p.id)+'" '+(!g.alive?'disabled':'')+'>Interagir →</button></div>';
 let out=displayTitle('🏫 Minha escola',current?'Colegas, professores, aprendizado e acontecimentos ao longo do ano.':'Recordações da sua vida escolar.');
 if(!current&&g.age>=18)out+=window.CaminhosPaths?.futureChoice(g)||'';
 out+='<div class="card"><div class="school-top"><span>📚 '+clean(s.name)+'</span><strong>'+lifeStageSchool(g)+'</strong></div><div class="school-metrics">'+
 '<div><small>Média geral</small><strong>'+Math.round(s.average)+'/100</strong></div>'+
 '<div><small>Comportamento</small><strong>'+Math.round(s.discipline)+'/100</strong></div>'+
 '<div><small>Destaques</small><strong>'+Math.round(s.awards)+'</strong></div></div></div>';
 if(current){
   const available=g.alive&&!g.pendingEvent&&!g.extra.prison;
   const options=[['study','📖 Estudar para a prova'],['homework','📝 Fazer lição'],['project','🔬 Participar de projeto'],['friends','🤝 Brincar com os colegas'],['teacher','🙋 Pedir ajuda ao professor'],...(g.age>=15?[['vestibular','📚 Preparação para faculdade']]:[])];
   out+='<div class="section-title">Vida escolar <small>Prática livre</small></div><div class="school-actions">'+
    options.map(([id,label])=>'<button type="button" class="secondary-button" data-life-extra="school" data-id="'+id+'" '+(!available?'disabled':'')+'>'+label+'</button>').join('')+'</div>';
   if(g.pendingEvent)out+='<div class="notice">Resolva a decisão pendente para realizar atividades escolares.</div>';
 }
 out+=renderClubs(g);
 out+='<div class="section-title">Meus colegas <small>'+mates.length+'</small></div><div class="school-list">'+mates.map(personCard).join('')+'</div>';
 out+='<div class="section-title">Professores <small>'+teachers.length+'</small></div><div class="school-list">'+teachers.map(personCard).join('')+'</div>';
 out+='<div class="notice">Interaja com colegas e professores aqui na Escola. Somente amizades aceitas aparecerão em Relacionamentos. Os personagens são fictícios.</div>';
 return out;
}
function schoolAction(g,id,personId){
 ensure(g);
 if(!g.alive||g.age<4||g.age>=18)return showToast('A escola é acessível dos 4 aos 17 anos.');
 
 if(g.pendingEvent)return showEvent();
 if(g.extra.prison>0)return showToast('Atividades escolares indisponíveis durante a prisão.');
 const s=g.extra.school;
 let title='',desc='',delta={},relationship=null;
 const classmates=g.people.filter(p=>p.role==='Colega');
 const teachers=g.people.filter(p=>p.role==='Professor(a)');
 if(id==='talk'){
   relationship=g.people.find(p=>Number(p.id)===Number(personId)&&['Colega','Professor(a)'].includes(p.role));
   if(!relationship)return;
   // Conversar na escola usa o mesmo sistema de afinidade e irritacao.
   relationAction(Number(relationship.id),'aproximar');
   return;
 }else if(id==='study'){
   s.average=clamp(s.average+rand(6,12));delta={inteligencia:5,disciplina:4,felicidade:-2};
   title='Preparação para prova';desc='Você estudou e melhorou seu desempenho escolar.';
 }else if(id==='homework'){
   s.average=clamp(s.average+rand(3,8));s.discipline=clamp(s.discipline+rand(4,8));
   delta={disciplina:6,inteligencia:2};title='Lição concluída';desc='Você fez suas atividades de casa.';
 }else if(id==='project'){
   s.projects++;s.average=clamp(s.average+rand(2,6));
   delta={inteligencia:4,carisma:3,disciplina:3};title='Projeto escolar';desc='Você participou de um trabalho em grupo na escola.';
 }else if(id==='friends'){
   const mate=choose(classmates);
   if(mate)mate.bond=clamp(mate.bond+rand(8,14));
   delta={felicidade:8,carisma:4};title='Recreio com amigos';desc='Você se divertiu com a turma no intervalo.';
 }else if(id==='teacher'){
   const t=choose(teachers);if(t)t.bond=clamp(t.bond+rand(5,10));
   s.average=clamp(s.average+rand(2,6));delta={inteligencia:5,disciplina:2};
   title='Ajuda do professor';desc='Um professor explicou a matéria de um jeito diferente.';
 }else if(id==='vestibular'){
   if(g.age<15)return;s.average=clamp(s.average+rand(4,8));
   delta={inteligencia:7,disciplina:6};title='Preparação para faculdade';desc='Você estudou com foco no ingresso ao ensino superior.';
 }else if(id==='club'){
   s.events++;delta={carisma:5,felicidade:5,disciplina:2};
   title='Clube escolar';desc='Você participou de um clube de arte, esporte ou ciências.';
 }else return;
 statChange(delta);logLine(title,desc);save();render();showToast(desc);
}
function renderAssets(g){
 ensure(g);
 const e=g.extra,items=owned(g);
 const selected=filter==='todos'?CATALOG:CATALOG.filter(p=>p[1]===filter);
 const stats=Object.entries(TYPES).filter(([id])=>id!=='todos').map(([id,label])=>'<span>'+label+': <strong>'+items.filter(a=>item(a.type)?.[1]===id).length+'</strong></span>').join('');
 let out='<div class="assets-intro"><h3>🏦 Meu patrimônio</h3><div class="asset-wealth">'+brl(wealth(g))+'</div><p>Dinheiro e investimentos, imóveis, veículos e empresas. Os preços e resultados são fictícios.</p>'+
 '<div class="asset-counters">'+stats+'</div></div>';
 if(g.properties>0)out+='<div class="notice">🏠 Você já possuía '+g.properties+' imóvel(is) do modelo antigo, avaliados em '+brl(g.properties*75000)+'. Eles continuam preservados.</div>';
 if(e.company)out+='<div class="notice">🏢 Sua empresa original ('+clean(e.company.name)+') continua disponível em Negócios.</div>';
 out+='<div class="section-title">Bens que você possui <small>'+items.length+' item(ns)</small></div>';
 if(items.length){
   out+='<div class="asset-grid">'+items.map(a=>{
     const p=item(a.type);if(!p)return '';
     const value=worth(a,g),company=p[1]==='empresas';
     return '<article class="asset-tile owned"><div class="asset-tile-head"><span>'+p[2]+'</span><div><strong>'+clean(p[3])+'</strong><small>Comprado aos '+a.age+' anos'+(company?' · Nível '+(a.level||1):'')+'</small></div></div>'+
       '<p>Valor estimado: <b>'+brl(value)+'</b>'+(Number.isFinite(a.share)&&a.share<.999?' · Sua participação: '+Math.round(a.share*1000)/10+'%':'')+(company?'<br>Lucro acumulado: '+brl(a.profit||0):'')+'</p>'+
       '<div class="asset-actions">'+(company?'<button class="secondary-button" data-life-extra="upgrade" data-inventory="'+Number(a.id)+'" '+(!g.alive?'disabled':'')+'>Expandir</button>':'')+
       '<button class="secondary-button" data-life-extra="sell" data-inventory="'+Number(a.id)+'">Vender</button></div></article>';
   }).join('')+'</div>';
 }else out+='<div class="notice">Você ainda não tem bens comprados neste catálogo. Veja as opções abaixo.</div>';
 out+='<div class="section-title">Loja de bens</div><div class="asset-filters">'+Object.entries(TYPES).map(([id,label])=>
   '<button type="button" data-life-extra="filter" data-id="'+id+'" class="'+(filter===id?'active':'')+'">'+label+'</button>').join('')+'</div>';
 out+='<div class="asset-grid">'+selected.map(p=>{
  const available=g.age>=18 && g.alive&&g.cash>=p[4]&&items.length<70;
  const category=p[1]==='empresas';
  return '<article class="asset-tile"><div class="asset-tile-head"><span>'+p[2]+'</span><div><strong>'+clean(p[3])+'</strong><small>'+TYPES[p[1]]+'</small></div></div>'+
    '<p>Preço: <b>'+brl(p[4])+'</b><br>'+(category?'Empresa com receita e despesas simuladas':'Manutenção anual inicial: '+brl(p[5]))+'</p>'+
    '<button type="button" class="secondary-button" data-life-extra="buy" data-id="'+p[0]+'" '+(!available?'disabled':'')+'>'+(!available?(g.age<18?'A partir dos 18 anos':'Saldo insuficiente'):'Comprar por '+brl(p[4]))+'</button></article>';
 }).join('')+'</div>';
 return out;
}
function businessCards(g){
 const companies=owned(g).filter(a=>item(a.type)?.[1]==='empresas');
 return '<div class="section-title">Outras empresas <small>'+companies.length+'</small></div>'+
 '<div class="card"><p>Agora você pode ter várias empresas ao mesmo tempo. Veja seus empreendimentos e compre outros na aba <strong>Bens → Empresas</strong>.</p>'+
 '<button type="button" class="secondary-button" data-go="financas">🏢 Abrir loja de bens e empresas →</button></div>'+
 (companies.length?'<div class="asset-grid">'+companies.map(a=>{
   const p=item(a.type);
   return '<div class="asset-tile owned"><strong>'+p[2]+' '+clean(p[3])+'</strong><p>Nível '+(a.level||1)+' · '+(a.employees||1)+' funcionários · Resultado acumulado: '+brl(a.profit||0)+'</p></div>';
 }).join('')+'</div>':'');
}
function assetsAction(g,action,itemId,assetId){
 ensure(g);
 if(!g.alive)return showToast('Esta vida já terminou.');
 if(g.age<18)return showToast('Disponível a partir dos 18 anos.');
 if(g.pendingEvent)return showEvent();
 if(g.extra.prison>0)return showToast('Não é possível negociar bens na prisão.');
 const inv=owned(g),e=g.extra;
 if(action==='buy'){
   const p=item(itemId);if(!p)return;
   if(inv.length>=70)return showToast('Limite de 70 bens por partida.');
   if(g.cash<p[4])return showToast('Saldo insuficiente: faltam '+brl(p[4]-g.cash)+'.');
   
   if(!confirm('Comprar '+p[3]+' por '+brl(p[4])+'?'))return;
   g.cash-=p[4];
   const object={id:e.assetSequence++,type:p[0],age:g.age,years:0,level:1,employees:1,profit:0};
   inv.push(object);
   logLine('Novo bem adquirido','Você comprou '+p[3]+' por '+brl(p[4])+'.');
 }else{
   const a=inv.find(v=>v.id===Number(assetId));if(!a)return;
   const p=item(a.type);if(!p)return;
   if(action==='sell'){
     const resale=worth(a,g);
     if(!confirm('Vender '+p[3]+' por '+brl(resale)+'?'))return;
     inv.splice(inv.indexOf(a),1);g.cash+=resale;
     logLine('Bem vendido','Você vendeu '+p[3]+' por '+brl(resale)+'.');
   }else if(action==='upgrade'&&p[1]==='empresas'){
     const level=Number(a.level)||1,price=Math.round(p[4]*.32*level);
     
     if(g.cash<price)return showToast('Expansão custa '+brl(price)+'.');
     if(!confirm('Expandir '+p[3]+' por '+brl(price)+'?'))return;
     g.cash-=price;a.level=level+1;a.employees=(a.employees||1)+3;
     logLine('Expansão do negócio','Sua empresa '+p[3]+' agora é nível '+a.level+'.');
   }
 }
 save();render();
}
document.addEventListener('click',event=>{
 const btn=event.target.closest('[data-life-extra]');
 if(!btn)return;
 if(typeof game==='undefined'||!game)return;
 const action=btn.dataset.lifeExtra;
 if(action==='filter'){filter=btn.dataset.id in TYPES?btn.dataset.id:'todos';render();return}
 if(action==='school'||action==='talk'){schoolAction(game,action==='talk'?'talk':btn.dataset.id,btn.dataset.person);return}
 if(action==='club'){schoolClubAction(game,btn.dataset.id,btn.dataset.club);return}
 if(['buy','sell','upgrade'].includes(action))assetsAction(game,action,btn.dataset.id,btn.dataset.inventory);
});
window.CaminhosExtras={ensure,annual,wealth,worth,renderSchool,renderAssets,businessCards,schoolAction,schoolClubAction,friendshipInvite,friendshipDecision};
})();