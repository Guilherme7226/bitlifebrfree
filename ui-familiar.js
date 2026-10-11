/* CAMINHOS — interface de listas inspirada no genero simulador de vida;
 * tipografia, elementos, identidade e componentes proprios. */
(function(){
'use strict';
const esc=v=>escapeHTML(String(v??''));
const getExtra=g=>g.extra||{};
function ensure(g){
 if(!g)return;
 if(!g.extra)g.extra={};
 if(!Number.isFinite(g.extra.appearance)){
  let h=7;for(const c of g.name)h=(h*31+c.charCodeAt(0))%100003;
  g.extra.appearance=35+(h%57);
 }
}
function screen(title,back='vida'){
 return '<div class="retro-screen-bar"><button class="retro-screen-close" type="button" data-go="'+esc(back)+'" aria-label="Voltar à minha história">×</button><strong>'+esc(title)+'</strong><span aria-hidden="true">✦</span></div>';
}
function separator(title){return '<div class="retro-section-title">'+esc(title)+'</div>'}
function row(icon,title,subtitle,link,opts={}){
 const muted=!!opts.disabled,tail=opts.value||'›';
 return '<button type="button" class="retro-menu-row'+(muted?' retro-disabled':'')+'" '+link+
 (muted?' disabled':'')+'>'+
 '<span class="retro-row-symbol" aria-hidden="true">'+icon+'</span><span class="retro-row-copy"><strong>'+esc(title)+'</strong>'+
 (subtitle?'<span>'+esc(subtitle)+'</span>':'')+'</span>'+
 '<span class="retro-row-end">'+tail+'</span></button>';
}
const go=id=>'data-go="'+id+'"';
const action=id=>'data-act="activity" data-id="'+id+'"';
function renderActivities(g){
 return screen('Atividades')+(window.CaminhosEveryday?.renderMenu(g)||'<div class="notice">Atividades indisponíveis. Atualize o jogo.</div>');
}
function renderCareer(g){
 const school=g.extra?.school;let out=screen(g.age<18?'Escola':'Profissão');
 out+=separator('Você');
 if(g.age<18)out+=row('🏫',g.age<4?'Primeiros anos':g.age<6?'Educação infantil':g.age<11?'Ensino fundamental I':g.age<15?'Ensino fundamental II':'Ensino médio',
 'Notas '+Math.round(school?.average||0)+'/100 · Professores e colegas',go('escola'),{disabled:g.age<4});
 else{
  out+=row('🏫','Histórico escolar','Notas, colegas e professores que marcaram sua vida',go('escola'));
  if(g.job)out+=row('💼',g.job.replaceAll('_',' '),'Trabalho atual · Toque para detalhes',go('carreira-detalhes'));
  if(g.university)out+=row('🎓','Faculdade em andamento','Veja curso e tempo restante',go('carreira-detalhes'));
  if(!g.job&&!g.university)out+=row('📋','Procurando oportunidades','Seu futuro profissional começa aqui',go('carreira-detalhes'));
 }
 out+=separator('Carreiras especiais');
 out+=row('🏢','Negócios','Crie, compre ou expanda uma empresa',go('negocios'),{disabled:g.age<18});
 out+=row('🏛️','Política','Dispute eleições e chegue à presidência',go('politica'),{disabled:g.age<18});
 out+=row('🪖','Forças Armadas','Exército, Marinha ou Aeronáutica',go('carreira-detalhes'),{disabled:g.age<18});
 out+=row('🚒','Polícia e Bombeiros','Concursos, formação e promoções',go('carreira-detalhes'),{disabled:g.age<18});
 out+=separator('Profissões e estudos');
 out+=row('☎️','Empregos','Consulte todas as vagas e salários',go('carreira-detalhes'),{disabled:g.age<16});
 out+=row('🎓','Faculdade','Escolha uma graduação',go('carreira-detalhes'),{disabled:g.age<18});
 out+=row('🥇','Esporte profissional','Competições e carreira de lutador',go('hobbies'),{disabled:g.age<12});
 out+=row('🎬','Fama e entretenimento','Cinema, música e redes sociais',go('fama'),{disabled:g.age<13});
 return out;
}
function renderFinance(g){
 let out=screen('Bens');
 out+=separator('Finanças');
 out+=row('💰','Finanças','Saldo disponível '+brl(g.cash),go('financas-detalhes'));
 out+=row('📊','Investimentos','Seu saldo aplicado: '+brl(g.savings),go('financas-detalhes'));
 out+=separator('Propriedades');
 out+=row('🏠','Imóveis','Casas, apartamentos, sítios e mansões',go('financas-detalhes'));
 out+=row('🚗','Veículos','Carros, motos e esportivos',go('financas-detalhes'));
 out+=row('🛥️','Barcos e aviões','Lanchas, iates, helicópteros e jatos',go('financas-detalhes'));
 out+=separator('Empresas e coleções');
 out+=row('🏢','Empresas','Compre, abra ou administre seus negócios',go('negocios'),{disabled:g.age<18});
 out+=row('💎','Coleção de bens','Veja todos os bens que você possui',go('financas-detalhes'));
 out+=separator('Diversos');
 out+=row('📱','Mídias sociais','Construa sua imagem e audiência',go('fama'),{disabled:g.age<13});
 return out;
}
function peopleGroup(g,entries,title){
 if(!entries.length)return '';
 return separator(title)+entries.map(p=>{
  const avatar=window.CaminhosWorld?.portrait(p.name,p.role,p.id) || esc(p.emoji||'👤');
  const val=Math.max(0,Math.min(100,Number(p.bond)||0));
  const sub=esc(p.role)+' · relacionamento '+val+'%';
  return '<button class="retro-person-row" data-ui-person="'+Number(p.id)+'">'+
   '<span class="retro-person-portrait">'+avatar+'</span>'+
   '<span class="retro-person-copy"><span><strong>'+esc(p.name)+'</strong> <span>('+esc(p.role)+')</span></span>'+
   '<span class="retro-bond-caption">Relacionamento <span class="retro-relationship-track"><span style="width:'+val+'%"></span></span></span></span>'+
   '<span class="retro-row-end">›</span></button>';
 }).join('');
}
function renderRelationships(g){
 const people=g.people||[];
 let out=screen('Relacionamentos');
 out+=peopleGroup(g,people.filter(p=>['Mãe','Pai','Padrasto','Madrasta','Filho','Filha','Cônjuge'].includes(p.role)),'Família');
 out+=peopleGroup(g,people.filter(p=>['Colega','Amizade','Namoro','Ex-relacionamento'].includes(p.role)),'Amigos e afetos');
 out+=peopleGroup(g,people.filter(p=>p.role?.includes('Professor')),'Professores');
 out+=peopleGroup(g,people.filter(p=>!['Mãe','Pai','Padrasto','Madrasta','Filho','Filha','Cônjuge','Colega','Amizade','Namoro','Ex-relacionamento'].includes(p.role)&&!p.role?.includes('Professor')),'Outras pessoas');
 out+=separator('Animais de estimação');
 const pets=g.extra?.pets||[];
 for(const pet of pets){
  const kind={cachorro:'Cachorro',gato:'Gato',coelho:'Coelho',passaro:'Pássaro',peixe:'Peixe'}[pet.species]||'Pet';
  out+=row('🐾',pet.name,kind+' · '+pet.age+' ano(s) · vínculo e cuidados',go('pets'));
 }
 out+=row('🐾','Adotar ou cuidar dos pets','Alimentação, saúde e brincadeiras',go('pets'));
 out+=separator('Vida amorosa');
 out+=row('💞','Encontrar alguém','Novos encontros e relacionamentos',go('relacoes-detalhes'),{disabled:g.age<16});
 return out;
}
function renderDiary(g){
 const recent=(g.history||[]).slice(0,37).reverse();
 let age=null,html='';
 for(const e of recent){
  if(age!==e.age){age=e.age;html+='<div class="retro-diary-age">Idade: '+age+' '+(age===1?'ano':'anos')+'</div>'}
  html+='<p class="retro-diary-line">'+esc(e.description||e.title)+'</p>';
 }
 const pending=g.pendingEvent?'<div class="retro-diary-notice"><strong>✦ Decisão pendente</strong><span>Um acontecimento espera sua escolha.</span><button class="secondary-button" type="button" data-act="show-event">Ver decisão →</button></div>':'';
 const future=window.CaminhosPaths?.futureChoice(g)||'';
 const jailed=g.extra?.prison>0?'<div class="retro-diary-notice">🔒 Você está cumprindo pena de prisão. Continue avançando os anos para reconstruir sua vida.</div>':'';
 return '<section class="retro-diary">'+pending+future+jailed+
  '<div class="retro-diary-list">'+(html||'<p class="retro-diary-line">Seu novo capítulo está começando.</p>')+'</div>'+
  '<div class="retro-diary-actions"><button type="button" class="secondary-button" data-go="historia">Ver minha história completa</button></div></section>';
}
function statRow(label,icon,value){
 const v=Math.max(0,Math.min(100,Math.round(Number(value)||0)));
 const bad=v<30,good=v>=30;
 return '<div class="retro-stat-row"><span class="retro-stat-name">'+label+' <span>'+icon+'</span></span>'+
 '<div class="retro-stat-meter"><span class="'+(bad?'retro-low':'retro-high')+'" style="width:'+v+'%"></span></div>'+
 '<span class="retro-stat-value">'+v+'%</span></div>';
}
function renderStats(g){
 ensure(g);
 return '<div class="retro-stats">'+
 statRow('Felicidade','🙂',g.stats.felicidade)+
 statRow('Saúde','❤️',g.stats.saude)+
 statRow('Inteligência','🧠',g.stats.inteligencia)+
 statRow('Aparência','✨',g.extra.appearance)+
 statRow('Carisma','💬',g.stats.carisma)+
 statRow('Disciplina','⚡',g.stats.disciplina)+'</div>';
}
function renderTab(g,tab){
 ensure(g);
 if(tab==='vida')return renderDiary(g);
 if(tab==='atividades')return renderActivities(g);
 if(tab==='carreira')return renderCareer(g);
 if(tab==='relacoes')return renderRelationships(g);
 if(tab==='financas')return renderFinance(g);
 return null;
}
document.addEventListener('click',event=>{
 const b=event.target.closest('[data-ui-person]');
 if(b&&typeof game!=='undefined'&&game){
  const p=game.people.find(x=>Number(x.id)===Number(b.dataset.uiPerson));
  if(!p)return;
  const portrait=window.CaminhosWorld?.portrait(p.name,p.role,p.id,true)||esc(p.emoji||'👤');
  const interactions='<button type="button" class="secondary-button" data-act="rel" data-id="'+Number(p.id)+'" data-option="aproximar" '+(game.actions<1||game.extra?.prison>0?'disabled':'')+'>💬 Conversar / passar tempo</button>';
  const partner=game.partnerId===p.id;
  const marriage=partner&&p.role==='Namoro'?'<button type="button" class="secondary-button" data-act="rel" data-id="'+Number(p.id)+'" data-option="casar" '+(game.age<18?'disabled':'')+'>💍 Casar</button>':'';
  const child=partner&&p.role==='Cônjuge'?'<button type="button" class="secondary-button" data-act="rel" data-id="'+Number(p.id)+'" data-option="filho">👶 Ter filho</button>':'';
  const breakup=partner?'<button type="button" class="danger-button" data-act="rel" data-id="'+Number(p.id)+'" data-option="terminar">Terminar relação</button>':'';
  showModal('<div class="retro-person-modal">'+portrait+'<div><div class="card-kicker">RELACIONAMENTO</div><h2 id="modalTitle">'+esc(p.name)+'</h2><p>'+esc(p.role)+' · Vínculo '+Math.round(p.bond)+'/100</p></div></div><div class="mini-buttons">'+interactions+marriage+child+breakup+'</div>');
 }
 if(event.target.closest('.retro-person-modal')?.dataset?.noAction)return;
});
window.CaminhosUI={ensure,renderTab,renderStats};
})();