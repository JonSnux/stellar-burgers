import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';

import type { TAppHeaderUIProps } from './type';
import styles from './app-header.module.css';
import { NavLink } from 'react-router-dom';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink to="/" className={({ isActive }) =>
        `text text_type_main-medium text_color_inactive pt-4 pb-4 ${
          styles.link
        } ${isActive ? styles.link_active : ''}`
      } end>
          <BurgerIcon type={'primary'} />
          <p className="text text_type_main-default ml-2 mr-10">Конструктор</p>
        </NavLink>
        <NavLink to="/feed" className={({ isActive }) =>
        `text text_type_main-medium text_color_inactive pt-4 pb-4 ${
          styles.link
        } ${isActive ? styles.link_active : ''}`
      } end>
          <ListIcon type={'primary'} />
          <p className="text text_type_main-default ml-2">Лента заказов</p>
        </NavLink>
      </div>
      <div className={styles.logo}>
        <Logo className="" />
      </div>
      <div className={styles.link_position_last}>
        <NavLink to="/profile" className={({ isActive }) =>
        `text text_type_main-medium text_color_inactive pt-4 pb-4 ${
          styles.link
        } ${isActive ? styles.link_active : ''}`
      } end>
          <ProfileIcon type={'primary'} />
          <p className="text text_type_main-default ml-2">
            {userName ?? 'Личный кабинет'}
          </p>
        </NavLink>
      </div>
    </nav>
  </header>
);
