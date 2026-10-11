/* CAMINHOS — Conquistas da conta, persistentes entre vidas e gerações. */
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
    ['novo-curso','Estudos','🎓','Novo curso superior','Matricule-se em uma faculdade.',g=>!!g.university],
    ['militar-iniciante','Carreira pública','🪖','Vida militar','Ingresse em alguma Força Armada.',g=>['militar_exercito','militar_marinha','militar_aeronautica'].includes(g.job)],
    ['bombeiros','Carreira pública','🚒','Herói de uniforme','Torne-se bombeiro militar.',g=>g.job==='bombeiro'],
    ['policia-civil','Carreira pública','🕵️','Investigador do Estado','Torne-se agente da Polícia Civil.',g=>g.job==='policial_civil'],
    ['policia-federal','Carreira pública','🛡️','Agente federal','Torne-se agente da Polícia Federal.',g=>g.job==='policial_federal'],
    ['patente','Carreira pública','🎖️','Primeira promoção','Seja promovido na carreira pública.',g=>(g.extra?.publicService?.active?.rank||0)>0],
    ['marcial','Esportes','🥋','Primeiro tatame','Faça um treino de artes marciais.',g=>Object.values(g.extra?.martialArts||{}).some(x=>x.trainings>0)],
    ['faixa-preta','Esportes','🥋','Faixa preta','Alcance 97 de habilidade em uma arte marcial.',g=>Object.values(g.extra?.martialArts||{}).some(x=>x.skill>=97)],
    ['medalha-marcial','Esportes','🏅','Medalha no tatame','Conquiste uma medalha em artes marciais.',g=>Object.values(g.extra?.martialArts||{}).some(x=>x.medals>0)],
    ['presidente-br','Política','🏛️','Presidente eleito','Vença a eleição presidencial.',g=>(g.extra?.politics2?.experience||[]).includes('presidente')],
    ['politica-honesta','Política','✅','Servidor íntegro','Alcance integridade política 90.',g=>(g.extra?.politics2?.integrity||0)>=90],
    ['condenacao','Riscos','⚖️','Consequências legais','Receba uma sentença penal fictícia.',g=>(g.extra?.record||0)>0],
    ['reintegracao','Riscos','🕊️','Recomeço','Conclua uma pena de prisão fictícia.',g=>(g.extra?.crimeStory?.served||0)>=1&&g.extra?.prison===0],
    ['pet','Pets','🐾','Novo companheiro','Adote ou compre seu primeiro pet.',g=>(g.extra?.pets||[]).length>=1],
    ['pet-familia','Pets','🐶','Família animal','Tenha três pets simultaneamente.',g=>(g.extra?.pets||[]).length>=3],
  ];
  // Eventos do diario podem render conquistas unicas, mesmo em vidas diferentes.
  const events=[
    ['Apenas começando','Vida','🌅','Uma vida começou','Inicie uma vida.',g=>g.age===0],
    ['Uma familia nova','Família','👨‍👩‍👧','Família reunida','Tenha duas pessoas próximas.',g=>g.people.length>=2],
    ['Amigos de todo lado','Relações','🤝','Popular na escola','Conheça seis pessoas.',g=>g.people.length>=6],
    ['Reencontro','Eventos aleatórios','🫂','Um velho amigo','Encontre um amigo do passado.',g=>g.history.some(h=>h.title==='Um velho amigo')],
    ['Viajei sem planejar','Eventos aleatórios','🧳','Viagem inesperada','Receba o convite de viagem de última hora.',g=>g.history.some(h=>h.title==='Convite para viajar')],
    ['Desafio novo','Eventos aleatórios','💡','Oportunidade inesperada','Enfrente uma proposta inesperada.',g=>g.history.some(h=>h.title==='Proposta inesperada')],
    ['Semana movimentada','Eventos aleatórios','🕓','Dias agitados','Passe por uma semana intensa.',g=>g.history.some(h=>h.title==='Uma semana intensa')],
    ['Conversa que mudou tudo','Eventos aleatórios','🗣️','Decisão importante','Tome uma decisão por alguém querido.',g=>g.history.some(h=>h.title==='A decisão importante')],
    ['Talento descoberto','Eventos aleatórios','🎭','Talento escondido','Descubra um talento especial.',g=>g.history.some(h=>h.title==='Um talento escondido')],
    ['Boas memórias','Eventos aleatórios','📖','Histórias que ficam','Compartilhe histórias da sua vida.',g=>g.history.some(h=>h.title==='Histórias que ficam')],
    ['Nova rotina','Eventos aleatórios','🚶','Um novo ritmo','Adapte-se a uma nova rotina.',g=>g.history.some(h=>h.title==='Uma nova rotina')],
    ['Amigo em apuros','Eventos aleatórios','🫶','Mãos amigas','Ajude alguém em uma situação inesperada.',g=>g.history.some(h=>h.title==='Um amigo precisa de ajuda')],
    ['Herói do cotidiano','Eventos aleatórios','🏅','Sempre presente','Faça escolhas em cinco acontecimentos diferentes.',g=>g.history.filter(h=>/Sua escolha:/.test(h.description)).length>=5],
    ['Escolhas sem fim','Eventos aleatórios','🎲','Caminhos cruzados','Decida o rumo de 20 acontecimentos.',g=>g.history.filter(h=>/Sua escolha:/.test(h.description)).length>=20],
    ['A primeira nota','Escola','✏️','Dever cumprido','Termine cinco tarefas ou projetos escolares.',g=>(g.extra?.school?.projects||0)+(g.extra?.school?.events||0)>=5],
    ['Ano exemplar','Escola','🌟','Nota máxima','Alcance média 100 na escola.',g=>(g.extra?.school?.average||0)>=100],
    ['Familia numerosa','Família','👶','Geração de ouro','Tenha cinco filhos na mesma vida.',g=>g.children>=5],
    ['Avos felizes','Gerações','👴','Sou avô ou avó','Tenha um neto.',g=>!!g.extra?.dynasty?.members?.some(p=>p.generation>=(g.extra.dynasty.members.find(q=>q.id===g.extra.dynasty.activeId)?.generation||1)+2)],
    ['Legado','Gerações','🌳','A família continua','Assuma a vida de um descendente.',g=>(g.extra?.dynasty?.transitions||0)>=1],
    ['Tres geracoes','Gerações','🧬','Três gerações','Continue uma família até a terceira geração.',g=>(g.extra?.dynasty?.members?.find(p=>p.id===g.extra.dynasty.activeId)?.generation||1)>=3],
    ['Cinco geracoes','Gerações','🌲','Cinco gerações','Alcance a quinta geração jogável.',g=>(g.extra?.dynasty?.members?.find(p=>p.id===g.extra.dynasty.activeId)?.generation||1)>=5],
    ['Dez geracoes','Gerações','🏛️','Dinastia lendária','Alcance a décima geração jogável.',g=>(g.extra?.dynasty?.members?.find(p=>p.id===g.extra.dynasty.activeId)?.generation||1)>=10],
    ['Vida centenaria','Gerações','⏳','Século em família','Acumule cinco sucessões na mesma família.',g=>(g.extra?.dynasty?.transitions||0)>=5],
    ['Colecao de carreiras','Carreira','🧑‍💼','Profissional versátil','Troque de profissão três vezes numa vida.',g=>(g.extra?.careerHistory?.length||0)>=3],
    ['Colecao de carreiras 2','Carreira','🎓','Currículo lendário','Exerça cinco carreiras na mesma vida.',g=>(g.extra?.careerHistory?.length||0)>=5],
    ['Patrimonio alto','Finanças','💎','Muito além de um milhão','Tenha R$ 10 milhões de patrimônio.',g=>(window.CaminhosExtras?.wealth(g)||0)>=10000000],
    ['Sorte no amor','Relações','❤️','Laços duradouros','Mantenha um relacionamento com vínculo 95.',g=>g.people.some(p=>p.role==='Cônjuge'&&p.bond>=95)],
    ['Fundo de emergencia','Finanças','💰','Reserva de milhões','Acumule R$ 1 milhão em investimentos.',g=>g.savings>=1000000],
    ['A frota','Bens','🏎️','Grande coleção','Tenha dez bens ao mesmo tempo.',g=>(g.extra?.assetInventory||[]).length>=10],
    ['Empregos no mundo','Negócios','🌍','Império empresarial','Seja dono de cinco empresas.',g=>(g.extra?.assetInventory||[]).filter(a=>['padaria','barbearia','restaurante','mercado','transportadora','hotel','companhia'].includes(a.type)).length>=5],
    ['Paz e justiça','Riscos','⚖️','Depois da sentença','Volte a trabalhar depois de cumprir uma pena.',g=>(g.extra?.crimeStory?.served||0)>=1&&!!g.job],
    ['Mestres','Esportes','🥋','Mestre de duas lutas','Alcance habilidade 90 em duas artes marciais.',g=>Object.values(g.extra?.martialArts||{}).filter(v=>v.skill>=90).length>=2],
    ['Cuidador','Pets','🐕','Companheiro fiel','Treine um pet até 75 pontos.',g=>(g.extra?.pets||[]).some(p=>p.training>=75)],
    ['Partilha','Gerações','📜','Herança de família','Transmita bens a um descendente.',g=>(g.extra?.dynasty?.transitions||0)>0&&(g.properties>0||(g.extra?.assetInventory||[]).length>0)]
  ];
  for(const [id,cat,emoji,name,desc,check] of events)defs.push(['extra-'+id.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-'),cat,emoji,name,desc,check]);

  const achievements=defs.map(([id,cat,emoji,name,desc,check])=>({id,cat,emoji,name,desc,check}));
  const careerIds=new Set();
  function registerCareers(careers){
    for(const c of careers||[]){
      if(!c?.id||careerIds.has(c.id))continue;
      careerIds.add(c.id);
      const cat='Carreiras • '+c.name;
      const rank=g=>g.extra?.publicService?.active?.id===c.id?g.extra.publicService.active.rank:0;
      const same=g=>g.job===c.id;
      const sets=[
        ['inicio',c.emoji,'Primeiros passos','Comece a trabalhar como '+c.name+'.',g=>same(g)],
        ['cinco', '📅','Experiência comprovada','Trabalhe cinco anos como '+c.name+'.',g=>same(g)&&g.jobYears>=5],
        ['excelencia','🌟','Destaque da profissão','Atinja 90 de '+({inteligencia:'inteligência',saude:'saúde',disciplina:'disciplina',carisma:'carisma',felicidade:'felicidade'}[c.stat]||c.stat)+' após dez anos como '+c.name+'.',g=>same(g)&&g.jobYears>=10&&g.stats[c.stat]>=90],
        ['vinte','🏆','Carreira consolidada','Trabalhe vinte anos consecutivos como '+c.name+'.',g=>same(g)&&g.jobYears>=20]
      ];
      if(['policial','policial_civil','policial_federal','bombeiro','militar_exercito','militar_marinha','militar_aeronautica'].includes(c.id)){
        sets.push(['promocao','🎖️','Alta patente','Alcance três promoções na carreira de '+c.name+'.',g=>same(g)&&rank(g)>=3]);
      }
      for(const [tag,emoji,name,desc,check] of sets)
        achievements.push({id:'career-'+c.id+'-'+tag,cat,emoji,name,desc,check});
    }
  }

  // A conta tem um arquivo local proprio, independente do JSON da vida.
  const PREFIX='caminhos.achievements.account.';
  let accountId='guest',progress=read();
  let migratedSession=new Set();
  function key(){return PREFIX+accountId+'.v2'}
  function read(){try{return JSON.parse(localStorage.getItem(PREFIX+(accountId||'guest')+'.v2')||'{}')}catch{return {}}}
  function persist(){try{localStorage.setItem(key(),JSON.stringify(progress))}catch{/* Quota cheia ou navegador privado */}}
  function cleanData(input){
    const output={};if(!input||typeof input!=='object'||Array.isArray(input))return output;
    for(const [id,value] of Object.entries(input)){
      if(typeof id!=='string'||id.length>125||!value)continue;
      output[id]={age:Number.isFinite(value.age)?Math.max(0,Math.min(130,value.age)):0,
         at:typeof value.at==='string'?value.at.slice(0,36):new Date().toISOString()};
    }
    return output;
  }
  function merge(remote){
    const cleaned=cleanData(remote),newCount=Object.keys(cleaned).filter(k=>!progress[k]).length;
    progress={...cleaned,...progress};persist();
    return newCount;
  }
  function switchAccount(id){
    const next=id||'guest';
    if(next===accountId)return;
    const guestProgress=accountId==='guest'?{...progress}:null;
    accountId=next;progress=read();
    // Migrar a colecao offline somente no primeiro login: nao duplicar entre contas.
    if(next!=='guest'&&guestProgress&&Object.keys(guestProgress).length){
      merge(guestProgress);
      try{localStorage.removeItem(PREFIX+'guest.v2')}catch{}
    }
    persist();
  }
  function evaluate(g){
    if(!g)return [];
    // Saves antigos carregavam conquistas dentro da vida. Importar uma vez.
    if(!g.achievementMigrationV2){
      merge(g.achievements);
      g.achievementMigrationV2=true;
    }
    const newly=[];
    for(const a of achievements){
      if(progress[a.id])continue;
      try{
        if(a.check(g)){
          progress[a.id]={age:g.age,at:new Date().toISOString()};
          newly.push(a);
        }
      }catch{/* jogo antigo ou dado parcial */}
    }
    if(newly.length){
      persist();
      window.CaminhosCloud?.syncAchievements?.();
    }
    return newly;
  }
  function count(){return achievements.filter(a=>!!progress[a.id]).length}
  function render(g){
    if(g)evaluate(g);
    const got=count();
    const categories=[...new Set(achievements.map(a=>a.cat))];
    const groups=categories.map(cat=>{
      const subset=achievements.filter(a=>a.cat===cat);
      const done=subset.filter(a=>progress[a.id]).length;
      return '<section class="achieve-group"><div class="retro-section-title">'+cat+' · '+done+'/'+subset.length+'</div><div class="achievement-rows">'+subset.map(a=>{
        const award=progress[a.id],title=a.name+' — '+cat.replace('Carreiras • ','');
        return '<div class="achievement-row '+(award?'is-unlocked':'is-locked')+'"><div class="achievement-icon">'+a.emoji+'</div><div class="achievement-copy"><strong>'+title+(award?' ✅':'')+'</strong><span>'+a.desc+'</span></div></div>';
      }).join('')+'</div></section>';
    }).join('');
    return '<div class="achievement-title"><h2>🏆 Conquistas da conta</h2><p>Desbloqueie objetivos em muitas vidas e gerações.</p></div>'+
      '<div class="achievement-progress-title">'+got+' de '+achievements.length+' conquistas desbloqueadas</div>'+
      '<div class="achieve-progress"><i style="width:'+Math.round(got/Math.max(achievements.length,1)*100)+'%"></i></div>'+groups+
      '<div class="notice">Conquistas são permanentes na conta. Com login Google elas são sincronizadas separadamente da vida. Sem login, ficam guardadas neste navegador.</div>';
  }
  window.CaminhosAchievements={evaluate,render,registerCareers,merge,switchAccount,getProgress:()=>({...progress}),count,
    get total(){return achievements.length}};
})();