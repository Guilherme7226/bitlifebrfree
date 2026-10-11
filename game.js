/* CAMINHOS v2.0 — jogo original, sem dependências, sem contas nem rastreamento */
'use strict';
const SAVE_KEY='caminhos.save.v1', CONFIG_KEY='caminhos.config.v1';
const clamp=(n,min=0,max=100)=>Math.min(max,Math.max(min,Number(n)||0));
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const choose=a=>a[rand(0,a.length-1)];
const brl=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(n);
const escapeHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=id=>document.getElementById(id);
const STAT_LABELS={saude:'Saúde',felicidade:'Felicidade',inteligencia:'Inteligência',carisma:'Carisma',disciplina:'Disciplina'};
const STAT_ICONS={saude:'❤',felicidade:'☀',inteligencia:'◈',carisma:'✧',disciplina:'⚡'};
const STAT_COLORS={saude:'red',felicidade:'gold',inteligencia:'blue',carisma:'good',disciplina:''};
const TRAITS={ambicioso:{disciplina:15,inteligencia:4},carismatico:{carisma:17,felicidade:5},curioso:{inteligencia:19},tranquilo:{saude:8,felicidade:13}};
const CAREERS=[
 {id:'atendente',name:'Atendente',emoji:'🛍️',salary:23500,age:16,min:0,stat:'carisma',description:'Seu primeiro emprego pode abrir portas.'},
 {id:'logistica',name:'Analista de logística',emoji:'🚛',salary:52000,age:18,min:45,stat:'disciplina',description:'Organize operações e cargas.'},
 {id:'designer',name:'Designer',emoji:'🎨',salary:43000,age:18,min:55,stat:'inteligencia',description:'Transforme ideias em projetos.'},
 {id:'programador',name:'Programador',emoji:'💻',salary:86000,age:18,min:63,stat:'inteligencia',description:'Crie tecnologias.'},
 {id:'policial',name:'Policial Militar',emoji:'👮',salary:67000,age:18,min:55,stat:'disciplina',description:'Carreira de PM com formação e patentes.'},
 {id:'empresario',name:'Empreendedor',emoji:'🏢',salary:104000,age:21,min:67,stat:'disciplina',description:'Lidere negócios e assuma riscos.'},
 {id:'medico',name:'Médico',emoji:'🩺',salary:165000,age:23,min:70,stat:'inteligencia',degree:'medicina',description:'Cuide da vida de outras pessoas.'},
 {id:'advogado',name:'Advogado',emoji:'⚖️',salary:95000,age:22,min:65,stat:'inteligencia',degree:'direito',description:'Defenda causas importantes.'},
 {id:'professor',name:'Professor',emoji:'📚',salary:58000,age:22,min:55,stat:'inteligencia',degree:'educacao',description:'Ensine as novas gerações.'},
 {id:'politico',name:'Assessor político',emoji:'🏛️',salary:120000,age:30,min:70,stat:'carisma',description:'A carreira política começa nas comunidades.'},
 {id:'ator',name:'Ator',emoji:'🎭',salary:78000,age:18,min:60,stat:'carisma',description:'Entre em produções de teatro e cinema.'},
 {id:'diretor',name:'Diretor de cinema',emoji:'🎬',salary:142000,age:24,min:70,stat:'inteligencia',degree:'cinema',description:'Conduza histórias para as telas.'},
 {id:'musico',name:'Músico',emoji:'🎤',salary:68000,age:18,min:60,stat:'carisma',description:'Lance músicas e conquiste fãs.'},
 {id:'atleta',name:'Atleta profissional',emoji:'🥇',salary:113000,age:18,min:78,stat:'saude',description:'Construa uma carreira competitiva.'},
 {id:'lutador',name:'Lutador profissional',emoji:'🥊',salary:85000,age:18,min:78,stat:'saude',description:'Treine e avance nas competições.'},
 {id:'piloto',name:'Piloto',emoji:'✈️',salary:153000,age:22,min:74,stat:'inteligencia',description:'Explore rotas e aeroportos.'},
 {id:'cientista',name:'Cientista',emoji:'🔬',salary:115000,age:22,min:75,stat:'inteligencia',degree:'engenharia',description:'Pesquise e descubra novas soluções.'},
 {id:'astronauta',name:'Astronauta',emoji:'🚀',salary:192000,age:28,min:86,stat:'inteligencia',degree:'engenharia',description:'Prepare-se para missões espaciais.'},
 {id:'agente',name:'Investigador',emoji:'🕵️',salary:104000,age:23,min:70,stat:'disciplina',description:'Resolva casos e situações complexas.'},
 {id:'militar_exercito',name:'Militar do Exército',emoji:'🪖',salary:49000,age:18,min:53,stat:'disciplina',description:'Treinamento e promoções no Exército.'},
 {id:'militar_marinha',name:'Militar da Marinha',emoji:'⚓',salary:51000,age:18,min:53,stat:'disciplina',description:'Serviço na Marinha do Brasil.'},
 {id:'militar_aeronautica',name:'Militar da Aeronáutica',emoji:'✈️',salary:53000,age:18,min:53,stat:'disciplina',description:'Força Aérea e carreira de oficiais ou praças.'},
 {id:'bombeiro',name:'Bombeiro Militar',emoji:'🚒',salary:62000,age:18,min:53,stat:'disciplina',description:'Resgate e prevenção de incêndios.'},
 {id:'policial_civil',name:'Polícia Civil',emoji:'🕵️',salary:73000,age:18,min:57,stat:'disciplina',description:'Carreira na polícia judiciária.'},
 {id:'policial_federal',name:'Polícia Federal',emoji:'🛡️',salary:108000,age:21,min:68,stat:'inteligencia',description:'Investigações federais e carreira policial.'},
 {id:'influencer',name:'Criador de conteúdo',emoji:'📱',salary:71000,age:18,min:60,stat:'carisma',description:'Produza conteúdo e desenvolva sua audiência.'}
]; 
window.CaminhosAchievements?.registerCareers(CAREERS);
const DEGREES={medicina:'Medicina',direito:'Direito',educacao:'Educação',cinema:'Cinema',musica:'Música',engenharia:'Engenharia',administracao:'Administração',computacao:'Ciência da Computação',enfermagem:'Enfermagem',educacao_fisica:'Educação Física'};
const NAMES=['Marina','Lara','Camila','Daniel','Rafael','Julia','Beatriz','Lucas','Pedro','Renata','Felipe','Isabela','Bruno','Bianca','Caio','Helena','Gabriel','Ana'];
const OFFLINE_EVENTS={
 crianca:[
  ['O desenho perdido','Na escola, um colega pede ajuda para encontrar um desenho muito especial.',[['Ajudar com entusiasmo',{felicidade:5,carisma:6}],['Continuar brincando',{felicidade:4,carisma:-3}],['Pedir ajuda a um professor',{inteligencia:4,disciplina:3}]]],
  ['Dia de chuva','Choveu durante todo o dia. Você decide como aproveitar o tempo em casa.',[['Ler um livro',{inteligencia:7,felicidade:2}],['Fazer um jogo com a família',{felicidade:8,carisma:3}],['Dormir a tarde toda',{saude:5,disciplina:-3}]]],
  ['A apresentação','Sua turma está organizando uma apresentação na escola.',[['Participar do palco',{carisma:8,felicidade:2}],['Criar os materiais',{inteligencia:5,disciplina:4}],['Ficar na plateia',{felicidade:2,carisma:-2}]]]
 ],
 adolescente:[
  ['Uma prova difícil','Uma prova importante está chegando, e seus amigos querem sair.',[['Estudar bastante',{inteligencia:8,disciplina:5,felicidade:-4}],['Estudar e depois sair',{inteligencia:4,carisma:5}],['Sair sem estudar',{felicidade:7,disciplina:-6}]]],
  ['Amizade em risco','Duas pessoas próximas discutiram e pedem sua opinião.',[['Ouvir os dois lados',{carisma:7,inteligencia:3}],['Escolher um lado',{carisma:-4,felicidade:3}],['Evitar o assunto',{disciplina:2,carisma:-3}]]],
  ['Um talento escondido','Você descobre uma oportunidade para mostrar algo que sabe fazer.',[['Se inscrever',{carisma:8,felicidade:5}],['Treinar primeiro',{disciplina:8,inteligencia:4}],['Deixar para depois',{felicidade:-3}]]]
 ],
 adulto:[
  ['Proposta inesperada','Alguém oferece uma oportunidade de negócio, mas existe risco de perder dinheiro.',[['Aceitar o desafio',{cash:rand(-3000,9000),disciplina:2,felicidade:3}],['Pesquisar antes de decidir',{inteligencia:7,cash:-400}],['Recusar e seguir tranquilo',{saude:3,felicidade:2}]]],
  ['Um velho amigo','Você encontra alguém do passado que quer retomar a amizade.',[['Marcar um encontro',{carisma:7,felicidade:6}],['Conversar por mensagem',{carisma:4,felicidade:2}],['Seguir seu caminho',{disciplina:4,felicidade:-2}]]],
  ['Uma semana intensa','As responsabilidades parecem não ter fim. O que fazer?',[['Tirar um dia de descanso',{saude:9,felicidade:6,cash:-250}],['Organizar sua rotina',{disciplina:8,saude:3}],['Trabalhar ainda mais',{cash:1400,disciplina:3,saude:-9}]]],
  ['Convite para viajar','Você recebeu um convite para uma viagem de última hora.',[['Viajar e aproveitar',{cash:-2800,felicidade:10,carisma:4}],['Fazer um passeio barato',{cash:-350,felicidade:6}],['Guardar dinheiro',{disciplina:6,cash:500}]]],
  ['A decisão importante','Uma pessoa querida precisa de ajuda com uma mudança de vida.',[['Apoiar de perto',{felicidade:7,carisma:6,cash:-300}],['Dar bons conselhos',{inteligencia:5,carisma:4}],['Priorizar seus compromissos',{disciplina:5,carisma:-4}]]]
 ],
 idoso:[
  ['Histórias que ficam','Uma pessoa mais jovem quer conhecer as histórias da sua vida.',[['Compartilhar tudo',{felicidade:9,carisma:7}],['Ensinar uma habilidade',{inteligencia:5,felicidade:5}],['Guardar algumas lembranças',{felicidade:3,disciplina:2}]]],
  ['Uma nova rotina','Você percebe que pequenas escolhas podem melhorar seus dias.',[['Caminhar ao ar livre',{saude:9,felicidade:5}],['Conhecer um novo hobby',{inteligencia:6,felicidade:7}],['Descansar em casa',{saude:5,disciplina:-2}]]]
 ]
};
const ACTIONS={
 brincar:{icon:'🧸',name:'Brincar',desc:'Aproveite os primeiros anos.',delta:{felicidade:9,carisma:2}},
 familia:{icon:'🏡',name:'Tempo em família',desc:'Crie laços com quem cuida de você.',delta:{felicidade:7,carisma:3},relation:true},
 explorar:{icon:'🔎',name:'Explorar o mundo',desc:'Aprenda descobrindo coisas novas.',delta:{inteligencia:6,disciplina:2}},
 estudar:{icon:'📖',name:'Estudar',desc:'Invista em conhecimento e futuro.',delta:{inteligencia:8,disciplina:4,felicidade:-2}},
 esporte:{icon:'🏃',name:'Fazer exercícios',desc:'Cuide do corpo e da mente.',delta:{saude:9,felicidade:3,disciplina:2}},
 socializar:{icon:'💬',name:'Vida social',desc:'Faça amizades e se conecte.',delta:{carisma:8,felicidade:6},friend:true},
 meditar:{icon:'🌿',name:'Descansar',desc:'Recarregue as energias.',delta:{saude:5,felicidade:8}},
 trabalhar:{icon:'💼',name:'Dedicar-se ao trabalho',desc:'Aumente suas chances de promoção.',delta:{disciplina:7,inteligencia:2,felicidade:-3,saude:-3},work:true},
 hobby:{icon:'🎨',name:'Ter um hobby',desc:'Encontre alegria nas pequenas coisas.',delta:{felicidade:9,inteligencia:2,cash:-120}},
 voluntariado:{icon:'🤝',name:'Fazer voluntariado',desc:'Ajude alguém da sua cidade.',delta:{carisma:7,felicidade:7,disciplina:3}},
 terapia:{icon:'💆',name:'Cuidar da mente',desc:'Procure apoio e mais equilíbrio.',delta:{saude:8,felicidade:10,cash:-450}},
 viagem:{icon:'🧳',name:'Viajar',desc:'Colecione experiências pelo mundo.',delta:{felicidade:12,carisma:4,cash:-2500}}
};
let game=null,activeTab='vida',loading=false,toastTimer=null;
let config=loadConfig();
function loadConfig(){try{return {...{endpoint:'',enableAI:false},...JSON.parse(localStorage.getItem(CONFIG_KEY)||'{}')}}catch{return {endpoint:'',enableAI:false}}}
function persistConfig(){try{localStorage.setItem(CONFIG_KEY,JSON.stringify(config))}catch{showToast('Não foi possível salvar as configurações.')}}
function restore(){try{const obj=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(isValidGame(obj)){obj.extra=extraData(obj.extra);return obj}return null}catch{return null}}
function isValidGame(g){return !!(g&&g.version===1&&typeof g.name==='string'&&Number.isInteger(g.age)&&g.age>=0&&g.age<=130&&g.stats&&Object.keys(STAT_LABELS).every(k=>typeof g.stats[k]==='number')&&Array.isArray(g.history)&&Array.isArray(g.people)&&typeof g.cash==='number')}
function enforceHealthDeath(reason){
 if(!game?.alive||!game.stats||Number(game.stats.saude)>0)return false;
 game.stats.saude=0;game.alive=false;game.pendingEvent=null;
 const message=reason||'A saúde de '+game.name+' chegou a 0. Sua jornada terminou aos '+game.age+' anos.';
 game.history.unshift({age:game.age,title:'Saúde esgotada',description:message});
 game.history=game.history.slice(0,150);game.lastEvent=message;
 window.CaminhosDynasty?.recordDeath(game);
 return true;
}
function save(){if(!game)return false;const healthDeath=enforceHealthDeath();try{window.CaminhosDynasty?.ensure(game);window.CaminhosSkills?.ensure(game);window.CaminhosExtras?.ensure(game);window.CaminhosPaths?.ensure(game);window.CaminhosWorld?.ensure(game);window.CaminhosUI?.ensure(game);const earned=window.CaminhosAchievements?.evaluate(game)||[];localStorage.setItem(SAVE_KEY,JSON.stringify(game));if(earned.length)showToast('🏆 Conquista: '+earned.map(a=>a.name).slice(0,2).join(', ')+(earned.length>2?' e outras!':''));window.CaminhosCloud?.queueSave(game);if(healthDeath){render();showEnd()}return true}catch{showToast('Não foi possível salvar seu progresso neste navegador.');return false}}
function logLine(title,description){game.history.unshift({age:game.age,title,description});game.history=game.history.slice(0,150);game.lastEvent=description;save()}
function showToast(msg){const el=$('toast');el.textContent=msg;el.classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.add('hidden'),3500)}
function startGame(name,city,trait){
 const bonuses=TRAITS[trait]||TRAITS.ambicioso;
 game={version:1,name:name.trim().slice(0,32),city,trait,age:0,stats:{saude:clamp(rand(68,85)+(bonuses.saude||0)),felicidade:clamp(rand(65,82)+(bonuses.felicidade||0)),inteligencia:clamp(rand(38,58)+(bonuses.inteligencia||0)),carisma:clamp(rand(38,59)+(bonuses.carisma||0)),disciplina:clamp(rand(35,55)+(bonuses.disciplina||0))},cash:0,savings:0,job:null,jobYears:0,degree:[],university:null,actions:3,people:[{id:1,name:choose(NAMES),role:'Mãe',emoji:'👩',bond:rand(65,86)},{id:2,name:choose(NAMES),role:'Pai',emoji:'👨',bond:rand(58,85)}],partnerId:null,children:0,properties:0,alive:true,pendingEvent:null,lastAIYear:-1,lastEvent:'Você nasceu em '+city+'. O mundo está à sua espera.',history:[]};
 initExtra();logLine('Um novo começo',game.lastEvent);activeTab='vida';render();showToast('Bem-vindo à sua nova vida!');
}
function statChange(delta){
 for(const k of Object.keys(STAT_LABELS)){
  if(typeof delta[k]==='number'&&Number.isFinite(delta[k]))game.stats[k]=clamp(game.stats[k]+delta[k]);
 }
 const extra=safeExtra();
 if(Number.isFinite(delta.aparencia))extra.appearance=clamp((extra.appearance??50)+delta.aparencia);
 if(Number.isFinite(delta.popularidade))extra.reputation=clamp((extra.reputation??30)+delta.popularidade);
 if(Number.isFinite(delta.fama))extra.fame=clamp((extra.fame??0)+delta.fama);
 if(Number.isFinite(delta.cash))game.cash=Math.round(game.cash+delta.cash);
}
const CORE_METRICS={
 felicidade:{title:'Uma pausa para você',name:'Felicidade',icon:'🙂',
  story:'Depois de uma semana cansativa, um amigo convida você para sair e passar um tempo juntos. O que você vai fazer?',
  choices:[{text:'Aceitar o convite',delta:{felicidade:10,cash:-40}},{text:'Descansar em casa',delta:{felicidade:4,saude:2}},{text:'Continuar ignorando o descanso',delta:{felicidade:-4}}]},
 saude:{title:'Cuidando de você',name:'Saúde',icon:'❤️',
  story:'Você percebeu que não está se sentindo tão bem. Surgiu uma oportunidade de cuidar da saúde. Qual será sua atitude?',
  choices:[{text:'Procurar atendimento e orientação',delta:{saude:14,cash:-180}},{text:'Descansar e acompanhar os sintomas',delta:{saude:5,felicidade:2}},{text:'Ignorar os sinais do corpo',delta:{saude:-7}}]},
 inteligencia:{title:'Uma oportunidade de aprender',name:'Inteligência',icon:'🧠',
  story:'Um curso e uma biblioteca gratuita abriram inscrições em sua região. Você pretende aproveitar?',
  choices:[{text:'Me dedicar ao aprendizado',delta:{inteligencia:11,felicidade:-2}},{text:'Estudar um pouco por conta própria',delta:{inteligencia:5}},{text:'Deixar os estudos de lado',delta:{inteligencia:-2,felicidade:3}}]},
 aparencia:{title:'Uma mudança de visual',name:'Aparência',icon:'✨',
  story:'Você ganhou um vale-presente de uma loja de roupas e acessórios. Talvez seja a hora de renovar seu estilo. O que você vai fazer?',
  choices:[{text:'Experimentar um novo visual',delta:{aparencia:12,felicidade:3}},{text:'Guardar o vale para outra ocasião',delta:{felicidade:1}},{text:'Escolher algo que não combina com você',delta:{aparencia:-3}}]},
 popularidade:{title:'A opinião das pessoas',name:'Popularidade',icon:'🗳️',
  story:'Moradores estão debatendo um problema importante na comunidade. Como você deseja agir?',
  choices:[{text:'Ouvir as pessoas e apresentar soluções',delta:{popularidade:10,felicidade:2}},{text:'Prestar contas com transparência',delta:{popularidade:6}},{text:'Fazer uma promessa impossível',delta:{popularidade:-10}}]},
 fama:{title:'Seu nome está em evidência',name:'Fama',icon:'⭐',
  story:'Uma oportunidade de entrevista e divulgação surgiu para sua carreira. Você vai participar?',
  choices:[{text:'Dar uma entrevista preparada',delta:{fama:10,felicidade:3}},{text:'Agradecer e seguir trabalhando',delta:{fama:3}},{text:'Criar uma polêmica para chamar atenção',delta:{fama:4,felicidade:-8}}]}
};
function coreValue(key){
 if(key==='aparencia')return safeExtra().appearance??50;
 if(key==='popularidade')return safeExtra().reputation??30;
 if(key==='fama')return safeExtra().fame??0;
 return game?.stats?.[key]??0;
}
function makeAttributeEvent(key){
 const idea=CORE_METRICS[key];
 if(!idea)return null;
 return {source:'attribute',attribute:key,title:idea.title,
   story:idea.story,choices:idea.choices.map(c=>({...c,delta:{...c.delta}}))};
}
function openAttributeOpportunity(key){
 if(!game?.alive)return;
 if(game.pendingEvent)return showEvent();
 const applicable=key==='popularidade'?(!!safeExtra().office||game.job==='politico'):
 key==='fama'?['ator','diretor','musico','influencer','atleta','lutador'].includes(game.job):true;
 if(!applicable||!CORE_METRICS[key])return;
 game.pendingEvent=makeAttributeEvent(key);save();showEvent();
}
function randomAttributeEvent(){
 const candidates=['felicidade','saude','inteligencia','aparencia'].filter(k=>coreValue(k)<45);
 if((safeExtra().office||game.job==='politico')&&coreValue('popularidade')<45)candidates.push('popularidade');
 if(['ator','diretor','musico','influencer','atleta','lutador'].includes(game.job)&&coreValue('fama')<45)candidates.push('fama');
 return candidates.length?makeAttributeEvent(choose(candidates)):null;
}
function jobInfo(){return CAREERS.find(c=>c.id===game.job)||null}
function stage(){return game.age<6?'primeiros anos':game.age<13?'infância':game.age<18?'adolescência':game.age<60?'vida adulta':'maturidade'}
function avatar(){return game.age<6?'👶':game.age<13?'🧒':game.age<18?'🧑':game.age<60?'🧑‍💼':'🧓'}
function yearSummary(){const professional=jobInfo();let income=0,expense=0;
 if(game.age>=16&&professional&&!safeExtra().prison){income=Math.round((window.CaminhosPaths?.salary(game)??professional.salary)*(1+Math.min(game.jobYears,15)*.035)*
 (['ator','diretor','musico','influencer','atleta','lutador'].includes(game.job)?1+(safeExtra().fame||0)/180:1));game.cash+=income;game.jobYears++}
 if(game.age>=18){expense=game.age<23?Math.round(6500+income*.12):Math.round(12500+income*.19);if(game.properties>0)expense+=game.properties*1600;game.cash-=expense}
 if(game.university){game.cash-=6500;game.university.yearsLeft-=1;if(game.university.yearsLeft<=0){const name=DEGREES[game.university.degree];game.degree.push(game.university.degree);game.university=null;logLine('Formatura','Você concluiu a faculdade de '+name+'. Parabéns pela conquista!')}}
 if(game.savings>0){const gain=Math.round(game.savings*.035);game.savings+=gain}
 if(game.age>=70){game.stats.saude=clamp(game.stats.saude-rand(1,4))}
 if(game.age<18)game.stats.inteligencia=clamp(game.stats.inteligencia+rand(0,2));
 annualExtra();
 if(professional&&['ator','diretor','musico','influencer','atleta','lutador'].includes(game.job)&&game.jobYears>0){
  const x=safeExtra();x.fame=clamp((x.fame||0)+rand(-1,4));
 }
 window.CaminhosDynasty?.onAnnual(game);window.CaminhosExtras?.annual(game);window.CaminhosPaths?.onAnnual(game);window.CaminhosWorld?.annual(game);game.stats.felicidade=clamp(game.stats.felicidade+rand(-4,3));
 game.stats.saude=clamp(game.stats.saude+rand(-3,2));
 if(income||expense)logLine('Resumo financeiro do ano',`Você recebeu ${brl(income)} e teve ${brl(expense)} em despesas.`);
 if(game.age===6)logLine('Primeiro dia de aula','Você começou a frequentar a escola. Um mundo de descobertas se abriu.');
 if(game.age===16)logLine('Mais independência','Você já pode procurar seu primeiro emprego.');
 if(game.age===18)logLine('Maioridade','Você chegou aos 18 anos! Uma nova etapa de escolhas começou.');
 if(game.age===60)logLine('Novo capítulo','Uma vida inteira de histórias começa a ganhar novas perspectivas.');
 if(game.alive&&game.age>=65&&Math.random()<Math.min(.82,(game.age-63)*.015+(100-game.stats.saude)*.003)){game.alive=false;window.CaminhosDynasty?.recordDeath(game);logLine('O fim de uma jornada',`${game.name} partiu aos ${game.age} anos. Sua história continua nas lembranças de quem conheceu.`)}
}
function offlineEvent(){const group=game.age<13?'crianca':game.age<18?'adolescente':game.age<60?'adulto':'idoso';const pick=choose(OFFLINE_EVENTS[group]);return {title:pick[0],story:pick[1],source:'offline',choices:pick[2].map(c=>({text:c[0],delta:c[1]}))}}
function cleanAIDelta(obj){const clean={};if(!obj||typeof obj!=='object')return clean;for(const k of Object.keys(STAT_LABELS)){if(Number.isFinite(obj[k]))clean[k]=clamp(obj[k],-12,12)}if(Number.isFinite(obj.cash))clean.cash=clamp(obj.cash,-3500,3500);return clean}
function cleanAIEvent(raw){const event=raw?.event||raw;if(typeof event?.title!=='string'||typeof event?.story!=='string'||!Array.isArray(event?.choices)||event.choices.length!==3)throw Error('Formato de IA inválido');return {title:event.title.slice(0,90),story:event.story.slice(0,680),source:'ia',choices:event.choices.map(c=>({text:String(c?.text||'Escolher').slice(0,120),delta:cleanAIDelta(c?.delta)}))}}
async function aiEvent(){if(!config.enableAI||!config.endpoint)return null;const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),9500);try{
 const safeStats=Object.fromEntries(Object.entries(game.stats).map(([k,v])=>[k,Math.round(v)]));
 const response=await fetch(config.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({age:game.age,trait:game.trait,stage:stage(),job:jobInfo()?.name||'Estudante ou sem emprego',stats:safeStats,city:game.city}),signal:ctl.signal});
 if(!response.ok)throw Error('HTTP '+response.status);const data=await response.json();return cleanAIEvent(data)
 }finally{clearTimeout(t)}}
