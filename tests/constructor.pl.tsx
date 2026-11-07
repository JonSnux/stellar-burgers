import { expect, test } from '@playwright/test';

const bunName = 'Краторная булка N-200i';
const fillingName = 'Говяжий метеорит (отбивная)';
const orderNumber = '931';

test.describe('Проверка работы конструктора', function () {
  test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients',
  });

  await page.goto('/');
  });
  test('#1 Страница показывает ингредиенты из мока', async ({ page }) => {
    await expect(page.getByText(bunName)).toBeVisible();
  });
  test('#2 Булка добавляется в конструктор', async ({ page }) => {
    await page
      .locator('li', { hasText: bunName })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await expect(
      page.getByRole('img', { name: `${bunName} (верх)` })
    ).toBeVisible();

    await expect(
      page.getByRole('img', { name: `${bunName} (низ)` })
    ).toBeVisible();
  });
  test('#3 Начинка добавляется в конструктор', async ({ page }) => {
    await page
      .locator('li', { hasText: fillingName })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await expect(page.getByText(fillingName)).toHaveCount(2);
  });
  test('#4 Модалка открывается с данными выбранного ингредиента', async ({ page }) => {
    await page.getByText(fillingName).first().click();
    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: fillingName })
    ).toBeVisible();
  });
  test('#5 Модалка закрывается по крестику', async ({ page }) => {
    await page.getByText(fillingName).first().click();
    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).not.toBeVisible();
  });
  test('#6 Модалка закрывается по оверлею', async ({ page }) => {
    await page.getByText(fillingName).first().click();

  const modalHeading = page.getByRole('heading', {
    name: 'Детали ингредиента',
    });
    await expect(modalHeading).toBeVisible();
    await page.mouse.click(10, 10);
    await expect(modalHeading).not.toBeVisible();
  });
});

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-token',
        domain: 'localhost',
        path: '/',
      },
    ]);
    await page.addInitScript(() =>
      localStorage.setItem('refreshToken', 'test-refresh-token')
    );
    await page.routeFromHAR('tests/hars/ingredients.har', { url: '**/api/ingredients' });
    await page.routeFromHAR('tests/hars/user.har', { url: '**/api/auth/user' });
    await page.routeFromHAR('tests/hars/order.har', { url: '**/api/orders' });
    await page.goto('/');
  });
  test('Заказ оформляется и показывает номер', async ({ page }) => {
    await page
      .locator('li', { hasText: bunName })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await expect(
      page.getByRole('img', { name: `${bunName} (верх)` })
    ).toBeVisible();
    await page
    .locator('li', { hasText: fillingName })
    .getByRole('button', { name: 'Добавить' })
    .click();
    await expect(
      page.getByRole('img', { name: fillingName })
    ).toBeVisible();
    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    await expect(
      page.getByText('Выберите начинку')
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: orderNumber })).toBeVisible();
    await expect(
      page.getByRole('img', { name: `${bunName} (верх)` })
    ).not.toBeVisible();
    await expect(
      page.getByRole('img', { name: `${bunName} (низ)` })
    ).not.toBeVisible();
    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(
      page.getByRole('heading', { name: orderNumber })
    ).not.toBeVisible();
  });
});