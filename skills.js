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
 ensure(g);const t=talent(g,id),counter=g.extra.skillPractice.counts;
 const times=counter[id]||0;
 // Treinos ilimitados por ano com retornos gradualmente menores.
 // Talento determina a velocidade; sorte ocasionalmente gera um treino excepcional.
 const luck=g.extra.luck||50;
 const extraordinary=Math.random()<(luck/650);
 const base=1.65+t/32;
 const gain=Math.max(1,Math.round(base/(1+times*.12)*(extraordinary?2.0:1)));
 counter[id]=times+1;
 const old=g.extra.skills[id]||{level:0,trainings:0,records:0};
 const level=Math.min(100,old.level+gain);
 g.extra.skills[id]={level,trainings:old.trainings+1,records:(old.records||0)+(extraordinary?1:0)};
 return {gain:level-old.level,level,talent:t,luck,extraordinary,trainings:old.trainings+1};
}
function train(g,id){
 const spec=LIB.find(x=>x[0]===id);
 if(!spec)return;
 if(!g.alive)return showToast('Comece ou continue uma vida para treinar.');
 if(g.age<spec[4])return showToast('Disponível a partir dos '+spec[4]+' anos.');
 if(g.extra?.prison>0)return showToast('Esta atividade não está disponível durante uma pena de prisão.');
 if(g.pendingEvent)return showEvent();
 const cost=spec[5]||0;
 if(g.cash<cost)return showToast('Você precisa de '+brl(cost)+' para essa aula.');
 g.cash-=cost;
 const result=practice(g,id);
 const motivation=result.extraordinary?' Você teve um momento de sorte e aprendeu muito mais rápido!':'';
 if(id==='canto'||id==='composicao')g.stats.carisma=clamp(g.stats.carisma+1);
 if(['corrida','natacao','ciclismo','danca'].includes(id))g.stats.saude=clamp(g.stats.saude+1);
 if(['xadrez','programacao','escrita'].includes(id))g.stats.inteligencia=clamp(g.stats.inteligencia+1);
 logLine('Treino: '+spec[2], 'Você praticou '+spec[2].toLowerCase()+' e ganhou '+result.gain+' ponto(s) de habilidade.'+motivation);
 save();render();
 showToast('🎯 '+spec[2]+': '+result.level+'/100 · Talento natural '+result.talent+'%');
}
function render(g){
 ensure(g);
 const tabs=[...new Set(LIB.map(s=>s[3]))];
 return '<div class="retro-screen-bar"><button class="retro-screen-close" data-go="atividades" aria-label="Voltar às atividades">×</button><strong>Habilidades</strong><span>✦</span></div>'+
 '<div class="skill-intro"><strong>🍀 Sorte: '+g.extra.luck+'%</strong><p>Você pode praticar quantas vezes quiser no mesmo ano. O talento natural varia em cada atividade: alguém pode ser excelente no violão e ter mais dificuldade em pintura. A sorte pode gerar um aprendizado extraordinário.</p></div>'+
 tabs.map(category=>'<div class="retro-section-title">'+esc(category)+'</div>'+
 LIB.filter(s=>s[3]===category).map(s=>{
 const t=talent(g,s[0]),level=score(g,s[0]),can=g.age>=s[4]&&g.alive&&!g.pendingEvent&&!(g.extra.prison>0);
 return '<div class="skill-card"><div class="skill-symbol">'+s[1]+'</div><div class="skill-details"><strong>'+esc(s[2])+'</strong>'+
 '<small>Habilidade '+level.level+'/100 · Talento natural '+t+'% · '+level.trainings+' treinos</small>'+
 '<div class="service-progress"><span style="width:'+level.level+'%"></span></div></div>'+
 '<button type="button" class="secondary-button" data-skill-train="'+s[0]+'" '+(can?'':'disabled')+'>Praticar</button></div>';
 }).join('')).join('')+
 '<div class="notice">Apenas jogos e oportunidades dependem do ano. Práticas e atividades cotidianas não têm limite anual, mas continuam sujeitas à idade, custos e condições do personagem.</div>';
}
document.addEventListener('click',ev=>{
 const b=ev.target.closest('[data-skill-train]');if(!b||typeof game==='undefined'||!game)return;
 train(game,b.dataset.skillTrain);
});
window.CaminhosSkills={ensure,talent,practice,score,train,render,library:LIB};
})();