async function advance(){if(!game||!game.alive||loading)return;if(game.pendingEvent){showEvent();return}loading=true;game.age++;game.actions=3;window.CaminhosSkills?.ensure(game);window.CaminhosEveryday?.annual(game);if(enforceHealthDeath()||!game.alive){save();render();loading=false;showEnd();return}yearSummary();save();render();if(!game.alive){loading=false;showEnd();return}if(game.age===18&&window.CaminhosPaths?.offerGraduation(game)){loading=false;window.CaminhosPaths.openGraduation(game);return}if(Math.random()<.75){let e=null;if(config.enableAI&&config.endpoint){showToast('Criando um novo acontecimento...');try{e=await aiEvent()}catch(err){showToast('IA indisponível. Usando história local.')}}if(!e)e=(Math.random()<.36?randomAttributeEvent():null)||(Math.random()<.67?window.CaminhosEveryday?.randomEvent(game):null)||offlineEvent();game.pendingEvent=e;save();showEvent()}else{logLine('Mais um ano de vida','Você completou '+game.age+' '+(game.age===1?'ano':'anos')+' e segue construindo seu próprio caminho.')}loading=false;render()}
function applyChoice(i){
 const event=game?.pendingEvent;if(!event)return;
 const choice=event.choices[i];if(!choice)return;
 game.pendingEvent=null;
 statChange(choice.delta);
 logLine(event.title,event.story+' Sua escolha: '+choice.text+'.');
 if(!game.alive)return;
 if(event.source==='cotidiano'){
   const died=window.CaminhosEveryday?.applyChoice(game,choice);
   if(died){save();return}
 }
 save();hideModal();render();showToast('Escolha registrada. Seu futuro mudou!');
}
function performAction(key){if(safeExtra().prison>0)return showToast('Enquanto estiver preso, avance os anos até sua liberdade.');if(!game?.alive)return showToast('Esta vida terminou.');const a=ACTIONS[key];if(!a)return;let delta={...a.delta};if(delta.cash<0&&game.cash<Math.abs(delta.cash))return showToast('Você não tem dinheiro para essa atividade.');const daily=(safeExtra().repeatActions||={});
 const count=daily[key]?.year===game.age?daily[key].count:0;
 daily[key]={year:game.age,count:count+1};
 for(const stat of Object.keys(delta)){if(stat!=='cash'&&Number.isFinite(delta[stat]))delta[stat]=Math.trunc(delta[stat]/(1+count*.15))}
 statChange(delta);
 if(a.relation)game.people.filter(p=>p.role==='Mãe'||p.role==='Pai').forEach(p=>p.bond=clamp(p.bond+8));
 if(a.friend){let friend=game.people.find(p=>p.role==='Amizade');if(!friend){friend={id:Date.now(),name:choose(NAMES),role:'Amizade',emoji:'🤗',bond:45};game.people.push(friend);logLine('Uma nova amizade','Você conheceu '+friend.name+'!')}else friend.bond=clamp(friend.bond+rand(7,13))}
 if(a.work&&game.job&&count===0){game.jobYears+=.15;if(Math.random()<.22){game.cash+=800;showToast('Você recebeu um bônus de '+brl(800)+'!')}}
 logLine(a.name,'Você decidiu: '+a.name.toLowerCase()+'. Pequenos hábitos fazem uma grande diferença.');save();render()}
