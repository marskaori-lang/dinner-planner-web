'use strict';
const Planner = (() => {
 const source=typeof module!=='undefined'?require('./ingredients.js'):window.DinnerIngredients;
 const {ingredientCatalog,normalizeIngredient,parseIngredients,animalIngredients,proteinIngredients,isAnimalIngredient,pantryIngredients}=source;
 const recipeList=typeof module!=='undefined'?require('./recipes.js').recipes:window.DinnerRecipes;
 const known=new Set(Object.values(ingredientCatalog).flat());
 function matches(recipe,ingredient) {return recipe.ingredients.some(([name])=>name===normalizeIngredient(ingredient));}
 function missingIngredients(recipe,input) {
  const registered=new Set(input.map(normalizeIngredient));
  return {food:recipe.ingredients.filter(([name])=>!registered.has(name)&&!pantryIngredients.has(name)),pantry:recipe.ingredients.filter(([name])=>!registered.has(name)&&pantryIngredients.has(name))};
 }
 function analyzePlan(rawInput,days) {
  if(!Number.isInteger(days)||days<1||days>7)throw new RangeError('日数は1〜7の整数にしてください');
  const input=[...new Set(rawInput.map(normalizeIngredient))];
  const requestedProteins=input.filter(name=>proteinIngredients.has(name)||isAnimalIngredient(name));
  const requestedAnimals=input.filter(isAnimalIngredient);
  const usable=input.filter(name=>recipeList.some(r=>matches(r,name)));
  const unsupported=input.filter(name=>!usable.includes(name));
  // 肉・魚等の指定があれば、主材料の完全一致を必須にする。別の部位や魚種は代用しない。
  let mains=recipeList.filter(r=>r.type==='主菜');
  if(requestedProteins.length) {
   mains=mains.filter(r=>requestedProteins.includes(r.protein));
   mains=mains.filter(r=>r.ingredients.every(([name])=>!isAnimalIngredient(name)||requestedAnimals.includes(name)));
  } else if(input.length) mains=mains.filter(r=>input.some(name=>matches(r,name)));
  const eligibleOther=recipeList.filter(r=>r.type!=='主菜'&&(!requestedProteins.length||r.ingredients.every(([name])=>!isAnimalIngredient(name)||requestedAnimals.includes(name))));
  const counts=new Map(),usedInput=new Set(),methods=new Map(),centers=new Map();
  let previous=null;
  function choose(candidates,today){
   if(!candidates.length)return null;
   const ranked=candidates.map((r,index)=>{
    const matched=input.filter(name=>matches(r,name));
    const fresh=matched.filter(name=>!usedInput.has(name)).length;
    const shortage=missingIngredients(r,input).food.length;
    const overlap=today.filter(Boolean).reduce((total,other)=>total+r.ingredients.filter(([name])=>!pantryIngredients.has(name)&&other.ingredients.some(([n])=>name===n)).length,0);
    // 最初に指定食材を使い、次に重複と作り方の偏りを抑える。候補の制限は採点と別に守る。
    const score=fresh*70+matched.length*12-(counts.get(r.id)||0)*45-shortage*3-overlap*3
      -(r.type==='主菜'?(methods.get(r.method)||0)*7+(centers.get(r.protein)||0)*5+(previous?.method===r.method?10:0)+(previous?.protein===r.protein?8:0):0)-index*.001;
    return {r,score};
   }).sort((a,b)=>b.score-a.score);
   const recipe=ranked[0].r;counts.set(recipe.id,(counts.get(recipe.id)||0)+1);
   for(const name of input)if(matches(recipe,name))usedInput.add(name);
   return recipe;
  }
  const plan=[];
  for(let day=0;day<days;day++) {
   const main=choose(mains,[]);
   // 入力した食材に全く対応できないときは、関係のない献立を作って成功扱いにしない。
   const others=input.length&&!usable.length?[]:eligibleOther;
   const side=choose(others.filter(r=>r.type==='副菜'),[main]);
   const soup=choose(others.filter(r=>r.type==='汁物'),[main,side]);
   plan.push([main,side,soup]);
   if(main){methods.set(main.method,(methods.get(main.method)||0)+1);centers.set(main.protein,(centers.get(main.protein)||0)+1);previous=main;}
  }
  return {plan,input,unsupported,used:input.filter(x=>usedInput.has(x)),unused:input.filter(x=>!usedInput.has(x)),unmatchedProteins:requestedProteins.filter(x=>!mains.some(r=>r.protein===x)),repeated:[...counts].filter(([,n])=>n>1).map(([id])=>recipeList.find(r=>r.id===id).name)};
 }
 function createPlan(input,days){return analyzePlan(input,days).plan;}
 return {recipes:recipeList,ingredientCatalog,normalizeIngredient,parseIngredients,matches,missingIngredients,analyzePlan,createPlan,known};
})();
if(typeof module!=='undefined')module.exports=Planner;
if(typeof document!=='undefined') {
 const {ingredientCatalog,normalizeIngredient,parseIngredients,missingIngredients,analyzePlan,known}=Planner;
 const $=id=>document.getElementById(id);
 const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let selected=[],current=null;
 function markDirty(){if(current)$('summary').textContent='条件が変わりました。「献立をつくる」を押すと更新します。表示中のレシピは前回の条件です。';}
 function renderSelected(){
  $('selected-count').textContent=selected.length;
  $('selected-ingredients').replaceChildren();
  if(!selected.length){const p=document.createElement('p');p.className='field-help';p.textContent='まだ登録されていません。自由入力と一覧を併用できます。';$('selected-ingredients').append(p);}
  for(const item of selected){const b=document.createElement('button');b.type='button';b.textContent=`${item} ×`;b.setAttribute('aria-label',`${item}を解除`);b.onclick=()=>{selected=selected.filter(x=>x!==item);renderSelected();markDirty();};$('selected-ingredients').append(b);}
  for(const b of document.querySelectorAll('[data-ingredient]'))b.setAttribute('aria-pressed',String(selected.includes(b.dataset.ingredient)));
  const notes=[];
  if(selected.some(x=>x.includes('部位未指定')))notes.push('部位未指定の料理には、骨なし・薄切りなどの条件があります。材料欄を確認し、部位が分かる場合は一覧で選び直してください。');
  if(selected.some(x=>!known.has(x)))notes.push('一覧にない食材も登録できます。対応レシピがない場合は献立作成後にお知らせします。');
  $('input-status').textContent=notes.join(' ');
 }
 function addTyped(){const added=parseIngredients($('ingredients').value);selected=[...new Set([...selected,...added])];$('ingredients').value='';renderSelected();if(added.length)markDirty();}
 $('add-ingredients').onclick=addTyped;
 $('ingredients').oninput=markDirty;
 for(const [category,items] of Object.entries(ingredientCatalog)){
  const details=document.createElement('details');details.className='category';
  const summary=document.createElement('summary');summary.textContent=`${category}（${items.length}）`;details.append(summary);
  const list=document.createElement('div');list.className='chips catalog-options';
  for(const name of items){const b=document.createElement('button');b.type='button';b.textContent=name;b.dataset.ingredient=name;b.setAttribute('aria-pressed','false');b.onclick=()=>{selected=selected.includes(name)?selected.filter(x=>x!==name):[...selected,name];renderSelected();markDirty();};list.append(b);}
  details.append(list);$('ingredient-categories').append(details);
 }
 $('clear-ingredients').onclick=()=>{selected=[];$('ingredients').value='';renderSelected();markDirty();};
 $('days').oninput=()=>{$('day-count').value=`${$('days').value}日分`;markDirty();};
 function renderPlan(){
  const result=analyzePlan(selected,Number($('days').value));current=result;
  $('menu-count').textContent=`${result.plan.length}日分の献立`;
  const notices=[];
  if(!result.input.length)notices.push(`登録なしのおすすめ献立です。${Planner.recipes.length}種類の家庭料理から選びました。`);
  if(result.used.length)notices.push(`活用した食材：${result.used.join('・')}。`);
  if(result.unsupported.length)notices.push(`対応レシピなし：${result.unsupported.join('・')}。別の肉や魚には置き換えていません。`);
  if(result.unmatchedProteins.length)notices.push(`指定した主材料の主菜を提案できません：${result.unmatchedProteins.join('・')}。部位未指定の場合は部位を選び直してください。`);
  const notUsed=result.unused.filter(x=>!result.unsupported.includes(x));
  if(notUsed.length)notices.push(`今回は使わなかった食材：${notUsed.join('・')}。`);
  if(result.repeated.length)notices.push('指定食材を優先するため、同じ料理が再登場します。');
  notices.push('不足食材は各料理に表示しています。調味料・分量はレシピで確認してください。主食がない献立にはごはんなどを添えてください。');
  $('summary').textContent=notices.join(' ');
  $('ingredient-recipes').hidden=!result.input.length;
  $('ingredient-recipe-list').innerHTML=result.input.map(name=>{
   const choices=Planner.recipes.filter(r=>Planner.matches(r,name));
   return `<details class="related-group"><summary>${escape(name)}を使う料理（${choices.length}品）</summary>${choices.length?choices.map(r=>`<button type="button" class="related-button" data-recipe-id="${r.id}">${escape(r.name)}<span>${r.type} · 約${r.time}分 →</span></button>`).join(''):'<p class="field-help">対応レシピがありません。</p>'}</details>`;
  }).join('');
  $('menus').innerHTML=result.plan.map((meals,day)=>{
   const main=meals[0];
   return `<article class="menu-card"><div class="card-head"><span class="day-label">DAY <b>${String(day+1).padStart(2,'0')}</b></span><span class="theme">${main?`${escape(main.cuisine)} · ${escape(main.method)}`:'主菜の対応レシピなし'}</span></div>${meals.map((r,index)=>{
    if(!r)return `<div class="empty-dish">${['主菜','副菜','汁物'][index]}：対応するレシピを提案できません。食材を追加・変更してください。</div>`;
    const missing=missingIngredients(r,result.input);const used=result.input.filter(x=>Planner.matches(r,x));
    return `<div class="dish"><div class="dish-icon" aria-hidden="true">${r.icon}</div><div class="dish-info"><div><span class="dish-label">${r.type}</span><span class="method">${r.method} / ${r.cuisine}</span></div><h3>${escape(r.name)}</h3><div class="dish-meta">約${r.time}分 · ${r.servings}人分${used.length?` · 登録食材：${escape(used.join('・'))}`:''}</div><div class="missing">${missing.food.length?`追加が必要：${escape(missing.food.map(([n])=>n).join('・'))}`:'追加の食材なし（調味料を除く）'}</div></div><button class="recipe-button" data-day="${day}" data-dish="${index}" aria-label="${escape(r.name)}のレシピを見る">レシピ <span aria-hidden="true">↗</span></button></div>`;
   }).join('')}</article>`;
  }).join('');
 }
 $('planner').onsubmit=e=>{e.preventDefault();addTyped();renderPlan();if(matchMedia('(max-width:760px)').matches)$('summary').scrollIntoView({behavior:'smooth',block:'start'});};
 function openRecipe(r){
  const missing=missingIngredients(r,current.input);
  const shortage=missing.food.length?missing.food.map(([n,a])=>`${n} ${a}`).join('、'):'なし';
  $('recipe-servings').textContent=`${r.servings}人分`;
  $('recipe-content').innerHTML=`<h2 id="recipe-title">${escape(r.name)}</h2><div class="dish-meta">${r.type} / ${r.cuisine} / ${r.method} / 約${r.time}分</div><p class="recipe-note">追加が必要な食材：${escape(shortage)}<br>未登録の調味料等：${escape(missing.pantry.map(([n])=>n).join('・')||'なし')}<br>登録は在庫量を保証しません。下の分量を確認してください。</p><h3>材料（${r.servings}人分）</h3><ul>${r.ingredients.map(([n,a])=>`<li>${escape(n)} … ${escape(a)} ${current.input.includes(n)?'<span class="pill">登録済み</span>':''}</li>`).join('')}</ul><h3>つくり方</h3><ol>${r.steps.map(s=>`<li>${escape(s)}</li>`).join('')}</ol><p class="recipe-note">調理時間は目安です。肉・魚・卵は十分に加熱してください。骨やアレルギーにもご注意ください。生の肉・魚を扱った器具は洗浄し、完成品と分けてください。</p>`;
  $('recipe-dialog').showModal();
 }
 $('menus').onclick=e=>{const b=e.target.closest('[data-day]');if(b)openRecipe(current.plan[Number(b.dataset.day)][Number(b.dataset.dish)]);};
 $('ingredient-recipe-list').onclick=e=>{const b=e.target.closest('[data-recipe-id]');if(b){const recipe=Planner.recipes.find(r=>r.id===b.dataset.recipeId);if(recipe)openRecipe(recipe);}};
 $('close-dialog').onclick=()=>$('recipe-dialog').close();
 $('recipe-dialog').onclick=e=>{if(e.target===$('recipe-dialog')){const b=e.target.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)e.target.close();}};
 renderSelected();renderPlan();
}
