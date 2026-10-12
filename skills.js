/* CAMINHOS — talentos naturais, sorte e prática livre das habilidades. */
(function(){
'use strict';
const LIB=[
 ['violao','🎸','Violão','Instrumentos',5,0],
 ['guitarra','🎸','Guitarra','Instrumentos',8,0],
 ['piano','🎹','Piano','Instrumentos',5,0],
 ['teclado','🎹','Teclado','Instrumentos',5,0],
 ['bateria','🥁','Bateria','Instrumentos',6,0],
 ['violino','🎻','Violino','Instrumentos',5,0],
 ['flauta','🪈','Flauta','Instrumentos',5,0],
 ['saxofone','🎷','Saxofone','Instrumentos',8,0],
 ['canto','🎤','Canto','Música e palco',5,0],
 ['danca','💃','Dança','Música e palco',5,0],
 ['teatro','🎭','Teatro','Música e palco',7,0],
 ['composicao','🎼','Composição musical','Música e palco',10,0],
 ['desenho','🎨','Desenho','Artes e criatividade',4,0],
 ['pintura','🖌️','Pintura','Artes e criatividade',5,0],
 ['fotografia','📸','Fotografia','Artes e criatividade',9,0],
 ['escrita','✍️','Escrita','Artes e criatividade',7,0],
 ['culinaria','👩‍🍳','Culinária','Conhecimentos',9,0],
 ['xadrez','♟️','Xadrez','Conhecimentos',6,0],
 ['programacao','💻','Programação','Conhecimentos',12,0],
 ['natacao','🏊','Natação','Esportes',5,0],
 ['corrida','🏃','Corrida','Esportes',6,0],
 ['ciclismo','🚴','Ciclismo','Esportes',6,0]
];
const esc=x=>escapeHTML(String(x??''));
function hash(s){let v=2166136261>>>0;for(const ch of String(s)){v=Math.imul(v^ch.charCodeAt(0),16777619)>>>0}return v}
function ensure(g){
 if(!g)return;
 if(!g.extra)g.extra={};
 const e=g.extra;
 if(!e.skills||typeof e.skills!=='object')e.skills={};
 if(!e.talents||typeof e.talents!=='object')e.talents={};
 if(!Number.isFinite(e.luck))e.luck=15+hash('luck:'+g.name+':'+(g.extra?.dynasty?.activeId||1))%71;
 if(!e.skillPractice||typeof e.skillPractice!=='object')e.skillPractice={year:g.age,counts:{}};
 if(e.skillPractice.year!==g.age)e.skillPractice={year:g.age,counts:{}};
}
function talent(g,id){
 ensure(g);
 if(!Number.isFinite(g.extra.talents[id])){
  const marker='talent:'+g.name+':'+(g.extra?.dynasty?.activeId||1)+':'+id;
  g.extra.talents[id]=20+hash(marker)%80;
 }
 return g.extra.talents[id];
}
function score(g,id){ensure(g);return g.extra.skills[id]||{level:0,trainings:0,records:0}}
function practice(g,id,opts={}){
 ensure(g);
 const naturalTalent=talent(g,id),counter=g.extra.skillPractice.counts;
 const times=counter[id]||0,prior=g.extra.skills[id]||{level:0,trainings:0,records:0};
 const luck=g.extra.luck??50;
 // Bom: evolucao expressiva. Normal: progresso pequeno. Ruim: regressao.
 // Talento e sorte aumentam as boas sessoes; cansaco por repeticao faz o
 // contrario, sem impedir o jogador de treinar quantas vezes quiser.
 const badChance=Math.min(.30,.06+(100-naturalTalent)*.0007+times*.004);
 const goodChance=Math.max(.12,Math.min(.62,.30+naturalTalent*.003+(luck-50)*.0008-times*.005));
 const roll=Math.random();
 let raw=0,kind='normal',extraordinary=false;
 if(roll<badChance){
  raw=-Math.max(1,Math.round(1+Math.random()*2+Math.min(2,times/12)));
  kind='setback';
 }else if(roll>=1-goodChance){
  kind='gain';extraordinary=Math.random()<(luck/650);
  raw=Math.max(4,Math.round((5+naturalTalent/16)/(1+times*.025)*(extraordinary?1.4:1)));
 }else{
  kind='normal';
  raw=1+(naturalTalent>=70&&Math.random()<.4?1:0);
 }
 counter[id]=times+1;
 const level=Math.max(0,Math.min(100,prior.level+raw));
 g.extra.skills[id]={level,trainings:prior.trainings+1,records:(prior.records||0)+(extraordinary?1:0)};
 return {gain:level-prior.level,raw,level,talent:naturalTalent,kind,luck,extraordinary,trainings:prior.trainings+1};
}
function lessonBase(spec){
 if(spec[3]==='Instrumentos'||spec[3]==='Música e palco')return 110;
 if(spec[3]==='Esportes')return 75;
 if(spec[3]==='Artes e criatividade')return 70;
 return 55;
}
function train(g,id){
 const spec=LIB.find(x=>x[0]===id);
 if(!spec)return;
 if(!g.alive)return showToast('Comece ou continue uma vida para treinar.');
 if(g.age<spec[4])return showToast('Disponível a partir dos '+spec[4]+' anos.');
 if(g.extra?.prison>0)return showToast('Esta atividade não está disponível durante uma pena de prisão.');
 if(g.pendingEvent)return showEvent();
 const key='skill-'+id;
 const cost=g.age<18?lessonBase(spec):spec[5]||0;
 if(!window.CaminhosFamily?.pay(g,key,spec[2],cost))return;
 const result=practice(g,id);
 let observation='';
 if(result.kind==='gain'){
  observation='Treino bom! Você praticou '+spec[2].toLowerCase()+' e evoluiu bastante: +'+result.gain+' ponto(s).'+
   (result.extraordinary?' Um momento de destaque ajudou você a melhorar ainda mais.':'');
 }else if(result.kind==='setback'){
  observation='Treino ruim! Você cometeu erros e sua habilidade '+(result.gain<0?'caiu '+Math.abs(result.gain)+' ponto(s).':'não conseguiu evoluir.') ;
 }else{
  observation='Treino normal. Você praticou '+spec[2].toLowerCase()+' e evoluiu um pouco: +'+result.gain+' ponto(s).';
 }
 if(['corrida','natacao','ciclismo','danca'].includes(id)){
  g.stats.saude=clamp(g.stats.saude+(result.kind==='setback'?-1:result.kind==='gain'?2:1));
 }
 if(['xadrez','programacao','escrita'].includes(id)&&result.gain>0)
  g.stats.inteligencia=clamp(g.stats.inteligencia+1);
 if(result.kind==='setback')g.stats.felicidade=clamp(g.stats.felicidade-1);
 logLine('Treino: '+spec[2],observation);
 save();render();
 showToast('🎯 '+spec[2]+': '+result.level+'/100 · '+(result.gain>0?'+'+result.gain:result.gain)+' ponto(s)');
}
function renderSkills(g){
 ensure(g);
 const tabs=[...new Set(LIB.map(s=>s[3]))];
 return '<div class="retro-screen-bar"><button class="retro-screen-close" data-go="atividades" aria-label="Voltar às atividades">×</button><strong>Habilidades</strong><span>✦</span></div>'+
 '<div class="skill-intro"><strong>Pratique no seu ritmo</strong><p>Treino bom: evolui bastante. Treino normal: evolui pouco. Treino ruim: pode perder pontos. Talento e cansaço influenciam os resultados. Menores precisam de autorização dos pais.</p></div>'+
 tabs.map(category=>'<div class="retro-section-title">'+esc(category)+'</div>'+
 LIB.filter(s=>s[3]===category).map(s=>{
 const t=talent(g,s[0]),level=score(g,s[0]),can=g.age>=s[4]&&g.alive&&!g.pendingEvent&&!(g.extra.prison>0);
 const family=window.CaminhosFamily?.state(g,'skill-'+s[0],lessonBase(s));
 const courseHint=g.age<18?(family?.approved?' · A família paga '+brl(family.cost)+' por aula':
  ' · Requer permissão dos pais'):'';
 const label=g.age<18&&!family?.approved?'Pedir autorização':'Praticar';
 return '<div class="skill-card"><div class="skill-symbol">'+s[1]+'</div><div class="skill-details"><strong>'+esc(s[2])+'</strong>'+
 '<small>Habilidade '+level.level+'/100 · Talento natural '+t+'% · '+level.trainings+' treinos'+courseHint+'</small>'+
 '<div class="service-progress"><span style="width:'+level.level+'%"></span></div></div>'+
 '<button type="button" class="secondary-button" data-skill-train="'+s[0]+'" '+(can?'':'disabled')+'>'+label+'</button></div>';
 }).join('')).join('')+
 '<div class="notice">Apenas jogos e oportunidades dependem do ano. Práticas e atividades cotidianas não têm limite anual, mas continuam sujeitas à idade, custos e condições do personagem.</div>';
}
document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-skill-train]');if(!b||typeof game==='undefined'||!game)return;
 train(game,b.dataset.skillTrain);
});
window.CaminhosSkills={ensure,talent,practice,score,train,render:renderSkills,library:LIB};
})();