function setJob(id){if(!game?.alive)return;const c=CAREERS.find(x=>x.id===id);if(!c)return;const requirement=jobRequirement(c);if(requirement)return showToast(requirement);if(safeExtra().prison>0)return showToast('Você está cumprindo pena.');window.CaminhosPaths?.leave(game,id);const previous=jobInfo()?.name||'nenhum';game.job=id;game.jobYears=0;const history=(safeExtra().careerHistory||=[]);if(!history.includes(id))history.push(id);logLine('Novo trabalho',`Você deixou ${previous} e começou sua carreira como ${c.name}.`);save();render();showToast('Novo emprego: '+c.name+'!')}
function jobRequirement(c){
 if(game.age<c.age)return 'Disponível aos '+c.age+' anos.';
 // Quatro atributos basicos; popularidade e fama sao progresso de carreira.
 const key=c.id==='politico'?'popularidade':
 (['ator','influencer'].includes(c.id)?'aparencia':
  ['policial','militar_exercito','militar_marinha','militar_aeronautica','bombeiro','lutador','atleta'].includes(c.id)?'saude':
  c.stat==='disciplina'?'inteligencia':c.stat==='carisma'?'felicidade':c.stat);
 const label=CORE_METRICS[key]?.name||STAT_LABELS[key]||'Desempenho';
 const threshold=c.id==='politico'?40:c.min;
 if(coreValue(key)<threshold)return 'Requer '+label+' de '+threshold+' ou mais.';
 if(c.degree&&!game.degree.includes(c.degree))return 'Exige graduação em '+DEGREES[c.degree]+'.';
 return window.CaminhosPaths?.jobReason(game,c.id)||'';
}
function startUniversity(d){if(safeExtra().prison>0)return showToast('Não pode cursar faculdade enquanto cumpre pena.');if(!safeExtra().school?.finished)return showToast('Conclua primeiro o ensino médio.');if(!game?.alive||game.age<18)return showToast('Você precisa ter 18 anos.');if(game.university)return showToast('Você já está estudando na faculdade.');if(game.degree.includes(d))return showToast('Você já concluiu esse curso.');if(!DEGREES[d])return;if(game.stats.inteligencia<50)return showToast('Você precisa de 50 pontos de inteligência para ingressar.');game.university={degree:d,yearsLeft:4};logLine('Faculdade','Você entrou em '+DEGREES[d]+'. A mensalidade anual é de R$ 6.500 no jogo.');save();render()}
function romance(){if(safeExtra().prison>0)return showToast('Relacionamentos indisponíveis durante a prisão.');if(game.age<16)return showToast('Relacionamentos românticos disponíveis aos 16 anos.');if(game.partnerId)return showToast('Você já tem um relacionamento.');const p={id:Date.now(),name:choose(NAMES),role:'Namoro',emoji:'💞',bond:rand(52,70)};game.people.push(p);game.partnerId=p.id;logLine('Novo romance','Você conheceu '+p.name+' e os dois começaram a namorar.');save();render()}
function relationshipFeedback(p,action,message,oldBond,oldCash){
 const change=clamp(p.bond)-oldBond;
 const score=change>0?'+'+change:String(change);
 const reaction=change>0?'Seu relacionamento melhorou.':change<0?'Seu relacionamento piorou.':'Seu relacionamento não mudou.';
 const tone=change>0?'improved':change<0?'worsened':'unchanged';
 const icon=change>0?'💚':change<0?'💔':'💬';
 const mood=(p.irritation||0)>=45?'Irritado(a)':(p.irritation||0)>=18?'Incomodado(a)':'Tranquilo(a)';
 const difference=game.cash-oldCash;
 const cashRow=difference!==0?'<span>Saldo: '+(difference>0?'+':'')+brl(difference)+'</span>':'';
 showModal('<div class="relationship-result">'+
 '<div class="relationship-result-icon">'+icon+'</div>'+
 '<div class="card-kicker">RESULTADO DA INTERAÇÃO</div>'+
 '<h2 id="modalTitle">'+escapeHTML(action)+'</h2>'+
 '<p>'+escapeHTML(message)+'</p>'+
 '<div class="relationship-result-score '+tone+'"><span>'+escapeHTML(reaction)+'</span>'+
 '<strong>'+score+' de vínculo</strong></div>'+
 '<div class="relationship-result-info"><span>Vínculo com '+escapeHTML(p.name)+': <b>'+Math.round(p.bond)+'/100</b></span>'+
 '<span>Humor: '+mood+'</span>'+cashRow+'</div>'+
 '<button type="button" class="secondary-button relationship-result-close" data-act="dismiss-result">Entendi</button></div>');
}
function chooseStrike(id){
 if(!game?.alive||game.age<6)return showToast('Esta interação fica disponível a partir dos 6 anos.');
 if(game.pendingEvent)return showEvent();
 if(safeExtra().prison>0)return showToast('Você não pode iniciar uma agressão enquanto está preso.');
 const person=game.people.find(x=>Number(x.id)===Number(id));
 if(!person)return;
 const moves=window.CaminhosPaths?.combatMoves(game)||[];
 const trained=moves.filter(m=>m.art!=='Básico');
 const renderMove=move=>'<button type="button" class="combat-option" data-act="choose-strike" data-id="'+Number(person.id)+'" data-move="'+escapeHTML(move.id)+'">'+
   '<span class="combat-option-emoji">'+move.emoji+'</span><span><strong>'+escapeHTML(move.name)+'</strong>'+
   '<small>'+escapeHTML(move.art)+' · Potência '+move.power+'/5'+(move.skill?' · Habilidade '+move.skill+'/100':'')+'</small></span>'+
   '<span class="combat-option-next">›</span></button>';
 showModal('<div class="combat-dialog"><div class="combat-dialog-icon">🥊</div>'+
  '<div class="card-kicker">INTERAÇÃO · CONSEQUÊNCIAS</div>'+
  '<h2 id="modalTitle">Agredir '+escapeHTML(person.name)+'?</h2>'+
  '<p>Escolha um golpe. Técnicas avançadas só aparecem depois que você treina artes marciais e melhora sua habilidade. A vítima pode reagir, se ferir ou denunciar você.</p>'+
  '<div class="combat-divider">Golpes básicos</div>'+
  '<div class="combat-options">'+moves.filter(m=>m.art==='Básico').map(renderMove).join('')+'</div>'+
  (trained.length?'<div class="combat-divider">🥋 Golpes aprendidos</div>'+
   '<div class="combat-options">'+trained.map(renderMove).join('')+'</div>':
   '<p class="combat-hint">🥋 Treine jiu-jítsu, judô, boxe e outras artes marciais em Atividades para desbloquear novos golpes.</p>')+
  '<button type="button" class="secondary-button combat-cancel" data-act="dismiss-result">Cancelar</button></div>');
}
function performStrike(id,moveId){
 if(!game?.alive||game.age<6||safeExtra().prison>0)return;
 if(game.pendingEvent)return showEvent();
 const person=game.people.find(x=>Number(x.id)===Number(id));
 const move=(window.CaminhosPaths?.combatMoves(game)||[]).find(m=>m.id===moveId);
 if(!person||!move)return showToast('Este golpe ainda não está disponível. Continue treinando.');
 const e=safeExtra();const data=(e.combatEncounters||={});
 const key=String(person.id);
 const counter=data[key]?.year===game.age?data[key].count:0;
 data[key]={year:game.age,count:counter+1};
 const oldBond=clamp(person.bond);
 const oldCash=game.cash;
 const skill=Math.max(0,move.skill||0);
 const power=Math.max(1,move.power);
 // Combate é resolvido por chance, como evento narrativo; treinos melhoram
 // a chance de êxito, mas nunca eliminam riscos e repercussões.
 const successful=Math.random()<Math.max(.22,Math.min(.88,.45+skill*.004+(game.stats.saude-50)*.001));
 const injury=successful?Math.max(1,Math.round(power*2+Math.random()*(power*3+2))):0;
 const serious=successful&&power>=4&&Math.random()<(power===5?.10:.045);
 const retaliation=Math.random()<Math.min(.85,.34+counter*.11+(successful?.02:.16));
 const damage=retaliation?Math.round(3+Math.random()*12+counter*2):0;
 person.bond=clamp(oldBond-(counter?18:12)-power*2-Math.round(Math.random()*8));
 person.irritation=clamp((person.irritation||0)+25+power*6);
 if(!Number.isFinite(person.health))person.health=85;
 person.health=Math.max(1,clamp(person.health-injury*(serious?2:1)));
 statChange({felicidade:-Math.min(14,5+counter*2),saude:-damage});
 let title=successful?'Você agrediu '+person.name:'A agressão não deu certo';
 let story=successful?'Você tentou usar '+move.name.toLowerCase()+' em '+person.name+'. '+person.name+
  (serious?' sofreu um ferimento grave e precisou de atendimento médico.':
   ' sofreu consequências físicas da agressão.') :
  'Você tentou usar '+move.name.toLowerCase()+' contra '+person.name+', mas não conseguiu atingir o alvo.';
 if(retaliation)story+=' '+person.name+' reagiu e você perdeu '+damage+' pontos de Saúde.';
 const chanceToReport=Math.min(.96,.24+power*.065+(counter*.14)+(serious?.3:0));
 let legal='';if(Math.random()<chanceToReport){
  if(game.age>=16&&Math.random()<Math.min(.85,.27+power*.055+(serious?.25:0)+counter*.06)){
   const years=serious?rand(2,5):rand(1,2);
   const fine=serious?rand(2500,8000):rand(350,1800);
   window.CaminhosWorld?.jail(game,'agressão física',years,fine);
   legal=' A vítima denunciou o caso, houve condenação e você recebeu pena de '+years+' ano(s) de prisão e multa.';
  }else if(game.age>=16){
   if(!Array.isArray(e.crimeStory?.cases))window.CaminhosWorld?.ensure(game);
   e.crimeStory.cases.push({title:'agressão física',heat:Math.min(.9,.3+power*.10),penalty:[1,serious?5:2],fine:serious?4500:700});
   legal=' A polícia foi informada, e você poderá responder a uma investigação.';
  }else{
   statChange({felicidade:-5});
   legal=' A família e a escola foram informadas e você recebeu uma advertência.';
  }
 }
 story+=legal+' O relacionamento caiu de '+oldBond+' para '+person.bond+'/100.';
 logLine('Conflito com '+person.name,story);
 // Salvar verifica imediatamente o fim da vida se a Saúde chegou a zero.
 if(!game.alive)return;
 render();
 relationshipFeedback(person,title,story,oldBond,oldCash);
}
function relationAction(id,action){
 if(!game?.alive)return showToast('Escolha uma vida para continuar.');
 if(game.pendingEvent)return showEvent();
 if(safeExtra().prison>0)return showToast('Visitas indisponíveis durante a prisão.');
 const p=game.people.find(x=>Number(x.id)===Number(id));if(!p)return;
 const oldBond=clamp(p.bond),oldCash=game.cash;
 let title='',message='';
 const log=(entry,desc)=>{logLine(entry,desc);save();render();relationshipFeedback(p,title,message,oldBond,oldCash)};
 if(action==='agredir')return chooseStrike(id);
 if(action==='casar'){
  if(game.age<18||Number(id)!==Number(game.partnerId)||p.bond<65)return showToast('É preciso ter 18 anos e vínculo de 65 ou mais para casar.');
  if(game.cash<3500)return showToast('Você precisa de R$ 3.500 para o casamento.');
  game.cash-=3500;p.role='Cônjuge';statChange({felicidade:13});
  title='Você se casou com '+p.name;
  message='A cerimônia foi especial e vocês agora estão casados!';
  log('Casamento',message);return;
 }
 if(action==='filho'){
  if(Number(id)!==Number(game.partnerId)||game.age<18)return showToast('Esta opção não está disponível neste relacionamento.');
  if(game.cash<1200)return showToast('Você precisa de R$ 1.200 para as despesas iniciais.');
  const childName=window.CaminhosDynasty?.birth(game);if(!childName)game.children++;
  game.cash-=1200;statChange({felicidade:9});
  title='Sua família cresceu';
  message='Nasceu '+(childName||'um bebê')+'! Agora você tem '+game.children+' filho(s).';
  log('A família cresceu',message);return;
 }
 if(action==='terminar'){
  if(Number(id)!==Number(game.partnerId))return;
  p.role='Ex-relacionamento';game.partnerId=null;statChange({felicidade:-12});
  p.bond=clamp(p.bond-rand(12,26));
  title='Você terminou com '+p.name;
  message='Vocês decidiram seguir caminhos diferentes. O vínculo ficou abalado.';
  log('Fim do relacionamento',message);return;
 }
 const allowed=['aproximar','passar-tempo','elogiar','presente','desculpas','discutir','provocar','ignorar','pedir-dinheiro','cinema','acordo','insultar','espiar','recrutar'];
 if(!allowed.includes(action))return;
 const data=(safeExtra().socialEncounters||={});
 const key=String(p.id);
 let record=data[key];
 if(!record||record.year!==game.age){
  const gap=record?Math.max(0,game.age-record.year):0;
  p.irritation=clamp((p.irritation||0)-gap*22);
  record={year:game.age,talks:0,total:0};
  data[key]=record;
 }
 const times=record.total++;
 let delta=0;
 if(action==='aproximar'){
  record.talks++;
  if(record.talks===1){
   delta=rand(5,10)-Math.floor((p.irritation||0)/28);
   title='Você conversou com '+p.name;
   message='Vocês tiveram uma conversa agradável e se conheceram melhor.';
  }else if(record.talks===2){
   delta=rand(1,5)-Math.floor((p.irritation||0)/20);
   title='Você conversou novamente com '+p.name;
   message=p.name+' ainda conversou com você, mas já tinha menos assunto.';
  }else if(record.talks===3){
   delta=-rand(1,4);
   p.irritation=clamp((p.irritation||0)+20);
   title=p.name+' começou a se incomodar';
   message='Você tentou conversar novamente. '+p.name+' respondeu de forma breve e pediu um pouco de espaço.';
  }else{
   delta=-rand(6,13)-Math.min(8,(record.talks-4)*2);
   p.irritation=clamp((p.irritation||0)+26);
   title=p.name+' ficou irritado(a)';
   message='Você insistiu em conversar várias vezes no mesmo ano. '+p.name+' perdeu a paciência e encerrou a conversa.';
  }
 }else if(action==='pedir-dinheiro'){
  const family=['Mãe','Pai','Padrasto','Madrasta','Avó','Avô','Irmão','Irmã','Filho','Filha','Cônjuge'];
  if(!family.includes(p.role)){record.total--;return showToast('Peça dinheiro somente a familiares próximos.');}
  record.moneyRequests=(record.moneyRequests||0)+1;
  if(record.moneyRequests>1){
   delta=-rand(7,14);p.irritation=clamp((p.irritation||0)+19);
   title=p.name+' ficou incomodado(a) com o pedido';
   message='Você pediu dinheiro novamente no mesmo ano e '+p.name+' pediu que parasse de insistir.';
  }else{
   const chance=Math.max(.12,Math.min(.90,.27+p.bond/175-(p.irritation||0)/180));
   const value=game.age<18?rand(10,75):rand(40,350);
   if(Math.random()<chance){
    game.cash+=value;delta=rand(1,4);
    title=p.name+' deu dinheiro a você';
    message='Você pediu ajuda financeira e '+p.name+' ofereceu '+brl(value)+'.';
   }else{
    delta=-rand(2,7);p.irritation=clamp((p.irritation||0)+6);
    title=p.name+' recusou seu pedido';
    message='Você pediu dinheiro, mas '+p.name+' explicou que não poderia ajudar neste momento.';
   }
  }
 }else if(action==='cinema'){
  if(game.age<6){record.total--;return showToast('Ir ao cinema está disponível a partir de 6 anos.');}
  const cost=game.age<16&&['Mãe','Pai','Padrasto','Madrasta'].includes(p.role)?0:90;
  if(game.cash<cost){record.total--;return showToast('Você precisa de '+brl(cost)+' para ir ao cinema com '+p.name+'.');}
  game.cash-=cost;
  if(p.bond<15&&Math.random()<.8){
   delta=-rand(1,4);
   title=p.name+' recusou ir ao cinema';
   message='Você convidou '+p.name+', mas ele(a) preferiu não sair com você.';
  }else if((record.cinema||0)>=2){
   delta=-rand(2,6);p.irritation=clamp((p.irritation||0)+9);
   title=p.name+' se cansou de sair';
   message='Vocês já foram ao cinema várias vezes este ano, e '+p.name+' queria fazer outra coisa.';
  }else{
   delta=rand(4,10)-Math.floor((p.irritation||0)/26);
   statChange({felicidade:rand(3,7)});
   title='Você foi ao cinema com '+p.name;
   message='Vocês assistiram a um filme e passaram bons momentos juntos.';
  }
  record.cinema=(record.cinema||0)+1;
 }else if(action==='acordo'){
  if(game.age<12){record.total--;return showToast('Negociar objetos está disponível a partir de 12 anos.');}
  const extra=safeExtra();
  // Posses pessoais limitadas: cada item vendido desaparece do inventário.
  // Assim, negociar não gera dinheiro ilimitado por cliques.
  if(!Array.isArray(extra.socialBelongings))
   extra.socialBelongings=[{name:'livro usado',value:35},{name:'colecionável antigo',value:65},{name:'jogo de tabuleiro',value:90}];
  const item=extra.socialBelongings[0];
  if(!item){record.total--;return showToast('Você não tem mais objetos pessoais para vender.');}
  const price=Math.max(1,Number(item.value)||20);
  const chance=Math.max(.1,Math.min(.95,.22+p.bond/150-(p.irritation||0)/190));
  if(Math.random()<chance){
   extra.socialBelongings.shift();game.cash+=price;delta=rand(2,6);
   title='Você fechou um acordo com '+p.name;
   message='Você vendeu '+item.name+' para '+p.name+' por '+brl(price)+'. O objeto saiu dos seus pertences.';
  }else{
   delta=-rand(1,4);
   title=p.name+' não aceitou o acordo';
   message='Você tentou vender '+item.name+', mas '+p.name+' não se interessou.';
  }
 }else if(action==='insultar'){
  delta=-rand(12,23);p.irritation=clamp((p.irritation||0)+28);
  statChange({felicidade:-3});
  title='Você insultou '+p.name;
  message='Você disse algo ofensivo a '+p.name+', que ficou muito magoado(a).';
 }else if(action==='espiar'){
  const chance=Math.min(.85,.46+(p.irritation||0)/260);
  if(Math.random()<chance){
   delta=-rand(14,27);p.irritation=clamp((p.irritation||0)+22);
   title=p.name+' descobriu que estava sendo espionado(a)';
   message='Você tentou espionar '+p.name+', mas foi descoberto(a). '+p.name+' considerou isso uma quebra de confiança.';
  }else{
   delta=0;
   title='Você espiou '+p.name;
   message='Você observou '+p.name+' sem ser notado(a). A relação não mudou, mas sua decisão poderia ter consequências.';
  }
 }else if(action==='recrutar'){
  if(!safeExtra().cult){record.total--;return showToast('Você precisa liderar um culto no jogo para recrutar pessoas.');}
  if(game.age<18){record.total--;return showToast('Recrutamento disponível apenas para adultos.');}
  const chance=Math.max(.05,Math.min(.85,p.bond/125-(p.irritation||0)/200));
  if(Math.random()<chance){
   safeExtra().cult.members=(safeExtra().cult.members||0)+1;delta=rand(2,6);
   title=p.name+' entrou para o seu grupo';
   message='Você convidou '+p.name+' para seu culto e a pessoa aceitou.';
  }else{
   delta=-rand(5,12);p.irritation=clamp((p.irritation||0)+10);
   title=p.name+' recusou o convite';
   message=p.name+' ficou desconfortável com o convite para o seu culto.';
  }
 }else if(action==='passar-tempo'){
  delta=rand(4,9)-Math.floor(times/2);
  title='Você passou tempo com '+p.name;
  message='Vocês fizeram algo juntos e fortaleceram sua convivência.';
 }else if(action==='elogiar'){
  delta=rand(3,8)-Math.floor(times/2);
  title='Você elogiou '+p.name;
  message='Você fez um elogio sincero. '+p.name+' gostou de ouvir isso.';
 }else if(action==='presente'){
  const cost=180;
  if(game.cash<cost){record.total--;return showToast('Você precisa de R$ 180 para comprar um presente.')}
  game.cash-=cost;
  delta=rand(5,12)-Math.floor(times/2);
  title='Você presenteou '+p.name;
  message='Você comprou um presente por '+brl(cost)+' para '+p.name+'.';
 }else if(action==='desculpas'){
  delta=(p.irritation||0)>35?rand(2,6):rand(6,11);
  p.irritation=clamp((p.irritation||0)-25);
  title='Você pediu desculpas a '+p.name;
  message='Você reconheceu seu erro e pediu desculpas. '+p.name+' ouviu o que você tinha a dizer.';
 }else if(action==='discutir'){
  delta=-rand(9,19);p.irritation=clamp((p.irritation||0)+20);
  title='Você discutiu com '+p.name;
  message='A conversa virou uma discussão e vocês saíram magoados.';
 }else if(action==='provocar'){
  delta=-rand(6,14);p.irritation=clamp((p.irritation||0)+17);
  title='Você provocou '+p.name;
  message='Sua provocação foi mal recebida e '+p.name+' ficou incomodado(a).';
 }else if(action==='ignorar'){
  delta=-rand(4,10);p.irritation=clamp((p.irritation||0)+8);
  title='Você ignorou '+p.name;
  message='Você decidiu não dar atenção a '+p.name+', que se sentiu deixado(a) de lado.';
 }
 if(delta>0&&p.irritation>50&&action!=='desculpas'){
  delta-=Math.ceil(p.irritation/15);
  message+=' Porém, '+p.name+' ainda está irritado(a) e precisa de espaço.';
 }
 p.bond=clamp(p.bond+delta);
 if(action==='aproximar'||action==='passar-tempo')statChange({felicidade:p.bond>oldBond?2:-2});
 if(['discutir','provocar','ignorar'].includes(action))statChange({felicidade:-2});
 log('Relacionamento: '+title,message+' Vínculo: '+oldBond+' → '+p.bond+'/100.');
}
function moneyAction(type,amount){if(safeExtra().prison>0)return showToast('Movimentações indisponíveis na prisão.');if(!game?.alive)return;const n=Number(amount)||0;if(n<=0)return;if(type==='depositar'){if(game.cash<n)return showToast('Saldo insuficiente para investir.');game.cash-=n;game.savings+=n;logLine('Investimento','Você aplicou '+brl(n)+' para o futuro.')}else if(type==='resgatar'){if(game.savings<n)return showToast('Investimento insuficiente.');game.savings-=n;game.cash+=n;logLine('Resgate','Você resgatou '+brl(n)+'.')}else if(type==='imovel'){if(game.cash<75000)return showToast('Você precisa de R$ 75.000.');game.cash-=75000;game.properties++;logLine('Casa própria','Você comprou um imóvel por R$ 75.000.')}save();render()}
function displayTitle(title,subtitle){return `<h2 class="panel-title">${title}</h2><p class="panel-subtitle">${subtitle}</p>`}
function renderActivities(){const childhood=game.age<6,young=game.age<16,actions=childhood?['brincar','familia','explorar','meditar']:young?['estudar','esporte','socializar','familia','explorar','hobby']:['estudar','esporte','socializar','trabalhar','meditar','hobby','voluntariado','terapia','viagem'];const filtered=actions.filter(id=>!(id==='trabalhar'&&!game.job));
 const cards=filtered.map(id=>{const a=ACTIONS[id];return `<button type="button" class="action-card" data-act="activity" data-id="${id}" ${!game.alive?'disabled':''}><span class="action-icon">${a.icon}</span><span class="action-name">${a.name}</span><span class="action-desc">${a.desc}</span></button>`}).join('');
 const special=game.pendingEvent?`<div class="notice"><strong>✦ Uma decisão está esperando!</strong><p>Você precisa decidir o que fazer com o acontecimento deste ano.</p><button class="secondary-button" data-act="show-event">Ver acontecimento →</button></div>`:'';
 return displayTitle('Minha vida',`${escapeHTML(game.name)}, cada ano oferece novas oportunidades. Faça quantas atividades quiser no mesmo ano.`)+special+`<div class="section-title">O que você quer fazer hoje? <small>Práticas sem limite por ano</small></div><div class="actions-grid">${cards}</div><div class="card"><h3>🥋 Artes marciais</h3><p>Treine uma modalidade, evolua de faixa e participe de competições.</p><button type="button" class="secondary-button" data-go="hobbies">🥋 Ver treinos e modalidades →</button></div><div class="section-title">Seu capítulo atual</div><div class="card"><span class="tag">${escapeHTML(stage().toUpperCase())}</span><p>${game.age<6?'Você está descobrindo o mundo ao seu redor.':game.age<18?'A escola e os amigos estão formando quem você será.':'Trabalho, dinheiro, amizades e escolhas moldam seu futuro.'}</p></div>`}
