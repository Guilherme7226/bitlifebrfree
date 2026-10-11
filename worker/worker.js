/**
 * CAMINHOS • narrador opcional usando Cloudflare Workers AI.
 * Configure um AI binding chamado AI e a variável ALLOWED_ORIGIN
 * (ex.: https://guilherme7226.github.io) no painel da Cloudflare.
 * Não publique tokens nem inclua credenciais no frontend.
 * IMPORTANTE: verifique o README sobre proteção contra abuso para uso público.
 */
const MODEL='@cf/meta/llama-3.1-8b-instruct';
const json=(value,status=200,origin='')=>new Response(JSON.stringify(value),{
 status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',
 ...(origin?{'Access-Control-Allow-Origin':origin,'Vary':'Origin'}:{})}
});
const clamp=(n,low,high)=>Math.min(high,Math.max(low,Number(n)||0));
const bounded=(value,max=100)=>String(value||'').slice(0,max);
function parseJsonFromModel(text){
 const raw=String(text||'').trim();try{return JSON.parse(raw)}catch{}
 const match=raw.match(/\{[\s\S]*\}/);if(!match)throw Error('Resposta sem JSON');return JSON.parse(match[0]);
}
function safeEvent(obj){
 const value=obj?.event||obj;
 if(typeof value?.title!=='string'||typeof value?.story!=='string'||!Array.isArray(value?.choices)||value.choices.length!==3)throw Error('Estrutura de evento inválida');
 return {title:value.title.slice(0,90),story:value.story.slice(0,680),choices:value.choices.map(c=>{
 const d={};for(const k of ['saude','felicidade','inteligencia','carisma','disciplina'])if(Number.isFinite(c?.delta?.[k]))d[k]=clamp(c.delta[k],-12,12);
 if(Number.isFinite(c?.delta?.cash))d.cash=clamp(c.delta.cash,-3500,3500);
 return {text:bounded(c?.text,120)||'Continuar',delta:d};
 })};
}
export default {
 async fetch(request,env){
  const origin=request.headers.get('Origin')||'';
  const allowed=String(env.ALLOWED_ORIGIN||'').replace(/\/$/,'');
  if(!allowed)return json({error:'Configure ALLOWED_ORIGIN no Worker.'},503);
  if(origin!==allowed)return json({error:'Origem não autorizada.'},403);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':allowed,'Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Max-Age':'600','Vary':'Origin'}});
  if(request.method!=='POST')return json({error:'Use POST.'},405,allowed);
  if(!env.AI)return json({error:'Configure o binding Workers AI chamado AI.'},503,allowed);
  let payload;
  try{const text=await request.text();if(text.length>3000)return json({error:'Requisição grande demais.'},413,allowed);payload=JSON.parse(text)}
  catch{return json({error:'JSON inválido.'},400,allowed)}
  const age=clamp(payload?.age,0,130);
  const stats={};for(const key of ['saude','felicidade','inteligencia','carisma','disciplina'])stats[key]=clamp(payload?.stats?.[key],0,100);
  const context={idade:age,fase:bounded(payload?.stage,30),profissao:bounded(payload?.job,45),perfil:bounded(payload?.trait,25),cidade:bounded(payload?.city,65),atributos:stats};
  const instructions=`Você é o narrador de CAMINHOS, um jogo original brasileiro de simulação de vida. Crie exatamente UMA situação ficcional interessante, coerente com a idade e profissão, com humor e emoção, mas sem gore, conteúdo sexual explícito ou instruções perigosas. Responda APENAS JSON válido com o formato: {"title":"Título breve","story":"Narrativa de 2 a 4 frases em português do Brasil","choices":[{"text":"Ação 1","delta":{"felicidade":5,"cash":-100}},{"text":"Ação 2","delta":{"inteligencia":3}},{"text":"Ação 3","delta":{"carisma":-3}}]}. Escolha três opções com consequências diferentes, atributos apenas saude,felicidade,inteligencia,carisma,disciplina entre -12 e +12; cash entre -3500 e +3500. Sem markdown, sem texto fora do JSON.`;
  try{
   const result=await env.AI.run(MODEL,{messages:[{role:'system',content:instructions},{role:'user',content:'Contexto do personagem fictício: '+JSON.stringify(context)}],max_tokens:600,temperature:0.85});
   return json(safeEvent(parseJsonFromModel(result?.response||result?.result||'')),200,allowed);
  }catch(err){return json({error:'Não foi possível gerar o evento. Tente novamente mais tarde.'},502,allowed)}
 }
};