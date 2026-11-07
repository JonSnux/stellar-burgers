import reducer, {
  addIngredient,
  clearConstructor,
  deleteIngredient,
  moveIngredientDown,
  moveIngredientUp,
} from './constructor-slice';

import type { TIngredient } from '@utils-types';

const mockMain: TIngredient = {
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
};

const mockBun: TIngredient = {
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
};

describe('редюсер слайса constructorSlice', () => {
  test('1 неизвестный экшен с undefined возвращает начальное состояние', () => {
    const result = reducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual({ bun: null, ingredients: [] });
  });
  test('2 addIngredient добавляет начинку в ingredients', () => {
    const action = addIngredient(mockMain);
    const result = reducer({ bun: null, ingredients: [] }, action);
    expect(result).toEqual({ bun: null, ingredients: [action.payload] });
  });
  test('3 addIngredient добавляет булку в bun', () => {
    const action = addIngredient(mockBun);
    const result = reducer({ bun: null, ingredients: [] }, action);
    expect(result).toEqual({ bun: action.payload, ingredients: [] });
  });
  test('4 deleteIngredient удаляет начинку из ingredients', () => {
    const result = reducer(
      {
        bun: null,
        ingredients: [
          { ...mockMain, id: '1' },
          { ...mockMain, id: '2' },
        ],
      },
      deleteIngredient('1')
    );
    expect(result).toEqual({ bun: null, ingredients: [{ ...mockMain, id: '2' }] });
  });
  test('5 moveIngredientUp меняет начинку местами с соседом сверху', () => {
    const result = reducer(
      {
        bun: null,
        ingredients: [
          { ...mockMain, id: '1' },
          { ...mockMain, id: '2' },
        ],
      },
      moveIngredientUp(1)
    );
    expect(result).toEqual({
      bun: null,
      ingredients: [
        { ...mockMain, id: '2' },
        { ...mockMain, id: '1' },
      ],
    });
  });
  test('6 moveIngredientDown меняет начинку местами с соседом снизу', () => {
    const result = reducer(
      {
        bun: null,
        ingredients: [
          { ...mockMain, id: '1' },
          { ...mockMain, id: '2' },
        ],
      },
      moveIngredientDown(0)
    );
    expect(result).toEqual({
      bun: null,
      ingredients: [
        { ...mockMain, id: '2' },
        { ...mockMain, id: '1' },
      ],
    });
  });
  test('7 clearConstructor удаляет ингредиенты и булку', () => {
    const result = reducer(
      { bun: { ...mockBun, id: 'bun' }, ingredients: [{ ...mockMain, id: '1' }] },
      clearConstructor()
    );
    expect(result).toEqual({ bun: null, ingredients: [] });
  });
});