function renderLife(){
 const events=game.history.slice(0,38);
 let lastAge=null;
 const diary=events.map(h=>{
  const heading=h.age!==lastAge?`<div class="diary-age">Idade: ${h.age} ${h.age===1?'ano':'anos'}</div>`:'';
  lastAge=h.age;
  return `${heading}<article class="diary-item"><strong>${escapeHTML(h.title)}</strong><p>${escapeHTML(h.description)}</p></article>`;
 }).join('');
 const future=window.CaminhosPaths?.futureChoice(game)||'';
 const special=game.pendingEvent?`<div class="notice diary-notice"><strong>✦ Você tem uma decisão pendente</strong><p>Escolha como sua história continua.</p><button class="secondary-button" data-act="show-event">Tomar decisão →</button></div>`:'';
 return `<div class="diary-heading"><span>✦ O SEU CAMINHO</span><strong>Minha vida</strong><p>As escolhas que escreveram sua história.</p></div>${special}${future}${safeExtra().prison>0?'<div class="notice">🔒 Você está cumprindo pena. Veja Riscos e Justiça.</div>':''}<div class="life-diary">${diary||'<p class="muted">Seu primeiro capítulo está começando.</p>'}</div><div class="diary-footer"><button class="secondary-button" data-go="historia">📖 Ver histórico completo</button><button class="secondary-button" data-go="atividades">🧭 Fazer atividades</button></div>`;
}
function renderCareer(){const current=jobInfo();const currentCard=current?`<div class="card"><div class="row-between"><div><span class="tag green">EMPREGADO</span><h3 style="margin-top:12px">${current.emoji} ${escapeHTML(current.name)}${window.CaminhosPaths?.rankName(game)?' · '+escapeHTML(window.CaminhosPaths.rankName(game)):''}</h3><p>Salário anual base: ${brl(window.CaminhosPaths?.salary(game)??current.salary)}</p></div><strong class="highlight-number">${brl(Math.round((window.CaminhosPaths?.salary(game)??current.salary)/12))}<small class="muted" style="display:block;font-size:10px">por mês (média)</small></strong></div><p>Tempo acumulado de experiência: ${Math.floor(game.jobYears)} ano(s).</p><button class="danger-button" data-act="quit-job">Pedir demissão</button></div>`:`<div class="notice">💼 Você ainda não tem um emprego. Escolha uma profissão quando alcançar os requisitos.</div>`;
 const university=game.university?`<div class="notice">🎓 Cursando ${DEGREES[game.university.degree]} • ${game.university.yearsLeft} ano(s) para concluir.</div>`:'';
 const courses=Object.entries(DEGREES).map(([k,n])=>`<button class="secondary-button" data-act="university" data-id="${k}" ${game.university||game.degree.includes(k)||game.age<18?'disabled':''}>🎓 ${n}${game.degree.includes(k)?' ✓':''}</button>`).join('');
 const civilianCareers=CAREERS.filter(c=>!window.CaminhosPaths?.services[c.id]);const careers=civilianCareers.map(c=>{const why=jobRequirement(c);return `<div class="card"><div class="row-between stack-mobile"><div><h3>${c.emoji} ${escapeHTML(c.name)}</h3><p>${escapeHTML(c.description)}<br>Salário anual: ${brl(c.salary)} • Idade mínima: ${c.age}</p><span class="tag ${why?'':'green'}">${escapeHTML(why||'Requisitos atendidos')}</span></div><button class="secondary-button" data-act="job" data-id="${c.id}" ${why||c.id===game.job||!game.alive?'disabled':''}>${c.id===game.job?'Atual':'Candidatar'}</button></div></div>`}).join('');
 return displayTitle('Carreira e educação','Estude, desenvolva seus atributos e conquiste novas oportunidades.')+(window.CaminhosPaths?.futureChoice(game)||'')+(game.age<18?'<div class="card"><h3>🏫 Escola</h3><p>Conheça professores e colegas, participe de atividades e acompanhe suas notas.</p><button class="secondary-button" data-go="escola">Abrir minha escola →</button></div>':'')+currentCard+`<div class="section-title">Faculdade <small>R$ 6.500 por ano cursado</small></div>`+university+`<div class="card"><div class="mini-buttons">${courses}</div></div><div class="section-title" id="regular-jobs">Mercado de trabalho <small>${civilianCareers.length} carreiras</small></div>`+careers+(window.CaminhosPaths?.renderServices(game)||'')}
