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
     g.people.push({id,name,role,emoji:role==='Colega'?'🧑‍🎓':'👩‍🏫',bond:rand(37,71)});
   }
 }
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
   const evolution=rand(-7,6)+Math.round((g.stats.inteligencia-50)/16)+Math.round((g.stats.disciplina-50)/18);
   s.average=clamp(s.average+evolution);
   if(s.average>=85){s.awards++;noteAnnual('Destaque escolar','Você recebeu reconhecimento por seu desempenho na escola.')}
   if(g.age===4)noteAnnual('Primeiro dia na escola', 'Você começou a educação infantil e conheceu colegas e professores.');
   if(g.age===6)noteAnnual('Ensino fundamental','Você começou o ensino fundamental!');
   if(g.age===15)noteAnnual('Ensino médio','Você entrou no ensino médio, com novas matérias e desafios.');
 }
 if(g.age>=18&&!s.finished){
   s.finished=true;
   g.people.forEach(p=>{if(p.role==='Colega')p.role='Amizade';else if(p.role==='Professor(a)')p.role='Ex-professor(a)'});
   noteAnnual('Fim da escola','Você concluiu a escola com média '+s.average+'/100 e '+s.awards+' destaque(s). Seus colegas continuam como amigos.');
 }
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
 ensure(g);const s=g.extra.school, schoolPeople=g.people.filter(p=>['Colega','Amizade','Professor(a)','Ex-professor(a)'].includes(p.role));
 if(g.age<4)return displayTitle('Minha escola','Sua jornada escolar começará aos 4 anos.')+
 '<div class="card"><h3>🧸 Os primeiros anos</h3><p>Você ainda está em casa com sua família. Avance até os 4 anos para conhecer colegas e professores.</p></div>';
 const current=g.age<=17&&!s.finished;
 const teachers=schoolPeople.filter(p=>p.role.toLowerCase().includes('professor'));
 const mates=schoolPeople.filter(p=>p.role==='Colega'||p.role==='Amizade').slice(0,8);
 const personCard=p=>'<div class="school-person"><div class="school-icon portrait-holder">'+(window.CaminhosWorld?.portrait(p.name,p.role,p.id)||clean(p.emoji))+'</div><div><strong>'+clean(p.name)+'</strong><small>'+clean(p.role)+' · Vínculo '+Math.round(p.bond)+'/100</small></div>'+
 (current?'<button type="button" class="secondary-button" data-life-extra="talk" data-person="'+Number(p.id)+'" '+(!g.alive?'disabled':'')+'>Conversar</button>':'')+'</div>';
 let out=displayTitle('🏫 Minha escola',current?'Colegas, professores, aprendizado e acontecimentos ao longo do ano.':'Recordações da sua vida escolar.');
 if(!current&&g.age>=18)out+=window.CaminhosPaths?.futureChoice(g)||'';
 out+='<div class="card"><div class="school-top"><span>📚 '+clean(s.name)+'</span><strong>'+lifeStageSchool(g)+'</strong></div><div class="school-metrics">'+
 '<div><small>Média geral</small><strong>'+Math.round(s.average)+'/100</strong></div>'+
 '<div><small>Comportamento</small><strong>'+Math.round(s.discipline)+'/100</strong></div>'+
 '<div><small>Destaques</small><strong>'+Math.round(s.awards)+'</strong></div></div></div>';
 if(current){
   const available=g.alive&&!g.pendingEvent&&!g.extra.prison;
   const options=[['study','📖 Estudar para a prova'],['homework','📝 Fazer lição'],['project','🔬 Participar de projeto'],['friends','🤝 Brincar com os colegas'],['teacher','🙋 Pedir ajuda ao professor'],['club','🎭 Clube escolar'],...(g.age>=15?[['vestibular','📚 Preparação para faculdade']]:[])];
   out+='<div class="section-title">Vida escolar <small>Prática livre</small></div><div class="school-actions">'+
    options.map(([id,label])=>'<button type="button" class="secondary-button" data-life-extra="school" data-id="'+id+'" '+(!available?'disabled':'')+'>'+label+'</button>').join('')+'</div>';
   if(g.pendingEvent)out+='<div class="notice">Resolva a decisão pendente para realizar atividades escolares.</div>';
 }
 out+='<div class="section-title">Meus colegas <small>'+mates.length+'</small></div><div class="school-list">'+mates.map(personCard).join('')+'</div>';
 out+='<div class="section-title">Professores <small>'+teachers.length+'</small></div><div class="school-list">'+teachers.map(personCard).join('')+'</div>';
 out+='<div class="notice">As interações com colegas e professores também aparecem na aba Relações. Os personagens e notas são fictícios e pertencem a esta partida.</div>';
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
   relationship.bond=clamp(relationship.bond+rand(7,13));
   delta={carisma:3,felicidade:3};title='Conversando na escola';desc='Você conversou com '+relationship.name+' e fortaleceram a relação.';
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
 if(['buy','sell','upgrade'].includes(action))assetsAction(game,action,btn.dataset.id,btn.dataset.inventory);
});
window.CaminhosExtras={ensure,annual,wealth,worth,renderSchool,renderAssets,businessCards,schoolAction};
})();