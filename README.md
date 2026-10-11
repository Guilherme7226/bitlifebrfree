# CAMINHOS — Simulador de Vida, versão 2.0

Um simulador **original** em português, inspirado pelo gênero de jogos de escolhas. Não é uma versão do BitLife e **não reproduz** códigos, pacotes, imagens ou marcas do jogo da Candywriter. O repositório de referência usa **Unity WebGL compilado**, portanto foi criado um motor próprio leve com HTML/CSS/JS para melhor adaptação ao iPhone.

## Recursos jogáveis hoje

- Criação de personagem, cidades, atributos, 3 ações por ano, histórico e eventos com escolhas.
- 20 profissões, faculdade, relacionamentos, filhos, trabalho, economia, imóveis e investimentos fictícios.
- **Negócios:** fundação, ampliação, lucro/prejuízo anual e venda.
- **Política:** reputação, campanhas, 4 cargos e mandatos de 4 anos.
- **Fama e música:** seguidores, música, produção de filmes e retorno financeiro fictício.
- **Luta esportiva:** treinamento, lutas simuladas, vitórias, derrotas e título.
- **Riscos e consequências:** delitos fictícios, prisão e reputação.
- **Modo Criador grátis:** dinheiro, atributos, seguidores e reputação.
- Salvamento automático local + exportação/importação JSON.
- Layout responsivo, navegação fixa na base do iPhone, suporte a áreas seguras do iPhone, ícone e manifesto para **Adicionar à Tela de Início**.
- Narrador por IA opcional, após configurar separadamente Cloudflare Workers AI; sem isso há eventos locais gratuitos.

## O que não existe ainda

Não há integração com as expansões do BitLife original, nem todas as centenas de atividades ou sistemas comerciais. Ainda faltam gerações herdadas jogáveis, rede social multiplayer, simulação empresarial mais profunda, eleições com plataformas políticas detalhadas, múltiplas lutas/minijogos, minigames, login e sincronização entre aparelhos. A IA não está ativada por padrão.

## Publicação

No GitHub Pages: **Settings > Pages > Deploy from branch > main > /(root)**. URL esperada: `https://guilherme7226.github.io/bitlifebrfree/` depois da ativação e propagação. Não coloque chaves privadas ou tokens no frontend.

### iPhone

Abra a URL do GitHub Pages pelo **Safari**, toque em **Compartilhar**, selecione **Adicionar à Tela de Início**. O jogo usa armazenamento do navegador/aplicativo; exporte o progresso antes de limpar os dados. Em dispositivos Safari diferentes o salvamento pode ficar separado.

### IA (futura, opcional)

O arquivo `worker/worker.js` contém um modelo ilustrativo do narrador com Cloudflare Workers AI. Consulte as instruções do arquivo da versão anterior para configurar o AI binding. Para disponibilizar publicamente um endpoint de IA, é necessário implantar proteções adequadas contra abuso, porque só CORS não garante autenticação. O jogo funciona sem essa conexão.

## Arquivos

- `index.html`, `styles.css`, `game.js`: jogo principal.
- `app-icon.svg`, `manifest.webmanifest`: atalho no iPhone.
- `worker/worker.js`: backend de IA opcional, não publicado automaticamente.