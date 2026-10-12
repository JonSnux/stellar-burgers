import { BurgerConstructorElementUI } from '@ui';
import { memo } from 'react';

import type { BurgerConstructorElementProps } from './type';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/services/store';
import { deleteIngredient, moveIngredientDown, moveIngredientUp } from '@/services/slices/constructor-slice';

export const BurgerConstructorElement = memo(function BurgerConstructorElement({
  ingredient,
  index,
  totalItems,
}: BurgerConstructorElementProps): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const handleMoveDown = (): void => {
    dispatch(moveIngredientDown(index));
  };

  const handleMoveUp = (): void => {
    dispatch(moveIngredientUp(index));
  };

  const handleClose = (): void => {
    dispatch(deleteIngredient(ingredient.id));
  };

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleClose}
    />
  );
});
