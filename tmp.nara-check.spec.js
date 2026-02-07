const { test } = require('@playwright/test');

test('check library section', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  const exists = await page.locator('#library-hero-lite-heading').count();
  console.log('LIB_HEADING_COUNT', exists);
  if (exists) {
    const bb = await page.locator('#library-hero-lite-heading').boundingBox();
    console.log('LIB_HEADING_BBOX', JSON.stringify(bb));
    const txt = await page.locator('#library-hero-lite-heading').innerText();
    console.log('LIB_HEADING_TEXT', txt);
  }
});
