import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import type { TConstructorIngredient } from '@utils-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserSelector } from '@/services/slices/user-slice';
import { clearConstructor, getConstructorSelector } from '@/services/slices/constructor-slice';
import { clearOrder, getOrderModalDataSelector, getOrderRequestSelector, orderBurger } from '@/services/slices/order-slice';
import type { AppDispatch } from '@/services/store';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector(getUserSelector);
  const constructorItems = useSelector(getConstructorSelector);
  const orderRequest = useSelector(getOrderRequestSelector);
  const orderModalData = useSelector(getOrderModalDataSelector);

  const onOrderClick = (): void => {
    if (!user) {
      navigate('/login');
      return
    }
    if (!constructorItems.bun || orderRequest) return;
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];
    dispatch(orderBurger(ingredientIds))
      .unwrap()
      .then(() => dispatch(clearConstructor()));
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
