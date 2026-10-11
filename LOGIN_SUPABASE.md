# Ativação do login social — CAMINHOS

O projeto Supabase correto é **bitlife** / ID `jpcmzlqkebvrnaaptcni`.
A organização **paozinhos** e seu banco de vendas são independentes.

## Já configurado
- `public.game_saves`, com políticas RLS para cada usuário enxergar e alterar somente sua própria partida.
- Código de login e sincronização em `cloud.js`.
- URL do Supabase e **somente chave pública publishable** no `cloud-config.js`.
- Deploy estático no GitHub Pages.
- O jogo local continua funcionando sem login.

## Etapa 1 — URLs permitidas

Acesse o painel [URL Configuration](https://supabase.com/dashboard/project/jpcmzlqkebvrnaaptcni/auth/url-configuration).

- **Site URL:** `https://guilherme7226.github.io/bitlifebrfree/`
- **Redirect URLs:** adicione `https://guilherme7226.github.io/bitlifebrfree/`

## Etapa 2 — Google

1. No [Google Cloud Console](https://console.cloud.google.com/auth/clients), configure a tela de consentimento.
2. Crie um cliente OAuth do tipo **Web application**.
3. **Authorized JavaScript origins:** `https://guilherme7226.github.io`
4. **Authorized redirect URI:** `https://jpcmzlqkebvrnaaptcni.supabase.co/auth/v1/callback`
5. No painel [Supabase → Authentication → Providers](https://supabase.com/dashboard/project/jpcmzlqkebvrnaaptcni/auth/providers), abra **Google** e habilite o provedor, informando seu Client ID e Client Secret **diretamente no Supabase**.
6. Não envie segredos no GitHub nem no chat.

Referência: https://supabase.com/docs/guides/auth/social-login/auth-google

## Etapa 3 — Apple

O login web com Apple precisa das credenciais do Apple Developer (Services ID/identificador, Team ID, Key ID e chave privada conforme documentação) e de seu domínio/URL de retorno cadastrados na Apple.

- Configure o provedor em https://supabase.com/dashboard/project/jpcmzlqkebvrnaaptcni/auth/providers
- Callback do Supabase: `https://jpcmzlqkebvrnaaptcni.supabase.co/auth/v1/callback`
- Consulte https://supabase.com/docs/guides/auth/social-login/auth-apple
- A associação ao Apple Developer Program pode gerar custos adicionais (independentes do Supabase Free).

## Como usar no jogo

Abra `https://guilherme7226.github.io/bitlifebrfree/`, depois:
- **☰ → Conta e nuvem** para fazer login.
- **Enviar esta partida** para criar o backup remoto.
- No outro dispositivo, entre com a mesma conta e selecione **Recuperar partida da nuvem**.
- Depois de enviar ou recuperar a partida, alterações subsequentes são sincronizadas durante a sessão.
- O site pede confirmação antes de substituir a partida local ou remota e continua oferecendo backup **JSON**.
- Conquistas são parte do arquivo de progresso do personagem.

## Segurança
Nunca publique `service_role`, `sb_secret_*`, Apple private key ou OAuth client secret em JavaScript público ou no GitHub.

O projeto segue funcionando offline sem conta. O login OAuth depende da configuração dos provedores Google/Apple, que não é ativada automaticamente pela criação da tabela.