function renderRelationships(){const people=game.people.map(p=>`<div class="card"><div class="person-row"><div class="person-avatar portrait-holder">${window.CaminhosWorld?.portrait(p.name,p.role,p.id)||escapeHTML(p.emoji)}</div><div class="details"><strong>${escapeHTML(p.name)}</strong> <span class="tag">${escapeHTML(p.role)}</span><p>Vínculo: ${p.bond}/100</p><div class="progress-bar"><span style="width:${clamp(p.bond)}%"></span></div></div></div><div class="mini-buttons" style="margin-top:14px"><button class="secondary-button" data-act="rel" data-id="${Number(p.id)||0}" data-option="aproximar" ${!game.alive?'disabled':''}>Conversar</button>${game.partnerId===p.id&&p.role==='Namoro'?`<button class="secondary-button" data-act="rel" data-id="${Number(p.id)||0}" data-option="casar" ${game.age<18||p.bond<65?'disabled':''}>💍 Casar</button>`:''}${game.partnerId===p.id&&p.role==='Cônjuge'?`<button class="secondary-button" data-act="rel" data-id="${Number(p.id)||0}" data-option="filho" ${game.age<18?'disabled':''}>👶 Ter filho</button>`:''}${game.partnerId===p.id?`<button class="danger-button" data-act="rel" data-id="${Number(p.id)||0}" data-option="terminar">Terminar</button>`:''}</div></div>`).join('');
 return displayTitle('Relações','Família, amizades e amor: ninguém escreve sua história sozinho.')+`<div class="card"><h3>🐾 Animais de estimação</h3><p>Adote pets e cuide dos seus companheiros.</p><button type="button" class="secondary-button" data-go="pets">🐾 Ver meus pets →</button></div>`+`<div class="card row-between"><div><h3>💞 Vida amorosa</h3><p>${game.partnerId?'Você está em um relacionamento.':'Seu coração está livre.'} • Filhos: ${game.children}</p></div><button class="secondary-button" data-act="romance" ${game.age<16||game.partnerId||game.actions<=0?'disabled':''}>Conhecer alguém</button></div><div class="section-title">Pessoas na sua vida <small>${game.people.length} contatos</small></div>`+people}
