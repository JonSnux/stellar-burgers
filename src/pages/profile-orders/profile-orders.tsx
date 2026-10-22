import { getOrders, getUserOrdersSelector } from '@/services/slices/user-slice';
import { useDispatch, useSelector } from '@/services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

export const ProfileOrders = (): React.JSX.Element => {
  const orders = useSelector(getUserOrdersSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrders());
  }, [])

  return <ProfileOrdersUI orders={orders} />;
};
