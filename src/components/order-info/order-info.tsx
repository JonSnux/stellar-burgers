import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';

import type { TIngredient } from '@utils-types';
import { type AppDispatch, useDispatch, useSelector } from '@/services/store';
import { useParams } from 'react-router-dom';
import { getOrdersSelector } from '@/services/slices/feed-slice';
import { getIngredientsSelector } from '@/services/slices/ingredients-slice';
import { getOrderByNumber, getOrderDataSelector } from '@/services/slices/order-slice';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const {number} = useParams();
  const orders = useSelector(getOrdersSelector);
  const ingredients = useSelector(getIngredientsSelector);
  const loadOrder = useSelector(getOrderDataSelector);
  const feedOrder = orders.find((order) => order.number === Number(number));
  const orderData = feedOrder ?? loadOrder;

  useEffect(() => {
    if (!feedOrder) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [number, feedOrder]);
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
