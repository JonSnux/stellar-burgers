import { getUserSelector } from '@/services/slices/user-slice';
import { useSelector } from '@/services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader = (): React.JSX.Element => {
  /* TODO: Получите имя пользователя из хранилища */
  const userName = useSelector(getUserSelector);

  return <AppHeaderUI userName={userName?.name} />;
};
