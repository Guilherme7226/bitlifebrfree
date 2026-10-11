'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const listeners={};
const values=new Map();
const dom=new Map();
const asNode=id=>{
 if(!dom.has(id))dom.set(id,{
   id,dataset:{},classList:{toggle(){},add(){},remove(){}},
   value:'',textContent:'',innerHTML:'',style:{},disabled:false,
   addEventListener(){},setAttribute(){},appendChild(){},remove(){},click(){}
 });
 return dom.get(id);
};
const document={
 getElementById:asNode,
 querySelectorAll(sel){if(sel==='[data-tab]'||sel==='[data-dock]'||sel==='.nav-list .tab')return [];return []},
 addEventListener(type,cb){(listeners[type]||=([])).push(cb)},
 createElement(tag){return asNode(tag+'-'+Math.random())}
};
const storage={
 getItem(k){return values.has(k)?values.get(k):null},
 setItem(k,v){values.set(k,String(v))},
 removeItem(k){values.delete(k)}
};
const ctx=vm.createContext({
 window:{scrollTo(){},location:{origin:'https://example.com',pathname:'/'}},
 document,localStorage:storage,navigator:{},location:{origin:'https://example.com',pathname:'/'},
 console,setTimeout(){return 1},clearTimeout(){},
 Date,Math,JSON,Intl,URL,Blob,AbortController,
 confirm(){return true},prompt(){return 'Pipoca'}
});
for(const file of ['achievements.js','life-extras.js','career-paths.js','sim-world.js','ui-familiar.js','game.js']){
  vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
}
function code(src){return vm.runInContext(src,ctx)}
function click(dataset){
 const target={dataset,closest(selector){
   if(selector==='[data-life-extra]'&&dataset.lifeExtra)return this;
   if(selector==='[data-path-act]'&&dataset.pathAct)return this;
   if(selector==='[data-world-action]'&&dataset.worldAction)return this;
   return null;
 }};
 for(const listener of (listeners.click||[]))listener({target});
}
assert.equal(code('game'),null,'starts without a game');
code("startGame('Teste','Santos, SP','curioso')");
assert.equal(code('game.age'),0);
code('game.age=4;game.actions=3;render()');
assert.ok(code("game.people.filter(x=>x.role==='Colega').length")>=4,'school has classmates');
assert.ok(code("game.people.filter(x=>x.role==='Professor(a)').length")>=2,'school has teachers');
assert.match(code('window.CaminhosExtras.renderSchool(game)'),/Vida escolar/);
const oldScore=code('game.extra.school.average');
click({lifeExtra:'school',id:'study'});
assert.ok(code('game.extra.school.average')>oldScore,'studying improves school average');
assert.equal(code('game.actions'),2,'school action costs an action');
const teacher=code("game.people.find(p=>p.role==='Professor(a)').id");
const oldTeacherBond=code("game.people.find(p=>p.id==="+teacher+").bond");
click({lifeExtra:'talk',person:teacher});
assert.ok(code("game.people.find(p=>p.id==="+teacher+").bond")>oldTeacherBond,'talking builds relationship');
code('game.age=18;game.cash=1100000;game.actions=3;window.CaminhosExtras.annual(game);render()');
assert.equal(code('game.extra.school.finished'),true);
assert.ok(code("game.people.some(p=>p.role==='Ex-professor(a)')"),'teacher is retained after graduation');
click({lifeExtra:'buy',id:'hatch'});
click({lifeExtra:'buy',id:'apto'});
click({lifeExtra:'buy',id:'restaurante'});
assert.equal(code('game.extra.assetInventory.length'),3,'multiple different assets can be purchased');
assert.ok(code('window.CaminhosExtras.wealth(game)')>0);
assert.match(code('window.CaminhosExtras.renderAssets(game)'),/Loja de bens/);
assert.match(code('window.CaminhosExtras.businessCards(game)'),/Restaurante/);
const id=code('game.extra.assetInventory[0].id');
click({lifeExtra:'sell',inventory:id});
assert.equal(code('game.extra.assetInventory.length'),2,'owned item can be sold');
code('game.age=19;window.CaminhosExtras.annual(game);save()');
assert.equal(code('game.extra.assetYear'),19);
assert.match(storage.getItem('caminhos.save.v1'),/assetInventory/,'local save contains assets');
code('game=null;game=restore();render()');
assert.equal(code('game.extra.assetInventory.length'),2,'backwards-compatible restore');
assert.ok(code('window.CaminhosAchievements.count(game)')>0,'achievements still work');
const html=fs.readFileSync('index.html','utf8');
assert.match(html,/data-dock="more"/);
assert.match(html,/id="homeShortcut"/);
assert.match(html,/data-tab="escola"/);
const css=fs.readFileSync('styles.css','utf8');
assert.match(css,/grid-template-columns:\.9fr \.9fr 1\.1fr \.9fr \.9fr \.8fr/);

