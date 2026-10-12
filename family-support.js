/* CAMINHOS — profissões visíveis dos pais, recursos e autorizações ocultas. */
(function(){
'use strict';
const OCCUPATIONS=[
 ['Professor(a)',2900],['Enfermeiro(a)',3800],['Motorista',2850],['Comerciante',3600],
 ['Auxiliar administrativo',2350],['Engenheiro(a)',7800],['Médico(a)',12500],
 ['Cozinheiro(a)',2500],['Pedreiro(a)',2600],['Policial',4900],['Bombeiro(a)',4700],
 ['Vendedor(a)',2600],['Desempregado(a)',0],['Técnico(a) de enfermagem',3100],
 ['Funcionário(a) público(a)',4100],['Advogado(a)',6200],['Eletricista',3400]
];
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function hash(txt){let n=2166136261;for(const char of String(txt)){n=Math.imul(n^char.charCodeAt(0),16777619)>>>0}return n>>>0}
function parents(g){return (g.people||[]).filter(p=>['Mãe','Pai','Pai/Mãe','Padrasto','Madrasta','Responsável'].includes(p.role))}
function ensure(g){
 if(!g?.extra)return null;
 let fam=g.extra.familySupport;
 if(!fam||typeof fam!=='object'||Array.isArray(fam))
   fam=g.extra.familySupport={version:1,parents:[],funds:0,approved:{},requests:{},year:g.age};
 if(!fam.approved||typeof fam.approved!=='object')fam.approved={};
 if(!fam.requests||typeof fam.requests!=='object')fam.requests={};
 if(!Array.isArray(fam.parents))fam.parents=[];
 for(const person of parents(g)){
  let record=fam.parents.find(p=>p.id===person.id);
  if(!record){
   const idx=hash(g.name+'|'+person.name+'|'+person.id)%OCCUPATIONS.length;
   record={id:person.id,profession:OCCUPATIONS[idx][0],monthlyIncome:OCCUPATIONS[idx][1]};
   fam.parents.push(record);
  }
  // Only the profession is presented to the child; income remains internal.
  person.profession=record.profession;
 }
 if(!Number.isFinite(fam.funds)){
  fam.funds=0;
 }
 if(!fam.initialized){
  const monthly=fam.parents.reduce((n,p)=>n+p.monthlyIncome,0);
  fam.funds=clamp(Math.round(monthly*.25)+(hash(g.name+'|family')%1200)-420,0,19000);
  fam.initialized=true;
 }
 if(!Number.isFinite(fam.year))fam.year=g.age;
 return fam;
}
function lessonCost(base){
 // After permission, a small amount still leaves the household budget.
 return clamp(Math.round(Math.max(40,base||40)*.15),8,32);
}
function state(g,key,base){
 if(g.age>=18)return {adult:true,approved:true,cost:Math.max(0,base||0)};
 const fam=ensure(g);
 const approved=!!fam?.approved?.[key];
 return {adult:false,approved,cost:lessonCost(base),alreadyAsked:fam?.requests?.[key]===g.age,
  hasGuardian:!!fam?.parents?.length};
}
function result(g,title,story){
 logLine(title,story);save();render();
 showModal('<div class="relationship-result"><div class="relationship-result-icon">👨‍👩‍👧</div>'+
  '<div class="card-kicker">PERMISSÃO DA FAMÍLIA</div><h2 id="modalTitle">'+escapeHTML(title)+'</h2>'+
  '<p>'+escapeHTML(story)+'</p>'+
  '<button type="button" class="secondary-button relationship-result-close" data-act="dismiss-result">Entendi</button></div>');
}
function authorize(g,key,label,base){
 if(g.age>=18)return true;
 const fam=ensure(g),st=state(g,key,base);
 if(st.approved)return true;
 if(!st.hasGuardian){showToast('Nenhum responsável pode autorizar esta atividade.');return false;}
 if(st.alreadyAsked){showToast('Você já pediu autorização neste ano. Tente novamente no próximo.');return false;}
 fam.requests[key]=g.age;
 const c=st.cost,rel=parents(g).reduce((total,p)=>total+(Number(p.bond)||50),0)/Math.max(1,parents(g).length);
 const canAfford=fam.funds>=c*3+90;
 const income=fam.parents.reduce((total,p)=>total+p.monthlyIncome,0);
 const financiallyTight=!canAfford||income<1700;
 const chance=clamp(.16+rel*.005+(canAfford?.24:-.20)+(income>5000?.07:0)-((g.age<7)?.05:0),.04,.95);
 if(Math.random()<chance&&canAfford){
  fam.approved[key]={since:g.age,label,cost:c};
  result(g,'Seus pais autorizaram!',
    'Você pediu para fazer '+label+'. Seus responsáveis concordaram em pagar as aulas. Agora você pode praticar; cada sessão terá um pequeno custo familiar.');
 }else{
  const reason=financiallyTight?
   'No momento a família não consegue assumir esse gasto.':
   'Seus responsáveis preferiram esperar antes de autorizar.';
  result(g,'Seus pais não autorizaram',
   'Você pediu permissão para fazer '+label+', mas recebeu uma resposta negativa. '+reason+' Poderá tentar novamente no próximo ano.');
 }
 return false; // O primeiro clique pede autorização, não realiza o treino.
}
function pay(g,key,label,base){
 const full=Math.max(0,Number(base)||0);
 if(g.age>=18){
  if(g.cash<full){showToast('Você precisa de '+brl(full)+' para esta atividade.');return false;}
  g.cash-=full;return true;
 }
 const st=state(g,key,full);
 if(!st.approved){authorize(g,key,label,full);return false;}
 const fam=ensure(g);
 if(fam.funds<st.cost){
  // A permissão não desaparece; o jovem aguarda melhores condições.
  showToast('Sua família não consegue pagar esta aula no momento. Tente em outro ano.');
  return false;
 }
 fam.funds-=st.cost;return true;
}
function onAnnual(g){
 if(g.age>=18)return;
 const fam=ensure(g);
 if(!fam||fam.year===g.age)return;
 const months=clamp(g.age-fam.year,1,10);
 const totalIncome=fam.parents.reduce((a,p)=>a+p.monthlyIncome,0);
 // Os recursos domésticos não fazem parte da conta bancária da criança.
 const resultPerYear=(totalIncome*.20-690)*months+Math.round((Math.random()-.5)*250);
 fam.funds=clamp(Math.round(fam.funds+resultPerYear),0,200000);
 fam.year=g.age;
}
function professions(g){
 ensure(g);return parents(g).map(p=>({name:p.name,role:p.role,profession:p.profession}));
}
window.CaminhosFamily={ensure,parents,professions,lessonCost,state,authorize,pay,onAnnual};
})();