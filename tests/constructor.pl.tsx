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
    await expect(page.getByTestId('constructor-bun-1')).toContainText(`${bunName} (верх)`);
    await expect(page.getByTestId('constructor-bun-2')).toContainText(`${bunName} (низ)`);
    
  });
  test('#3 Начинка добавляется в конструктор', async ({ page }) => {
    await page
      .locator('li', { hasText: fillingName })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await expect(page.getByTestId('constructor-ingredients')).toContainText(fillingName);
  });
  test('#4 Модалка открывается с данными выбранного ингредиента', async ({ page }) => {
    const modal = page.getByTestId('modal');
    await page.getByText(fillingName).click();
    await expect(modal.getByText('Детали ингредиента')).toBeVisible();
    await expect(modal.getByRole('heading', { name: fillingName })).toBeVisible();
  });
  test('#5 Модалка закрывается по крестику', async ({ page }) => {
    const modal = page.getByTestId('modal');
    await page.getByText(fillingName).click();
    await expect(modal.getByText('Детали ингредиента')).toBeVisible();
    await modal.getByRole('button', { name: 'Закрыть' }).click();
    await expect(modal).not.toBeVisible();
  });
  test('#6 Модалка закрывается по оверлею', async ({ page }) => {
    const modal = page.getByTestId('modal');
    await page.getByText(fillingName).click();
    await expect(modal.getByText('Детали ингредиента')).toBeVisible();
    await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });
    await expect(modal).not.toBeVisible();
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
    await expect(page.getByTestId('constructor-bun-1')).toContainText(`${bunName} (верх)`);
    await page
      .locator('li', { hasText: fillingName })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await expect(page.getByTestId('constructor-ingredients')).toContainText(fillingName);
    await page.getByRole('button', { name: 'Оформить заказ' }).click();
    await expect(page.getByTestId('constructor-ingredients')).toContainText('Выберите начинку');
    await expect(page.getByTestId('order-number')).toHaveText(orderNumber);
    await expect(page.getByTestId('constructor-bun-1')).not.toBeVisible();
    await expect(page.getByTestId('constructor-ingedients')).not.toBeVisible();
    await expect(page.getByTestId('constructor-bun-2')).not.toBeVisible();
    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByTestId('order-number')).not.toBeVisible();
  });
});