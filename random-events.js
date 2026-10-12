/* CAMINHOS — acontecimentos de vida variados. Catálogo offline, persistente e contextual. */
(function(){
'use strict';
const ALL=[];
const ch=(text,delta,extra)=>({text,delta,...(extra||{})});
const add=(group,minimum,maximum,events)=>{
 for(const [id,title,story,choices,opts] of events){
  ALL.push({id,group,min:minimum,max:maximum,title,story,choices,requires:opts?.requires||[],weight:opts?.weight||1});
 }
};
add('primeiros anos',0,5,[
 ['primeiros-passos','Os primeiros passos','Você tentou atravessar a sala andando e tropeçou no tapete.',[
 ch('Levantar e tentar novamente',{saude:7,felicidade:12}),ch('Pedir colo',{felicidade:14},{bond:'parents',bondAmount:5}),ch('Desistir da brincadeira',{felicidade:-13,saude:-5})]],
 ['brinquedo-quebrado','O brinquedo quebrado','Seu brinquedo favorito quebrou durante uma brincadeira.',[
 ch('Pedir ajuda para consertá-lo',{felicidade:12,inteligencia:8},{bond:'parents',bondAmount:5}),ch('Tentar consertar sozinho(a)',{inteligencia:13,felicidade:-3}),ch('Fazer birra',{felicidade:-15},{bond:'parents',bondAmount:-9})]],
 ['medo-do-escuro','Uma noite assustadora','O barulho de uma tempestade deixou você com medo do escuro.',[
 ch('Chamar seus responsáveis',{felicidade:15},{bond:'parents',bondAmount:6}),ch('Acalmar-se com uma história',{felicidade:8,inteligencia:7}),ch('Ficar acordado(a) até amanhecer',{saude:-14,felicidade:-12})]],
 ['comida-nova','Uma refeição diferente','Sua família preparou uma comida que você nunca experimentou.',[
 ch('Experimentar',{saude:14,felicidade:7}),ch('Provar só um pouquinho',{saude:7,inteligencia:6}),ch('Recusar todas as refeições',{saude:-12,felicidade:-7})]],
 ['aniversario-surpresa','Seu aniversário','Seus familiares fizeram uma pequena comemoração em sua homenagem.',[
 ch('Brincar com todos',{felicidade:20},{bond:'parents',bondAmount:7}),ch('Compartilhar os presentes',{felicidade:14},{bond:'parents',bondAmount:10}),ch('Reclamar da festa',{felicidade:-13},{bond:'parents',bondAmount:-6})]],
 ['passeio-familia','Passeio em família','Seus responsáveis convidaram você para passear no parque.',[
 ch('Brincar ao ar livre',{felicidade:18,saude:11}),ch('Explorar a natureza',{inteligencia:12,saude:6}),ch('Ficar emburrado(a)',{felicidade:-11},{bond:'parents',bondAmount:-5})]],
 ['desenho-parede','Arte na parede','Você desenhou em uma parede da casa. Seus responsáveis descobriram.',[
 ch('Contar a verdade',{inteligencia:7,felicidade:-3},{bond:'parents',bondAmount:8}),ch('Ajudar a limpar',{inteligencia:12,felicidade:5},{bond:'parents',bondAmount:4}),ch('Culpar outra pessoa',{felicidade:-14},{bond:'parents',bondAmount:-15})]],
 ['visita-familia','Visita inesperada','Alguns parentes vieram conhecer você e passar a tarde juntos.',[
 ch('Brincar com eles',{felicidade:18},{bond:'parents',bondAmount:5}),ch('Ouvir histórias da família',{inteligencia:14,felicidade:6}),ch('Se esconder a tarde inteira',{felicidade:-8})]],
 ['queda-primeira-infancia','Uma queda no quintal','Você caiu enquanto brincava e começou a sentir dor.',[
 ch('Pedir ajuda',{saude:16,felicidade:5},{bond:'parents',bondAmount:4}),ch('Descansar',{saude:8,felicidade:3}),ch('Voltar a brincar machucado(a)',{saude:-19,felicidade:-8})]],
 ['vacinacao','Hora da vacinação','Sua família vai levá-lo(a) ao posto de saúde.',[
 ch('Cooperar com o atendimento',{saude:18,felicidade:-2}),ch('Fazer perguntas',{saude:12,inteligencia:10}),ch('Recusar e fazer birra',{saude:-9,felicidade:-12})]],
 ['novo-irmao','Novidade na família','Seus responsáveis estão preparando o quarto para receber mais uma criança.',[
 ch('Ajudar com carinho',{felicidade:18},{bond:'parents',bondAmount:10}),ch('Fazer perguntas',{inteligencia:11,felicidade:7}),ch('Ficar com ciúmes',{felicidade:-19},{bond:'parents',bondAmount:-6})]],
 ['primeiro-livro','Um livro colorido','Um familiar ofereceu um livro cheio de desenhos para você.',[
 ch('Ler com um responsável',{inteligencia:19,felicidade:9},{bond:'parents',bondAmount:5}),ch('Inventar uma história',{inteligencia:14,felicidade:12}),ch('Rasgar as páginas',{inteligencia:-7,felicidade:-10})]]
]);
add('infancia',6,12,[
 ['boletim-dificil','Boletim abaixo do esperado','Suas notas caíram e você precisa decidir o que fazer.',[
 ch('Pedir ajuda e estudar',{inteligencia:21,felicidade:-4},{school:10,bond:'parents',bondAmount:5}),ch('Organizar um grupo de estudo',{inteligencia:15,felicidade:7},{school:6}),ch('Esconder o boletim',{felicidade:-18,inteligencia:-5},{school:-9,bond:'parents',bondAmount:-10})]],
 ['prova-surpresa','Prova surpresa','O professor anunciou uma prova sem avisar.',[
 ch('Tentar com o que aprendi',{inteligencia:13,felicidade:5},{school:7}),ch('Revisar no intervalo',{inteligencia:18,felicidade:-5},{school:9}),ch('Colar do colega',{inteligencia:-8,felicidade:-13},{school:-12})]],
 ['feira-ciencias','Feira de ciências','Sua escola precisa de voluntários para apresentar experimentos.',[
 ch('Liderar um projeto',{inteligencia:21,felicidade:10},{school:12,club:6}),ch('Participar em grupo',{inteligencia:14,felicidade:12},{school:5}),ch('Faltar ao evento',{felicidade:-11},{school:-9})]],
 ['amigo-isolado','Um colega está sozinho','Você encontrou um aluno triste e sozinho durante o intervalo.',[
 ch('Convidar para brincar',{felicidade:13},{bond:'school',bondAmount:16}),ch('Ouvir seus problemas',{felicidade:8,inteligencia:8},{bond:'school',bondAmount:11}),ch('Ignorar e rir dele',{felicidade:-14},{bond:'school',bondAmount:-20})]],
 ['boato-escolar','Um boato cruel','Uma mensagem sobre um colega começou a circular na escola.',[
 ch('Desmentir o boato',{inteligencia:11,felicidade:13},{bond:'school',bondAmount:10}),ch('Não compartilhar',{inteligencia:7,felicidade:3}),ch('Ajudar a espalhar',{felicidade:-21},{bond:'school',bondAmount:-21})]],
 ['campeonato-interclasses','Campeonato interclasses','Seu time está prestes a jogar uma partida importante.',[
 ch('Participar da partida',{saude:14,felicidade:18},{club:9}),ch('Torcer pelos colegas',{felicidade:14},{bond:'school',bondAmount:7}),ch('Faltar sem avisar',{felicidade:-10},{club:-10})]],
 ['olimpiada-matematica','Olimpíada de matemática','A escola abriu inscrições para uma competição de raciocínio.',[
 ch('Treinar intensamente',{inteligencia:23,felicidade:-6},{school:10}),ch('Estudar com colegas',{inteligencia:15,felicidade:8},{school:5}),ch('Desistir sem tentar',{inteligencia:-6,felicidade:-9})]],
 ['apresentacao-escolar','Apresentação cultural','Sua turma vai subir ao palco diante de toda a escola.',[
 ch('Ensaiar e se apresentar',{felicidade:16,aparencia:9},{school:8,club:5}),ch('Criar cenários',{inteligencia:16,felicidade:6},{school:5}),ch('Esconder-se da apresentação',{felicidade:-15},{school:-7})]],
 ['brincadeira-perigosa','Desafio perigoso','Alguns colegas inventaram um desafio arriscado na rua.',[
 ch('Sugerir uma brincadeira segura',{saude:10,felicidade:10}),ch('Voltar para casa',{saude:8},{bond:'parents',bondAmount:5}),ch('Aceitar o desafio',{saude:-17,felicidade:5},{risk:'road'})]],
 ['passeio-museu','Visita ao museu','A escola organizou uma excursão com sua turma.',[
 ch('Explorar as exposições',{inteligencia:19,felicidade:11},{school:6}),ch('Conversar com os colegas',{felicidade:15},{bond:'school',bondAmount:8}),ch('Fazer uma confusão',{felicidade:-14},{school:-10})]],
 ['clube-reuniao','Uma reunião importante','O clube escolar está precisando de pessoas para ajudar.',[
 ch('Oferecer ajuda',{felicidade:12,inteligencia:8},{club:12}),ch('Preparar uma atividade',{inteligencia:15,felicidade:6},{club:15}),ch('Ignorar os colegas',{felicidade:-8},{club:-10})],{requires:['club']}],
 ['professor-elogiou','Elogio inesperado','Um professor elogiou sua dedicação diante da turma.',[
 ch('Agradecer e continuar',{inteligencia:12,felicidade:14},{school:8}),ch('Ajudar quem tem dificuldade',{inteligencia:10,felicidade:9},{bond:'school',bondAmount:10}),ch('Ficar arrogante',{felicidade:-9},{bond:'school',bondAmount:-10})]],
 ['pressao-amigos','Pressão dos colegas','Seus amigos querem que você mate aula para ir passear.',[
 ch('Ficar na escola',{inteligencia:16,felicidade:-3},{school:6}),ch('Conversar e combinar outro dia',{inteligencia:9,felicidade:7},{bond:'school',bondAmount:4}),ch('Matar aula',{inteligencia:-11,felicidade:8},{school:-12})]],
 ['livro-inspirador','Um livro marcante','Você encontrou um livro que despertou um interesse enorme.',[
 ch('Ler tudo',{inteligencia:21,felicidade:10}),ch('Compartilhar com alguém',{inteligencia:12,felicidade:10},{bond:'school',bondAmount:5}),ch('Deixar para depois',{inteligencia:-3})]],
 ['discussao-familia','Discussão em casa','Seus responsáveis tiveram uma discussão e o clima ficou difícil.',[
 ch('Conversar quando estiverem calmos',{felicidade:11},{bond:'parents',bondAmount:11}),ch('Procurar apoio de outro adulto',{felicidade:8,saude:6}),ch('Se isolar por semanas',{felicidade:-22,saude:-8})]],
 ['cachorro-fugiu','Um animal perdido','Você viu um cachorro perdido perto da escola.',[
 ch('Pedir ajuda a um adulto',{felicidade:15},{bond:'school',bondAmount:6}),ch('Avisar uma ONG',{felicidade:12,inteligencia:6}),ch('Correr atrás dele na rua',{saude:-13,felicidade:4},{risk:'road'})]]
]);
add('adolescencia',13,17,[
 ['pressao-aparencia','Comentários sobre seu visual','Alguém fez um comentário desagradável sobre sua aparência.',[
 ch('Escolher um estilo de que goste',{aparencia:18,felicidade:13}),ch('Conversar sobre respeito',{felicidade:11,inteligencia:8}),ch('Tentar agradar a todos',{aparencia:-9,felicidade:-20})]],
 ['prova-vestibulinho','Seleção de estudos','Surgiu a chance de participar de uma seleção muito concorrida.',[
 ch('Estudar intensamente',{inteligencia:23,felicidade:-8},{school:12}),ch('Preparar um cronograma equilibrado',{inteligencia:15,saude:5},{school:6}),ch('Ignorar a seleção',{inteligencia:-7,felicidade:-11})]],
 ['primeiro-trabalho','O primeiro bico','Alguém ofereceu dinheiro para você ajudar em uma tarefa de fim de semana.',[
 ch('Aceitar e trabalhar',{inteligencia:9,saude:-5,cash:280}),ch('Negociar responsabilidades',{inteligencia:14,cash:130}),ch('Recusar educadamente',{felicidade:7})]],
 ['festa-adolescente','Uma festa de colegas','Uma turma organizou uma festa e você foi convidado(a).',[
 ch('Ir e se divertir',{felicidade:19,aparencia:6,cash:-60}),ch('Ir por pouco tempo',{felicidade:10,saude:3}),ch('Ficar e descansar',{saude:9,felicidade:3})]],
 ['amizade-em-crise','Uma amizade em crise','Uma pessoa próxima parou de falar com você depois de um mal-entendido.',[
 ch('Pedir uma conversa sincera',{felicidade:13},{bond:'friend',bondAmount:18}),ch('Dar espaço',{felicidade:5},{bond:'friend',bondAmount:5}),ch('Insultar pelas redes sociais',{felicidade:-20},{bond:'friend',bondAmount:-24})],{requires:['friend']}],
 ['escolha-esportes','Convite para uma seletiva','Seu professor indicou você para uma seletiva esportiva.',[
 ch('Treinar para a seletiva',{saude:21,felicidade:10},{club:10}),ch('Treinar com equilíbrio',{saude:13,felicidade:13}),ch('Ignorar o convite',{felicidade:-10,saude:-5})]],
 ['boato-na-internet','Uma postagem viralizou','Uma postagem constrangedora sobre você está circulando.',[
 ch('Pedir a remoção e buscar apoio',{felicidade:11,inteligencia:10},{bond:'friend',bondAmount:4}),ch('Ignorar e seguir em frente',{felicidade:4}),ch('Responder com ofensas',{felicidade:-22,aparencia:-5},{bond:'friend',bondAmount:-12})]],
 ['crush-adolescencia','Alguém chamou sua atenção','Você começou a gostar de um colega da escola.',[
 ch('Conversar com respeito',{felicidade:16,aparencia:6},{bond:'school',bondAmount:10}),ch('Convidar para estudar',{felicidade:9,inteligencia:10},{bond:'school',bondAmount:7}),ch('Criar histórias falsas',{felicidade:-16},{bond:'school',bondAmount:-12})]],
 ['participar-voluntariado','Mutirão voluntário','Sua turma organiza uma ação solidária no bairro.',[
 ch('Participar da equipe',{felicidade:18,inteligencia:8},{school:7}),ch('Liderar a organização',{felicidade:12,inteligencia:15},{club:15}),ch('Fazer piada do evento',{felicidade:-12},{school:-10})]],
 ['dinheiro-guardado','O primeiro dinheiro guardado','Você recebeu uma quantia por ajudar alguém.',[
 ch('Guardar o dinheiro',{inteligencia:11,cash:150}),ch('Comprar um presente para a família',{felicidade:16,cash:60},{bond:'parents',bondAmount:9}),ch('Gastar tudo de uma vez',{felicidade:8,cash:90,inteligencia:-5})]],
 ['conflito-professor','Discussão com professor','Você discordou da avaliação que um professor deu.',[
 ch('Conversar com calma',{inteligencia:15,felicidade:7},{school:8}),ch('Pedir revisão com argumentos',{inteligencia:18},{school:6}),ch('Gritar na sala',{felicidade:-19},{school:-13})]],
 ['festival-banda','Festival de talentos','Sua escola realizará um festival de música e apresentações.',[
 ch('Se apresentar',{felicidade:20,aparencia:11},{club:13}),ch('Ajudar nos bastidores',{inteligencia:13,felicidade:8},{club:8}),ch('Criticar todos os colegas',{felicidade:-13},{bond:'school',bondAmount:-16})]],
 ['madrugada-estudos','Noite sem dormir','Você pensou em passar a noite acordado(a) estudando.',[
 ch('Dormir e estudar cedo',{saude:11,inteligencia:13}),ch('Estudar um pouco e descansar',{inteligencia:17,saude:3}),ch('Virar a noite toda',{inteligencia:7,saude:-22,aparencia:-9})]],
 ['viagem-turma','Viagem de formatura','Seus colegas querem organizar uma viagem de final de ano.',[
 ch('Contribuir com a organização',{felicidade:14,inteligencia:9,cash:-120},{bond:'school',bondAmount:7}),ch('Ir apenas aos eventos gratuitos',{felicidade:12}),ch('Criar briga no grupo',{felicidade:-15},{bond:'school',bondAmount:-16})]],
 ['curso-online','Uma habilidade nova','Você descobriu aulas gratuitas de uma área que deseja conhecer.',[
 ch('Estudar com dedicação',{inteligencia:20,felicidade:9}),ch('Praticar com um amigo',{inteligencia:12,felicidade:12},{bond:'school',bondAmount:5}),ch('Desistir no primeiro erro',{felicidade:-12,inteligencia:-5})]],
 ['lideranca-turma','Representante da turma','Alunos pediram que você se candidate a representante.',[
 ch('Apresentar boas propostas',{inteligencia:18,felicidade:12},{school:10,club:10}),ch('Apoiar outro candidato',{felicidade:9},{bond:'school',bondAmount:8}),ch('Prometer coisas impossíveis',{felicidade:-12},{school:-13})]]
]);
add('vida adulta',18,59,[
 ['curso-profissional','Uma chance de qualificação','Um curso profissional pode abrir portas na sua carreira.',[
 ch('Pagar o curso completo',{inteligencia:24,felicidade:9,cash:-1800},{career:7}),ch('Estudar por conta própria',{inteligencia:13,felicidade:3},{career:3}),ch('Ignorar a oportunidade',{felicidade:-8,inteligencia:-3})]],
 ['exames-preventivos','Saúde em primeiro lugar','Você percebeu que já faz muito tempo desde a última consulta médica.',[
 ch('Fazer um check-up particular',{saude:23,felicidade:10,cash:-650},{treat:true}),ch('Procurar o serviço público',{saude:15,felicidade:4},{treat:true}),ch('Adiar mais um ano',{saude:-20,felicidade:-9},{risk:'neglect'})]],
 ['reforma-casa','A casa precisa de cuidados','Uma infiltração começou a afetar a parede de sua casa.',[
 ch('Contratar um profissional',{saude:9,felicidade:16,cash:-2400}),ch('Resolver os reparos simples',{inteligencia:11,felicidade:6,cash:-180}),ch('Deixar a infiltração piorar',{saude:-17,felicidade:-16})]],
 ['amigo-precisa','Um amigo está em dificuldades','Um amigo próximo pediu ajuda depois de perder o emprego.',[
 ch('Oferecer ajuda financeira',{felicidade:15,cash:-550},{bond:'friend',bondAmount:17}),ch('Ajudá-lo a procurar oportunidades',{felicidade:12,inteligencia:8},{bond:'friend',bondAmount:12}),ch('Humilhá-lo por pedir ajuda',{felicidade:-19},{bond:'friend',bondAmount:-26})],{requires:['friend']}],
 ['promocao-possivel','Uma oportunidade de promoção','Uma vaga melhor surgiu dentro de sua empresa.',[
 ch('Fazer um curso e se candidatar',{inteligencia:19,cash:-900},{career:17}),ch('Conversar com o gestor',{felicidade:8,inteligencia:8},{career:9}),ch('Sabotar outro candidato',{felicidade:-17},{career:-18})],{requires:['job']}],
 ['desemprego-receio','Incerteza profissional','A empresa em que você trabalha anunciou mudanças e possíveis cortes.',[
 ch('Melhorar seu currículo',{inteligencia:19,felicidade:-5},{career:9}),ch('Começar a procurar vagas',{inteligencia:11,felicidade:7},{career:5}),ch('Discutir com o chefe',{felicidade:-20},{career:-21})],{requires:['job']}],
 ['dificuldade-dividas','Contas inesperadas','Uma despesa inesperada comprometeu seu planejamento financeiro.',[
 ch('Renegociar e organizar os gastos',{inteligencia:17,felicidade:5,cash:-600}),ch('Buscar uma renda extra',{inteligencia:10,saude:-7,cash:450}),ch('Ignorar todas as cobranças',{felicidade:-19,cash:-1250})]],
 ['premio-trabalho','Reconhecimento profissional','Seu trabalho chamou atenção em uma avaliação da equipe.',[
 ch('Aceitar novos desafios',{inteligencia:14,felicidade:17,cash:1200},{career:12}),ch('Compartilhar os créditos',{felicidade:13,cash:450},{career:6}),ch('Criticar seus colegas',{felicidade:-14},{career:-12})],{requires:['job']}],
 ['curso-idioma','Viagem ou estudo de idiomas','Você encontrou uma oportunidade para estudar outro idioma.',[
 ch('Pagar aulas com professor',{inteligencia:21,felicidade:10,cash:-2200}),ch('Usar aulas gratuitas',{inteligencia:13,felicidade:5}),ch('Não começar',{inteligencia:-4,felicidade:-4})]],
 ['casal-dialogo','Uma conversa difícil','Sua pessoa parceira pediu mais atenção e tempo de qualidade.',[
 ch('Planejar uma viagem a dois',{felicidade:19,cash:-1400},{bond:'partner',bondAmount:20}),ch('Conversar com calma',{felicidade:12},{bond:'partner',bondAmount:15}),ch('Ignorar os sentimentos dela',{felicidade:-23},{bond:'partner',bondAmount:-25})],{requires:['partner']}],
 ['casa-surpresa','Um problema no imóvel','O encanamento de um de seus imóveis apresentou vazamentos.',[
 ch('Contratar reparo imediato',{felicidade:13,cash:-3200}),ch('Resolver aos poucos',{inteligencia:10,felicidade:4,cash:-400}),ch('Adiar até piorar',{saude:-13,felicidade:-20})],{requires:['property']}],
 ['investimento-arriscado','Oferta de investimento','Um conhecido ofereceu uma aplicação com retorno prometido, mas alto risco.',[
 ch('Investir uma quantia moderada',{inteligencia:9,cash:-1300},{randomMoney:[-1400,3800]}),ch('Pesquisar antes de decidir',{inteligencia:16,felicidade:5}),ch('Colocar todo o dinheiro em uma promessa',{felicidade:-12,cash:-5000},{randomMoney:[-3500,8500]})]],
 ['entrevista-tv','Um convite para entrevista','Uma emissora local quer ouvir sua história profissional.',[
 ch('Aceitar e se preparar',{felicidade:18,aparencia:13,cash:-280},{fame:14,career:5}),ch('Participar sem gastar',{felicidade:11},{fame:8}),ch('Recusar e criticar a emissora',{felicidade:-10},{fame:-8})],{requires:['fameCareer']}],
 ['noticia-politica','Uma polêmica na cidade','Moradores pressionam você a se posicionar sobre um problema importante.',[
 ch('Ouvir especialistas e agir',{inteligencia:15,felicidade:11,cash:-450},{popularity:20}),ch('Prestar contas publicamente',{inteligencia:10,felicidade:5},{popularity:14}),ch('Fazer uma promessa que não pode cumprir',{felicidade:-18},{popularity:-23})],{requires:['politics']}],
 ['campanha-bairro','Um pedido da comunidade','Moradores pediram apoio para uma ação de melhorias no bairro.',[
 ch('Financiar a iniciativa',{felicidade:18,cash:-3200},{popularity:18}),ch('Organizar voluntários',{felicidade:13,inteligencia:11},{popularity:13}),ch('Ignorar a comunidade',{felicidade:-17},{popularity:-19})],{requires:['politics']}],
 ['pet-doente','Seu animal não está bem','Seu animal de estimação começou a mostrar sinais de doença.',[
 ch('Levar ao veterinário particular',{felicidade:19,cash:-850},{pet:18}),ch('Procurar atendimento popular',{felicidade:11,cash:-180},{pet:10}),ch('Ignorar os sintomas',{felicidade:-20},{pet:-24})],{requires:['pet']}],
 ['filho-crescendo','Um momento importante dos filhos','Um de seus filhos quer conversar sobre uma decisão importante.',[
 ch('Ouvir e apoiar',{felicidade:20},{bond:'child',bondAmount:19}),ch('Oferecer orientação',{inteligencia:10,felicidade:10},{bond:'child',bondAmount:13}),ch('Desconsiderar seus sentimentos',{felicidade:-20},{bond:'child',bondAmount:-25})],{requires:['child']}],
 ['viagem-sonhos','Uma viagem dos sonhos','Você viu uma oportunidade para viajar a um lugar que sempre quis conhecer.',[
 ch('Viajar e aproveitar',{felicidade:24,aparencia:6,saude:8,cash:-4500}),ch('Fazer um passeio perto de casa',{felicidade:14,cash:-350}),ch('Ficar em casa e economizar',{felicidade:6,inteligencia:4})]],
 ['academia-desafio','Desafio de condicionamento','Um conhecido convidou você para um desafio de saúde.',[
 ch('Contratar acompanhamento',{saude:23,felicidade:12,cash:-950}),ch('Começar com caminhadas',{saude:13,felicidade:9}),ch('Exagerar sem preparo',{saude:-17,felicidade:-9},{risk:'work'})]],
 ['rede-social','Uma discussão nas redes','Uma publicação polêmica sobre sua opinião viralizou.',[
 ch('Explicar com calma',{inteligencia:14,felicidade:6},{fame:7}),ch('Ignorar a discussão',{felicidade:10}),ch('Ofender os participantes',{felicidade:-22,aparencia:-8},{fame:-10})]],
 ['acidente-carro','Uma decisão na estrada','Um motorista começou a provocar você no trânsito.',[
 ch('Manter distância e dirigir com atenção',{saude:8,felicidade:6}),ch('Parar em um local seguro',{saude:12,felicidade:3}),ch('Disputar velocidade',{felicidade:-11,saude:-22},{risk:'reckless'})]],
 ['assalto-noite','Uma situação de risco','Você presenciou uma tentativa de roubo ao sair à noite.',[
 ch('Afastar-se e pedir ajuda',{saude:8,felicidade:-5}),ch('Auxiliar a vítima à distância',{felicidade:12,inteligencia:6},{risk:'help'}),ch('Confrontar os criminosos',{saude:-22,felicidade:-15},{risk:'confront'})]],
 ['mudanca-visual','Uma transformação','Você recebeu uma proposta para mudar o visual com acompanhamento.',[
 ch('Investir em um visual novo',{aparencia:22,felicidade:14,cash:-750}),ch('Cuidar do estilo em casa',{aparencia:11,felicidade:8,cash:-65}),ch('Deixar a aparência de lado',{aparencia:-9,felicidade:-9})]],
 ['desentendimento-familia','Conflito com familiares','Um familiar ficou chateado com uma decisão sua.',[
 ch('Pedir desculpas',{felicidade:12},{bond:'parents',bondAmount:16}),ch('Conversar e procurar uma solução',{inteligencia:10,felicidade:9},{bond:'parents',bondAmount:12}),ch('Cortar contato com insultos',{felicidade:-24},{bond:'parents',bondAmount:-23})]]
]);
add('maturidade',60,125,[
 ['consulta-idoso','Uma recomendação médica','Seu médico recomendou acompanhar mais de perto sua saúde.',[
 ch('Fazer avaliação completa',{saude:23,felicidade:12,cash:-1200},{treat:true}),ch('Consultar a rede pública',{saude:16,felicidade:4},{treat:true}),ch('Ignorar os exames',{saude:-25,felicidade:-13},{risk:'neglect'})]],
 ['reencontro-antigo','Reencontro inesperado','Uma pessoa que você não via há décadas entrou em contato.',[
 ch('Marcar um encontro',{felicidade:23,cash:-230},{bond:'friend',bondAmount:14}),ch('Conversar por telefone',{felicidade:14},{bond:'friend',bondAmount:8}),ch('Responder de forma rude',{felicidade:-16},{bond:'friend',bondAmount:-15})]],
 ['projeto-legado','Um legado para deixar','Sua comunidade convidou você a compartilhar experiências com jovens.',[
 ch('Financiar um projeto social',{felicidade:24,cash:-4500},{popularity:12}),ch('Dar aulas voluntárias',{felicidade:17,inteligencia:8}),ch('Recusar e ridicularizar',{felicidade:-13})]],
 ['caminhada-matinal','Hábitos saudáveis','Uma pessoa recomendou pequenas caminhadas pela manhã.',[
 ch('Começar caminhadas regulares',{saude:20,felicidade:14}),ch('Alongar-se em casa',{saude:11,felicidade:7}),ch('Passar dias sem se movimentar',{saude:-17,felicidade:-11})]],
 ['carta-passado','Uma carta do passado','Você encontrou uma caixa antiga com cartas e fotos de pessoas queridas.',[
 ch('Compartilhar histórias',{felicidade:20},{bond:'child',bondAmount:12}),ch('Organizar um álbum',{inteligencia:11,felicidade:13}),ch('Destruir as lembranças',{felicidade:-19})]],
 ['reforma-acessibilidade','Reforma para mais conforto','Você percebeu que sua casa precisa de melhorias para continuar confortável.',[
 ch('Adaptar o imóvel',{saude:18,felicidade:16,cash:-3500}),ch('Fazer melhorias simples',{saude:10,felicidade:8,cash:-380}),ch('Ignorar os riscos da casa',{saude:-22,felicidade:-12},{risk:'work'})]],
 ['aniversario-velhice','Um aniversário especial','Familiares e amigos estão organizando uma homenagem para você.',[
 ch('Comemorar com todos',{felicidade:26,cash:-550},{bond:'child',bondAmount:13}),ch('Fazer uma reunião simples',{felicidade:17},{bond:'child',bondAmount:9}),ch('Cancelar e se isolar',{felicidade:-20})]],
 ['novo-hobby-idoso','Nunca é tarde para aprender','Você descobriu um hobby interessante e gratuito em um centro comunitário.',[
 ch('Participar das aulas',{inteligencia:18,felicidade:17}),ch('Ensinar algo que sabe',{inteligencia:11,felicidade:14}),ch('Recusar por achar tarde demais',{felicidade:-16,inteligencia:-4})]],
 ['golpe-digital','Uma mensagem suspeita','Você recebeu uma mensagem dizendo que ganhou um prêmio extraordinário.',[
 ch('Verificar antes de responder',{inteligencia:17,felicidade:4}),ch('Pedir ajuda a alguém confiável',{inteligencia:10,felicidade:8}),ch('Enviar dinheiro ao desconhecido',{cash:-2600,felicidade:-24})]],
 ['passagem-tempo','Um dia de reflexão','Você começou a pensar nas escolhas que fez ao longo da vida.',[
 ch('Reconectar-se com a família',{felicidade:22},{bond:'child',bondAmount:13}),ch('Escrever suas memórias',{inteligencia:18,felicidade:14}),ch('Lamentar tudo em silêncio',{felicidade:-23,saude:-7})]],
 ['amizade-antiga','Um velho amigo precisa de atenção','Um amigo de longa data contou que está se sentindo sozinho.',[
 ch('Visitá-lo',{felicidade:18,cash:-150},{bond:'friend',bondAmount:17}),ch('Conversar e combinar encontros',{felicidade:12},{bond:'friend',bondAmount:12}),ch('Dizer que não se importa',{felicidade:-14},{bond:'friend',bondAmount:-22})],{requires:['friend']}],
 ['exame-rotina','Um sinal de alerta','Você percebeu uma mudança em seu bem-estar que merece atenção.',[
 ch('Agendar uma consulta',{saude:21,cash:-580},{treat:true}),ch('Procurar atendimento público',{saude:14},{treat:true}),ch('Deixar a saúde para depois',{saude:-24,felicidade:-14},{risk:'neglect'})]]
]);
add('qualquer idade',6,125,[
 ['chuva-inundacao','Um temporal muito forte','Uma tempestade alagou algumas ruas próximas à sua casa.',[
 ch('Ajudar com segurança',{felicidade:15,inteligencia:8},{risk:'help'}),ch('Permanecer protegido(a)',{saude:8}),ch('Entrar em uma área inundada',{saude:-23,felicidade:-7},{risk:'storm'})]],
 ['encontro-animal','Um animal precisa de ajuda','Um animal ferido apareceu perto de onde você estava.',[
 ch('Chamar apoio especializado',{felicidade:17}),ch('Levar alimento e água com cuidado',{felicidade:12,saude:4},{risk:'help'}),ch('Tentar pegá-lo de forma imprudente',{saude:-17},{risk:'brave'})]],
 ['semanas-estresse','Um período estressante','Vários compromissos ao mesmo tempo começaram a afetar seu humor.',[
 ch('Organizar a rotina',{inteligencia:10,felicidade:14,saude:5}),ch('Reservar tempo para descansar',{saude:13,felicidade:16}),ch('Ignorar os limites',{saude:-17,felicidade:-22})]],
 ['ajudar-vizinhos','Ajuda no bairro','Vizinhos estão organizando um mutirão para melhorar a região.',[
 ch('Ajudar a organizar',{felicidade:16,inteligencia:8},{bond:'friend',bondAmount:4}),ch('Participar de uma tarefa simples',{felicidade:12,saude:5}),ch('Destruir o trabalho coletivo',{felicidade:-18})]],
 ['dia-sorte','Uma surpresa feliz','Um acontecimento inesperado trouxe uma oportunidade para alegrar o dia.',[
 ch('Aproveitar e agradecer',{felicidade:21}),ch('Compartilhar com outras pessoas',{felicidade:16},{bond:'parents',bondAmount:7}),ch('Ignorar tudo',{felicidade:-6})]],
 ['sono-ruim','Uma noite sem descanso','Você passou uma noite difícil e acordou sem energia.',[
 ch('Descansar mais um pouco',{saude:15,felicidade:12}),ch('Ajustar os horários',{saude:12,inteligencia:6}),ch('Repetir a rotina exaustiva',{saude:-19,felicidade:-13,aparencia:-8})]],
 ['conflito-transporte','Problema no transporte','O transporte que você usava quebrou, atrasando seus planos.',[
 ch('Encontrar alternativa segura',{inteligencia:11,felicidade:4}),ch('Esperar com paciência',{felicidade:8}),ch('Arriscar uma viagem perigosa',{saude:-18,felicidade:-8},{risk:'road'})]],
 ['desafio-mental','Um grande desafio','Você encontrou um desafio que exige raciocínio e paciência.',[
 ch('Estudar até resolver',{inteligencia:20,felicidade:11}),ch('Pedir ajuda e aprender',{inteligencia:12,felicidade:10}),ch('Desistir sem tentar',{inteligencia:-7,felicidade:-13})]]
]);
function eligible(g){
 const state=g?.extra||{},school=state.school?.clubs;
 const has=(flag)=>{
  if(flag==='job')return !!g.job;
  if(flag==='friend')return (g.people||[]).some(p=>p.friend===true);
  if(flag==='partner')return !!g.partnerId;
  if(flag==='child')return Number(g.children)>0;
  if(flag==='pet')return (state.pets||[]).length>0;
  if(flag==='club')return !!school?.activeId&&g.age<18;
  if(flag==='property')return (g.properties||0)>0||(state.assetInventory||[]).some(a=>['imoveis','casas'].includes(a.type));
  if(flag==='politics')return !!state.office||g.job==='politico';
  if(flag==='fameCareer')return ['ator','musico','influencer','diretor','atleta','lutador'].includes(g.job);
  return true;
 };
 return ALL.filter(e=>g.age>=e.min&&g.age<=e.max&&e.requires.every(has));
}
function pick(g,options={}){
 if(!g||!g.alive)return null;
 if(!g.extra)g.extra={};
 const store=g.extra.storyEvents||{recent:[],count:0,lastYear:-1};
 if(!Array.isArray(store.recent))store.recent=[];
 g.extra.storyEvents=store;
 const list=eligible(g);
 if(!list.length)return null;
 let pool=list.filter(e=>!store.recent.includes(e.id));
 if(!pool.length)pool=list;
 const weights=pool.map(e=>{
  const delta=e.choices.map(v=>v.delta||{});
  let weight=e.weight||1;
  for(const key of ['felicidade','saude','inteligencia','aparencia']){
   const val=key==='aparencia'?g.extra.appearance:g.stats[key];
   if(val<35&&delta.some(d=>Number(d[key])>=8))weight+=.7;
  }
  if(e.group==='qualquer idade')weight*=.85;
  return weight;
 });
 const sum=weights.reduce((a,b)=>a+b,0);let roll=Math.random()*sum,index=0;
 for(let i=0;i<pool.length;i++){roll-=weights[i];if(roll<0){index=i;break}}
 const selected=pool[index];
 store.recent.unshift(selected.id);store.recent=store.recent.slice(0,Math.min(16,Math.max(8,Math.floor(list.length/3))));
 store.count=(store.count||0)+1;store.lastYear=g.age;
 return {source:'story',scenario:selected.id,title:selected.title,story:selected.story,category:selected.group,
  choices:selected.choices.map(o=>({text:o.text,delta:{...o.delta},effect:Object.fromEntries(Object.entries(o).filter(([key])=>key!=='text'&&key!=='delta'))}))};
}
function choiceImpact(g,choice){
 const fx=choice?.effect||{};
 const info=[];
 if(fx.bond){
  const options=(g.people||[]).filter(p=>{
   if(fx.bond==='parents')return ['Mãe','Pai','Pai/Mãe','Padrasto','Madrasta','Responsável'].includes(p.role);
   if(fx.bond==='friend')return p.friend===true;
   if(fx.bond==='partner')return Number(p.id)===Number(g.partnerId);
   if(fx.bond==='child')return ['Filho','Filha'].includes(p.role);
   if(fx.bond==='school')return ['Colega','Professor(a)'].includes(p.role);
   return false;
  });
  if(options.length){
   const member=options[Math.floor(Math.random()*options.length)];
   const before=member.bond||0,after=Math.max(0,Math.min(100,before+(fx.bondAmount||0)));
   member.bond=after;info.push('Relação com '+member.name+': '+(after-before>0?'+':'')+(after-before)+'.');
  }
 }
 if(Number.isFinite(fx.school)&&g.extra?.school){
  const s=g.extra.school;s.average=Math.max(0,Math.min(100,(s.average||50)+fx.school));
  info.push('Desempenho escolar: '+(fx.school>0?'+':'')+fx.school+'.');
 }
 const club=g.extra?.school?.clubs;
 if(Number.isFinite(fx.club)&&club?.activeId){
  club.popularity=Math.max(0,Math.min(100,club.popularity+fx.club));
  info.push('Popularidade no clube: '+(fx.club>0?'+':'')+fx.club+'.');
 }
 if(Number.isFinite(fx.career)&&g.job){
  g.extra.careerMomentum=Math.max(-60,Math.min(75,(g.extra.careerMomentum||0)+fx.career));
  info.push('Progresso profissional: '+(fx.career>0?'+':'')+fx.career+'.');
 }
 if(Number.isFinite(fx.popularity)){
  g.extra.reputation=Math.max(0,Math.min(100,(g.extra.reputation||30)+fx.popularity));
  info.push('Popularidade política: '+(fx.popularity>0?'+':'')+fx.popularity+'.');
 }
 if(Number.isFinite(fx.fame)){
  g.extra.fame=Math.max(0,Math.min(100,(g.extra.fame||0)+fx.fame));
  info.push('Fama: '+(fx.fame>0?'+':'')+fx.fame+'.');
 }
 if(fx.pet&&g.extra?.pets?.length){
  const pet=g.extra.pets[0];
  pet.bond=Math.max(0,Math.min(100,(pet.bond||60)+fx.pet));
  info.push('Relação com '+pet.name+' foi alterada.');
 }
 if(Array.isArray(fx.randomMoney)&&fx.randomMoney.length===2){
  const amount=Math.round(fx.randomMoney[0]+Math.random()*(fx.randomMoney[1]-fx.randomMoney[0]));
  g.cash+=amount;info.push(amount>=0?'Investimento rendeu '+brl(amount)+'.':'Investimento perdeu '+brl(-amount)+'.');
 }
 if(fx.treat&&g.extra?.everyday?.illness){
  g.extra.everyday.illness=null;g.extra.everyday.illnessYears=0;
  info.push('Você recebeu tratamento e se recuperou da doença.');
 }
 if(fx.risk&&window.CaminhosEveryday?.harm){
  const died=window.CaminhosEveryday.harm(g,fx.risk);
  if(died)return {died:true,info:info.join(' ')};
  if(fx.risk!=='safe')info.push('A decisão envolveu riscos reais.');
 }
 return {died:false,info:info.join(' ')};
}
window.CaminhosStories={pick,choiceImpact,eligible,count:()=>ALL.length,catalog:ALL};
})();
