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
for(const file of ['achievements.js','dynasty.js','skills.js','everyday.js','life-extras.js','career-paths.js','sim-world.js','ui-familiar.js','game.js']){
  vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
}
function code(src){return vm.runInContext(src,ctx)}
function click(dataset){
 const target={dataset,closest(selector){
   if(selector==='[data-life-extra]'&&dataset.lifeExtra)return this;
   if(selector==='[data-path-act]'&&dataset.pathAct)return this;
   if(selector==='[data-world-action]'&&dataset.worldAction)return this;
   if(selector==='[data-everyday]'&&dataset.everyday)return this;
   if(selector==='[data-skill-train]'&&dataset.skillTrain)return this;
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
assert.equal(code('game.actions'),3,'school action no longer consumes any annual quota');
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
assert.doesNotMatch(html,/data-dock="more"/,"More is present only in the top header");
assert.match(html,/id="homeShortcut"/);
assert.doesNotMatch(html,/data-tab="escola"/,"School accessible from career rather than separate top-level tab");
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
assert.match(code("window.CaminhosUI.renderTab(game,'relacoes')"),/Família|Amigos/,'menu de relacoes com nome');
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
assert.match(fs.readFileSync('index.html','utf8'),/theme-classic\.css\?v=20261011-combate/,'cache do iPhone atualizado');
assert.doesNotMatch(fs.readFileSync('index.html','utf8'),/data-tab="escola"|data-tab="hobbies"/,'school and martial arts accessed in relevant parent sections');
const statusCss=fs.readFileSync('theme-classic.css','utf8');
assert.match(statusCss,/\.game>\.stats-strip\{\s*order:1;/,'status aparecem antes do diario no iPhone');
assert.match(statusCss,/\.game>\.body-grid\{order:2/,'diario vem apos status');
assert.match(statusCss,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/,'seis status em duas colunas');
assert.match(code("window.CaminhosUI.renderStats(game)"),/Felicidade[\s\S]*Saúde[\s\S]*Inteligência[\s\S]*Aparência/,'quatro atributos principais disponiveis');
code("openMoreMenu()");
assert.match(code("document.getElementById('modalContent').innerHTML"),/Recomeçar vida/,'reset disponivel em Mais');
assert.match(fs.readFileSync('cloud.js','utf8'),/async function resetLife\(\)/,'nuvem possui rotina de reset');
assert.match(fs.readFileSync('cloud.js','utf8'),/\.delete\(\)\.eq\('user_id',uid\)/,'reset apaga backup da conta conectada');
assert.match(fs.readFileSync('index.html','utf8'),/cloud\.js\?v=20261011-account-achievements/,'copia de seguranca no iPhone atualizada');
assert.ok(code('window.CaminhosAchievements.total')>=170,'170+ permanent account achievements');
assert.match(code("window.CaminhosUI.renderTab(game,'atividades')"),/Hobbies e coisas em geral|Habilidades|Lazer/,'activities grouped into lifestyle sections');
assert.match(code('window.CaminhosSkills.render(game)'),/Violão/,'musical talents available');
code("game.age=24;game.extra.prison=0;game.alive=true;game.pendingEvent=null;game.actions=0");
const prevSkill=code("window.CaminhosSkills.score(game,'violao').level");
click({skillTrain:'violao'});
click({skillTrain:'violao'});
click({skillTrain:'violao'});
assert.equal(code("window.CaminhosSkills.score(game,'violao').trainings"),3,'practices repeat within same year');
assert.ok(code("window.CaminhosSkills.score(game,'violao').level")>prevSkill,'practice raises skill');
assert.equal(code("game.actions"),0,'practices do not require actions quota');
const oldHappiness=code('game.stats.felicidade');
click({everyday:'cinema'});
assert.ok(code('game.stats.felicidade')>=oldHappiness,'cinema leisure changes happiness');
assert.match(code('window.CaminhosEveryday.renderMenu(game)'),/Ir ao médico/,'medical visits enabled');
assert.match(code("window.CaminhosEveryday.randomEvent(game).story"),/.+/,'random event has story');
const totalBeforeHeir=code('window.CaminhosAchievements.count(game)');
code("game.alive=true;game.extra.prison=0;game.children=0;game.age=42;game.name='Familia Silva';game.actions=3");
const newborn=code("window.CaminhosDynasty.birth(game)");
assert.ok(newborn.includes('Silva'),'child inherits surname');
assert.equal(code('game.children'),1,'birth creates genealogical record');
code('game.alive=false;window.CaminhosDynasty.recordDeath(game)');
assert.equal(code('window.CaminhosDynasty.candidates(game).length'),1,'living descendants appear for succession');
assert.match(code('window.CaminhosDynasty.render(game)'),/Continuar →/,'heirs can be selected');
assert.equal(code('window.CaminhosDynasty.chooseHeir(game,2)'),true,'continue as child');
assert.equal(code('game.alive'),true,'heir continues the save');
assert.equal(code('game.age'),0,'newborn heir inherits own age');
assert.equal(code('game.extra.dynasty.transitions'),1,'family succession tracked');
assert.match(code('window.CaminhosDynasty.render(game)'),/Geração 2/,'family tree keeps generations');
assert.ok(code('window.CaminhosAchievements.count(game)')>=totalBeforeHeir,'achievements persist after death');
const permanentTotal=code('window.CaminhosAchievements.count(game)');
code("startGame('Outra Familia','Santos, SP','curioso')");
assert.ok(code('window.CaminhosAchievements.count(game)')>=permanentTotal,'achievements survive beginning another life');
assert.ok(JSON.parse(storage.getItem('caminhos.achievements.account.guest.v2')),'achievements stored separately');
assert.match(fs.readFileSync('cloud.js','utf8'),/merge_account_achievements/,'atomic account sync');
assert.match(fs.readFileSync('dynasty.js','utf8'),/function chooseHeir/,'family legacy module present');
assert.match(fs.readFileSync('index.html','utf8'),/dynasty.js/,'legacy module loaded');
assert.match(fs.readFileSync('index.html','utf8'),/data-tab="arvore"/,'family navigation enabled');
// Health zero must cause immediate death and a succession-ready screen.
code("startGame('Saude Teste','Santos, SP','curioso')");
code('game.age=39;game.stats.saude=1');
code('statChange({saude:-1});save()');
assert.equal(code('game.stats.saude'),0,'health clamped to zero');
assert.equal(code('game.alive'),false,'health 0 immediately kills the character');
assert.equal(code('game.extra.dynasty.pastLives.length'),1,'death registered for family lineage');
assert.match(code("document.getElementById('modalContent').innerHTML"),/legado/,'shows succession dialog');
code("startGame('Outra Vida','Santos, SP','curioso')");
code('game.age=22;game.stats.saude=1;game.pendingEvent={source:"offline",title:"Evento",story:"Escolha",choices:[{text:"Arriscar",delta:{saude:-5}}]};applyChoice(0)');
assert.equal(code('game.alive'),false,'a risky choice that reaches health zero immediately ends the life');
assert.match(code('game.lastEvent'),/saúde|Saúde/,'journal records health zero death');
code("restartLife()");
assert.equal(code('game'),null,'reset volta para criacao de personagem');
assert.equal(storage.getItem('caminhos.save.v1'),null,'reset apaga save local');
// Sorte continua na mecanica, mas nao aparece como atributo visual.
code("startGame('Sorte Oculta','Santos, SP','curioso')");
assert.ok(Number.isFinite(code("game.extra.luck")),'sorte interna e gerada normalmente');
assert.doesNotMatch(code("window.CaminhosUI.renderStats(game)"),/Sorte|🍀/,'sorte nao aparece nas barras de status');
assert.doesNotMatch(code("window.CaminhosSkills.render(game)"),/Sorte:|🍀/,'habilidades nao mostram valor da sorte');
assert.doesNotMatch(code("window.CaminhosEveryday.renderMenu(game)"),/Sorte:\\s*\\d+|🍀/,'atividades nao mostram percentual da sorte');
assert.match(fs.readFileSync('skills.js','utf8'),/const luck=g\.extra\.luck/,'talento ainda usa sorte nos calculos');
assert.match(fs.readFileSync('everyday.js','utf8'),/const prob=\(g\.extra\.luck/,'loteria ainda usa sorte interna');
assert.match(fs.readFileSync('index.html','utf8'),/ui-familiar\.js\?v=20261011-friendship/,'iPhone recebe o layout atualizado');
// User interface must preserve four general attributes and show only applicable career stats.
const four=code("window.CaminhosUI.renderStats(game)");
assert.equal((four.match(/class="retro-stat-row retro-stat-action"/g)||[]).length,4,
 'exactly four core stats by default');
assert.doesNotMatch(four,/Carisma|Disciplina|Popularidade|Fama/,'hide professional extras outside careers');
assert.match(four,/data-stat="aparencia"/,'appearance is touchable');
code("game.history=[{age:30,title:'Mais recente',description:'Mensagem recente'},{age:29,title:'Mais antigo',description:'Mensagem antiga'}]");
const timeline=code("window.CaminhosUI.renderTab(game,'vida')");
assert.ok(timeline.indexOf('Mensagem recente')<timeline.indexOf('Mensagem antiga'),
 'diary displays newest entries first');
const appearance=code("game.extra.appearance");
code("openAttributeOpportunity('aparencia')");
assert.equal(code("game.pendingEvent.source"),'attribute','tap attribute opens decision');
assert.match(code("document.getElementById('modalContent').innerHTML"),/Uma mudança de visual/,'visual boost modal appears');
code("applyChoice(0)");
assert.ok(code("game.extra.appearance")>appearance,'choice changes visible appearance stat');
assert.equal(code('game.pendingEvent'),null,'decision ends modal event');
code("game.job='politico';game.extra.reputation=72;game.age=40;render()");
const politician=code("window.CaminhosUI.renderStats(game)");
assert.match(politician,/Popularidade/,'politician sees popularity');
assert.equal((politician.match(/retro-stat-action/g)||[]).length,5,
 'politician gets one extra professional stat');
code("game.job='ator';game.extra.office=null;game.extra.fame=60;render()");
const actor=code("window.CaminhosUI.renderStats(game)");
assert.match(actor,/Fama/,'famous career shows fame');
assert.doesNotMatch(actor,/Popularidade/,'does not mix professional bars');
const cssFixed=fs.readFileSync('theme-classic.css','utf8');
assert.match(cssFixed,/position:sticky;[\s\S]*top:calc\(159px \+ env\(safe-area-inset-top, 0px\)\)/,
 'stats remain visible under iPhone notch during scroll');
assert.match(cssFixed,/--stats-sticky-size:79px/,'sticky reserved space for core stats');
assert.match(fs.readFileSync('index.html','utf8'),/game\.js\?v=20261011-friendship/,
 'new game logic cache busted');


const pageHTML=fs.readFileSync('index.html','utf8');
const dockMarkup=pageHTML.match(/<nav class="mobile-dock"[^>]*>([\s\S]*?)<\/nav>/)?.[1]||'';
assert.deepEqual([...dockMarkup.matchAll(/data-dock="([^"]+)"/g)].map(m=>m[1]),[
 'carreira','financas','advance','relacoes','atividades'
],'mobile dock has exactly the five requested controls');
assert.doesNotMatch(dockMarkup,/data-dock="more"|>Mais</,'More is not in mobile dock');
assert.match(pageHTML,/id="openNavigation"[^>]*aria-label="Abrir Mais"/,
 'More remains available in top header');
assert.match(fs.readFileSync('game.js','utf8'),
 /\$\('openNavigation'\)\.addEventListener\('click',openMoreMenu\)/,
 'top menu opens the full navigation');
assert.match(fs.readFileSync('theme-classic.css','utf8'),
 /grid-template-columns:minmax\(0,1fr\) minmax\(0,1fr\) minmax\(0,1\.25fr\) minmax\(0,1fr\) minmax\(0,1fr\)/,
 'five controls are distributed with the Age button centered');

// Social interactions report results in a popup and discourage spamming the same person.
code("startGame('Teste Social','Santos, SP','curioso')");
code('game.age=27;game.cash=1000;game.people[0].bond=55;game.people[0].irritation=0');
const socialName=code('game.people[0].name');
code("relationAction(1,'aproximar')");
const socialPopup=code("document.getElementById('modalContent').innerHTML");
assert.match(socialPopup,/Você conversou com/,'conversation shows confirmation');
assert.ok(socialPopup.includes(socialName),'popup displays the actual contact name');
assert.match(socialPopup,/Vínculo com/,'popup explains changed relationship score');
const firstSocialBond=code('game.people[0].bond');
assert.ok(firstSocialBond>55,'first conversation normally helps the relationship');
code("relationAction(1,'aproximar')");
const secondSocialBond=code('game.people[0].bond');
assert.ok(secondSocialBond>firstSocialBond,'second talk may still help');
code("relationAction(1,'aproximar')");
code("relationAction(1,'aproximar')");
assert.ok(code('game.people[0].bond')<secondSocialBond,
 'pestering a character repeatedly lowers relationship');
assert.ok(code('game.people[0].irritation')>=40,
 'repeating a conversation adds persistent irritation');
assert.match(code("document.getElementById('modalContent').innerHTML"),/ficou irritado/,
 'irritation appears in a confirmation popup');
const beforeArgument=code('game.people[0].bond');
code("relationAction(1,'discutir')");
assert.ok(code('game.people[0].bond')<beforeArgument,'argument is a negative interaction');
const beforeApology=code('game.people[0].irritation');
code("relationAction(1,'desculpas')");
assert.ok(code('game.people[0].irritation')<beforeApology,'apology reduces anger');
assert.match(code("window.CaminhosUI.renderTab(game,'relacoes')"),/data-ui-person/,'relation cards keep profile interaction access');
assert.match(fs.readFileSync('ui-familiar.js','utf8'),/socialActions=\[/, 'UI offers social action choices');
assert.match(fs.readFileSync('ui-familiar.js','utf8'),/'discutir','😠'|'provocar','😒'/, 'UI offers negative social interactions');
assert.match(fs.readFileSync('life-extras.js','utf8'),/relationAction\(Number\(relationship.id\),'aproximar'\)/,
 'talking with a schoolmate uses the same relationship interactions');


// Expanded relationship interactions from user-provided reference.
code("startGame('Teste Interacoes','Santos, SP','curioso')");
code("game.age=27;game.cash=1000;game.people[0].bond=90;game.people[0].irritation=0");
const moneyBefore=code("game.cash");
code("relationAction(1,'pedir-dinheiro')");
const moneyPopup=code("document.getElementById('modalContent').innerHTML");
assert.match(moneyPopup,/dinheiro|financeira/i,'asking family for money returns outcome');
const moneyAfterFirst=code("game.cash");
const bondBeforeSecondRequest=code("game.people[0].bond");
code("relationAction(1,'pedir-dinheiro')");
assert.equal(code("game.cash"),moneyAfterFirst,'repeated money requests do not create unlimited income');
assert.ok(code("game.people[0].bond")<bondBeforeSecondRequest,
 'repeated request annoys the family member');
const cinemaBefore=code("game.cash");
code("relationAction(1,'cinema')");
assert.equal(code("game.cash"),cinemaBefore-90,'cinema deducts a real ticket cost');
assert.match(code("document.getElementById('modalContent').innerHTML"),/cinema|filme/i,
 'cinema produces its own popup');
code("relationAction(1,'acordo')");
assert.ok(code("game.extra.socialBelongings.length")<=3,
 'agreement uses finitely owned personal items');
assert.match(code("document.getElementById('modalContent').innerHTML"),/acordo|vender|vendeu/i,
 'agreement produces a negotiation outcome');
const beforeInsult=code("game.people[0].bond");
code("relationAction(1,'insultar')");
assert.ok(code("game.people[0].bond")<beforeInsult,'insult damages relationship');
code("relationAction(1,'espiar')");
assert.match(code("document.getElementById('modalContent').innerHTML"),/espiou|espionado|espionar|notado/i,
 'spying creates an uncertain but specific outcome');
const uiExtended=fs.readFileSync('ui-familiar.js','utf8');
assert.match(uiExtended,/'pedir-dinheiro'/,'financial request exists for family');
assert.match(uiExtended,/'cinema'/,'cinema appears as a social action');
assert.match(uiExtended,/'acordo'/,'item sale is a social action');
assert.match(uiExtended,/'insultar'/,'insult is available');
assert.match(uiExtended,/'espiar'/,'spying is available');
assert.match(uiExtended,/social-option-body/,'social profiles show descriptions like the reference');
assert.match(fs.readFileSync('index.html','utf8'),/game\.js\?v=20261011-friendship/,
 'updated social actions are uncached on mobile');


// Agressao ficcional com golpes basicos ou desbloqueados por arte marcial.
code("startGame('Teste de Combate','Santos, SP','curioso')");
code("game.age=26;game.cash=10000;game.stats.saude=100;game.people[0].bond=91;game.people[0].irritation=0");
const basics=code('window.CaminhosPaths.combatMoves(game)');
assert.deepEqual(Array.from(basics.map(m=>m.name)),['Tapa','Empurrão','Soco simples'],
 'sem treinamento, o personagem conhece somente golpes basicos');
code("chooseStrike(1)");
let attackDialog=code("document.getElementById('modalContent').innerHTML");
assert.match(attackDialog,/Golpes básicos/,'abertura do popup de ataque');
assert.match(attackDialog,/Soco simples/,'mostra golpe basico');
assert.doesNotMatch(attackDialog,/Golpes aprendidos/,'sem golpes avancados nao mostra lista de artes marciais');
const forbiddenBefore=code('game.people[0].bond');
code("performStrike(1,'imobilizacao')");
assert.equal(code('game.people[0].bond'),forbiddenBefore,
 'golpe ainda nao aprendido nao pode ser usado mesmo por tentativa direta');
code("window.CaminhosPaths.martialAction(game,'jiujitsu','train')");
assert.ok(code("game.extra.martialArts.jiujitsu.trainings")>=1,'treino de jiu jitsu registrado');
code("game.extra.martialArts.jiujitsu.skill=65;game.extra.martialArts.jiujitsu.trainings=15");
const learned=code("window.CaminhosPaths.combatMoves(game)");
assert.ok(learned.some(m=>m.id==='queda'),'queda liberada no nivel intermediario');
assert.ok(learned.some(m=>m.id==='imobilizacao'),'imobilizacao liberada ao evoluir no jiu jitsu');
assert.ok(!learned.some(m=>m.id==='gancho'),'boxe nao desbloqueado sem treino');
code("chooseStrike(1)");
attackDialog=code("document.getElementById('modalContent').innerHTML");
assert.match(attackDialog,/Golpes aprendidos/,'separa opcoes tecnicas');
assert.match(attackDialog,/Imobilização/,'golpe avancado aparece no popup');
const beforeBondAttack=code('game.people[0].bond');
code("performStrike(1,'imobilizacao')");
assert.ok(code('game.people[0].bond')<beforeBondAttack,'agressao afeta relacionamento negativamente');
assert.ok(code('game.people[0].irritation')>0,'pessoa agredida fica irritada');
assert.equal(code('game.extra.combatEncounters["1"].count'),1,'contador de agressao salvo por ano');
assert.match(code('game.history[0].title'),/Conflito com/,'agressao registrada no diario');
assert.match(code("document.getElementById('modalContent').innerHTML"),/Relacionamento|vínculo|Vínculo/,
 'pop up confirma impacto na relacao');
assert.match(fs.readFileSync('ui-familiar.js','utf8'),/'agredir','🥊'/,
 'agressao disponivel no perfil da pessoa');
assert.match(fs.readFileSync('game.js','utf8'),/CaminhosWorld\?\.jail\(game,'agressão física'/,
 'risco de condenacao e prisão implementado');
assert.match(fs.readFileSync('index.html','utf8'),/career-paths\.js\?v=20261011-combate/,
 'cache de golpes atualizado para iPhone');


// Escola abre todas as interacoes; apenas amigos aceitos aparecem em Relacionamentos.
code("startGame('Teste Amizades','Santos, SP','curioso')");
code("game.age=8;render()");
const friendMate=code("game.people.find(p=>p.role==='Colega').id");
const schoolMateName=code("game.people.find(p=>p.id==="+friendMate+").name");
const schoolHTML=code("window.CaminhosExtras.renderSchool(game)");
assert.match(schoolHTML,/data-ui-person/,'school cards open complete person profiles');
assert.ok(schoolHTML.includes(schoolMateName),'school displays classroom contacts');
assert.doesNotMatch(code("window.CaminhosUI.renderTab(game,'relacoes')"),new RegExp(schoolMateName),
 'a schoolmate is not in Relationships until the friendship is accepted');
code("window.CaminhosUI.openPerson(game,"+friendMate+")");
let schoolProfile=code("document.getElementById('modalContent').innerHTML");
assert.match(schoolProfile,/data-option="aproximar"/,'talking accessible through the School');
assert.match(schoolProfile,/data-option="agredir"/,'other interactions accessible through the School');
assert.match(schoolProfile,/data-option="pedir-amizade" disabled/,'request needs bond 65+');
code("game.people.find(p=>p.id==="+friendMate+").bond=90");
code("window.CaminhosUI.openPerson(game,"+friendMate+")");
schoolProfile=code("document.getElementById('modalContent').innerHTML");
assert.match(schoolProfile,/data-option="pedir-amizade"/,'ask for friendship accessible with good relationship');
assert.doesNotMatch(schoolProfile,/data-option="pedir-amizade" disabled/,'request enabled after good relationship');
code("{const prior=Math.random;Math.random=()=>0;try{relationAction("+friendMate+",'pedir-amizade')}finally{Math.random=prior}}");
assert.equal(code("game.people.find(p=>p.id==="+friendMate+").friend"),true,
 'friendship was explicitly requested and accepted');
assert.ok(code("window.CaminhosUI.renderTab(game,'relacoes')").includes(schoolMateName),
 'accepted friend now appears in Relationships');
assert.match(code("document.getElementById('modalContent').innerHTML"),/aceitou sua amizade/,
 'friendship shows confirmation popup');
code("game.age=18;window.CaminhosExtras.annual(game)");
assert.equal(code("game.people.find(p=>p.id==="+friendMate+").role"),'Ex-colega',
 'graduation preserves contact status without fabricating friendships');
const anotherClassmate=code("game.people.find(p=>p.role==='Ex-colega'&&!p.friend).id");
const anotherName=code("game.people.find(p=>p.id==="+anotherClassmate+").name");
assert.ok(!code("window.CaminhosUI.renderTab(game,'relacoes')").includes(anotherName),
 'unbefriended graduates are not automatically added');
code("game.people.find(p=>p.id==="+anotherClassmate+").bond=84");
code("game.extra.friendshipInvitationYear=-1");
code("{const prior=Math.random;Math.random=()=>0;try{game.pendingEvent=window.CaminhosExtras.friendshipInvite(game)}finally{Math.random=prior}}");
assert.equal(code("game.pendingEvent.source"),'friendship','classmate can invite friendship randomly');
assert.ok(code("game.pendingEvent.story").includes(anotherName),'friendship invitation identifies actual person');
code("applyChoice(0)");
assert.equal(code("game.people.find(p=>p.id==="+anotherClassmate+").friend"),true,'accepted invitation marks friendship');
assert.ok(code("window.CaminhosUI.renderTab(game,'relacoes')").includes(anotherName),
 'friends who invite you also appear in Relationships');
const thirdClassmate=code("game.people.find(p=>p.role==='Ex-colega'&&!p.friend).id");
code("game.people.find(p=>p.id==="+thirdClassmate+").bond=82");
code("game.pendingEvent={source:'friendship',personId:"+thirdClassmate+",title:'Convite',story:'Uma pessoa propôs amizade',choices:[{text:'Sim',delta:{felicidade:4},accept:true},{text:'Não',delta:{felicidade:-1},accept:false}]}");
code("applyChoice(1)");
assert.equal(code("game.people.find(p=>p.id==="+thirdClassmate+").friend"),false,
 'declining a request does not create friendship');
assert.ok(!code("window.CaminhosUI.renderTab(game,'relacoes')").includes(code("game.people.find(p=>p.id==="+thirdClassmate+").name")),
 'declined invitations remain outside Relationships');


// Clubes escolares: participantes identificados, popularidade, eleicoes e lideranca.
code("startGame('Teste Clubes','Santos, SP','curioso')");
code("game.age=9;render()");
const clubMenu=code("window.CaminhosExtras.renderSchool(game)");
assert.match(clubMenu,/Clubes escolares/,'clubes ficam na tela da Escola');
assert.match(clubMenu,/Clube de Ciências/,'mostra clube de ciencias');
assert.match(clubMenu,/Clube Esportivo/,'mostra clube de esportes');
assert.match(clubMenu,/Clube de Música/,'mostra clube de musica');
assert.match(clubMenu,/data-life-extra="club" data-id="join"/,'entrar em um clube via escola');
assert.ok(code("game.people.filter(p=>p.role==='Colega').length")>=10,'integrantes dos clubes tem nomes e perfil');
click({lifeExtra:'club',id:'join',club:'debate'});
assert.equal(code('game.extra.school.clubs.activeId'),'debate','entrou no clube de debate');
assert.equal(code('game.extra.school.clubs.status'),'Integrante','comeca como integrante');
const clubHTML=code('window.CaminhosExtras.renderSchool(game)');
assert.match(clubHTML,/data-life-extra="club" data-id="practice"/,'praticar no clube');
assert.match(clubHTML,/data-life-extra="club" data-id="organize"/,'organizar evento');
assert.match(clubHTML,/data-life-extra="club" data-id="campaign"/,'buscar apoio na lideranca');
assert.match(clubHTML,/data-life-extra="club" data-id="leader"/,'votar em novo lider');
assert.match(clubHTML,/Alunos do clube/,'clube apresenta alunos do grupo');
assert.match(clubHTML,/data-ui-person="\d+"/,'alunos permitem perfil e interacoes gerais');
const clubMemberId=code('game.extra.school.clubs.list.find(c=>c.id==="debate").members[0]');
code("window.CaminhosUI.openPerson(game,"+clubMemberId+")");
assert.match(code("document.getElementById('modalContent').innerHTML"),/data-option="pedir-amizade"/,
 'membros do clube podem receber convite de amizade');
const clubPopularStart=code('game.extra.school.clubs.popularity');
click({lifeExtra:'club',id:'practice'});
assert.ok(code('game.extra.school.clubs.popularity')>=clubPopularStart,
 'participar do clube aumenta popularidade');
assert.equal(code('game.extra.school.clubs.participation'),1,'primeira participacao registrada');
for(let i=0;i<5;i++)click({lifeExtra:'club',id:'help'});
assert.equal(code('game.extra.school.clubs.participation'),6,'acoes de clube ilimitadas por ano');
assert.ok(['Integrante','Coordenador(a)'].includes(code('game.extra.school.clubs.status')),
 'deve evoluir cargo inicialmente');
code('game.extra.school.clubs.popularity=85');
code("game.extra.school.clubs.list.find(c=>c.id==='debate').members.forEach(mid=>{const person=game.people.find(p=>p.id===mid);person.bond=90})");
click({lifeExtra:'club',id:'campaign'});
assert.match(code("document.getElementById('modalContent').innerHTML"),/liderança|candidatura|apoio/i,
 'campanha gera popup narrativo');
code('game.extra.school.clubs.popularity=90');
code("{const prior=Math.random;Math.random=()=>0;try{window.CaminhosExtras.schoolClubAction(game,'leader')}finally{Math.random=prior}}");
assert.equal(code('game.extra.school.clubs.status'),'Líder','eleicao pode levar ao posto de lider');
assert.ok(code('game.extra.school.clubs.prestige')>=18,'lideranca influencia prestigio do clube');
assert.match(code("document.getElementById('modalContent').innerHTML"),/eleito.*líder/i,
 'popup confirma eleicao');
assert.match(storage.getItem('caminhos.save.v1'),/"status":"Líder"/,
 'status no clube salvo permanentemente');
const unknownClubName=code('game.people.find(p=>p.id==='+clubMemberId+').name');
assert.ok(!code("window.CaminhosUI.renderTab(game,'relacoes')").includes(unknownClubName),
 'ser integrante de um clube nao cria amizade automaticamente');
code('game.age=18;window.CaminhosExtras.annual(game);render()');
assert.match(code('window.CaminhosExtras.renderSchool(game)'),/Alunos do clube/,
 'historico do clube permanece visivel apos a formatura');

console.log('OK: escola, amigos, professores, bens, empresas, venda, salvamento e navegação.');
