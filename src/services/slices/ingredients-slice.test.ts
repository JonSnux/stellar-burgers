import reducer, { getIngredients } from './ingredients-slice';

import type { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '01',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 250,
    price: 100,
    image: 'https://example.com/bun.png',
    image_large: 'https://example.com/bun-large.png',
    image_mobile: 'https://example.com/bun-mobile.png',
  },
  {
    _id: '02',
    name: 'Говяжья котлета',
    type: 'main',
    proteins: 25,
    fat: 15,
    carbohydrates: 5,
    calories: 300,
    price: 200,
    image: 'https://example.com/meat.png',
    image_large: 'https://example.com/meat-large.png',
    image_mobile: 'https://example.com/meat-mobile.png',
  },
  {
    _id: '03',
    name: 'Сыр',
    type: 'main',
    proteins: 15,
    fat: 25,
    carbohydrates: 2,
    calories: 150,
    price: 50,
    image: 'https://example.com/cheese.png',
    image_large: 'https://example.com/cheese-large.png',
    image_mobile: 'https://example.com/cheese-mobile.png',
  },
];

describe('редюсер слайса ingredients', () => {
  test('1 неизвестный экшен возвращает начальное состояние', () => {
    const result = reducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual({ ingredients: [], isLoading: false, error: null });
  });
  test('2 pending включает загрузку и сбрасывает ошибку', () => {
    const result = reducer(
      { ingredients: [], isLoading: false, error: { message: 'Старая ошибка' } },
      { type: getIngredients.pending.type }
    );
    expect(result).toEqual({ ingredients: [], isLoading: true, error: null });
  });
  test('3 fulfilled выключает загрузку и записывает ingredients из ответа', () => {
    const result = reducer(
      { ingredients: [], isLoading: true, error: null },
      { type: getIngredients.fulfilled.type, payload: mockIngredients }
    );
    expect(result).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null,
    });
  });
  test('4 rejected выключает загрузку и записывает объект ошибки', () => {
    const result = reducer(
      { ingredients: [], isLoading: true, error: null },
      { type: getIngredients.rejected.type, error: { message: 'Сеть упала' } }
    );
    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: { message: 'Сеть упала' },
    });
  });
});