assert.match(code("window.CaminhosWorld.portrait('Helena','Professora',11)"),/<svg/,'NPCs possuem modelo 2D');
assert.notEqual(code("window.CaminhosWorld.portrait('Helena','Professora',11)"),code("window.CaminhosWorld.portrait('Daniel','Aluno',12)"),'retratos sao individuais');
assert.match(code('window.CaminhosExtras.renderSchool(game)'),/ensino médio|escolar/i,'ensino medio e formatura apresentados');
code('game.age=18;game.actions=3');
assert.equal(code("window.CaminhosPaths.offerGraduation(game)"),true,'convite apos ensino medio');
click({pathAct:'choose',choice:'faculdade'});
assert.equal(code("game.extra.lifeRoute.choice"),'faculdade','escolha faculdade apos formatura');
assert.match(code("renderCareer()"),/Concursos e Forças Armadas/,'exibe area de concursos');
code("game.cash=3000000;game.age=22;game.actions=3;game.stats.saude=100;game.stats.disciplina=100;game.stats.inteligencia=100;game.pendingEvent=null;render()");
click({pathAct:'enroll',id:'militar_exercito',track:'praca'});
assert.equal(code("game.extra.publicService.training.id"),'militar_exercito','matricula militar');
code("game.age=23;window.CaminhosPaths.onAnnual(game)");
assert.equal(code('game.job'),'militar_exercito','formatura inicia a carreira militar');
assert.match(code("window.CaminhosPaths.rankName(game)"),/Soldado|Cabo/,'patente militar');
assert.ok(code("window.CaminhosPaths.salary(game)")>0,'remuneracao militar');
code('game.actions=3');
click({pathAct:'practice'});
assert.ok(code('game.extra.publicService.active.merit')>=50,'treino desenvolve merito');
code("game.actions=3;game.age=25;game.cash=40000");
click({pathAct:'martial-train',id:'jiujitsu'});
assert.ok(code("game.extra.martialArts.jiujitsu.trainings")>=1,'judo e jiu jitsu treinaveis');
assert.match(code('window.CaminhosPaths.renderMartial(game)'),/Jiu-jítsu/);
code('game.actions=3;game.cash=3000000');
click({worldAction:'pet-add',id:'cachorro',choice:'adopt'});
assert.equal(code('game.extra.pets.length'),1,'pet foi adotado');
assert.equal(code('game.extra.pets[0].name'),'Pipoca','pets nomeados');
code('game.actions=3');
click({worldAction:'pet-care',id:1,choice:'feed'});
assert.ok(code('game.extra.pets[0].hunger')>=75,'alimentacao do pet');
assert.match(code('window.CaminhosWorld.renderPets(game)'),/Pipoca/);
code("window.CaminhosPaths.leave(game);game.job=null;game.age=38;game.actions=3;game.stats.carisma=100;game.cash=10000000;game.extra.reputation=95;game.extra.politics2.loyalty=85;Math.random=()=>0");
assert.match(code('window.CaminhosWorld.renderPolitics(game)'),/Presidente da República/);
click({worldAction:'election',id:'prefeito'});
assert.equal(code('game.extra.office'),null,'nao pode ser prefeito sem vereanca');
click({worldAction:'election',id:'vereador'});
assert.equal(code('game.extra.office'),'vereador','vereador eleito');
code('game.extra.office=null;game.actions=3');
click({worldAction:'election',id:'prefeito'});
assert.equal(code('game.extra.office'),'prefeito','prefeito eleito depois de vereador');
code('game.extra.office=null;game.actions=3');
click({worldAction:'election',id:'governador'});
assert.equal(code('game.extra.office'),'governador','governador eleito depois de prefeito');
code('game.extra.office=null;game.actions=3');
click({worldAction:'election',id:'presidente'});
assert.equal(code('game.extra.office'),'presidente','presidente eleito depois de governador');
code('game.actions=3;game.extra.politics2.integrity=70');
click({worldAction:'honest'});
assert.ok(code('game.extra.politics2.integrity')>=82,'gestao honesta melhora integridade');
code('game.actions=3');
click({worldAction:'corrupt'});
assert.ok(code('game.extra.prison')>=1,'corrupcao pode causar prisao');
assert.equal(code('game.extra.office'),null,'condenacao termina mandato');
assert.equal(code('game.job'),null,'condenacao suspende trabalho');
code('game.extra.prison=0;game.actions=3;game.age=40');
click({worldAction:'crime',id:'trafico'});
assert.ok(code('game.extra.record')>=1,'crime registra antecedentes');
assert.ok(code('game.extra.prison')>=1,'trafico ficticio pode levar a prisao');
const beforePrison=code('game.extra.prison');
code('game.age=41;window.CaminhosWorld.annual(game)');
assert.equal(code('game.extra.prison'),beforePrison-1,'desconta um ano de pena');
assert.match(code("window.CaminhosWorld.renderCrime(game)"),/Ficha judicial/);
assert.doesNotMatch(fs.readFileSync('index.html','utf8'),/data-tab="pets"/,'pets accessed from relationships, not separate main tab');
assert.match(fs.readFileSync('index.html','utf8'),/career-paths.js/);
assert.match(fs.readFileSync('index.html','utf8'),/sim-world.js/);
assert.match(code("window.CaminhosUI.renderTab(game,'atividades')"),/Artes marciais/i,'artes marciais in activities');
assert.match(code("window.CaminhosUI.renderTab(game,'financas')"),/Investimentos/,'menu de bens classico');
assert.match(code("window.CaminhosUI.renderTab(game,'carreira')"),/PROFISSÃO|Profissão/,'menu da carreira classico');
assert.match(code("window.CaminhosUI.renderTab(game,'relacoes')"),/Família|Amigos e afetos/,'menu de relacoes com nome');
assert.match(code("window.CaminhosUI.renderTab(game,'relacoes')"),/Adotar ou cuidar dos pets/,'pets belong to relationships');
assert.doesNotMatch(code("window.CaminhosUI.renderTab(game,'atividades')"),/Animais de estimação|Adotar ou cuidar dos pets/,'pets absent from activities');
assert.doesNotMatch(code("window.CaminhosUI.renderTab(game,'atividades')"),/Escola e aprendizado/,'school absent from activities');
assert.match(code("window.CaminhosUI.renderTab(game,'carreira')"),/Histórico escolar/,'school history under career');
code('game.age=9');
assert.match(code("window.CaminhosUI.renderTab(game,'carreira')"),/Notas.*Professores e colegas/,'school accessible from School/Job for child');
assert.match(code("window.CaminhosUI.renderTab(game,'carreira')"),/ESCOLA|Escola/,'school name in youth section');
assert.match(code("window.CaminhosUI.renderTab(game,'vida')"),/Idade:/,'diario em texto com idade');
assert.match(code("window.CaminhosUI.renderStats(game)"),/Aparência/,'barras de aparencia e saude');
assert.match(fs.readFileSync('index.html','utf8'),/theme-classic.css/,'tema classico incluido');
assert.match(fs.readFileSync('index.html','utf8'),/ui-familiar.js/,'menus classicos incluidos');
assert.match(fs.readFileSync('theme-classic.css','utf8'),/background:#23a642/,'idade em verde');
assert.match(fs.readFileSync('theme-classic.css','utf8'),/retro-screen-bar/,'cabecalho das telas');
const iosCss=fs.readFileSync('theme-classic.css','utf8');
assert.match(iosCss,/height:calc\(64px \+ env\(safe-area-inset-top, 0px\)\)/,'cabeçalho respeita barra de status');
assert.match(iosCss,/padding-top:env\(safe-area-inset-top, 0px\)/,'reserva vertical segura do iPhone');
assert.match(iosCss,/top:calc\(159px \+ env\(safe-area-inset-top, 0px\)\)/,'título fixo não invade o cabeçalho');
assert.match(fs.readFileSync('index.html','utf8'),/theme-classic\.css\?v=20261011-ios-safe-area/,'cache do iPhone atualizado');
assert.doesNotMatch(fs.readFileSync('index.html','utf8'),/data-tab="escola"|data-tab="hobbies"/,'school and martial arts accessed in relevant parent sections');
console.log('OK: escola, amigos, professores, bens, empresas, venda, salvamento e navegação.');
