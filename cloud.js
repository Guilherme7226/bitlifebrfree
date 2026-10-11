/* CAMINHOS — salvamento local + sincronizacao automatica segura (Google/Apple).
   Mantem o backup existente; nao substitui versoes divergentes silenciosamente. */
(function(){
'use strict';
const conf=window.CAMINHOS_CLOUD_CONFIG||{};
const ready=!!(conf.url&&conf.publishableKey&&/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(conf.url));
const META_PREFIX='caminhos.cloud.synced.';
let client=null,session=null,connectedPromise=null,bootPromise=null;
let sync=false,knownUpdated=null,busy=false,timer=null,remote=null,state='local',resetting=false,resetEpoch=0;
const line=e=>String(e?.message||e||'Falha desconhecida').slice(0,180);
const html=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const feedback=m=>{if(typeof showToast==='function')showToast(m)};
const serialize=g=>JSON.stringify(g);
const getLocal=()=>typeof game==='undefined'?null:game;
const hasValidGame=g=>typeof isValidGame==='function'&&isValidGame(g);
const canSync=()=>ready&&!!session?.user?.id;
const getMeta=id=>{try{return JSON.parse(localStorage.getItem(META_PREFIX+id)||'null')}catch{return null}};
function setMeta(snapshot){
 if(!canSync())return;
 try{localStorage.setItem(META_PREFIX+session.user.id,JSON.stringify({snapshot,updatedAt:knownUpdated}))}catch{/* localStorage pode estar cheio */}
}
function indicator(kind,message){
 state=kind;
 const chip=document.getElementById('saveStatus');
 const indicatorText=document.getElementById('saveIndicator');
 const quick=document.getElementById('quickSave');
 if(chip){chip.dataset.saveState=kind;chip.textContent=message||'Salvo no aparelho';}
 if(indicatorText){indicatorText.dataset.saveState=kind;indicatorText.textContent=message||'Salvo no aparelho';}
 if(quick){quick.dataset.saveState=kind;quick.title=message||'Salvar a partida';}
}
function localIndicator(){
 indicator(ready?'local':'local',canSync()?'Aguardando sincronização':'Salvo no aparelho');
}
async function connect(){
 if(!ready)throw Error('Supabase ainda não foi configurado.');
 if(client)return client;
 if(connectedPromise)return connectedPromise;
 connectedPromise=(async()=>{
   const mod=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.75.0/+esm');
   const supa=mod.createClient(conf.url,conf.publishableKey,{
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'implicit'}
   });
   client=supa;
   supa.auth.onAuthStateChange((event,next)=>{
     const oldId=session?.user?.id;
     session=next;
     if(!next){
       clearTimeout(timer);sync=false;knownUpdated=null;remote=null;bootPromise=null;
       localIndicator();
       return;
     }
     if(oldId!==next.user.id || (event==='SIGNED_IN'&&!sync&& !bootPromise)){
       setTimeout(()=>{bootstrap().catch(e=>indicator('error','Nuvem indisponível: '+line(e)))},0);
     }
   });
   const result=await supa.auth.getSession();
   if(result.error)throw result.error;
   session=result.data.session;
   if(session)setTimeout(()=>{bootstrap().catch(e=>indicator('error','Nuvem indisponível: '+line(e)))},0);
   else localIndicator();
   return supa;
 })();
 try{return await connectedPromise}finally{connectedPromise=null}
}
async function readRemote(){
 if(!client||!canSync())throw Error('Faça login na sua conta primeiro.');
 const {data,error}=await client.from('game_saves')
   .select('data,updated_at')
   .eq('user_id',session.user.id)
   .maybeSingle();
 if(error)throw error;
 remote=data||null;
 return remote;
}
function isSame(a,b){return serialize(a)===serialize(b)}
function restoreRow(row){
 if(!hasValidGame(row?.data))throw Error('O backup da nuvem está incompatível.');
 clearTimeout(timer);
 sync=false;
 game=JSON.parse(serialize(row.data));
 game.extra=extraData(game.extra);
 activeTab='vida';
 save();render();
 knownUpdated=row.updated_at;
 sync=true;
 setMeta(serialize(game));
 indicator('saved','✓ Salvo na nuvem');
 // Caso a restauracao libere novas conquistas, inclua-as no backup posteriormente.
 if(!isSame(game,row.data))queueSave(game);
}
async function bootstrap(){
 if(!canSync()||resetting)return;
 if(bootPromise)return bootPromise;
 bootPromise=(async()=>{
   const userId=session.user.id,epoch=resetEpoch;
   sync=false;
   indicator('checking','Verificando nuvem…');
   try{
     if(!client)await connect();
     const row=await readRemote();
     if(!canSync()||session.user.id!==userId||epoch!==resetEpoch||resetting)return;
     const local=getLocal(), meta=getMeta(userId);
     knownUpdated=row?.updated_at||null;
     if(!row){
       sync=true;
       indicator('local',local?'Pronto para salvar na nuvem':'Sem partida ainda');
       if(local)queueSave(local);
       return;
     }
     if(!hasValidGame(row.data))throw Error('Backup remoto inválido. Nada foi sobrescrito.');
     if(!local){
       restoreRow(row);
       feedback('Partida recuperada automaticamente da nuvem!');
       return;
     }
     if(isSame(local,row.data)){
       sync=true;
       setMeta(serialize(local));
       indicator('saved','✓ Salvo na nuvem');
       return;
     }
     const latest=serialize(row.data), localSnapshot=serialize(local);
     // A partida local ainda corresponde ao ultimo backup deste dispositivo:
     // a nuvem mudou em outro aparelho, logo podemos atualiza-la com seguranca.
     if(meta?.snapshot===localSnapshot){
       restoreRow(row);
       feedback('Progresso mais recente recuperado da nuvem!');
       return;
     }
     // A nuvem nao mudou desde o ultimo backup daqui: somente o local avancou.
     if(meta?.snapshot===latest){
       sync=true;
       indicator('pending','Enviando progresso…');
       queueSave(local);
       return;
     }
     sync=false;
     indicator('conflict','⚠ Escolha qual partida usar');
     feedback('Existem duas partidas diferentes. Em ☰ → Conta e nuvem, escolha qual manter.');
   }catch(err){
     sync=false;
     indicator('error','Nuvem indisponível');
     feedback('Não foi possível verificar a nuvem: '+line(err));
   }
 })();
 try{return await bootPromise}finally{bootPromise=null}
}
async function writeSnapshot({manual=false,override=false}={}){
 if(!canSync()||resetting)return false;
 if(!getLocal())return feedback('Crie uma vida antes de salvar.'),false;
 if(busy){
   if(!manual)queueSave(getLocal());
   return false;
 }
 if(!sync&&!manual)return false;
 busy=true;clearTimeout(timer);
 indicator('saving','Salvando na nuvem…');
 const userId=session.user.id;
 try{
   // Consulta a versao atual antes de atualizar. A escrita tem condicao
   // de versao e impede o overwrite por uma alteracao concorrente.
   const row=await readRemote();
   const updated=row?.updated_at||null;
   if(userId!==session?.user?.id)return false;
   if(updated!==knownUpdated){
     if(manual&&override){
       // Mesmo no modo manual, confirme a troca se surgiu um backup inesperado.
       if(!confirm('A nuvem foi atualizada em outro aparelho. Substituir essa versão pela partida local?')) {
         sync=false;indicator('conflict','⚠ Duas versões diferentes');return false;
       }
       knownUpdated=updated;
     }else{
       sync=false;indicator('conflict','⚠ Duas versões diferentes');
       feedback('A partida mudou em outro aparelho. Abra Conta e nuvem para escolher a versão.');
       return false;
     }
   }
   if(row&&manual&&!sync&&!override) {
     sync=false;indicator('conflict','⚠ Escolha a versão');
     feedback('Abra Conta e nuvem e escolha qual partida manter.');
     return false;
   }
   const snapshot=serialize(getLocal()), payload=JSON.parse(snapshot);
   let result;
   if(row){
     result=await client.from('game_saves')
       .update({data:payload})
       .eq('user_id',userId).eq('updated_at',updated)
       .select('updated_at').maybeSingle();
     if(!result.error&&!result.data){
       sync=false;indicator('conflict','⚠ Partida alterada em outro aparelho');
       feedback('Outra versão foi salva durante o envio. Escolha a partida em Conta e nuvem.');
       return false;
     }
   }else{
     result=await client.from('game_saves')
       .insert({user_id:userId,data:payload})
       .select('updated_at').single();
   }
   if(result.error)throw result.error;
   knownUpdated=result.data.updated_at;
   sync=true;setMeta(snapshot);
   indicator('saved','✓ Salvo na nuvem');
   if(manual)feedback('✓ Progresso salvo na nuvem!');
   if(serialize(getLocal())!==snapshot)queueSave(getLocal());
   return true;
 }catch(err){
   sync=false;indicator('error','⚠ Falha ao salvar na nuvem');
   feedback('Progresso local preservado. Erro na nuvem: '+line(err));
   return false;
 }finally{busy=false}
}
function queueSave(g){
 if(!g||resetting)return;
 if(!canSync()){localIndicator();return}
 if(!sync){if(state!=='conflict'&&state!=='error'&&state!=='checking')indicator('local','Salvo no aparelho');return}
 indicator('pending','Aguardando nuvem…');
 clearTimeout(timer);
 timer=setTimeout(()=>{writeSnapshot().catch(e=>feedback(line(e)))},1250);
}
async function download({quiet=false}={}){
 if(!canSync())return feedback('Entre com Google para recuperar o backup.');
 if(busy)return;
 busy=true;
 try{
   indicator('checking','Buscando backup…');
   const row=await readRemote();
   if(!row){indicator('local','Sem backup na nuvem');return feedback('Esta conta ainda não possui backup.');}
   if(!quiet&&getLocal()&&!isSame(getLocal(),row.data)&&!confirm('Recuperar o backup da nuvem? Isto substituirá o progresso atual deste aparelho. Exporte JSON antes, caso queira guardá-lo.')){
     indicator('conflict','⚠ Escolha qual partida usar');return;
   }
   restoreRow(row);
   if(!quiet)feedback('Partida recuperada da nuvem!');
   hideModal();
 }catch(e){indicator('error','Nuvem indisponível');feedback('Falha ao recuperar: '+line(e))}
 finally{busy=false}
}
async function manualSave(){
 if(typeof save==='function'&&getLocal())save();
 if(!getLocal())return feedback('Crie uma vida antes de salvar.');
 if(!canSync()){
   feedback('✓ Salvo neste aparelho. Entre com Google em ☰ → Conta e nuvem para salvar também na nuvem.');
   return;
 }
 if(!sync){
   if(state==='checking')return feedback('Aguarde a verificação do backup na nuvem.');
   await bootstrap();
   if(!sync){
     indicator('conflict','⚠ Escolha qual partida usar');
     open();
     return;
   }
 }
 clearTimeout(timer);
 await writeSnapshot({manual:true});
}
async function forceUpload(){
 if(!canSync())return feedback('Faça login primeiro.');
 if(!getLocal())return feedback('Não existe uma partida local para enviar.');
 const row=await readRemote().catch(e=>{feedback(line(e));return undefined});
 if(row===undefined)return;
 if(row&&!isSame(getLocal(),row.data)){
   if(!confirm('Substituir o backup na nuvem pela vida deste aparelho? O progresso que estava na nuvem será perdido. É recomendável exportar um JSON antes.'))return;
 }
 knownUpdated=row?.updated_at||null;
 sync=true;
 await writeSnapshot({manual:true,override:true});
 open();
}
async function login(provider){
 if(!ready)return feedback('Login ainda não configurado.');
 try{
   const c=await connect();
   const {error}=await c.auth.signInWithOAuth({provider,options:{redirectTo:location.origin+location.pathname}});
   if(error)throw error;
 }catch(e){feedback('Não foi possível entrar: '+line(e))}
}
// Apaga a vida atual deste aparelho e, caso a conta esteja conectada,
 // tambem remove a copia deste usuario em public.game_saves.
 // So libera o reset local depois da confirmacao do servidor.
async function resetLife(){
 if(busy||resetting){
   feedback('Espere a sincronização terminar antes de recomeçar.');
   return false;
 }
 try{
   if(ready&&!client)await connect();
 }catch(err){
   feedback('Não foi possível verificar sua conta. Reset cancelado para proteger o backup: '+line(err));
   return false;
 }
 const signed=canSync(),oldSync=sync,oldState=state;
 resetting=true;resetEpoch++;clearTimeout(timer);sync=false;
 try{
   if(signed){
     const uid=session.user.id;
     const {error}=await client.from('game_saves')
       .delete().eq('user_id',uid);
     if(error)throw error;
     if(!session||session.user.id!==uid)throw Error('A conta mudou durante o reset; recarregue a página.');
     try{localStorage.removeItem(META_PREFIX+uid)}catch{}
   }
   knownUpdated=null;remote=null;bootPromise=null;
   sync=signed;
   indicator('local','Pronto para uma nova vida');
   return true;
 }catch(err){
   sync=oldSync;
   indicator(oldState==='saved'?'saved':'error','Não foi possível recomeçar');
   feedback('Reset cancelado: '+line(err));
   return false;
 }finally{resetting=false}
}
async function signout(){
 if(!client)return;
 const {error}=await client.auth.signOut();
 if(error)return feedback('Falha ao sair: '+line(error));
 session=null;sync=false;knownUpdated=null;remote=null;clearTimeout(timer);
 localIndicator();open();
}
async function refresh(){
 if(!canSync())return;
 bootPromise=null;
 await bootstrap();
 open();
}
function card(){
 if(!ready)return '<div class="notice">A conta de backup ainda não foi configurada. A partida continua salva no aparelho.</div>';
 if(!canSync())return '<p>Conecte sua conta para ativar o salvamento automático na nuvem.</p><div class="cloud-buttons"><button class="secondary-button" data-cloud-action="google">🌐 Entrar com Google</button><button class="secondary-button" data-cloud-action="apple"> Entrar com Apple</button></div>';
 const email=html(session.user.email||'');
 const status=sync?'✓ Salvamento automático habilitado':state==='conflict'?'⚠ Há partidas diferentes; escolha qual manter.':'Aguardando conexão / conferência';
 return '<div class="notice"><strong>Conta: '+email+'</strong><p>'+status+'</p></div>'+
 '<div class="cloud-buttons">'+
 '<button class="primary-button" data-cloud-action="save">💾 Salvar agora</button>'+
 '<button class="secondary-button" data-cloud-action="download">⬇ Usar partida da nuvem</button>'+
 '<button class="secondary-button" data-cloud-action="upload">☁️ Usar partida deste aparelho</button>'+
 '<button class="secondary-button" data-cloud-action="refresh">🔄 Conferir versões</button>'+
 '<button class="secondary-button" data-cloud-action="signout">Sair da conta</button></div>'+
 '<p class="tiny-note">Após entrar, o jogo salva automaticamente na nuvem e recupera a versão mais recente quando não há mudanças locais pendentes. Se os dois aparelhos mudaram a partida, você escolhe qual salvar para evitar perdas. O arquivo JSON continua disponível em Configurações.</p>';
}
function open(){
 showModal('<div class="card-kicker">SALVAMENTO AUTOMÁTICO</div><h2 id="modalTitle">☁️ Conta e progresso</h2>'+card());
 if(ready&&!client)connect().then(()=>open()).catch(e=>feedback(line(e)));
}
document.addEventListener('click',ev=>{
 const el=ev.target.closest('[data-cloud-action]');
 if(!el)return;
 const a=el.dataset.cloudAction;
 if(a==='open')open();
 if(a==='save')manualSave();
 if(a==='google'||a==='apple')login(a);
 if(a==='upload')forceUpload();
 if(a==='download')download();
 if(a==='refresh')refresh();
 if(a==='signout')signout();
});
window.addEventListener('online',()=>{if(canSync()&&sync&&getLocal())queueSave(getLocal());});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&canSync()&&!sync&&state==='error')bootstrap().catch(()=>{});});
window.CaminhosCloud={open,queueSave,configured:ready,manualSave,resetLife,getStatus:()=>state};
if(ready)connect().catch(e=>{indicator('error','Nuvem indisponível');feedback('Falha ao conectar: '+line(e))});
else localIndicator();
})();
