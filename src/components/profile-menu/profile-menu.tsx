import { logoutUser } from '@/services/slices/user-slice';
import { useDispatch, type AppDispatch } from '@/services/store';
import { ProfileMenuUI } from '@ui';
import { useLocation } from 'react-router-dom';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = (): void => {
    dispatch(logoutUser());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
