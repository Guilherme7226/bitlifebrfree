/* CAMINHOS — educação pós-ensino médio, carreiras públicas e artes marciais.
   Simulação fictícia inspirada nas profissões brasileiras, não retrata concursos reais. */
(function(){
'use strict';
const SERVICES={
 militar_exercito:{name:'Exército Brasileiro',emoji:'🪖',type:'militar',entry:'Alistamento / escola de formação',pracas:['Soldado','Cabo','3º Sargento','2º Sargento','1º Sargento','Subtenente'],oficiais:['2º Tenente','1º Tenente','Capitão','Major','Tenente-coronel','Coronel']},
 militar_marinha:{name:'Marinha do Brasil',emoji:'⚓',type:'militar',entry:'Seleção naval',pracas:['Marinheiro','Cabo','3º Sargento','2º Sargento','1º Sargento','Suboficial'],oficiais:['2º Tenente','1º Tenente','Capitão-tenente','Capitão de corveta','Capitão de fragata','Capitão de mar e guerra']},
 militar_aeronautica:{name:'Força Aérea Brasileira',emoji:'✈️',type:'militar',entry:'Seleção aeronáutica',pracas:['Soldado','Cabo','3º Sargento','2º Sargento','1º Sargento','Suboficial'],oficiais:['2º Tenente','1º Tenente','Capitão','Major','Tenente-coronel','Coronel']},
 policial:{name:'Polícia Militar',emoji:'👮',type:'militar',entry:'Concurso PM',pracas:['Soldado','Cabo','3º Sargento','2º Sargento','1º Sargento','Subtenente'],oficiais:['2º Tenente','1º Tenente','Capitão','Major','Tenente-coronel','Coronel']},
 policial_civil:{name:'Polícia Civil',emoji:'🕵️',type:'civil',entry:'Concurso PC',pracas:['Agente','Agente experiente','Investigador sênior','Supervisor de equipe','Coordenador'],oficiais:[]},
 policial_federal:{name:'Polícia Federal',emoji:'🛡️',type:'civil',entry:'Concurso PF',pracas:['Agente federal','Agente experiente','Especialista','Supervisor','Coordenador'],oficiais:[]},
 bombeiro:{name:'Corpo de Bombeiros Militar',emoji:'🚒',type:'militar',entry:'Concurso CBM',pracas:['Soldado','Cabo','3º Sargento','2º Sargento','1º Sargento','Subtenente'],oficiais:['2º Tenente','1º Tenente','Capitão','Major','Tenente-coronel','Coronel']}
};
const MARTIAL=[
 {id:'jiujitsu',name:'Jiu-jítsu',emoji:'🥋',minAge:5,cost:130,belt:true},
 {id:'judo',name:'Judô',emoji:'🥋',minAge:5,cost:110,belt:true},
 {id:'karate',name:'Karatê',emoji:'🥋',minAge:5,cost:110,belt:true},
 {id:'taekwondo',name:'Taekwondo',emoji:'🥋',minAge:6,cost:120,belt:true},
 {id:'muaythai',name:'Muay Thai',emoji:'🥊',minAge:12,cost:160,belt:false},
 {id:'boxe',name:'Boxe',emoji:'🥊',minAge:12,cost:135,belt:false},
 {id:'capoeira',name:'Capoeira',emoji:'🤸',minAge:6,cost:100,belt:true,capoeira:true},
 {id:'kungfu',name:'Kung Fu',emoji:'🐉',minAge:7,cost:120,belt:true}
];
const BELTS=['Branca','Cinza','Amarela','Laranja','Verde','Azul','Roxa','Marrom','Preta'];
const CORDS=['Crua','Cinza','Amarela','Laranja','Verde','Azul','Roxa','Marrom','Vermelha'];
const BELT_POINTS=[0,12,24,35,47,60,73,86,97];
const clean=v=>escapeHTML(String(v??''));
function ensure(g){
 if(!g)return;
 if(!g.extra||typeof g.extra!=='object')g.extra={};
 const e=g.extra;
 if(!e.lifeRoute||typeof e.lifeRoute!=='object')e.lifeRoute={choice:null,chosenAt:null};
 if(!e.publicService||typeof e.publicService!=='object')e.publicService={training:null,active:null,last:null};
 if(!e.martialArts||typeof e.martialArts!=='object'||Array.isArray(e.martialArts))e.martialArts={};
 // Compatibilidade com quem já era policial antes da atualização.
 if(g.job==='policial'&&!e.publicService.active&&!e.publicService.training&&!e.publicService.last){
   e.publicService.active={id:'policial',route:'praca',rank:0,yearsAtRank:0,years:Math.floor(g.jobYears||0),merit:45,missions:0};
 }
}
const svc=id=>SERVICES[id]||null;
const trainingFor=g=>{ensure(g);return g.extra.publicService.training};
const currentService=g=>{ensure(g);const a=g.extra.publicService.active;return a&&a.id===g.job?a:null};
const hasDegree=g=>Array.isArray(g.degree)&&g.degree.length>0;
function entryReason(g,id,route='praca'){
 const p=svc(id);if(!p)return 'Carreira indisponível.';
 if(g.age<18)return 'Requer 18 anos ou mais.';
 if(g.age>50)return 'Inscrição indisponível após os 50 anos nesta simulação.';
 if(g.extra?.prison>0)return 'Não é possível ingressar enquanto cumpre pena.';
 if(!g.extra?.school?.finished)return 'Conclua o ensino médio.';
 if(g.stats.saude<(id==='policial_federal'?62:55))return 'Saúde insuficiente para os testes físicos.';
 if(g.stats.disciplina<(p.type==='civil'?57:53))return 'Requer mais disciplina.';
 if(id==='policial_federal'&&!hasDegree(g))return 'Polícia Federal exige uma graduação no jogo.';
 if(id==='policial_federal'&&g.stats.inteligencia<68)return 'Polícia Federal requer 68 de inteligência.';
 if(id==='policial_civil'&&g.stats.inteligencia<55)return 'Polícia Civil requer 55 de inteligência.';
 if(route==='oficial'){
   if(p.type!=='militar')return 'Trilha de oficial indisponível nesta corporação.';
   if(g.stats.inteligencia<68)return 'Formação de oficial requer inteligência 68.';
   if(g.stats.disciplina<65)return 'Formação de oficial requer disciplina 65.';
 }
 return '';
}
function enrollment(g,id,route){
 ensure(g);const p=svc(id);if(!p)return;
 if(g.extra.publicService.training)return showToast('Conclua a formação atual antes de iniciar outra.');
 const reason=entryReason(g,id,route);if(reason)return showToast(reason);
 if(g.actions<1)return showToast('Avance um ano para ter novas ações.');
 if(g.pendingEvent)return showEvent();
 if(currentService(g)?.id===id)return showToast('Você já trabalha nesta corporação.');
 if(!confirm('Iniciar formação em '+p.name+' como '+(route==='oficial'?'oficial':'praça/agente')+'? Leva um ano no simulador.'))return;
 g.actions--;
 g.extra.publicService.training={id,route:p.type==='civil'?'praca':route,yearsLeft:1,progress:45};
 logLine('Formação profissional','Você ingressou na formação de '+p.name+'. No próximo ano, poderá concluir o curso.');
 save();render();
}
function leave(g,newId=null){
 ensure(g);
 const ps=g.extra.publicService;
 if(ps.active&&(newId===null||newId!==ps.active.id)){
   ps.last={...ps.active,endedAt:g.age};ps.active=null;
 }
}
function jobReason(g,id){
 const p=svc(id);if(!p)return '';
 ensure(g);
 if(currentService(g)?.id===id)return '';
 return 'Requer conclusão do curso de formação em '+p.name+'. Acesse Carreira → Concursos e Forças Armadas.';
}
function rankName(g){
 const s=currentService(g);if(!s)return null;
 const p=svc(s.id);const ranks=s.route==='oficial'?p.oficiais:p.pracas;
 return ranks[Math.min(s.rank,ranks.length-1)]||ranks[0];
}
function salary(g){
 const s=currentService(g);
 if(!s)return null;
 const c=CAREERS.find(c=>c.id===g.job);
 if(!c)return null;
 return Math.round(c.salary*(s.route==='oficial'?1.6:1)*Math.pow(1.18,s.rank));
}
function serviceBadge(g){
 const s=currentService(g);if(!s)return '';
 const p=svc(s.id);
 return '<div class="service-card"><div class="service-header"><strong>'+p.emoji+' '+clean(p.name)+'</strong><span class="tag green">'+clean(s.route==='oficial'?'OFICIAL':p.type==='civil'?'AGENTE':'PRAÇA')+'</span></div>'+
 '<div class="service-rank">'+clean(rankName(g))+'</div><p>Tempo de serviço: '+Math.floor(s.years)+' ano(s) · Mérito: '+s.merit+'/100 · Atendimentos e missões: '+s.missions+'</p>'+
 '<div class="service-progress"><span style="width:'+Math.min(100,s.merit)+'%"></span></div>'+
 '<div class="mini-buttons"><button type="button" class="secondary-button" data-path-act="practice" '+(g.actions<1||!g.alive?'disabled':'')+'>🏋️ Treinamento profissional</button>'+
 '<button type="button" class="secondary-button" data-path-act="mission" '+(g.actions<1||!g.alive?'disabled':'')+'>🎖️ Cumprir serviço</button></div>'+
 '<p class="tiny-note">Promoções simuladas por tempo, disciplina e mérito. Patentes e remunerações são fictícias.</p></div>';
}
function onAnnual(g){
 ensure(g);const ps=g.extra.publicService;
 if(ps.training){
   ps.training.yearsLeft--;
   if(ps.training.yearsLeft<=0){
     const training=ps.training;const p=svc(training.id);
     if(training.progress>=40){
       leave(g,training.id);
       ps.active={id:training.id,route:training.route,rank:0,yearsAtRank:0,years:0,merit:50,missions:0};
       ps.last=null;
       g.job=training.id;g.jobYears=0;
       noteAnnual('Formação concluída','Você concluiu a formação e ingressou em '+p.name+' como '+rankName(g)+'.');
     }else{
       training.yearsLeft=1;
       noteAnnual('Formação prolongada','Você precisa continuar treinando para concluir a formação.');
     }
     if(ps.active?.id===training.id)ps.training=null;
   }
 }
 const s=currentService(g);
 if(s){
   s.years++;s.yearsAtRank++;s.merit=clamp(s.merit+rand(-3,3));
   const p=svc(s.id);const ranks=s.route==='oficial'?p.oficiais:p.pracas;
   const required=s.rank>=3?3:2;
   if(s.rank<ranks.length-1&&s.yearsAtRank>=required&&s.merit>=55&&g.stats.disciplina>=55){
     s.rank++;s.yearsAtRank=0;s.merit=clamp(s.merit-18);
     noteAnnual('Promoção na carreira', 'Você foi promovido em '+p.name+' a '+rankName(g)+'!');
   }
 }
}
function serviceAction(g,id){
 ensure(g);const s=currentService(g),t=trainingFor(g);
 if(!s&&!t)return showToast('Entre em uma formação ou carreira primeiro.');
 if(g.actions<1)return showToast('Não há ações disponíveis neste ano.');
 if(g.pendingEvent)return showEvent();
 if(id==='mission'&&!s)return showToast('Conclua a formação antes de atuar.');
 g.actions--;
 if(id==='practice'){
   if(t)t.progress=clamp(t.progress+rand(10,17));
   if(s)s.merit=clamp(s.merit+rand(10,17));
   statChange({saude:4,disciplina:5,felicidade:1});
   logLine('Treinamento profissional','Você participou de um treino físico e técnico.');
 }else if(id==='mission'){
   s.missions++;
   s.merit=clamp(s.merit+rand(5,12));
   statChange({disciplina:3,carisma:2,saude:-2});
   logLine('Serviço prestado','Você participou de uma atividade profissional em '+svc(s.id).name+'.');
 }else return;
 save();render();
}
function futureChoice(g){
 ensure(g);
 if(g.age<18||!g.extra.school?.finished)return '';
 const v=g.extra.lifeRoute.choice;
 const routes={
  faculdade:'🎓 Faculdade',
  trabalho:'💼 Trabalho',
  concurso:'🚒 Polícia e Bombeiros',
  militar:'🪖 Forças Armadas'
 };
 if(v)return '<div class="card future-choice chosen"><h3>🎓 Após o ensino médio</h3><p>Você escolheu: <strong>'+routes[v]+'</strong>. Pode mudar sua trajetória a qualquer momento.</p><button type="button" class="secondary-button" data-path-act="graduation">Rever caminhos</button></div>';
 return '<div class="card future-choice"><h3>🎓 Ensino médio concluído!</h3><p>Agora você pode optar por faculdade, começar a trabalhar ou seguir uma carreira pública.</p><button type="button" class="primary-button" data-path-act="graduation">Escolher meu futuro →</button></div>';
}
function openGraduation(g){
 ensure(g);
 if(g.age<18||!g.extra.school?.finished)return showToast('Conclua primeiro o ensino médio.');
 showModal('<div class="card-kicker">NOVO CAPÍTULO</div><h2 id="modalTitle">🎓 O que fazer após a escola?</h2><p>Você concluiu o ensino médio. Escolha seu próximo passo — será possível mudar de rumo depois.</p>'+
 '<div class="graduation-options">'+
 '<button type="button" data-path-act="choose" data-choice="faculdade"><strong>🎓 Fazer faculdade</strong><small>Escolha seu curso e abra novas profissões.</small></button>'+
 '<button type="button" data-path-act="choose" data-choice="trabalho"><strong>💼 Começar a trabalhar</strong><small>Procure emprego, ganhe experiência e renda.</small></button>'+
 '<button type="button" data-path-act="choose" data-choice="concurso"><strong>🚒 Polícia ou Bombeiros</strong><small>Preste concurso e faça formação profissional.</small></button>'+
 '<button type="button" data-path-act="choose" data-choice="militar"><strong>🪖 Forças Armadas</strong><small>Exército, Marinha ou Aeronáutica.</small></button>'+
 '</div><p class="tiny-note">Nesta simulação, cursos e concursos têm requisitos próprios. A escolha inicial não impede outras carreiras.</p>');
}
function chooseFuture(g,key){
 if(!['faculdade','trabalho','concurso','militar'].includes(key)||g.age<18||!g.extra?.school?.finished)return;
 ensure(g);g.extra.lifeRoute.choice=key;g.extra.lifeRoute.chosenAt=g.age;
 const names={faculdade:'faculdade',trabalho:'trabalho',concurso:'serviço público',militar:'Forças Armadas'};
 logLine('Escolhendo o futuro','Ao terminar o ensino médio, você optou por '+names[key]+'.');
 save();hideModal();
 activeTab='carreira';render();window.scrollTo?.({top:0,behavior:'smooth'});
 showToast('Escolha registrada! Agora veja os cursos e profissões.');
}
function trainingCard(g){
 ensure(g);const t=trainingFor(g);if(!t)return '';
 return '<div class="service-card"><h3>📋 Formação em andamento</h3><p>Instituição: '+clean(svc(t.id)?.name||'')+' · Trilha: '+(t.route==='oficial'?'Oficiais':'Praças e agentes')+'</p>'+
 '<p>Tempo restante: '+Math.max(0,t.yearsLeft)+' ano(s) · Progresso: '+t.progress+'/100</p>'+
 '<div class="service-progress"><span style="width:'+t.progress+'%"></span></div>'+
 '<button type="button" class="secondary-button" data-path-act="practice" '+(g.actions<1?'disabled':'')+'>🏃 Preparação e treinamento</button></div>';
}
function renderServices(g){
 ensure(g);
 const visible=Object.entries(SERVICES);
 const card=visible.map(([id,p])=>{
  const reason=entryReason(g,id,'praca');
  const officer=p.type==='militar'?entryReason(g,id,'oficial'):null;
  return '<article class="public-job"><div class="public-header"><span>'+p.emoji+'</span><div><strong>'+p.name+'</strong><small>'+p.entry+'</small></div></div>'+
   '<p>Formação simplificada: 1 ano. '+(p.type==='militar'?'Praças e oficiais têm progressões diferentes.':'Carreira de agente e funções de coordenação.')+'</p>'+
   '<div class="mini-buttons">'+
    '<button class="secondary-button" type="button" data-path-act="enroll" data-id="'+id+'" data-track="praca" '+(reason||g.extra.publicService.training||currentService(g)?.id===id?'disabled':'')+'>Ingressar como '+(p.type==='civil'?'agente':'praça')+'</button>'+
    (p.type==='militar'?'<button class="secondary-button" type="button" data-path-act="enroll" data-id="'+id+'" data-track="oficial" '+(officer||g.extra.publicService.training||currentService(g)?.id===id?'disabled':'')+'>Formação de oficial</button>':'')+
   '</div>'+(reason?'<p class="public-requirement">⚠ '+clean(reason)+'</p>':'')+
   (officer&&p.type==='militar'?'<p class="public-requirement">Oficial: '+clean(officer)+'</p>':'')+
   '</article>';
 }).join('');
 return '<section id="public-careers" class="public-careers"><div class="section-title">🪖 Concursos e Forças Armadas</div>'+
 '<div class="notice">As formas de ingresso, remunerações e patentes são fictícias e simplificadas para o jogo; não representam editais brasileiros reais.</div>'+
 trainingCard(g)+serviceBadge(g)+
 '<div class="public-jobs">'+card+'</div></section>';
}
function martialName(id){return MARTIAL.find(x=>x.id===id);}
function martialState(g,id){
 ensure(g);
 if(!g.extra.martialArts[id])g.extra.martialArts[id]={skill:0,trainings:0,wins:0,medals:0};
 return g.extra.martialArts[id];
}
function levelName(art,skill){
 if(!art.belt)return skill>=90?'Elite':skill>=65?'Avançado':skill>=35?'Intermediário':'Iniciante';
 const belt=(art.capoeira?CORDS:BELTS);
 let idx=0;for(let j=0;j<BELT_POINTS.length;j++)if(skill>=BELT_POINTS[j])idx=j;
 return (art.capoeira?'Corda ':'Faixa ')+belt[idx];
}
function renderMartial(g){
 ensure(g);
 const inventory=MARTIAL.map(a=>({art:a,stats:g.extra.martialArts[a.id]}));
 const trained=inventory.filter(({stats})=>stats?.trainings>0).length;
 return displayTitle('🥋 Hobbies e artes marciais','Treine uma modalidade, evolua seu nível e participe de competições fictícias.')+
 '<div class="martial-overview"><strong>'+trained+' / '+MARTIAL.length+' modalidades praticadas</strong><p>Os treinos gastam uma ação do ano. Crianças treinam sem custo; adultos pagam a aula.</p></div>'+
 '<div class="martial-grid">'+inventory.map(({art:a,stats:r})=>{
  const skill=r?.skill||0,trainings=r?.trainings||0,wins=r?.wins||0,medals=r?.medals||0;
  const canTrain=g.age>=a.minAge&&g.alive&&g.actions>0&&!g.pendingEvent&&(g.age<16||g.cash>=a.cost);
  const canCompete=g.age>=12&&g.actions>0&&!g.pendingEvent&&skill>=35&&(g.age<16||g.cash>=250)&&g.alive;
  return '<article class="martial-card"><div class="martial-head"><span>'+a.emoji+'</span><div><strong>'+a.name+'</strong><small>'+levelName(a,skill)+'</small></div></div>'+
   '<div class="service-progress"><span style="width:'+skill+'%"></span></div>'+
   '<p>Habilidade '+skill+'/100 · '+trainings+' treino(s) · '+wins+' vitórias · '+medals+' medalha(s)</p>'+
   '<div class="mini-buttons"><button class="secondary-button" data-path-act="martial-train" data-id="'+a.id+'" '+(canTrain?'':'disabled')+'>Treinar'+(g.age>=16?' · '+brl(a.cost):'')+'</button>'+
   '<button class="secondary-button" data-path-act="martial-compete" data-id="'+a.id+'" '+(canCompete?'':'disabled')+'>🏅 Competir</button></div>'+
   (g.age<a.minAge?'<p class="tiny-note">A partir dos '+a.minAge+' anos.</p>':'')+
   '</article>';
 }).join('')+'</div>';
}
function martialAction(g,id,act){
 const art=martialName(id);if(!art)return;
 if(!g.alive||g.age<art.minAge)return showToast('Esta modalidade ainda não está disponível.');
 if(!g.actions)return showToast('Você não tem mais ações neste ano.');
 if(g.pendingEvent)return showEvent();
 const price=g.age>=16?(act==='compete'?250:art.cost):0;
 if(g.cash<price)return showToast('Saldo insuficiente para esta atividade.');
 const r=martialState(g,id),before=levelName(art,r.skill);
 if(act==='compete'){
   if(g.age<12||r.skill<35)return showToast('Para competir, você precisa ter 12 anos e 35 de habilidade.');
   g.actions--;g.cash-=price;
   const success=Math.random()<Math.min(.92,.2+r.skill*.006+g.stats.disciplina*.002);
   if(success){r.wins++;r.medals++;if(g.age>=18)g.cash+=rand(200,1400);statChange({felicidade:7,carisma:3});logLine('Campeonato de '+art.name,'Você venceu uma competição e conquistou uma medalha!')}
   else{statChange({felicidade:-3,disciplina:2});logLine('Competição de '+art.name,'Você participou, mas não venceu. A experiência vai ajudar no próximo torneio.')}
 }else{
   g.actions--;g.cash-=price;r.trainings++;r.skill=clamp(r.skill+rand(6,12));
   if(!g.extra.fightSkill||!Number.isFinite(g.extra.fightSkill))g.extra.fightSkill=0;
   g.extra.fightSkill=clamp(g.extra.fightSkill+rand(2,5));
   statChange({saude:5,disciplina:4,felicidade:4});
   const after=levelName(art,r.skill);
   logLine('Treino de '+art.name,after!==before?'Você evoluiu para '+after+'!':'Você praticou '+art.name+' e ganhou experiência.');
 }
 save();render();
}
function resetFuture(g){ensure(g);return g.extra.lifeRoute.choice}
document.addEventListener('click',ev=>{
 const button=ev.target.closest('[data-path-act]');
 if(!button||typeof game==='undefined'||!game)return;
 const action=button.dataset.pathAct;
 if(action==='graduation')openGraduation(game);
 if(action==='choose')chooseFuture(game,button.dataset.choice);
 if(action==='enroll')enrollment(game,button.dataset.id,button.dataset.track||'praca');
 if(action==='practice'||action==='mission')serviceAction(game,action);
 if(action==='martial-train')martialAction(game,button.dataset.id,'train');
 if(action==='martial-compete')martialAction(game,button.dataset.id,'compete');
});
window.CaminhosPaths={ensure,onAnnual,entryReason,jobReason,salary,rankName,serviceBadge,renderServices,
 futureChoice,openGraduation,renderMartial,martialAction,resetFuture,services:SERVICES};
})();