function renderFinance(){
 const balance=window.CaminhosExtras?.wealth(game)??(game.cash+game.savings+game.properties*75000);
 return displayTitle('Bens e finanças','Compre carros, motos, casas, navios, aviões e empresas. Patrimônio e manutenção evoluem com sua história.')+
 '<div class="card"><div class="row-between"><div><div class="muted small">SALDO DISPONÍVEL</div><div class="highlight-number">'+brl(game.cash)+'</div></div>'+
 '<div><div class="muted small">PATRIMÔNIO TOTAL</div><div style="font-size:20px;font-weight:800">'+brl(balance)+'</div></div></div></div>'+
 '<div class="card"><h3>◈ Investimentos</h3><p>Saldo aplicado: <strong class="light">'+brl(game.savings)+'</strong>. Rendimento fictício de 3,5% ao ano.</p>'+
 '<div class="mini-buttons"><button class="secondary-button" data-act="money" data-option="depositar" data-value="1000">Aplicar R$ 1 mil</button>'+
 '<button class="secondary-button" data-act="money" data-option="depositar" data-value="5000">Aplicar R$ 5 mil</button>'+
 '<button class="secondary-button" data-act="money" data-option="resgatar" data-value="1000">Resgatar R$ 1 mil</button>'+
 '<button class="secondary-button" data-act="money" data-option="resgatar" data-value="all">Resgatar tudo</button></div></div>'+
 (window.CaminhosExtras?.renderAssets(game)||'')+
 '<div class="card"><h3>🏡 Imóvel básico (modelo antigo)</h3><p>Se preferir, ainda pode comprar o imóvel básico por R$ 75 mil. Imóveis anteriores continuam valendo normalmente.</p>'+
 '<button class="secondary-button" data-act="money" data-option="imovel" data-value="75000" '+(game.age<18?'disabled':'')+'>Comprar imóvel básico — R$ 75 mil</button></div>'+
 '<div class="notice">Tudo representa preços e investimentos fictícios do simulador.</div>';
}
function renderHistory(){return displayTitle('Minha história','Acompanhe os capítulos e acontecimentos que moldaram sua trajetória.')+`<div class="timeline">${game.history.map(h=>`<div class="timeline-item"><small>AOS ${h.age} ANOS</small><div><strong>${escapeHTML(h.title)}</strong><p>${escapeHTML(h.description)}</p></div></div>`).join('')}</div><div class="mini-buttons"><button class="secondary-button" data-act="export">⬇ Exportar minha história</button></div>`}
function renderAI(){const connected=config.enableAI&&config.endpoint;return displayTitle('Inteligência artificial','Eventos criativos, contextualizados pela fase da sua vida, gerados opcionalmente por um modelo de linguagem.')+`<div class="card"><div class="row-between"><div><h3>✳ Narrador com IA</h3><p>${connected?'Ativado: a IA tentará criar acontecimentos ao avançar os anos.':'Desativado: o jogo funciona com eventos locais, sem internet.'}</p></div><span class="tag ${connected?'green':''}">${connected?'ATIVO':'OFFLINE'}</span></div><form id="aiConfigForm"><div class="settings-field"><label for="aiEndpoint">URL pública do seu Cloudflare Worker</label><input class="field" id="aiEndpoint" type="url" placeholder="https://meu-narrador.usuario.workers.dev" value="${escapeHTML(config.endpoint)}"></div><label class="small" style="display:flex;align-items:center;gap:10px"><input type="checkbox" id="aiEnabled" ${config.enableAI?'checked':''}> Habilitar narrador com IA</label><div style="height:15px"></div><button type="submit" class="primary-button wide">Salvar configuração <span>✓</span></button></form></div><div class="card"><h3>✦ Experimente um acontecimento com IA</h3><p>Conecte o Worker para criar uma cena inédita. Uma tentativa por ano; se falhar, o jogo continua com eventos locais.</p><button class="secondary-button" data-act="ai-now" ${connected&&game.lastAIYear!==game.age&&!loading&&!game.pendingEvent?'':'disabled'}>Gerar acontecimento com IA</button></div><div class="notice"><strong>Sem custo para começar:</strong> o jogo e o GitHub Pages não cobram para o uso descrito. O narrador por IA exige configurar sua conta Cloudflare; o plano gratuito tem uma franquia diária e limites. Nunca coloque tokens secretos no JavaScript do navegador.</div>`}
// Novos sistemas independentes — mecânicas próprias, não copiadas de outro jogo.
const EXTRA_DEFAULT={company:null,office:null,officeYears:0,reputation:30,record:0,prison:0,followers:0,fame:0,film:0,fightSkill:0,fightWins:0,fightLosses:0,champion:false,godEdits:0,events:0};
const OFFICES=[{id:'vereador',name:'Vereador',cost:9000,age:18,stat:43},{id:'prefeito',name:'Prefeito',cost:35000,age:21,stat:55},{id:'governador',name:'Governador',cost:145000,age:30,stat:72},{id:'presidente',name:'Presidente',cost:400000,age:35,stat:85}];
const BUSINESS_TYPES=[{id:'cafe',name:'Cafeteria',icon:'☕',cost:17000},{id:'studio',name:'Estúdio criativo',icon:'🎧',cost:48000},{id:'tech',name:'Startup de tecnologia',icon:'📱',cost:110000},{id:'logistica',name:'Empresa de logística',icon:'🚚',cost:180000},{id:'cinema',name:'Produtora de cinema',icon:'🎞️',cost:240000}];
const extraData=x=>({...EXTRA_DEFAULT,...(x && typeof x==='object' && !Array.isArray(x)?x:{})});
function initExtra(){game.extra=extraData(game.extra)}
function safeExtra(){if(game&&!game.extra)initExtra();return game.extra}
function charge(cost){if(game.cash<cost){showToast('Saldo insuficiente: precisa de '+brl(cost));return false}game.cash-=cost;return true}
function useExtraAction(){if(!game.alive){showToast('Comece uma nova vida.');return false}if(game.pendingEvent){showEvent();return false}return true}
function noteExtra(title,desc){safeExtra().events++;logLine(title,desc);save();render();showToast(desc)}
function annualExtra(){const e=safeExtra();
 // Pena anual administrada pelo modulo de justiça.
 if(e.company){const c=e.company;const revenue=Math.round((c.level*11000+11500)*(.6+Math.random()*.8)*(game.stats.disciplina/100+.45));const cost=Math.round(9500+c.level*5300+(c.employees||1)*1400);const result=revenue-cost;game.cash+=result;c.years=(c.years||0)+1;c.profit=(c.profit||0)+result;noteAnnual('Negócio: '+c.name,'Sua empresa teve resultado de '+brl(result)+' neste ano.');if(game.cash< -150000){e.company=null;noteAnnual('Fim da empresa','As dívidas encerraram sua operação.')}}
 // Mandatos anuais administrados pelo modulo politico.
 if(e.followers>1000){let earned=Math.round(Math.sqrt(e.followers)*rand(4,13));game.cash+=earned;noteAnnual('Publicidade','Seus conteúdos renderam '+brl(earned)+' neste ano.')}
 e.followers=Math.max(0,Math.round(e.followers*(.95+Math.random()*.09)));e.fame=clamp(e.fame+rand(-4,2));
}
function noteAnnual(title,detail){game.history.unshift({age:game.age,title,description:detail});game.history=game.history.slice(0,150);game.lastEvent=detail}
function businessAction(kind,id){const e=safeExtra();if(game.age<18)return showToast('Você precisa ter 18 anos.');if(e.prison>0)return showToast('Não é possível administrar negócios enquanto cumpre pena.');
 if(kind==='open'){const t=BUSINESS_TYPES.find(x=>x.id===id);if(!t||e.company)return;if(game.cash<t.cost)return showToast('Capital necessário: '+brl(t.cost));if(!useExtraAction())return;game.cash-=t.cost;e.company={id:t.id,name:t.name,level:1,employees:1,years:0,profit:0};noteExtra('Empresa fundada','Você abriu sua empresa: '+t.name+'.')}
 if(kind==='improve'&&e.company){const cost=e.company.level*18000;if(game.cash<cost)return showToast('Ampliação custa '+brl(cost));if(!useExtraAction())return;game.cash-=cost;e.company.level++;e.company.employees+=2;game.stats.disciplina=clamp(game.stats.disciplina+3);noteExtra('Expansão','Sua empresa cresceu para o nível '+e.company.level+'.')}
 if(kind==='sell'&&e.company){if(!useExtraAction())return;const value=e.company.level*15500+e.company.employees*2600;game.cash+=value;e.company=null;noteExtra('Venda da empresa','Você vendeu seu negócio por '+brl(value)+'.')}
}
function politicalAction(id){window.CaminhosWorld?.election(game,id)}
function fameAction(kind){const e=safeExtra();if(game.age<13)return showToast('Disponível a partir dos 13 anos.');if(e.prison)return showToast('Você está cumprindo pena.');let cost=0;if(kind==='film'){if(game.age<18)return showToast('É necessário ter 18 anos.');cost=25000;if(game.cash<cost)return showToast('Uma produção custa '+brl(cost))}if(!useExtraAction())return;
 if(kind==='post'){const gained=rand(250,1800)+Math.round(game.stats.carisma*36)+Math.round(e.fame*70);e.followers+=gained;e.fame=clamp(e.fame+rand(1,5));game.stats.carisma=clamp(game.stats.carisma+2);noteExtra('Novo conteúdo','Sua postagem trouxe '+gained.toLocaleString('pt-BR')+' seguidores.');return}
 if(kind==='music'){const audience=Math.round(rand(100,3000)*(1+e.fame/60));const money=audience*rand(1,5);e.followers+=audience;e.fame=clamp(e.fame+rand(2,8));game.cash+=money;noteExtra('Lançamento musical','Sua música conquistou '+audience.toLocaleString('pt-BR')+' fãs e rendeu '+brl(money)+'.');return}
 if(kind==='film'){game.cash-=cost;const success=Math.random()*100+game.stats.inteligencia*.35+e.fame*.2;const revenue=Math.round(success*rand(600,1700));game.cash+=revenue;e.film++;e.fame=clamp(e.fame+Math.round(success/25));noteExtra('Estreia no cinema','Sua produção nº '+e.film+' arrecadou '+brl(revenue)+' nas bilheterias fictícias.')}
}
function fighterAction(kind){const e=safeExtra();if(game.age<16)return showToast('Lutas esportivas disponíveis a partir dos 16 anos.');if(e.prison)return showToast('Você precisa terminar sua pena.');if(!useExtraAction())return;
 if(kind==='train'){e.fightSkill=clamp(e.fightSkill+rand(6,12));game.stats.saude=clamp(game.stats.saude+4);game.stats.disciplina=clamp(game.stats.disciplina+2);noteExtra('Treino esportivo','Você evoluiu suas habilidades de luta para '+e.fightSkill+'/100.');return}
 const difficulty=rand(25,100);const score=e.fightSkill*.7+game.stats.saude*.4+rand(-26,27);const victory=score>=difficulty;if(victory){e.fightWins++;const prize=rand(1500,4500)*(1+Math.floor(e.fightWins/5));game.cash+=prize;e.fame=clamp(e.fame+3);if(e.fightWins>=8&&!e.champion){e.champion=true;noteExtra('Título conquistado','Você alcançou o título de campeão da liga!')}else noteExtra('Vitória na competição','Você venceu uma luta esportiva e recebeu '+brl(prize)+'.')}else{e.fightLosses++;game.stats.saude=clamp(game.stats.saude-rand(2,9));noteExtra('Derrota esportiva','Você perdeu uma luta. Treinar pode melhorar suas chances.')}
}
function crimeAction(kind){window.CaminhosWorld?.crimeAction(game,kind==='big'?'roubo':'furto')}
function creatorAction(stat){if(!game.alive)return;const e=safeExtra();if(stat==='cash'){game.cash+=100000;noteExtra('Modo Criador','Você adicionou R$ 100 mil ao seu personagem.');return}if(stat==='reputation'){e.reputation=100;noteExtra('Modo Criador','Você elevou sua reputação ao máximo.');return}if(stat==='fame'){e.fame=100;e.followers+=1000000;noteExtra('Modo Criador','Sua fama e seus seguidores aumentaram.');return}if(Object.hasOwn(STAT_LABELS,stat)){game.stats[stat]=clamp(game.stats[stat]+10);e.godEdits++;noteExtra('Modo Criador','Você aumentou '+STAT_LABELS[stat]+' em 10 pontos.')}
}
function panelCard(emoji,title,description,buttons){return `<div class="card"><div class="row-between stack-mobile"><div><h3>${emoji} ${escapeHTML(title)}</h3><p>${description}</p></div></div><div class="mini-buttons">${buttons}</div></div>`}
function tabButton(text,command,id='',disabled=false){return `<button type="button" class="secondary-button" data-extra="${escapeHTML(command)}" data-id="${escapeHTML(id)}" ${disabled?'disabled':''}>${escapeHTML(text)}</button>`}
function renderBusiness(){const e=safeExtra();let html=displayTitle('Empresas e negócios','Funde, administre e expanda seus negócios. Os resultados anuais variam, inclusive com prejuízos.');if(e.company){const c=e.company;html+=panelCard('🏢',c.name,`Nível ${c.level} • ${c.employees} funcionário(s) • ${c.years} anos de atividade • Saldo acumulado: ${brl(c.profit)}`,tabButton('Ampliar — '+brl(c.level*18000),'biz-improve')+tabButton('Vender empresa','biz-sell'))}else html+=`<div class="notice">Você ainda não abriu uma empresa do modelo clássico. No catálogo de Bens → Empresas você pode abrir várias empresas adicionais.</div>`;
 html+=window.CaminhosExtras?.businessCards(game)||'';html+=`<div class="section-title">Começar um negócio</div>`+BUSINESS_TYPES.map(b=>panelCard(b.icon,b.name,`Investimento inicial: ${brl(b.cost)}`,tabButton('Abrir empresa','biz-open',b.id,game.age<18||!!e.company))).join('');return html}
