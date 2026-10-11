'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const listeners={};
const values=new Map();
const dom=new Map();
const asNode=id=>{
 if(!dom.has(id))dom.set(id,{
   id,dataset:{},classList:{toggle(){},add(){},remove(){}},
   value:'',textContent:'',innerHTML:'',style:{},disabled:false,
   addEventListener(){},setAttribute(){},appendChild(){},remove(){},click(){}
 });
 return dom.get(id);
};
const document={
 getElementById:asNode,
 querySelectorAll(sel){if(sel==='[data-tab]'||sel==='[data-dock]'||sel==='.nav-list .tab')return [];return []},
 addEventListener(type,cb){(listeners[type]||=([])).push(cb)},
 createElement(tag){return asNode(tag+'-'+Math.random())}
};
const storage={
 getItem(k){return values.has(k)?values.get(k):null},
 setItem(k,v){values.set(k,String(v))},
 removeItem(k){values.delete(k)}
};
const ctx=vm.createContext({
 window:{scrollTo(){},location:{origin:'https://example.com',pathname:'/'}},
 document,localStorage:storage,navigator:{},location:{origin:'https://example.com',pathname:'/'},
 console,setTimeout(){return 1},clearTimeout(){},
 Date,Math,JSON,Intl,URL,Blob,AbortController,
 confirm(){return true}
});
for(const file of ['achievements.js','life-extras.js','game.js']){
  vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
}
function code(src){return vm.runInContext(src,ctx)}
function click(dataset){
 const target={dataset,closest(selector){
   if(selector==='[data-life-extra]'&&dataset.lifeExtra)return this;
   return null;
 }};
 for(const listener of (listeners.click||[]))listener({target});
}
assert.equal(code('game'),null,'starts without a game');
code("startGame('Teste','Santos, SP','curioso')");
assert.equal(code('game.age'),0);
code('game.age=4;game.actions=3;render()');
assert.ok(code("game.people.filter(x=>x.role==='Colega').length")>=4,'school has classmates');
assert.ok(code("game.people.filter(x=>x.role==='Professor(a)').length")>=2,'school has teachers');
assert.match(code('window.CaminhosExtras.renderSchool(game)'),/Vida escolar/);
const oldScore=code('game.extra.school.average');
click({lifeExtra:'school',id:'study'});
assert.ok(code('game.extra.school.average')>oldScore,'studying improves school average');
assert.equal(code('game.actions'),2,'school action costs an action');
const teacher=code("game.people.find(p=>p.role==='Professor(a)').id");
const oldTeacherBond=code("game.people.find(p=>p.id==="+teacher+").bond");
click({lifeExtra:'talk',person:teacher});
assert.ok(code("game.people.find(p=>p.id==="+teacher+").bond")>oldTeacherBond,'talking builds relationship');
code('game.age=18;game.cash=1100000;game.actions=3;window.CaminhosExtras.annual(game);render()');
assert.equal(code('game.extra.school.finished'),true);
assert.ok(code("game.people.some(p=>p.role==='Ex-professor(a)')"),'teacher is retained after graduation');
click({lifeExtra:'buy',id:'hatch'});
click({lifeExtra:'buy',id:'apto'});
click({lifeExtra:'buy',id:'restaurante'});
assert.equal(code('game.extra.assetInventory.length'),3,'multiple different assets can be purchased');
assert.ok(code('window.CaminhosExtras.wealth(game)')>0);
assert.match(code('window.CaminhosExtras.renderAssets(game)'),/Loja de bens/);
assert.match(code('window.CaminhosExtras.businessCards(game)'),/Restaurante/);
const id=code('game.extra.assetInventory[0].id');
click({lifeExtra:'sell',inventory:id});
assert.equal(code('game.extra.assetInventory.length'),2,'owned item can be sold');
code('game.age=19;window.CaminhosExtras.annual(game);save()');
assert.equal(code('game.extra.assetYear'),19);
assert.match(storage.getItem('caminhos.save.v1'),/assetInventory/,'local save contains assets');
code('game=null;game=restore();render()');
assert.equal(code('game.extra.assetInventory.length'),2,'backwards-compatible restore');
assert.ok(code('window.CaminhosAchievements.count(game)')>0,'achievements still work');
const html=fs.readFileSync('index.html','utf8');
assert.match(html,/data-dock="more"/);
assert.match(html,/id="homeShortcut"/);
assert.match(html,/data-tab="escola"/);
const css=fs.readFileSync('styles.css','utf8');
assert.match(css,/grid-template-columns:\.9fr \.9fr 1\.1fr \.9fr \.9fr \.8fr/);
console.log('OK: escola, amigos, professores, bens, empresas, venda, salvamento e navegação.');
