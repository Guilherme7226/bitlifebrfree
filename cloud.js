/* CAMINHOS — login social e backup em nuvem opcional.
   Sem configuração o jogo segue 100% local. Não expõe credenciais privadas. */
(function(){
'use strict';
const conf=window.CAMINHOS_CLOUD_CONFIG||{};
const ready=!!(conf.url&&conf.publishableKey&&/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(conf.url));
let client=null,session=null,remote=null,knownUpdated=null,sync=false,busy=false,timer=null;
let inflight=null;
const line=e=>{const str=String(e?.message||e||'Falha desconhecida');return str.slice(0,220)};
const html=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const feedback=msg=>{if(typeof showToast==='function')showToast(msg)};
async function connect(){
 if(!ready)throw Error('Projeto de login ainda não configurado.');
 if(client)return client;
 if(inflight)return inflight;
 inflight=(async()=>{
   const mod=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.75.0/+esm');
   const supa=mod.createClient(conf.url,conf.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'implicit'}});
   const res=await supa.auth.getSession();
   if(res.error)throw res.error;
   session=res.data.session;
   supa.auth.onAuthStateChange((_event,s)=>{
      session=s;
      if(!s){sync=false;remote=null;knownUpdated=null;}
      if(!s)feedback('Sessão encerrada. Seu jogo local continua salvo.');
   });
   client=supa;
   return supa;
 })();
 try{return await inflight}finally{inflight=null}
}
async function fetchRemote(){
 const c=await connect();
 const {data,error}=await c.from('game_saves').select('data,updated_at').eq('user_id',session.user.id).maybeSingle();
 if(error)throw error;
 remote=data||null;
 return remote;
}
function connected(){return !!session?.user}
function card(){
 const email=session?.user?.email||'';
 if(!ready)return '<div class="notice"><strong>⏳ Preparação pendente:</strong> um projeto Supabase exclusivo do jogo deve ser criado e os provedores Google/Apple configurados. Por enquanto o progresso é salvo automaticamente neste navegador. Use Exportar JSON como backup. Não é necessário alterar o projeto Paozinhos.</div><div class="mini-buttons"><button type="button" class="secondary-button" data-act="export">⬇ Exportar partida</button></div>';
 if(!connected())return '<p>Escolha sua conta para entrar. O jogo local não será apagado.</p><div class="cloud-buttons"><button data-cloud-action="google" class="secondary-button">🌐 Entrar com Google</button><button data-cloud-action="apple" class="secondary-button"> Entrar com Apple</button></div><p class="tiny-note">A conexão exige autorização dos provedores no painel Supabase e URLs de retorno permitidas. Se ainda não estiverem ativados, o acesso pode apresentar erro.</p>';
 return '<div class="notice"><strong>✓ Conta conectada:</strong> '+html(email)+'</div><p><strong>Sincronização automática:</strong> '+(sync?'Ativada para esta sessão':'Pausada. Escolha uma partida primeiro.')+'</p><div class="cloud-buttons"><button type="button" class="secondary-button" data-cloud-action="upload">☁️ Enviar esta partida</button><button type="button" class="secondary-button" data-cloud-action="download">⬇ Recuperar partida da nuvem</button><button type="button" class="secondary-button" data-cloud-action="refresh">🔄 Verificar backup</button><button type="button" class="secondary-button" data-cloud-action="signout">Sair da conta</button></div><p class="tiny-note">O envio pode substituir um backup remoto. Antes de substituir, será pedida confirmação. O download substitui o jogo local; exporte um JSON como segurança.</p>';
}
function open(){
 showModal('<div class="card-kicker">CONTA E SINCRONIZAÇÃO</div><h2 id="modalTitle">☁️ Backup na nuvem</h2>'+card());
 if(ready&&!client){connect().then(()=>open()).catch(err=>feedback('Nuvem indisponível: '+line(err))); }
}
async function login(provider){
 if(!ready)return feedback('O Supabase do jogo ainda não foi configurado.');
 if(busy)return;
 busy=true;
 try{
  const c=await connect();
  const target=location.origin+location.pathname;
  const {error}=await c.auth.signInWithOAuth({provider,options:{redirectTo:target}});
  if(error)throw error;
 }catch(e){feedback('Não foi possível entrar: '+line(e))}
 finally{busy=false}
}
async function signout(){
 if(!client)return;
 const {error}=await client.auth.signOut();
 if(error)return feedback('Não foi possível sair: '+line(error));
 session=null;sync=false;remote=null;knownUpdated=null;open();
}
async function upload(autosync=false){
 if(busy || !ready || !connected() || !game)return;
 busy=true;
 try{
   const current=await fetchRemote();
   const latest=current?.updated_at||null;
   if(autosync){
     if(knownUpdated!==latest){sync=false;feedback('Há um backup mais recente na nuvem. Escolha qual partida manter em Conta e nuvem.');return;}
   }else if(current && !confirm('Já existe uma partida na nuvem. Substituí-la pela partida deste aparelho? Faça um backup JSON antes de continuar.')){
     return;
   }
   // Salva somente no identificador da conta autenticada, com RLS.
   const data=JSON.parse(JSON.stringify(game));
   const {data:result,error}=await client.from('game_saves').upsert({user_id:session.user.id,data},{onConflict:'user_id'}).select('updated_at').single();
   if(error)throw error;
   knownUpdated=result.updated_at;sync=true;
   if(!autosync)feedback('Backup salvo na sua conta!');
 }catch(err){sync=false;feedback('Falha ao salvar na nuvem: '+line(err))}
 finally{busy=false}
}
async function download(){
 if(busy || !ready || !connected())return;
 busy=true;
 try{
   const row=await fetchRemote();
   if(!row)return feedback('Esta conta ainda não tem uma partida salva.');
   const next=row.data;
   if(typeof isValidGame!=='function'||!isValidGame(next))throw Error('Backup incompatível.');
   if(game&&!confirm('Recuperar partida da nuvem? O jogo atual deste aparelho será substituído. Exporte um JSON antes, se quiser guardá-lo.'))return;
   sync=false;clearTimeout(timer);
   next.extra=extraData(next.extra);
   game=next;
   save();activeTab='vida';render();hideModal();
   knownUpdated=row.updated_at;sync=true;
   feedback('Partida recuperada da nuvem!');
 }catch(e){feedback('Não foi possível recuperar: '+line(e))}
 finally{busy=false}
}
async function refresh(){
 try{await fetchRemote();feedback(remote?'Backup na nuvem encontrado.':'Ainda não existe backup na nuvem.');open();}
 catch(e){feedback('Erro ao consultar backup: '+line(e))}
}
function queueSave(g){
 if(!ready||!sync||!connected()||busy||!g)return;
 clearTimeout(timer);
 timer=setTimeout(()=>{upload(true)},1800);
}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-cloud-action]');
 if(!button)return;
 const action=button.dataset.cloudAction;
 if(action==='open')open();
 if(action==='google'||action==='apple')login(action);
 if(action==='upload')upload();
 if(action==='download')download();
 if(action==='refresh')refresh();
 if(action==='signout')signout();
});
window.CaminhosCloud={open,queueSave,configured:ready};
if(ready)connect().catch(e=>feedback('Nuvem indisponível: '+line(e)));
})();