function renderPolitics(){return window.CaminhosWorld.renderPolitics(game)}
function renderFame(){const e=safeExtra();return displayTitle('Fama, filmes e música','Faça seu personagem crescer como artista e criador. Nada está preso a um pacote pago.')+panelCard('📸','Minha audiência',`${e.followers.toLocaleString('pt-BR')} seguidores • Fama: ${e.fame}/100 • Filmes lançados: ${e.film}`,tabButton('Publicar conteúdo','fame-post')+tabButton('Lançar música','fame-music')+tabButton('Produzir filme (R$ 25 mil)','fame-film','',game.age<18))+panelCard('🥊','Liga de luta',`Habilidade: ${e.fightSkill}/100 • Vitórias: ${e.fightWins} • Derrotas: ${e.fightLosses} • ${e.champion?'🏆 Campeão':'Ainda sem título'}`,tabButton('Treinar luta','fight-train','',game.age<16)+tabButton('Participar de luta','fight-match','',game.age<16));}
function renderChallenges(){return window.CaminhosWorld.renderCrime(game)}
function renderCreator(){return displayTitle('Modo Criador ✨','Todas as ferramentas de personalização são gratuitas neste jogo. Não há compras internas.')+panelCard('💰','Recursos especiais','Aplique modificações imediatas ao personagem. Estas escolhas não gastam ações anuais.',tabButton('Adicionar R$ 100 mil','create','cash')+tabButton('Máximo de reputação','create','reputation')+tabButton('1 milhão de seguidores','create','fame'))+`<div class="section-title">Melhorar atributos</div><div class="card"><div class="mini-buttons">${Object.entries(STAT_LABELS).map(([id,name])=>tabButton('+10 '+name,'create',id)).join('')}</div></div>`}
function extraClick(action,id){if(!game||!game.alive)return;const e=safeExtra();if(action==='biz-open')businessAction('open',id);else if(action==='biz-improve')businessAction('improve');else if(action==='biz-sell')businessAction('sell');else if(action==='elect')politicalAction(id);else if(action==='campanha'){if(!useExtraAction())return;e.reputation=clamp(e.reputation+rand(4,12));noteExtra('Vida comunitária','Você se envolveu na comunidade e sua reputação melhorou.')}else if(action==='fame-post')fameAction('post');else if(action==='fame-music')fameAction('music');else if(action==='fame-film')fameAction('film');else if(action==='fight-train')fighterAction('train');else if(action==='fight-match')fighterAction('match');else if(action==='crime-small')crimeAction('small');else if(action==='crime-big')crimeAction('big');else if(action==='create')creatorAction(id)}

