import { FeedInfoUI } from '@ui';
import { useSelector } from '@services/store';
import type {TFeedState, TOrder } from '@utils-types';
import { getOrdersSelector, getTotalOrderSelector, getTotalTodaySelector } from '@/services/slices/feed-slice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const allOrders = useSelector(getOrdersSelector);
  const totalOrders = useSelector(getTotalOrderSelector);
  const totalToday = useSelector(getTotalTodaySelector);
  const feed: TFeedState = {
    orders: allOrders,
    total: totalOrders,
    totalToday: totalToday,
    isLoading: false,
    error: null,
  };
  const readyOrders = getOrders(allOrders, 'done');
  const pendingOrders = getOrders(allOrders, 'pending');
  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
