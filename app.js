'use strict';
const dish = (name, type, protein, method, time, icon, ingredients, steps) => ({name,type,protein,method,time,icon,ingredients,steps});
const recipes = [
 dish('鶏肉とキャベツの蒸し焼き','主菜','鶏肉','蒸す',20,'🥬',[['鶏肉','250g'],['キャベツ','200g'],['酒','大さじ2'],['塩','小さじ1/3'],['こしょう','少々']],['鶏肉を一口大、キャベツをざく切りにします。','フライパンにキャベツ、鶏肉の順に重ね、酒と塩を加えてふたをします。','中火で沸かし、弱めの中火で12〜15分蒸します。鶏肉の中心まで十分に火を通し、こしょうを振ります。']),
 dish('鮭のきのこホイル焼き','主菜','魚','焼く',25,'🐟',[['鮭','2切れ'],['しめじ','100g'],['玉ねぎ','1/2個'],['バター','10g'],['しょうゆ','小さじ2']],['玉ねぎを薄切りにし、しめじをほぐします。','アルミホイルを2枚広げ、それぞれに玉ねぎ、鮭、しめじ、バター、しょうゆを半量ずつのせ、包みます。','フライパンに並べ、水を深さ1cmほど注いでふたをし、中火で15分ほど加熱します。鮭の中心まで火が通ったら完成です。']),
 dish('豆腐と豚肉のやさしい煮物','主菜','大豆・豚肉','煮る',20,'🍲',[['豆腐','300g'],['豚肉','120g'],['にんじん','1/2本'],['だし汁','250ml'],['しょうゆ','大さじ1'],['みりん','大さじ1']],['豆腐は大きめの角切り、にんじんは薄い半月切り、豚肉は食べやすく切ります。','鍋にだし汁、しょうゆ、みりん、にんじんを入れ、5分煮ます。','豚肉と豆腐を加え、アクを取りながら8〜10分煮て、豚肉の中心まで火を通します。']),
 dish('豚肉とピーマンのしょうが炒め','主菜','豚肉','炒める',15,'🫑',[['豚肉','250g'],['ピーマン','3個'],['玉ねぎ','1/2個'],['しょうが','1片'],['しょうゆ','大さじ1'],['みりん','大さじ1'],['油','小さじ2']],['豚肉と野菜を細切りにし、しょうがはすりおろします。','フライパンに油を熱し、豚肉を炒めます。肉の色が変わったら野菜を加えます。','しょうが、しょうゆ、みりんを加え、豚肉の中心まで火を通し、汁気を軽く飛ばします。']),
 dish('さばと大根のみそ煮','主菜','魚','煮る',30,'🐟',[['さば','2切れ'],['大根','150g'],['しょうが','1片'],['水','200ml'],['みそ','大さじ1と1/2'],['みりん','大さじ2'],['酒','大さじ2']],['大根を薄い半月切りに、しょうがを薄切りにします。さばに熱湯をかけます。','鍋に水、酒、みりん、しょうが、大根を入れ、5分煮ます。','さばを加え、落としぶたをして10分煮ます。みそを溶き入れ、さらに5分煮て、さばの中心まで火を通します。']),
 dish('豆腐と卵のふんわり焼き','主菜','大豆・卵','焼く',20,'🥚',[['豆腐','300g'],['卵','2個'],['にんじん','1/3本'],['片栗粉','大さじ2'],['塩','小さじ1/3'],['油','小さじ2']],['豆腐をキッチンペーパーで包んで水気を切り、にんじんは細かく刻みます。','豆腐を崩し、卵、にんじん、片栗粉、塩を混ぜ合わせます。','油を熱したフライパンに小さく落とし入れ、弱めの中火で両面各4〜5分、卵が中心まで固まるまで焼きます。']),
 dish('鶏肉とじゃがいものトマト煮','主菜','鶏肉','煮る',30,'🍅',[['鶏肉','250g'],['じゃがいも','2個'],['玉ねぎ','1/2個'],['トマト缶','200g'],['水','100ml'],['塩','小さじ1/2'],['油','小さじ2']],['鶏肉とじゃがいもを一口大に、玉ねぎを薄切りにします。','鍋に油を熱して鶏肉の表面を焼き、玉ねぎを加えて炒めます。','残りの材料を加え、ふたをして弱火で20分ほど煮ます。鶏肉の中心まで火を通し、じゃがいもが柔らかくなったら完成です。']),
 dish('えびとブロッコリーの塩炒め','主菜','魚介','炒める',15,'🥦',[['むきえび','200g'],['ブロッコリー','200g'],['にんにく','1片'],['酒','大さじ1'],['塩','小さじ1/3'],['油','小さじ2']],['ブロッコリーを小房に分けて3分ゆで、水を切ります。えびは背わたを除き、水気を拭きます。','フライパンに油と刻んだにんにくを入れて弱火で熱し、えびを加えます。','酒とブロッコリーを加え、中火でえびが中心まで不透明になるまで炒め、塩で味を調えます。']),
 dish('にんじんとほうれん草のごまあえ','副菜','','あえる',10,'🥕',[['にんじん','1/2本'],['ほうれん草','150g'],['すりごま','大さじ1'],['しょうゆ','小さじ2'],['砂糖','小さじ1']],['にんじんは細切りにし、沸騰した湯で2分ゆでます。','ほうれん草を別の湯で1分ゆで、冷水に取り、水気を絞って3cm幅に切ります。','すりごま、しょうゆ、砂糖を混ぜ、野菜をあえます。']),
 dish('キャベツときゅうりのさっぱりあえ','副菜','','あえる',10,'🥒',[['キャベツ','150g'],['きゅうり','1本'],['塩','小さじ1/4'],['酢','大さじ1'],['ごま油','小さじ1']],['キャベツは細切り、きゅうりは薄切りにします。','塩を振って5分置き、水気をしっかり絞ります。','酢とごま油を混ぜてあえます。']),
 dish('かぼちゃのほくほく煮','副菜','','煮る',20,'🎃',[['かぼちゃ','250g'],['水','150ml'],['しょうゆ','小さじ2'],['みりん','大さじ1']],['かぼちゃの種とわたを除き、3cm角に切ります。','鍋に皮を下にして並べ、水、しょうゆ、みりんを加えます。','落としぶたをし、弱めの中火で15分ほど、竹串がすっと通るまで煮ます。']),
 dish('ブロッコリーのレモンサラダ','副菜','','ゆでる',10,'🥦',[['ブロッコリー','200g'],['トマト','1個'],['レモン汁','小さじ2'],['オリーブ油','小さじ2'],['塩','少々']],['ブロッコリーを小房に分け、沸騰した湯で3分ゆで、水を切ります。','トマトを一口大に切ります。','レモン汁、オリーブ油、塩を混ぜ、野菜とあえます。']),
 dish('きのこと小松菜のおひたし','副菜','','ゆでる',10,'🥬',[['小松菜','150g'],['しめじ','100g'],['だし汁','大さじ3'],['しょうゆ','小さじ2']],['小松菜を沸騰した湯で2分ゆで、冷水に取り、水気を絞って3cm幅に切ります。','しめじをほぐして2分ゆで、水気を切ります。','だし汁としょうゆを合わせ、野菜を浸します。']),
 dish('豆腐とわかめのみそ汁','汁物','','煮る',10,'🥣',[['豆腐','100g'],['乾燥わかめ','2g'],['だし汁','400ml'],['みそ','大さじ1と1/2']],['豆腐をさいの目に切ります。わかめは袋の表示どおりに戻します。','だし汁を温め、豆腐とわかめを入れて2分煮ます。','火を止めてみそを溶き入れます。']),
 dish('玉ねぎとにんじんのスープ','汁物','','煮る',15,'🥣',[['玉ねぎ','1/2個'],['にんじん','1/2本'],['水','400ml'],['顆粒コンソメ','小さじ2'],['こしょう','少々']],['玉ねぎとにんじんを薄切りにします。','鍋に水、野菜、コンソメを入れ、沸騰したら弱火で10分煮ます。','野菜が柔らかくなったら、こしょうで味を調えます。']),
 dish('大根としめじのすまし汁','汁物','','煮る',15,'🍄',[['大根','100g'],['しめじ','80g'],['だし汁','400ml'],['しょうゆ','小さじ1'],['塩','少々']],['大根を薄いいちょう切りにし、しめじをほぐします。','鍋にだし汁と野菜を入れ、弱めの中火で10分ほど煮ます。','大根が柔らかくなったら、しょうゆと塩で味を調えます。'])
];
const aliases={'鶏むね肉':'鶏肉','鶏もも肉':'鶏肉','鶏胸肉':'鶏肉','鶏':'鶏肉','豚こま':'豚肉','豚バラ':'豚肉','豚':'豚肉','サケ':'鮭','さけ':'鮭','サーモン':'鮭','サバ':'さば','人参':'にんじん','玉葱':'玉ねぎ','たまねぎ':'玉ねぎ','ジャガイモ':'じゃがいも','じゃが芋':'じゃがいも','ほうれんそう':'ほうれん草','たまご':'卵','玉子':'卵','エビ':'むきえび','えび':'むきえび','キノコ':'しめじ','きのこ':'しめじ','ナス':'なす'};
function parseIngredients(text){return [...new Set(text.split(/[、,，\s]+/u).filter(Boolean).map(x=>aliases[x]||x))];}
function matches(recipe,ingredient){return recipe.ingredients.some(([name])=>name===ingredient||(ingredient==='トマト'&&name==='トマト缶'));}
function createPlan(input,days){
 const counts=new Map(),proteins=new Map(),methods=new Map();let previous=null;
 const choose=(type,today)=>recipes.filter(r=>r.type===type).map((r,i)=>{
  const match=input.filter(x=>matches(r,x)).length;
  const overlap=today.reduce((n,other)=>n+r.ingredients.filter(([x])=>other.ingredients.some(([y])=>x===y)).length,0);
  const score=match*7-(counts.get(r.name)||0)*22-(type==='主菜'?(proteins.get(r.protein)||0)*4+(methods.get(r.method)||0)*3+(previous?.protein===r.protein?8:0)+(previous?.method===r.method?6:0):0)-overlap*2-i*.01;
  return {r,score};
 }).sort((a,b)=>b.score-a.score)[0].r;
 const plan=[];
 for(let n=0;n<days;n++){const meals=[];for(const type of ['主菜','副菜','汁物']){const r=choose(type,meals);meals.push(r);counts.set(r.name,(counts.get(r.name)||0)+1);}const main=meals[0];proteins.set(main.protein,(proteins.get(main.protein)||0)+1);methods.set(main.method,(methods.get(main.method)||0)+1);previous=main;plan.push(meals);}return plan;
}
if(typeof module!=='undefined')module.exports={recipes,parseIngredients,createPlan,matches};
if(typeof document!=='undefined'){
 const $=id=>document.getElementById(id);let currentPlan=[];
 const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 for(const item of ['鶏肉','キャベツ','にんじん','豆腐','鮭','卵']){const b=document.createElement('button');b.type='button';b.textContent=`＋ ${item}`;b.onclick=()=>{const items=parseIngredients($('ingredients').value);if(!items.includes(item))items.push(item);$('ingredients').value=items.join('、');};$('chips').append(b);}
 $('days').oninput=()=>{$('day-count').value=`${$('days').value}日分`;};
 function render(){const input=parseIngredients($('ingredients').value);const days=Number($('days').value);currentPlan=createPlan(input,days);$('menu-count').textContent=`${days}日分の献立`;
 const used=input.filter(x=>currentPlan.flat().some(r=>matches(r,x)));const unused=input.filter(x=>!used.includes(x));
 $('summary').textContent=input.length?`${used.length?`活用する食材：${used.join('・')}。`:'入力食材に対応するレシピはありません。'}${unused.length?`今回使えなかった食材：${unused.join('・')}。`:''}不足する材料はレシピでご確認ください。`:'肉・魚・大豆製品と野菜を組み合わせたおすすめ献立です。主食のごはんを添えてどうぞ。';
 $('menus').innerHTML=currentPlan.map((meals,i)=>`<article class="menu-card"><div class="card-head"><span class="day-label">DAY <b>${String(i+1).padStart(2,'0')}</b></span><span class="theme">${escape(meals[0].protein)} × ${escape(meals[0].method)}献立 · ごはんを添えて</span></div>${meals.map((r,j)=>`<div class="dish"><div class="dish-icon" aria-hidden="true">${r.icon}</div><div class="dish-info"><div><span class="dish-label">${r.type}</span><span class="method">${r.method}</span></div><h3>${r.name}</h3><div class="dish-meta">約${r.time}分 · ${r.ingredients.slice(0,2).map(([x])=>x).join('・')}</div></div><button class="recipe-button" data-day="${i}" data-dish="${j}" aria-label="${r.name}のレシピを見る">レシピ <span aria-hidden="true">↗</span></button></div>`).join('')}</article>`).join('');}
 $('planner').onsubmit=e=>{e.preventDefault();render();if(matchMedia('(max-width:760px)').matches)$('summary').scrollIntoView({behavior:'smooth',block:'start'});};
 $('menus').onclick=e=>{const button=e.target.closest('[data-day]');if(!button)return;const r=currentPlan[Number(button.dataset.day)][Number(button.dataset.dish)];const input=parseIngredients($('ingredients').value);$('recipe-content').innerHTML=`<h2 id="recipe-title">${r.name}</h2><div class="dish-meta">${r.type} / ${r.method} / 約${r.time}分</div><h3>材料（2人分）</h3><ul>${r.ingredients.map(([name,amount])=>`<li>${name} … ${amount}${input.some(x=>matches({ingredients:[[name,amount]]},x))?' <span class="pill">入力した食材</span>':''}</li>`).join('')}</ul><h3>つくり方</h3><ol>${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol><p class="recipe-note">ごはんは1人分150g程度を目安に、お好みの量を添えてください。材料にない食材・調味料は別途ご用意ください。</p>`;$('recipe-dialog').showModal();};
 $('close-dialog').onclick=()=>$('recipe-dialog').close();$('recipe-dialog').onclick=e=>{if(e.target===$('recipe-dialog')){const b=e.target.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)e.target.close();}};render();
}