function render(){
 $('welcomeView').classList.toggle('hidden',!!game);$('gameView').classList.toggle('hidden',!game);$('openNavigation').classList.toggle('hidden',!game);$('quickSave').classList.toggle('hidden',!game);if(!game)return;
 window.CaminhosDynasty?.ensure(game);window.CaminhosSkills?.ensure(game);window.CaminhosExtras?.ensure(game);window.CaminhosPaths?.ensure(game);window.CaminhosWorld?.ensure(game);window.CaminhosUI?.ensure(game);
 $('careerDockIcon').textContent=game.age<18?'🎓':'💼';$('careerDockLabel').textContent=game.age<18?'Escola':'Profissão';
 $('heroName').textContent=game.name;$('avatar').innerHTML=window.CaminhosWorld?.portrait(game.name,'Protagonista',0,true)||avatar();$('lifeStage').textContent=stage().toUpperCase();$('ageLabel').textContent=game.age+' '+(game.age===1?'ano':'anos');$('jobLabel').textContent=jobInfo()?.name||(game.age<18?'Crescendo e aprendendo':'Sem emprego');$('moneyLabel').textContent=brl(game.cash);$('savingsLabel').textContent='Investimentos: '+brl(game.savings);$('yearNumber').innerHTML=game.age+'<span>'+(game.age===1?'ano':'anos')+'</span>';
 $('profileActions').textContent='Atividades livres';$('apLabel').textContent='Ações ilimitadas';$('apDots').innerHTML='';$('lastEvent').textContent=game.lastEvent;
 $('gameView').classList.toggle('has-career-stat',!!(game.extra?.office||game.job==='politico'||['ator','diretor','musico','influencer','atleta','lutador'].includes(game.job)));
 $('statsStrip').innerHTML=window.CaminhosUI?.renderStats(game)||Object.entries(STAT_LABELS).map(([k,n])=>`<div class="stat-card"><div class="stat-row"><span class="stat-name">${STAT_ICONS[k]} ${n}</span><span class="stat-value">${Math.round(game.stats[k])}</span></div><div class="stat-track"><div class="stat-fill ${STAT_COLORS[k]}" style="width:${game.stats[k]}%"></div></div></div>`).join('');
 document.querySelectorAll('[data-tab]').forEach(btn=>{btn.classList.toggle('active',btn.dataset.tab===activeTab);btn.setAttribute('aria-current',btn.dataset.tab===activeTab?'page':'false')});
 document.querySelectorAll('[data-dock]').forEach(btn=>{const isSelected=btn.dataset.dock===activeTab;btn.classList.toggle('active',isSelected);if(btn.dataset.dock==='advance')btn.disabled=!game.alive||loading;else btn.setAttribute('aria-current',isSelected?'page':'false')});
 const content={vida:renderLife,atividades:renderActivities,'atividades-detalhes':renderActivities,lazer:()=>window.CaminhosEveryday.renderMenu(game),habilidades:()=>window.CaminhosSkills.render(game),cotidiano:()=>window.CaminhosEveryday.renderMenu(game),carreira:renderCareer,'carreira-detalhes':renderCareer,'financas-detalhes':renderFinance,'relacoes-detalhes':renderRelationships,escola:()=>window.CaminhosExtras.renderSchool(game),hobbies:()=>window.CaminhosPaths.renderMartial(game),pets:()=>window.CaminhosWorld.renderPets(game),relacoes:renderRelationships,financas:renderFinance,historia:renderHistory,conquistas:()=>window.CaminhosAchievements?.render(game)||'<p>Conquistas indisponíveis.</p>',arvore:()=>window.CaminhosDynasty?.render(game)||'<p>Árvore indisponível.</p>',ia:renderAI,negocios:renderBusiness,politica:renderPolitics,fama:renderFame,desafios:renderChallenges,criador:renderCreator};$('tabContent').innerHTML=(game.alive?(window.CaminhosUI?.renderTab(game,activeTab)??(content[activeTab]||renderLife)()):`<div class="death-banner"><h3>🕊️ Um capítulo terminou</h3><p>${escapeHTML(game.name)} viveu ${game.age} anos, deixando ${game.children} filho(s). O legado familiar pode continuar.</p><div class="mini-buttons"><button class="secondary-button" data-go="arvore">🌳 Árvore familiar</button><button class="secondary-button" data-act="export">Exportar história</button></div>${(window.CaminhosDynasty?.candidates(game)||[]).length?'<div class="section-title">Escolha um descendente vivo</div>': '<div class="notice">Esta linhagem não tem descendentes vivos. Você pode iniciar uma nova família sem perder as conquistas da conta.</div>'}${(window.CaminhosDynasty?.candidates(game)||[]).map(p=>`<button type="button" class="secondary-button heir-quick" data-act="inherit" data-id="${p.id}">🌿 ${escapeHTML(p.name)} · ${p.age} anos · Continuar →</button>`).join('')}<div class="mini-buttons"><button class="danger-button" data-act="restart">Iniciar outra família →</button></div></div>`);
 const next=$('nextYear');next.disabled=!game.alive||loading;next.textContent=game.pendingEvent?'✦ Decisão pendente':loading?'Preparando ano...':'+ Avançar 1 ano →';
}
function showModal(body){$('modalContent').innerHTML=body;$('overlay').classList.remove('hidden')}
function hideModal(){$('overlay').classList.add('hidden')}
function showEvent(){
 if(!game?.pendingEvent)return;
 const e=game.pendingEvent;
 const att=CORE_METRICS[e.attribute];
 const statBar=att?'<div class="event-attribute-meter"><span>'+att.icon+' '+att.name+'</span><div class="retro-stat-meter"><span style="width:'+clamp(coreValue(e.attribute))+'%"></span></div><strong>'+Math.round(coreValue(e.attribute))+'%</strong></div>':'';
 showModal('<div class="'+(att?'attribute-event':'')+'">'+
 '<div class="event-icon">'+(att?att.icon:e.source==='ia'?'✳':'✦')+'</div>'+
 '<div class="card-kicker">'+(att?'OPORTUNIDADE · '+att.name.toUpperCase():e.source==='ia'?'HISTÓRIA GERADA COM IA':'ACONTECIMENTO INESPERADO')+' • '+game.age+' ANOS</div>'+
 '<h2 id="modalTitle">'+escapeHTML(e.title)+'</h2><p>'+escapeHTML(e.story)+'</p>'+statBar+
 '<div class="section-title">O que você vai fazer?</div>'+e.choices.map((item,i)=>
 '<button class="choice" data-act="choice" data-index="'+i+'">'+escapeHTML(item.text)+'</button>').join('')+'</div>');
}
function showEnd(){
 window.CaminhosDynasty?.recordDeath(game);save();
 const heirs=window.CaminhosDynasty?.candidates(game)||[];
 showModal('<div class="event-icon">🕊️</div><div class="card-kicker">UMA GERAÇÃO SE DESPEDE</div>'+
  '<h2 id="modalTitle">'+escapeHTML(game.name)+' deixou seu legado</h2>'+
  '<p>Seu personagem viveu '+game.age+' anos. '+(heirs.length?'O patrimônio foi dividido entre os filhos e seus respectivos ramos. Escolha um descendente para continuar. A herança de pais vivos não é antecipada.':'Não restam descendentes vivos. As conquistas da sua conta permanecerão desbloqueadas.')+'</p>'+
  '<div class="heir-list">'+heirs.map(p=>'<button type="button" class="secondary-button heir-quick" data-act="inherit" data-id="'+p.id+'">🌿 '+escapeHTML(p.name)+' · '+p.age+' anos · Continuar →</button>').join('')+'</div>'+
  '<div class="mini-buttons"><button class="secondary-button" data-go="arvore">🌳 Ver árvore familiar</button><button class="secondary-button" data-act="export">⬇ Exportar</button>'+
  '<button class="danger-button" data-act="restart">Criar outra família</button></div>');
}
function showSettings(){showModal(`<div class="card-kicker">SALVAMENTO E CONFIGURAÇÕES</div><h2 id="modalTitle">Sua partida</h2><p>✅ O jogo salva automaticamente no aparelho e, quando você entra com Google ou Apple, também tenta sincronizar com a nuvem. Versões diferentes exigem sua escolha para evitar perdas.</p><div class="mini-buttons"><button class="secondary-button" data-act="save-now" ${!game?'disabled':''}>💾 Salvar agora</button><button class="secondary-button" data-act="export" ${!game?'disabled':''}>⬇ Exportar arquivo JSON</button><label class="secondary-button" style="cursor:pointer">⬆ Importar jogo<input id="importSave" type="file" accept=".json,application/json" hidden></label><button class="secondary-button" data-act="tutorial">📘 Como funciona?</button><button type="button" class="secondary-button" data-cloud-action="open">☁️ Login e salvamento na nuvem</button><button class="danger-button" data-act="restart" ${!game?'disabled':''}>Recomeçar</button></div><div class="notice"><strong>Como continuar no iPhone ou PC:</strong> toque em <b>Exportar arquivo JSON</b>, guarde-o no app Arquivos ou iCloud Drive e, no outro aparelho, use <b>Importar jogo</b>. A importação substitui a partida atual. Limpar dados do Safari, usar modo privado ou mudar de navegador pode apagar o progresso local.</div><div class="notice"><strong>Nuvem:</strong> depois de entrar com Google, o progresso é sincronizado automaticamente quando não há conflito com outro aparelho. Você pode acompanhar pelo botão 💾 Salvar no topo. O login Apple depende da configuração do provedor.</div>`)}
function downloadSave(){if(!game)return;const blob=new Blob([JSON.stringify(game,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='caminhos-'+game.name.toLowerCase().replace(/[^a-z0-9áàâãéêíóôõúüç-]/gi,'-')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast('Progresso exportado!')}
async function importSave(file){if(!file)return;try{if(file.size>1000000)throw Error('Arquivo grande demais.');const data=JSON.parse(await file.text());if(!isValidGame(data))throw Error('Salvamento incompatível ou inválido.');data.name=data.name.slice(0,32);data.age=clamp(data.age,0,130);data.actions=3;data.people=data.people.slice(0,50).map((p,i)=>({...p,id:Number.isSafeInteger(p.id)?p.id:i+1,name:String(p.name||'Pessoa').slice(0,40),role:String(p.role||'Amizade').slice(0,35),emoji:String(p.emoji||'🙂').slice(0,8),bond:clamp(p.bond)}));data.history=data.history.slice(0,150).map(h=>({age:clamp(h.age,0,130),title:String(h.title||'').slice(0,90),description:String(h.description||'').slice(0,700)}));data.pendingEvent=null;data.extra=extraData(data.extra);game=data;save();hideModal();activeTab='vida';render();showToast('Sua história foi restaurada!')}catch(err){showToast('Não foi possível importar: '+err.message)}}
async function generateNow(){if(loading||!config.enableAI||!config.endpoint||game.pendingEvent||game.lastAIYear===game.age)return;loading=true;game.lastAIYear=game.age;save();render();try{const event=await aiEvent();game.pendingEvent=event;save();showEvent()}catch(err){showToast('Não foi possível gerar com IA: '+err.message+'. Sem perder o jogo.')}finally{loading=false;render()}}
$('newGameForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);const name=String(f.get('name')||'').trim();if(name.length<2)return showToast('Digite um nome com pelo menos 2 caracteres.');startGame(name,String(f.get('city')),String(f.get('trait')))});
$('nextYear').addEventListener('click',advance);$('openNavigation').addEventListener('click',openMoreMenu);$('homeShortcut').addEventListener('click',()=>{activeTab='vida';render();window.scrollTo({top:0,behavior:'smooth'})});$('openSettings').addEventListener('click',showSettings);$('closeModal').addEventListener('click',hideModal);$('brandHome').addEventListener('click',e=>{e.preventDefault();activeTab='vida';render();window.scrollTo({top:0,behavior:'smooth'})});
document.addEventListener('submit',e=>{if(e.target.id!=='aiConfigForm')return;e.preventDefault();const endpoint=$('aiEndpoint').value.trim();if(endpoint&&(!/^https:\/\//i.test(endpoint)||endpoint.length>240))return showToast('Use uma URL HTTPS válida para seu Worker.');config.endpoint=endpoint;config.enableAI=$('aiEnabled').checked&&!!endpoint;persistConfig();render();showToast('Configuração da IA salva.')});
document.addEventListener('change',e=>{if(e.target.id==='importSave')importSave(e.target.files?.[0])});
document.addEventListener('click',e=>{const tab=e.target.closest('[data-tab]');if(tab){activeTab=tab.dataset.tab;render();return}const b=e.target.closest('[data-act]');if(!b)return;const act=b.dataset.act,id=b.dataset.id,option=b.dataset.option;if(act==='attribute-boost')openAttributeOpportunity(b.dataset.stat);if(act==='dismiss-result')hideModal();if(act==='activity')performAction(id);if(act==='job')setJob(id);if(act==='quit-job'){if(confirm('Deseja realmente pedir demissão?')){window.CaminhosPaths?.leave(game);game.job=null;game.jobYears=0;logLine('Mudança de planos','Você decidiu sair do emprego.');render()}}if(act==='university')startUniversity(id);if(act==='romance')romance();if(act==='rel')relationAction(Number(id),option);if(act==='choose-strike')performStrike(Number(id),b.dataset.move);if(act==='money'){let n=b.dataset.value==='all'?game.savings:Number(b.dataset.value);moneyAction(option,n)}if(act==='choice')applyChoice(Number(b.dataset.index));if(act==='show-event')showEvent();if(act==='tutorial')showTutorial();if(act==='game-settings')showSettings();if(act==='save-now')window.CaminhosCloud?.manualSave();if(act==='export')downloadSave();if(act==='restart')restartLife();if(act==='inherit'){if(!game?.alive&&window.CaminhosDynasty?.chooseHeir(game,Number(id))){save();hideModal();activeTab='vida';render();showToast('🌳 A história continua com '+game.name+'!')}}if(act==='account-achievements')showModal(window.CaminhosAchievements?.render(game)||'Conquistas indisponíveis.');if(act==='ai-now')generateNow()});
game=restore();if(game)window.CaminhosDynasty?.ensure(game);render();

// Navegação auxiliar e ações dos módulos avançados.
document.addEventListener('click',ev=>{
 const btn=ev.target.closest('[data-extra]');if(btn){extraClick(btn.dataset.extra,btn.dataset.id);return}
 const dock=ev.target.closest('[data-dock]');if(dock){const v=dock.dataset.dock;if(v==='advance')advance();else if(v==='more')openMoreMenu();else {activeTab=v;render();window.scrollTo({top:0,behavior:'smooth'})}return}
});

// Ajuda integrada: conteúdo original baseado nas mecânicas atuais do jogo.
function showTutorial(){
 const statInfo=[
  ['❤','Saúde','Condição física e bem-estar. Esportes, cuidados pessoais e acontecimentos podem aumentar ou diminuir esse indicador.'],
  ['☀','Felicidade','Satisfação com a vida. Atividades, relações e acontecimentos influenciam o seu humor.'],
  ['◈','Inteligência','Aprendizado e raciocínio. Estudar melhora esse atributo; profissões e faculdade podem exigir níveis altos.'],
  ['✨','Aparência','Como seu visual influencia oportunidades e a confiança pessoal. Você pode trabalhar esse atributo em eventos e escolhas.']
 ];
 const attributes=statInfo.map(function(row){
   return '<div class="tutorial-stat"><span class="tutorial-symbol" aria-hidden="true">'+row[0]+'</span><div><strong>'+row[1]+'</strong><p>'+row[2]+'</p></div></div>';
 }).join('');
 showModal(
  '<div class="card-kicker">MANUAL DO JOGADOR</div><h2 id="modalTitle">📘 Como jogar CAMINHOS</h2>'+
  '<div class="tutorial-section"><h3>1. Sua história</h3><p>O botão verde <strong>+ Idade</strong> faz o personagem envelhecer um ano. Alguns anos trazem acontecimentos com escolhas que alteram seu futuro. Você pode praticar atividades livremente ao longo do mesmo ano.</p></div>'+
  '<div class="tutorial-section"><h3>2. O que significa cada status?</h3><p>As quatro barras principais vão de <strong>0 a 100</strong>. Popularidade e Fama aparecem apenas em carreiras pertinentes. Quanto maior o número, maior a característica:</p>'+attributes+'</div>'+
  '<div class="tutorial-section"><h3>3. Dinheiro e outros indicadores</h3><p><strong>Dinheiro:</strong> saldo disponível para gastos. <strong>Investimentos:</strong> valor reservado, separado do saldo. <strong>Patrimônio:</strong> inclui outros bens. <strong>Relações:</strong> mostram o vínculo com outras pessoas. <strong>Atividades:</strong> treinos e ações comuns podem ser repetidos no mesmo ano.</p></div>'+
  '<div class="tutorial-section"><h3>4. Onde ficam as funções?</h3><p><strong>Trabalho:</strong> estudo e emprego. <strong>Bens:</strong> veículos, imóveis, empresas, investimentos e manutenção anual. <strong>Escola:</strong> professores, colegas e atividades infantis. <strong>Relações:</strong> família e amizades. <strong>Atividades:</strong> ações do ano. No botão <strong>Mais</strong> da barra inferior ou no menu ☰ você encontra também Escola, Negócios, Política, Fama, Riscos, IA, Conquistas e Modo Criador. Use <strong>📖 Diário</strong> no cabeçalho para voltar à sua vida.</p></div>'+
  '<div class="tutorial-section"><h3>5. Como salvar meu progresso?</h3><p>O progresso é <strong>salvo automaticamente neste aparelho e, após login, também na nuvem</strong> quando não há conflito entre partidas. Para ter uma cópia segura, abra ☰ → <strong>Salvar e recuperar</strong> → <strong>Exportar arquivo JSON</strong>. Guarde o arquivo no iCloud Drive/Arquivos do iPhone. Para restaurar, use <strong>Importar jogo</strong> no aparelho desejado. A importação substitui a partida atual.</p><p class="tutorial-warning">⚠️ Sem login, o salvamento fica apenas no aparelho. Com login, o backup na nuvem permite recuperar sua partida no PC/iPhone; se houver duas versões divergentes, escolha qual manter. O arquivo JSON continua sendo um backup adicional seguro.</p><div class="mini-buttons"><button type="button" class="primary-button" data-act="game-settings">💾 Abrir salvamento →</button></div></div>'+
  '<div class="tutorial-section"><h3>6. Conquistas</h3><p>Abra ☰ → <strong>Conquistas</strong> para ver desafios de trabalho, estudos, família, dinheiro, negócios, política, fama, luta e muito mais. Quando você completa um objetivo, ele fica desbloqueado na sua partida.</p></div>'+
  '<div class="tutorial-section"><h3>7. Posso entrar com Google ou Apple?</h3><p>Abra ☰ → <strong>Conta e nuvem</strong>. O login Google pode sincronizar automaticamente após a autenticação. O login Apple depende da configuração do provedor. Use sempre o botão 💾 Salvar do cabeçalho para ver o estado do backup.</p></div>'
 );
}
async function restartLife(){
 if(!game)return;
 const info='Recomeçar vida? Seu personagem atual, histórico e bens desta vida serão apagados. As conquistas da conta permanecerão salvas. Se estiver conectado ao Google, o backup desta vida na nuvem também será excluído. Para guardar uma cópia, exporte a partida antes. Deseja continuar?';
 if(!confirm(info))return;
 const cloud=window.CaminhosCloud;
 if(cloud?.resetLife){
   try{
     const ok=await cloud.resetLife();
     if(!ok)return;
   }catch(err){
     showToast('Não foi possível recomeçar. O progresso foi preservado.');
     return;
   }
 }
 try{localStorage.removeItem(SAVE_KEY)}catch{
   showToast('Não foi possível apagar a partida local. Verifique o armazenamento do navegador.');
   return;
 }
 game=null;
 loading=false;
 activeTab='vida';
 hideModal();render();window.scrollTo({top:0,behavior:'smooth'});
 showToast('Nova vida liberada! Crie um novo personagem.');
}
function openMoreMenu(){if(!game)return;showModal(`<div class="card-kicker">NAVEGAÇÃO E AJUDA</div><h2 id="modalTitle">Explorar a vida</h2><div class="more-grid"><button type="button" class="secondary-button menu-help" data-act="tutorial">📘 Tutorial e atributos</button><button type="button" class="secondary-button menu-help" data-act="game-settings">💾 Salvar e recuperar</button><button type="button" class="secondary-button menu-help" data-cloud-action="open">☁️ Conta e nuvem</button><button type="button" class="secondary-button menu-help" data-go="arvore">🌳 Árvore familiar</button><button type="button" class="secondary-button menu-help" data-go="conquistas">🏆 Conquistas da conta</button><button type="button" class="danger-button menu-help" data-act="restart">🔄 Recomeçar vida</button>${Array.from(document.querySelectorAll('.nav-list .tab')).map(el=>`<button class="secondary-button" data-go="${escapeHTML(el.dataset.tab)}">${escapeHTML(el.textContent.trim())}</button>`).join('')}</div>`)}
document.addEventListener('click',ev=>{const btn=ev.target.closest('[data-go]');if(!btn)return;hideModal();activeTab=btn.dataset.go;render();window.scrollTo({top:0,behavior:'smooth'})});