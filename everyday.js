/* CAMINHOS — Atividades do cotidiano e acontecimentos de vida. */
(function(){
'use strict';
const esc=x=>escapeHTML(String(x??''));
const clamp100=x=>Math.max(0,Math.min(100,Math.round(x)));
const rnd=(lo,hi)=>Math.floor(Math.random()*(hi-lo+1))+lo;
const THINGS=[
 ['cinema','🎬','Ir ao cinema','Assista a um filme e relaxe','Lazer',6,65],
 ['ferias','🏖️','Tirar férias','Conheça um lugar e recarregue as energias','Lazer',16,2400],
 ['balada','🪩','Sair à noite','Curta uma festa com amigos','Lazer',18,180],
 ['parque','🌳','Passear no parque','Aproveite o ar livre','Lazer',3,0],
 ['restaurante','🍽️','Sair para comer','Aproveite uma refeição especial','Lazer',10,90],
 ['viagem','✈️','Fazer uma viagem','Explore novas cidades','Lazer',12,1400],
 ['medico','🩺','Ir ao médico','Consulte seu estado de saúde','Saúde e bem-estar',0,350],
 ['terapia','🧠','Fazer terapia','Cuide da sua saúde emocional','Saúde e bem-estar',10,240],
 ['academia','🏋️','Ir à academia','Treine seu corpo e disciplina','Saúde e bem-estar',14,65],
 ['meditacao','🧘','Meditar','Acalme a mente','Saúde e bem-estar',6,0],
 ['loteria','🎟️','Jogar na loteria','Tente a sorte com um bilhete','Sorte e dinheiro',18,15],
 ['emprestimo','🏦','Pedir empréstimo','Consiga crédito e assuma parcelas','Sorte e dinheiro',18,0],
 ['pagar-emprestimo','💳','Pagar empréstimo','Reduza sua dívida atual','Sorte e dinheiro',18,0],
 ['processar','⚖️','Processar alguém','Abra uma ação civil fictícia','Sorte e dinheiro',18,800],
 ['emigrar','🌎','Mudar de país','Recomece em outro país','Vida e família',18,8000],
 ['adotar-crianca','🧸','Adotar uma criança','Acolha uma criança na sua família','Vida e família',25,4500],
 ['pets','🐾','Adotar um pet','Veja os animais em Relacionamentos','Vida e família',10,0],
 ['artes-marciais','🥋','Artes marciais','Jiu-jítsu, judô, boxe e outras lutas','Habilidades e hobbies',5,0],
 ['habilidades','🎸','Aprender habilidades','Instrumentos, canto, desenho, esportes e mais','Habilidades e hobbies',5,0],
 ['leitura','📚','Ler e estudar','Melhore sua inteligência','Habilidades e hobbies',5,0],
 ['voluntariado','🤝','Trabalho voluntário','Ajude outras pessoas','Habilidades e hobbies',12,0]
];
const SCENES=[
 {id:'transito',minAge:16,title:'Uma rua perigosa',story:'Você viu um motorista furar o sinal enquanto atravessava a rua.',
  choices:[['Esperar na calçada',{saude:0,disciplina:2},'safe'],['Ajudar alguém a atravessar',{carisma:5,felicidade:3},'brave'],['Correr para atravessar mesmo assim',{felicidade:1},'road']]},
 {id:'tempestade',minAge:5,title:'Temporal inesperado',story:'Uma forte tempestade atingiu sua região. A previsão é de chuva e vento intensos.',
  choices:[['Ficar em um local seguro',{disciplina:2},'safe'],['Ajudar os vizinhos',{carisma:4,felicidade:4},'help'],['Sair mesmo com a tempestade',{felicidade:1},'storm']]},
 {id:'montanha',minAge:16,title:'Trilha na serra',story:'Amigos convidaram você para uma trilha. O tempo virou e a visibilidade ficou ruim.',
  choices:[['Voltar com segurança',{disciplina:3},'safe'],['Esperar a equipe de resgate',{inteligencia:3},'safe'],['Continuar pela encosta',{felicidade:5},'cliff']]},
 {id:'remedio',minAge:5,title:'Uma febre repentina',story:'Você acordou com muita febre e precisa decidir como cuidar da saúde.',
  choices:[['Procurar atendimento médico',{saude:11,cash:-150},'treatment'],['Descansar e monitorar sintomas',{saude:2},'rest'],['Ignorar os sintomas',{felicidade:-3},'neglect']]},
 {id:'assalto',minAge:15,title:'Uma situação assustadora',story:'Você presenciou uma tentativa de roubo próximo a uma loja.',
  choices:[['Procurar abrigo e chamar a polícia',{disciplina:3},'safe'],['Ajudar as vítimas de longe',{carisma:6},'help'],['Confrontar os criminosos',{disciplina:4},'confront']]},
 {id:'hospital',minAge:12,title:'Uma pessoa precisa de ajuda',story:'Uma pessoa desmaiou perto de você. Alguém pede socorro.',
  choices:[['Chamar o serviço de emergência',{carisma:5},'help'],['Oferecer ajuda com segurança',{disciplina:4},'brave'],['Ignorar e ir embora',{felicidade:-5},'safe']]},
 {id:'carro',minAge:18,title:'Viagem pela estrada',story:'Você está em um carro e o motorista oferece a chance de dirigir num trecho perigoso.',
  choices:[['Dirigir com cautela',{disciplina:3},'safe'],['Preferir ser passageiro',{felicidade:2},'safe'],['Acelerar e fazer ultrapassagens arriscadas',{felicidade:4},'reckless']]},
 {id:'trabalho',minAge:18,title:'Segurança no trabalho',story:'Você notou um problema de segurança no ambiente profissional.',
  choices:[['Avisar e interromper a atividade',{disciplina:6,carisma:2},'safe'],['Pedir manutenção',{inteligencia:3},'safe'],['Ignorar e continuar trabalhando',{disciplina:-4},'work']]},
 {id:'presente',minAge:4,title:'Uma surpresa agradável',story:'Alguém ofereceu um presente para agradecer sua gentileza.',
  choices:[['Aceitar e agradecer',{felicidade:7,carisma:3},'safe'],['Compartilhar com outra pessoa',{felicidade:5,carisma:5},'help'],['Recusar educadamente',{disciplina:2},'safe']]},
 {id:'carteira',minAge:8,title:'Uma carteira perdida',story:'Você encontrou uma carteira com documentos e algum dinheiro.',
  choices:[['Entregar ao dono',{disciplina:7,felicidade:5},'safe'],['Levar a um posto policial',{carisma:4},'safe'],['Ficar com o dinheiro',{cash:350,disciplina:-7},'legal']]},
 {id:'heranca',minAge:16,title:'Carta inesperada',story:'Um antigo conhecido da família deixou uma carta que pode mudar seus planos.',
  choices:[['Ler com a família',{felicidade:6},'safe'],['Investigar a história',{inteligencia:5},'safe'],['Deixar para depois',{disciplina:-2},'safe']]},
 {id:'oportunidade',minAge:16,title:'Um convite especial',story:'Uma pessoa que você conhece convidou você para aprender algo diferente.',
  choices:[['Aceitar a oportunidade',{inteligencia:5,carisma:3},'safe'],['Convidar um amigo',{felicidade:5},'safe'],['Recusar por enquanto',{disciplina:1},'safe']]},
 {id:'cachorro',minAge:5,title:'Animal em situação de risco',story:'Um cachorro se perdeu durante uma caminhada no seu bairro.',
  choices:[['Ligar para uma ONG de resgate',{carisma:5,felicidade:4},'help'],['Aproximar-se com cuidado',{felicidade:5},'brave'],['Não se aproximar',{disciplina:1},'safe']]},
 {id:'premio',minAge:12,title:'Sorteio comunitário',story:'Você foi escolhido para participar de um concurso da comunidade.',
  choices:[['Participar',{felicidade:4,carisma:3},'lucky'],['Convidar a família',{felicidade:5},'safe'],['Não participar',{disciplina:1},'safe']]}
];
const RISK={safe:0,help:.000015,brave:.00008,road:.00045,storm:.00035,cliff:.001,neglect:.00015,confront:.0008,reckless:.0012,work:.00035,legal:.00004,treatment:0,rest:0,lucky:0};
function ensure(g){
 if(!g.extra)g.extra={};let x=g.extra.everyday;
 if(!x||typeof x!=='object')x=g.extra.everyday={country:'Brasil',debt:0,illness:null,illnessYears:0,actionCounts:{},events:0,accidents:0,nearMisses:0,treated:0,lotteryWins:0,adoptions:0,travels:0,disasters:0};
 if(!x.actionCounts||typeof x.actionCounts!=='object')x.actionCounts={};
 if(!Number.isFinite(x.debt))x.debt=0;
 return x;
}
function harm(g,type,{safety=false}={}){
 const e=ensure(g),luck=g.extra.luck??50;
 const odds=(RISK[type]??0) * (1.18-luck*.003);
 if(Math.random()<odds){
  e.accidents++;e.disasters++;
  g.stats.saude=0;g.alive=false;
  window.CaminhosDynasty?.recordDeath(g);
  logLine('Acidente fatal','Uma consequência raríssima de sua decisão resultou em um acidente fatal. '+g.name+' morreu aos '+g.age+' anos.');
  save();render();showEnd();return true;
 }
 const near={road:.12,storm:.08,cliff:.24,neglect:.22,confront:.27,reckless:.22,work:.10,brave:.06,legal:.04};
 if(Math.random()<(near[type]||0)){
  e.nearMisses++;
  const damage=rnd(4,16);g.stats.saude=clamp100(g.stats.saude-damage);
  if(type==='neglect')e.illness='Sintomas agravados';
  logLine('Susto e consequências','Sua decisão teve consequências: você perdeu '+damage+' pontos de saúde, mas se recuperou do perigo.');
 }
 return false;
}
function annual(g){
 const x=ensure(g);window.CaminhosSkills?.ensure(g);
 if(g.age<1||!g.alive)return;
 if(x.debt>0){
  x.debt=Math.round(x.debt*1.09);
  if(g.age>=18){const payment=Math.min(x.debt,Math.max(0,Math.round(g.cash*.06)));g.cash-=payment;x.debt-=payment}
  if(x.debt>2000000)logLine('Dívida acumulada','Seu empréstimo cresceu com juros. Considere amortizar a dívida.');
 }
 if(x.illness){
  x.illnessYears++;g.stats.saude=clamp100(g.stats.saude-rnd(2,6));
 }else if(Math.random()<(g.age>60?.15:.07)){
  x.illness=['Gripe forte','Infecção','Problema respiratório','Enxaqueca prolongada'][rnd(0,3)];
  x.illnessYears=0;g.stats.saude=clamp100(g.stats.saude-rnd(3,9));
  logLine('Você ficou doente','Sintomas de '+x.illness.toLowerCase()+' surgiram. Procure um médico em Atividades para iniciar os cuidados.');
 }
 // Há risco natural mínimo de acidentes mesmo com escolhas seguras.
 if(Math.random()<.000045){harm(g,'reckless');}
}
function randomEvent(g){
 const list=SCENES.filter(x=>g.age>=x.minAge&&(!g.extra?.everyday?.illness||x.id!=='remedio'));
 if(!list.length)return null;
 const spec=list[rnd(0,list.length-1)];
 return {source:'cotidiano',title:spec.title,story:spec.story,scenario:spec.id,choices:spec.choices.map(([text,delta,risk])=>({text,delta,risk}))};
}
function applyChoice(g,choice){
 const x=ensure(g);x.events++;
 if(choice.risk==='treatment'&&x.illness){x.illness=null;x.illnessYears=0;x.treated++;g.stats.saude=clamp100(g.stats.saude+12);}
 if(choice.risk==='lucky'&&Math.random()<(g.extra.luck||50)/450){g.cash+=600;logLine('Um pequeno prêmio','Você ganhou R$ 600 em um sorteio da comunidade.');}
 return harm(g,choice.risk||'safe');
}
function execute(g,id){
 const opt=THINGS.find(x=>x[0]===id);if(!opt)return;
 if(!g.alive)return showToast('Esta vida terminou. Escolha um herdeiro ou recomece.');
 if(g.age<opt[5])return showToast('Disponível aos '+opt[5]+' anos.');
 if(g.extra?.prison>0)return showToast('Atividade indisponível enquanto cumpre pena.');
 if(g.pendingEvent)return showEvent();
 const x=ensure(g),dateKey=id+':'+g.age,used=x.actionCounts[dateKey]||0;
 if(id==='pets'){activeTab='pets';render();return}
 if(id==='artes-marciais'){activeTab='hobbies';render();return}
 if(id==='habilidades'){activeTab='habilidades';render();return}
 if(id==='pagar-emprestimo'){if(x.debt<=0)return showToast('Você não tem empréstimos para pagar.');if(g.cash<=0)return showToast('Sem saldo para amortizar.');const payment=Math.min(x.debt,Math.floor(Math.max(0,g.cash*.5)));x.debt-=payment;g.cash-=payment;logLine('Amortização','Você pagou '+brl(payment)+' da dívida. Saldo devedor: '+brl(x.debt)+'.');save();render();return}
 if(id==='emprestimo'){if(x.debt>0)return showToast('Pague seu empréstimo atual antes de contratar outro.');if(g.job===null)return showToast('Você precisa ter emprego para conseguir crédito.');const amount=Math.max(2500,Math.min(35000,Math.round((g.stats.disciplina+g.stats.inteligencia)*150)));x.debt=amount;g.cash+=amount;logLine('Empréstimo aprovado','Você recebeu '+brl(amount)+' e deverá pagar o empréstimo com juros anuais.');save();render();return}
 if(id==='loteria'&&used>=1)return showToast('Você já comprou um bilhete nesta edição anual da loteria.');
 if(id==='adotar-crianca'&&used>=1)return showToast('Você já realizou uma adoção neste ano.');
 const cost=opt[6];
 if(g.cash<cost)return showToast('Saldo insuficiente: '+brl(cost)+'.');
 g.cash-=cost;x.actionCounts[dateKey]=used+1;
 let desc='',delta={};
 const small=(key,n)=>{g.stats[key]=clamp100(g.stats[key]+n)};
 switch(id){
 case 'cinema':small('felicidade',Math.max(1,9-used*2));desc='Você assistiu a um filme e aproveitou o passeio.';break;
 case 'ferias':small('felicidade',Math.max(2,15-used*3));small('saude',3);x.travels++;desc='Você tirou férias, descansou e conheceu novos lugares.';break;
 case 'balada':small('felicidade',Math.max(1,10-used*2));small('carisma',3);desc='Você dançou e conheceu pessoas interessantes.';if(harm(g,'road'))return;break;
 case 'parque':small('saude',3);small('felicidade',Math.max(1,6-used));desc='Você aproveitou um passeio ao ar livre.';break;
 case 'restaurante':small('felicidade',Math.max(1,7-used));desc='Você desfrutou uma refeição especial.';break;
 case 'viagem':small('felicidade',Math.max(2,12-used*2));x.travels++;desc='Você explorou novos lugares durante a viagem.';if(harm(g,'road'))return;break;
 case 'medico':x.treated++;if(x.illness){desc='O médico tratou '+x.illness.toLowerCase()+'. Você está se recuperando.';x.illness=null;x.illnessYears=0;small('saude',rnd(15,30))}else{small('saude',5);desc='Uma consulta de rotina ajudou a cuidar da saúde.'}break;
 case 'terapia':small('felicidade',Math.max(2,13-used*2));small('saude',4);desc='Você conversou com um profissional e se sentiu melhor.';break;
 case 'academia':small('saude',Math.max(1,8-used*2));small('disciplina',Math.max(1,4-used));window.CaminhosSkills?.practice(g,'academia');desc='Você treinou e melhorou seu condicionamento.';break;
 case 'meditacao':small('felicidade',Math.max(1,7-used));desc='Você dedicou um tempo para meditar.';break;
 case 'loteria':{const prob=(g.extra.luck||50)/20000;const win=Math.random()<prob;if(win){const prize=rnd(1000,150000);g.cash+=prize;x.lotteryWins++;desc='Sorte grande! Você ganhou '+brl(prize)+' na loteria.'}else desc='Você comprou um bilhete, mas não foi premiado.';break;}
 case 'processar':{const success=Math.random()<(.2+g.stats.inteligencia/250);if(success){const prize=rnd(1000,7500);g.cash+=prize;desc='Você venceu o processo e recebeu '+brl(prize)+'.'}else{const fees=rnd(250,1100);g.cash-=fees;desc='Você perdeu a ação e precisou pagar '+brl(fees)+' em custas.';}break;}
 case 'emigrar':{const places=['Portugal','Canadá','Japão','Alemanha','Argentina','Austrália'];const next=places[rnd(0,places.length-1)];x.country=next;g.city='Cidade de '+next;g.job=null;g.jobYears=0;desc='Você se mudou para '+next+' e precisa reconstruir sua carreira.';break;}
 case 'adotar-crianca':{if(g.children>=12)return showToast('A família já tem o número máximo de filhos nesta simulação.');const child=window.CaminhosDynasty?.birth(g);x.adoptions++;small('felicidade',11);desc='Você adotou '+(child||'uma criança')+'. A família ganhou mais um integrante.';break;}
 case 'leitura':small('inteligencia',Math.max(1,7-used));desc='Você passou um tempo lendo e estudando.';break;
 case 'voluntariado':small('carisma',Math.max(1,8-used));small('felicidade',5);desc='Você participou de uma ação voluntária.';break;
 default:desc='Você dedicou tempo a esta atividade.';
 }
 logLine(opt[2],desc);save();render();showToast(desc);
}
function renderMenu(g){
 const x=ensure(g);const sections=['Lazer','Habilidades e hobbies','Saúde e bem-estar','Sorte e dinheiro','Vida e família'];
 let html='<div class="notice" style="margin:10px 12px"><strong>🎲 Sorte e talento</strong><p>Você tem '+(g.extra?.luck??50)+'% de sorte. Treine habilidades livremente: seu talento natural acelera o aprendizado.</p></div>';
 for(const cat of sections){
  html+='<div class="retro-section-title">'+esc(cat)+'</div>';
  for(const [id,icon,title,sub,group,min,cost] of THINGS.filter(a=>a[4]===cat)){
   let disabled=!g.alive||g.age<min||g.extra?.prison>0;
   let detail=sub+(min>g.age?' · A partir dos '+min+' anos':'')+((cost>0&&g.age>=min&&id!=='adotar-crianca')?' · '+brl(cost):'');
   html+='<button type="button" class="retro-menu-row'+(disabled?' retro-disabled':'')+'" data-everyday="'+id+'" '+(disabled?'disabled':'')+'><span class="retro-row-symbol">'+icon+'</span><span class="retro-row-copy"><strong>'+esc(title)+'</strong><span>'+esc(detail)+'</span></span><span class="retro-row-end">›</span></button>';
  }
 }
 return html;
}
document.addEventListener('click',event=>{
 const b=event.target.closest('[data-everyday]');if(!b||typeof game==='undefined'||!game)return;
 execute(game,b.dataset.everyday);
});
window.CaminhosEveryday={ensure,execute,annual,randomEvent,applyChoice,renderMenu,harm,items:THINGS};
})();