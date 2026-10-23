import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useDispatch, useSelector } from '@services/store';
import { useEffect } from 'react';
import { getFeeds, getOrdersSelector } from '@/services/slices/feed-slice';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(getOrdersSelector);
  useEffect(() => {
    dispatch(getFeeds());
  }, []);

  const handleGetFeeds = (): void => {
    dispatch(getFeeds());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
