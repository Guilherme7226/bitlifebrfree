/* CAMINHOS — Conquistas permanentes da partida, sem APIs externas. */
(function () {
  'use strict';
  const defs = [
    ['primeiro-passo','Vida','👣','Primeiro passo','Complete seu primeiro ano.',g=>g.age>=1],
    ['maioridade','Vida','🎂','Maioridade','Chegue aos 18 anos.',g=>g.age>=18],
    ['trinta','Vida','🕰️','Três décadas','Chegue aos 30 anos.',g=>g.age>=30],
    ['cinquenta','Vida','🏅','Meio século','Chegue aos 50 anos.',g=>g.age>=50],
    ['oitenta','Vida','🌳','Uma vida longa','Chegue aos 80 anos.',g=>g.age>=80],
    ['cem','Vida','💯','Centenário','Chegue aos 100 anos.',g=>g.age>=100],
    ['primeiro-emprego','Carreira','💼','Carteira assinada','Consiga seu primeiro emprego.',g=>!!g.job],
    ['anos-servico','Carreira','🧑‍💼','Profissional experiente','Passe cinco anos no mesmo emprego.',g=>g.jobYears>=5],
    ['veterano','Carreira','🏆','Veterano','Passe quinze anos na mesma carreira.',g=>g.jobYears>=15],
    ['medico','Carreira','🩺','Jaleco branco','Torne-se médico.',g=>g.job==='medico'],
    ['advogado','Carreira','⚖️','Nos tribunais','Torne-se advogado.',g=>g.job==='advogado'],
    ['programador','Carreira','💻','Código é vida','Trabalhe como programador.',g=>g.job==='programador'],
    ['policial','Carreira','👮','Servir e proteger','Trabalhe como policial.',g=>g.job==='policial'],
    ['astro','Carreira','🚀','Olhar para as estrelas','Torne-se astronauta.',g=>g.job==='astronauta'],
    ['universitario','Estudos','📚','Calouro','Entre na faculdade.',g=>!!g.university],
    ['diploma','Estudos','🎓','Diplomado','Conclua um curso superior.',g=>(g.degree||[]).length>=1],
    ['duplo-diploma','Estudos','📜','Colecionador de diplomas','Conclua dois cursos superiores.',g=>(g.degree||[]).length>=2],
    ['mente','Estudos','🧠','Mente brilhante','Alcance 90 de inteligência.',g=>g.stats.inteligencia>=90],
    ['atleta','Atributos','❤️','Vida saudável','Alcance 95 de saúde.',g=>g.stats.saude>=95],
    ['feliz','Atributos','🌞','Felicidade plena','Alcance 95 de felicidade.',g=>g.stats.felicidade>=95],
    ['disciplinado','Atributos','⚡','Foco total','Alcance 95 de disciplina.',g=>g.stats.disciplina>=95],
    ['carismatico','Atributos','💬','Pessoa magnética','Alcance 95 de carisma.',g=>g.stats.carisma>=95],
    ['primeira-economia','Finanças','💰','Primeira reserva','Tenha R$ 10 mil investidos.',g=>g.savings>=10000],
    ['cem-mil','Finanças','💵','Seis dígitos','Acumule R$ 100 mil em dinheiro.',g=>g.cash>=100000],
    ['milionario','Finanças','💎','Milionário','Alcance R$ 1 milhão de patrimônio.',g=>g.cash+g.savings+g.properties*75000>=1000000],
    ['imovel','Finanças','🏠','Chave na mão','Compre seu primeiro imóvel.',g=>g.properties>=1],
    ['investidor','Finanças','📈','Investidor sério','Tenha R$ 100 mil aplicados.',g=>g.savings>=100000],
    ['amizade','Relações','🤝','Novas amizades','Faça uma amizade.',g=>g.people.some(p=>p.role==='Amizade')],
    ['romance','Relações','💞','Coração ocupado','Comece um namoro.',g=>!!g.partnerId],
    ['casamento','Relações','💍','Sim, eu aceito','Case-se.',g=>g.people.some(p=>p.role==='Cônjuge')],
    ['familia','Relações','👶','Nova geração','Tenha um filho.',g=>g.children>=1],
    ['familia-grande','Relações','👨‍👩‍👧‍👦','Família grande','Tenha três filhos.',g=>g.children>=3],
    ['empresa','Negócios','🏢','Meu próprio negócio','Abra sua primeira empresa.',g=>!!g.extra?.company],
    ['empresa-grande','Negócios','📊','Negócio em expansão','Leve uma empresa ao nível 3.',g=>(g.extra?.company?.level||0)>=3],
    ['lucro','Negócios','📦','Negócio lucrativo','Acumule R$ 100 mil de lucro em sua empresa.',g=>(g.extra?.company?.profit||0)>=100000],
    ['politico','Política','🗳️','Eleito pelo povo','Ganhe sua primeira eleição.',g=>!!g.extra?.office],
    ['presidente','Política','🏛️','Chefe de Estado','Torne-se presidente.',g=>g.extra?.office==='presidente'],
    ['boa-reputacao','Política','⭐','Respeitado','Alcance 90 de reputação.',g=>(g.extra?.reputation||0)>=90],
    ['fama','Fama','📸','Influenciador','Alcance 10 mil seguidores.',g=>(g.extra?.followers||0)>=10000],
    ['super-fama','Fama','🌟','Estrela da internet','Alcance 1 milhão de seguidores.',g=>(g.extra?.followers||0)>=1000000],
    ['cineasta','Fama','🎬','Primeiro filme','Produza um filme.',g=>(g.extra?.film||0)>=1],
    ['luta','Esportes','🥊','Primeira vitória','Vença sua primeira luta.',g=>(g.extra?.fightWins||0)>=1],
    ['campeao','Esportes','🥇','Campeão','Conquiste um título na luta.',g=>!!g.extra?.champion],
    ['redencao','Riscos','🔓','Segunda chance','Saia da prisão após cumprir pena.',g=>g.history.some(h=>h.title==='Liberdade')],
    ['deus','Especial','✨','Arquiteto do destino','Use o Modo Criador.',g=>(g.extra?.godEdits||0)>=1],
    ['escola','Escola','🏫','Primeira aula','Comece a frequentar a escola.',g=>g.age>=4&&!!g.extra?.school],
    ['boas-notas','Escola','📗','Aluno exemplar','Tenha média escolar de 90 pontos.',g=>(g.extra?.school?.average||0)>=90],
    ['trabalho-escola','Escola','🔬','Feira de ciências','Participe de três projetos escolares.',g=>(g.extra?.school?.projects||0)>=3],
    ['destaque-escolar','Escola','🏅','Destaque escolar','Receba três destaques na escola.',g=>(g.extra?.school?.awards||0)>=3],
    ['fim-escola','Escola','🎓','Formado no ensino médio','Conclua sua vida escolar.',g=>!!g.extra?.school?.finished],
    ['carro','Bens','🚗','Primeiro carro','Compre seu primeiro carro.',g=>(g.extra?.assetInventory||[]).some(a=>['usado','hatch','sedan','suv','eletrico','esportivo','colecao'].includes(a.type))],
    ['lancha','Bens','🛥️','Vida no mar','Compre uma embarcação.',g=>(g.extra?.assetInventory||[]).some(a=>['jetski','lancha','veleiro','iate','barco'].includes(a.type))],
    ['aviao','Bens','✈️','Conquiste os céus','Compre uma aeronave.',g=>(g.extra?.assetInventory||[]).some(a=>['ultraleve','monomotor','helicoptero','jato'].includes(a.type))],
    ['mansao','Bens','🏰','Vida de luxo','Compre uma mansão.',g=>(g.extra?.assetInventory||[]).some(a=>a.type==='mansao')],
    ['frota','Bens','🚙','Colecionador','Tenha cinco bens simultaneamente.',g=>(g.extra?.assetInventory||[]).length>=5],
    ['multiempresario','Negócios','🏢','Empresário múltiplo','Tenha três empresas ao mesmo tempo.',g=>(g.extra?.assetInventory||[]).filter(a=>['padaria','barbearia','restaurante','mercado','transportadora','hotel','companhia'].includes(a.type)).length>=3],
  ];
  const achievements = defs.map(([id,cat,emoji,name,desc,check])=>({id,cat,emoji,name,desc,check}));
  function evaluate(g) {
    if(!g) return [];
    if(!g.achievements||typeof g.achievements!=='object'||Array.isArray(g.achievements))g.achievements={};
    const newly=[];
    for(const a of achievements){
      if(g.achievements[a.id])continue;
      try{if(a.check(g)){g.achievements[a.id]={age:g.age,at:new Date().toISOString()};newly.push(a)}}catch(e){/* dados antigos parciais */}
    }
    return newly;
  }
  function render(g){
    evaluate(g);
    const count=achievements.filter(a=>!!g.achievements?.[a.id]).length;
    const groups=[...new Set(achievements.map(a=>a.cat))];
    const cards=groups.map(cat=>{
      const group=achievements.filter(a=>a.cat===cat);
      return '<section class="achieve-group"><h3>'+cat+' <small>'+group.filter(a=>g.achievements?.[a.id]).length+'/'+group.length+'</small></h3><div class="achieve-grid">'+group.map(a=>{
        const got=g.achievements?.[a.id];
        return '<article class="achieve-card '+(got?'achieve-earned':'achieve-locked')+'"><span class="achieve-icon">'+(got?a.emoji:'🔒')+'</span><div><strong>'+a.name+'</strong><p>'+a.desc+'</p><small>'+(got?'✓ Desbloqueada aos '+got.age+' anos':'Ainda não desbloqueada')+'</small></div></article>';
      }).join('')+'</div></section>';
    }).join('');
    return '<div class="diary-heading"><span>✦ SEU LEGADO</span><strong>🏆 Conquistas</strong><p>Os seus feitos ficam registrados nesta partida.</p></div><div class="achieve-summary"><strong>'+count+' / '+achievements.length+'</strong><span>conquistas desbloqueadas</span><div class="achieve-progress"><i style="width:'+Math.round(count/achievements.length*100)+'%"></i></div></div>'+cards+'<div class="notice">Conquistas obtidas continuam desbloqueadas mesmo se seus atributos ou dinheiro diminuírem. Elas são salvas com a partida; exporte um backup para não perdê-las.</div>';
  }
  window.CaminhosAchievements={evaluate,render,total:achievements.length,count:g=>achievements.filter(a=>!!g?.achievements?.[a.id]).length};
})();