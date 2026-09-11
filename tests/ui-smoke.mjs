import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?`${process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES}/playwright`:'playwright');
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
const errors=[];
try{
 for(const cls of ['knight','mage','ranger','assassin','necromancer','engineer','druid','monk']){
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(`${cls}: ${e.message}`));
  await page.goto(process.env.GAME_URL||'http://127.0.0.1:4173');
  await page.locator(`[data-class="${cls}"]`).click();await page.locator('#start-btn').click();await page.locator('#skills-btn').click();
  await page.locator('.skill-card').first().waitFor();
  assert.equal(await page.locator('.skill-card').count(),6);
  assert.equal(await page.locator('.skill-select').count(),3,'Passives must not contain active slot selectors');
  await page.locator('[data-ui="skill-select"][data-slot="0"][data-choice="3"]').click();
  assert.equal(await page.locator('[data-ui="skill-select"][data-slot="0"][data-choice="3"]').getAttribute('aria-pressed'),'true');
  assert(await page.locator('[data-ui="skill-select"][data-slot="1"][data-choice="3"]').isDisabled());
  await page.locator('[data-ui="learn"][data-node="0"]').click();
  await page.locator('[data-ui="rune"][data-node="0"][data-choice="1"]').click();
  const name=await page.locator('.rune-choice.selected b').first().innerText();
  await page.locator('[data-ui="close"]').click();
  const hud=page.locator('[data-action="skill0"]');
  assert((await hud.locator('small').textContent()).length>0);
  assert.equal(await hud.getAttribute('aria-label'),`1P ${await hud.locator('small').textContent()}`);
  assert(name.includes(await hud.locator('small').textContent()),'Rune name must refresh on HUD');
  await page.reload();await page.locator('#start-btn').click();await page.locator('#skills-btn').click();
  assert.equal(await page.locator('[data-ui="skill-select"][data-slot="0"][data-choice="3"]').getAttribute('aria-pressed'),'true');
  if(process.env.UI_SCREENSHOT&&cls==='knight')await page.screenshot({path:process.env.UI_SCREENSHOT});
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:850,height:800}}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.GAME_URL||'http://127.0.0.1:4173');await page.locator('[data-mode="2"]').click();await page.locator('#start-btn').click();await page.locator('#skills-btn').click();
 await page.locator('[data-ui="player"][data-player="1"]').click();await page.locator('[data-ui="skill-select"][data-slot="0"][data-choice="4"]').click();await page.locator('[data-ui="close"]').click();
 assert.equal(await page.locator('[data-hud-player="1"] [data-action="skill0"] small').textContent(),'얼음 창');
 assert.equal(await page.locator('[data-hud-player="0"] [data-action="skill0"] small').textContent(),'회전베기');
 await context.close();assert.deepEqual(errors,[]);console.log('Browser UI passed: all 8 skill menus, selection, duplicate prevention, rune HUD, save reload and independent 2P selection.');
}finally{await browser.close();}
