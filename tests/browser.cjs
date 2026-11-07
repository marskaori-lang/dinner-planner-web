'use strict';
// 開発環境のPlaywrightとChromiumで実行。サイトの利用には不要。
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try {
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const errors=[],external=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:8010/')&&!r.url().startsWith('data:'))external.push(r.url());});
  await page.goto('http://127.0.0.1:8010/');
  assert.equal(await page.locator('.menu-card').count(),3);
  await page.locator('#ingredients').fill('鶏もも、鶏モモ肉');await page.locator('#add-ingredients').click();
  assert.equal(await page.locator('#selected-count').innerText(),'1');
  assert.equal(await page.locator('#selected-ingredients button').innerText(),'鶏もも肉 ×');
  await page.locator('.catalog > summary').click();
  await page.locator('.category > summary').filter({hasText:/^魚・魚介/}).click();
  await page.locator('[data-ingredient="ホッケ"]').click();
  assert.equal(await page.locator('#selected-count').innerText(),'2');
  await page.getByRole('button',{name:'鶏もも肉を解除',exact:true}).click();
  assert.equal(await page.locator('#selected-count').innerText(),'1');
  await page.locator('#days').fill('7');await page.locator('.primary').click();
  assert.equal(await page.locator('.menu-card').count(),7);
  for(const text of await page.locator('.menu-card .dish:first-of-type h3').allTextContents())assert.ok(text.includes('ホッケ'));
  // Query each card explicitly: the first row is always the main dish.
  for(const card of await page.locator('.menu-card').all())assert.ok((await card.locator('h3').first().innerText()).includes('ホッケ'));
  assert.ok((await page.locator('#summary').innerText()).includes('再登場'));
  assert.ok((await page.locator('.missing').first().innerText()).includes('大根'));
  await page.locator('.recipe-button').first().click();
  assert.equal(await page.locator('#recipe-title').innerText(),'ホッケの塩焼き');
  assert.ok((await page.locator('#recipe-content').innerText()).includes('150g'));
  await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').isVisible(),false);
  // Editing conditions must not silently relabel an existing recipe's ingredients.
  await page.locator('#ingredients').fill('大根');await page.locator('#add-ingredients').click();
  assert.ok((await page.locator('#summary').innerText()).includes('条件が変わりました'));
  await page.locator('.recipe-button').first().click();
  assert.ok((await page.locator('#recipe-content .recipe-note').first().innerText()).includes('大根 150g'));
  await page.getByRole('button',{name:'レシピを閉じる'}).click();
  await page.locator('#clear-ingredients').click();
  await page.locator('#ingredients').fill('鹿肉');await page.locator('.primary').click();
  assert.ok((await page.locator('#summary').innerText()).includes('対応レシピなし：鹿肉'));
  assert.equal(await page.locator('.recipe-button').count(),0);
  await page.locator('#clear-ingredients').click();
  await page.locator('#ingredients').fill('鶏むね肉、にんじん');await page.locator('.primary').click();
  assert.equal(await page.locator('#ingredients').inputValue(),'');
  assert.equal(await page.locator('#selected-count').innerText(),'2');
  for(const card of await page.locator('.menu-card').all())assert.ok((await card.locator('h3').first().innerText()).includes('鶏むね肉'));
  // Untrusted free text is displayed as text, never executed as markup.
  await page.locator('#ingredients').fill('<img/src=x/onerror=alert(1)>');await page.locator('.primary').click();
  assert.equal(await page.locator('#selected-ingredients img, #summary img').count(),0);
  await page.locator('.catalog > summary').click();
  for(const width of [320,360,390,768,1440]){
   await page.setViewportSize({width,height:900});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`horizontal overflow at ${width}px`);
  }
  await page.locator('#clear-ingredients').click();await page.locator('.primary').click();
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:'/tmp/dinner-planner-web-mobile.png',fullPage:true});
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  console.log('PASS: free input + category selection, deduplication/removal, seven-day exact fish and chicken matching, missing ingredients, unsupported food, stable recipe conditions, dialog/keyboard, injection protection, 320–1440px layouts, no external requests or JS errors.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
