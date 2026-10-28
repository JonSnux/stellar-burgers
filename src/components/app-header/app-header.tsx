import { getUserSelector } from '@/services/slices/user-slice';
import { useSelector } from '@/services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader = (): React.JSX.Element => {
  const userName = useSelector(getUserSelector);

  return <AppHeaderUI userName={userName?.name} />;
};
