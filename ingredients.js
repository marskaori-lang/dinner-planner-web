'use strict';
// 部位・魚種は独立した名前として保持する。大分類への自動置き換えはしない。
const ingredientCatalog = {
 '鶏肉': ['鶏もも肉','鶏むね肉','鶏ささみ','鶏手羽元','鶏手羽先','鶏ひき肉','鶏肉（部位未指定）'],
 '豚肉': ['豚ロース肉','豚バラ肉','豚こま切れ肉','豚もも肉','豚ひき肉','豚肉（部位未指定）'],
 '牛肉': ['牛こま切れ肉','牛薄切り肉','牛バラ肉','牛ひき肉','牛ステーキ肉','合いびき肉','牛肉（部位未指定）'],
 '魚・魚介': ['ホッケ','鮭','サバ','アジ','ブリ','タラ','サンマ','イワシ','カレイ','マグロ','カツオ','タイ','むきえび','いか','あさり','しらす'],
 '野菜': ['キャベツ','白菜','レタス','玉ねぎ','長ねぎ','にんじん','大根','じゃがいも','さつまいも','里芋','かぼちゃ','なす','ピーマン','パプリカ','トマト','ミニトマト','きゅうり','ブロッコリー','カリフラワー','ほうれん草','小松菜','豆苗','チンゲン菜','水菜','もやし','ごぼう','れんこん','オクラ','にら','春菊','かぶ','アスパラガス','いんげん','ズッキーニ','たけのこ水煮','とうもろこし','しょうが','にんにく','大葉'],
 'きのこ': ['しめじ','えのき','しいたけ','まいたけ','エリンギ','マッシュルーム'],
 '卵・豆・海藻': ['卵','豆腐','厚揚げ','油揚げ','納豆','大豆水煮','ひよこ豆水煮','枝豆','乾燥わかめ','ひじき','切り干し大根','焼きのり'],
 '加工食品・乳製品': ['ちくわ','かにかま','はんぺん','ツナ缶','サバ缶','トマト缶','コーン缶','ベーコン','ウインナー','ハム','チーズ','牛乳','ヨーグルト','春雨','こんにゃく','しらたき','高野豆腐','梅干し','かつお節','餃子の皮'],
 '主食': ['米','うどん','そば','中華麺','パスタ','パン粉','小麦粉']
};
const normalizeKey = value => value.normalize('NFKC').trim().replace(/[\s・･]/g,'').replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
const ingredientAliases = new Map();
for (const item of Object.values(ingredientCatalog).flat()) ingredientAliases.set(normalizeKey(item),item);
const aliasGroups = {
 '鶏もも肉':['鶏もも','鶏モモ肉','鶏腿肉','とりもも','とりもも肉'],
 '鶏むね肉':['鶏むね','鶏胸肉','とりむね','とりむね肉'],
 '鶏ささみ':['ささみ','鶏ささ身','とりささみ'], '鶏手羽元':['手羽元'], '鶏手羽先':['手羽先'],
 '鶏ひき肉':['鶏挽肉','鶏挽き肉','鶏ミンチ','とりひき肉'],
 '豚ロース肉':['豚ロース'], '豚バラ肉':['豚バラ','豚ばら'],
 '豚こま切れ肉':['豚こま','豚コマ肉','豚こま肉','豚小間','豚小間切れ','豚こま切れ'],
 '豚もも肉':['豚もも','豚モモ'], '豚ひき肉':['豚挽肉','豚挽き肉','豚ミンチ'],
 '牛こま切れ肉':['牛こま','牛コマ肉','牛こま肉','牛小間切れ','牛こま切れ'],
 '牛薄切り肉':['牛薄切り','牛うす切り','牛薄切肉'], '牛バラ肉':['牛バラ','牛ばら'],
 '牛ひき肉':['牛挽肉','牛挽き肉','牛ミンチ'], '牛ステーキ肉':['ステーキ肉','牛ステーキ','牛肉ステーキ用'],
 '合いびき肉':['合挽き肉','合挽肉','合い挽き肉','合いびき','合い挽き'],
 '鶏肉（部位未指定）':['鶏肉','とり肉'], '豚肉（部位未指定）':['豚肉'], '牛肉（部位未指定）':['牛肉'],
 '鮭':['さけ','サーモン'], 'むきえび':['えび','エビ','むきエビ'],
 '豆苗':['とうみょう','トウミョウ'], 'にんじん':['人参'], '玉ねぎ':['玉葱','たまねぎ'], '長ねぎ':['長葱','ねぎ'],
 'じゃがいも':['じゃが芋','馬鈴薯'], 'ほうれん草':['ほうれんそう'], '卵':['たまご','玉子'],
 '豆腐':['木綿豆腐','絹ごし豆腐','絹豆腐'], '大根':['だいこん'], '大豆水煮':['大豆','水煮大豆'],
 'ツナ缶':['ツナ','シーチキン'], '乾燥わかめ':['わかめ'], 'トマト缶':['カットトマト缶','ホールトマト缶']
};
for (const [canonical,names] of Object.entries(aliasGroups)) for (const name of names) ingredientAliases.set(normalizeKey(name),canonical);
function normalizeIngredient(value) { const clean=value.normalize('NFKC').trim(); return ingredientAliases.get(normalizeKey(clean)) || clean; }
function parseIngredients(text) { return [...new Set(text.split(/[、,，;；\s]+/u).filter(Boolean).map(normalizeIngredient))]; }
const animalIngredients = new Set(['鶏肉','豚肉','牛肉','魚・魚介'].flatMap(category=>ingredientCatalog[category]).concat(['ベーコン','ウインナー','ハム','ツナ缶','サバ缶','ちくわ','かにかま','はんぺん']));
const proteinIngredients = new Set([...animalIngredients,'卵','豆腐','厚揚げ','納豆','大豆水煮','ひよこ豆水煮','高野豆腐']);
function isAnimalIngredient(name) { return animalIngredients.has(name) || /肉|ホッケ|ひき肉/.test(name); }
const pantryIngredients = new Set(['水','湯','塩','こしょう','しょうゆ','みそ','砂糖','酒','みりん','酢','油','ごま油','オリーブ油','バター','だし汁','顆粒コンソメ','鶏がらスープの素','片栗粉','小麦粉','パン粉','すりごま','白ごま','マヨネーズ','ケチャップ','ウスターソース','中濃ソース','ポン酢','レモン汁','カレー粉','カレールウ','豆板醤','オイスターソース','練りからし','めんつゆ','にんにく','しょうが','はちみつ','乾燥パセリ','七味唐辛子','鶏がらスープ','中華だし','粒マスタード','コチュジャン','ピザ用チーズ']);
if (typeof module !== 'undefined') module.exports={ingredientCatalog,normalizeIngredient,parseIngredients,animalIngredients,proteinIngredients,isAnimalIngredient,pantryIngredients};

if(typeof window!=='undefined') window.DinnerIngredients={ingredientCatalog,normalizeIngredient,parseIngredients,animalIngredients,proteinIngredients,isAnimalIngredient,pantryIngredients};
