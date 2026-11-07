'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {recipes,ingredientCatalog,normalizeIngredient,parseIngredients,missingIngredients,analyzePlan,createPlan,known}=require('../app.js');
const {isAnimalIngredient,pantryIngredients}=require('../ingredients.js');

test('表記揺れを統合し、肉の部位・魚種は別々に保持する',()=>{
 assert.deepEqual(parseIngredients('鶏もも、鶏モモ肉 鶏胸肉\nささみ,手羽元，手羽先;鶏ミンチ'),['鶏もも肉','鶏むね肉','鶏ささみ','鶏手羽元','鶏手羽先','鶏ひき肉']);
 assert.deepEqual(parseIngredients('豚ロース 豚バラ 豚こま 豚モモ 豚ミンチ'),['豚ロース肉','豚バラ肉','豚こま切れ肉','豚もも肉','豚ひき肉']);
 assert.deepEqual(parseIngredients('牛こま 牛薄切り 牛バラ 牛ミンチ ステーキ肉'),['牛こま切れ肉','牛薄切り肉','牛バラ肉','牛ひき肉','牛ステーキ肉']);
 assert.deepEqual(parseIngredients('ほっけ ホッケ 鮭 サーモン さば アジ ブリ タラ サンマ'),['ホッケ','鮭','サバ','アジ','ブリ','タラ','サンマ']);
 assert.equal(normalizeIngredient('鶏肉'),'鶏肉（部位未指定）');
 assert.notEqual(normalizeIngredient('鶏もも'),normalizeIngredient('鶏むね'));
 assert.equal(normalizeIngredient('ﾎｯｹ'),'ホッケ');
});
test('125件の重複しないレシピに必要な情報が揃っている',()=>{
 assert.equal(recipes.length,125);
 assert.equal(new Set(recipes.map(r=>r.name)).size,125);
 assert.equal(new Set(recipes.map(r=>r.id)).size,125);
 assert.equal(new Set(recipes.map(r=>r.steps.join('|'))).size,125);
 for(const r of recipes){
  assert.ok(['主菜','副菜','汁物'].includes(r.type),r.name);
  assert.ok(r.servings===2&&r.time>=10&&r.time<=60,r.name);
  assert.ok(r.ingredients.length>=4,r.name);
  assert.equal(new Set(r.ingredients.map(([n])=>n)).size,r.ingredients.length,r.name);
  for(const [n,a]of r.ingredients){assert.ok(n&&a,r.name);assert.ok(known.has(n)||pantryIngredients.has(n),`${r.name}: ${n}`);assert.equal(normalizeIngredient(n),n);}
  assert.ok(r.steps.length>=3,r.name);assert.ok(r.steps.every(s=>s.trim().length>0),r.name);
  if(r.type==='主菜')assert.ok(r.ingredients.some(([n])=>n===r.protein),r.name);
 }
});
test('ホッケを指定すると7日間すべてホッケの主菜になり、鮭を提案しない',()=>{
 const result=analyzePlan(['ホッケ'],7);
 assert.ok(result.plan.every(([main])=>main.protein==='ホッケ'));
 assert.ok(result.plan.flat().filter(Boolean).every(r=>r.ingredients.every(([n])=>!isAnimalIngredient(n)||n==='ホッケ')));
 assert.ok(result.repeated.length>0);
});
test('全ての登録済み肉の部位と魚種で、別の部位・魚へ置き換えない',()=>{
 const names=['鶏肉','豚肉','牛肉','魚・魚介'].flatMap(c=>ingredientCatalog[c]);
 for(const name of names){
  const result=analyzePlan([name],7);
  for(const [main]of result.plan)if(main)assert.equal(main.protein,name);
  if(!recipes.some(r=>r.type==='主菜'&&r.protein===name)){
   assert.ok(result.plan.every(([m])=>m===null));assert.ok(result.unmatchedProteins.includes(name));
  }
 }
});
test('複数の肉魚を登録した時も未登録の肉魚を主菜に加えない',()=>{
 const names=['ホッケ','鶏むね肉','豚ロース肉'];
 const result=analyzePlan(names,7);
 assert.deepEqual([...new Set(result.plan.map(([r])=>r.protein))].sort(),[...names].sort());
 for(const r of result.plan.flat().filter(Boolean))for(const [n]of r.ingredients)if(isAnimalIngredient(n))assert.ok(names.includes(n));
});
test('豆腐と卵を指定した主菜に未登録の肉魚を入れない',()=>{
 for(const name of ['豆腐','卵','厚揚げ','大豆水煮']){
  const result=analyzePlan([name],7);
  assert.ok(result.plan.every(([r])=>r&&r.protein===name));
  assert.ok(result.plan.flat().filter(Boolean).every(r=>r.ingredients.every(([n])=>!isAnimalIngredient(n))));
 }
});
test('不明食材・対応料理なし・部位未指定の状態を正直に返す',()=>{
 for(const name of ['鹿肉','架空食材','鶏肉']){
  const result=analyzePlan([name],3);
  assert.ok(result.plan.every(([main])=>main===null));assert.equal(result.unsupported.length,1);
 }
 const result=analyzePlan(['鮭','未知食材'],1);
 assert.equal(result.plan[0][0].protein,'鮭');assert.deepEqual(result.unsupported,['未知食材']);
 const leafy=analyzePlan(['キャベツ'],1);assert.ok(leafy.plan[0][0].ingredients.some(([n])=>n==='キャベツ'));
});
test('不足食材と調味料を分けて、分量付きで正確に返す',()=>{
 const r=recipes.find(r=>r.name==='ホッケの塩焼き');
 assert.deepEqual(missingIngredients(r,['ホッケ']),{food:[['大根','150g']],pantry:[['塩','小さじ1/3'],['油','小さじ1']]});
 assert.deepEqual(missingIngredients(r,['ほっけ','大根','塩','油']),{food:[],pantry:[]});
});
test('1〜7日分の3品構成と調理法・たんぱく源の変化を維持する',()=>{
 for(let d=1;d<=7;d++){
  const plan=createPlan([],d);assert.equal(plan.length,d);
  for(const day of plan)assert.deepEqual(day.map(r=>r.type),['主菜','副菜','汁物']);
 }
 const main=createPlan([],7).map(([r])=>r);
 assert.ok(new Set(main.map(r=>r.method)).size>=3);
 assert.ok(new Set(main.map(r=>r.protein)).size>=4);
 assert.equal(new Set(main.map(r=>r.id)).size,7);
});
test('日数の範囲外を受け付けない',()=>{
 for(const d of [0,8,-1,1.5,NaN,'7'])assert.throws(()=>createPlan([],d),RangeError);
});
