import { chromium } from '@playwright/test';

async function recordOrderHar() {
  const browser = await chromium.launch();

  const context = await browser.newContext({
    recordHar: {
      path: 'tests/hars/order.har',
      content: 'embed',
      mode: 'minimal',
      urlFilter: '**/api/orders',
    },
  });

  await context.addCookies([
    {
      name: 'accessToken',
      value: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZWVlOTRhOWMxN2M0NmViNjc2MjM3MiIsImlhdCI6MTc5NDA0MjE4NiwiZXhwIjoxNzk0MDQzMzg2fQ.LZytSSAfowzrIxOuf9QE48fY2jM-0M8ijyJ6wfaTvg4',
      domain: 'localhost',
      path: '/',
    },
  ]);

  await context.addInitScript(() => {
    localStorage.setItem('refreshToken', 'a5afa8d194e6f3243fb31f4a2822aba4f9996fc69a88b4df55cf942e7b34cbebb0c7e6baf4164ea5');
  });

  const page = await context.newPage();

  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients',
  });

  await page.routeFromHAR('tests/hars/user.har', {
    url: '**/api/auth/user',
  });

  await page.goto('http://localhost:4000');

  await page
    .locator('li', { hasText: 'Краторная булка N-200i' })
    .getByRole('button', { name: 'Добавить' })
    .click();

  await page
    .locator('li', { hasText: 'Говяжий метеорит (отбивная)' })
    .getByRole('button', { name: 'Добавить' })
    .click();

  const orderResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes('/api/orders') &&
      response.request().method() === 'POST'
  );

  await page.getByRole('button', { name: 'Оформить заказ' }).click();

  const orderResponse = await orderResponsePromise;

  console.log('Order response status:', orderResponse.status());

  await context.close();
  await browser.close();
}

recordOrderHar();