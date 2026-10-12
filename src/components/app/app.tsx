import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { ConstructorPage, Feed, ForgotPassword, Login, NotFound404, Profile, ProfileOrders, Register, ResetPassword } from '@pages';
import { Preloader } from '@ui';
import { Routes, Route, useLocation, useNavigate, type Location } from 'react-router-dom';

import type { AppContentProps } from './type';
import type { TIngredient } from '@utils-types';

import '../../index.css';

import styles from './app.module.css';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useDispatch, useSelector } from 'react-redux';
import { getErrorSelector, getIngredients, getIngredientsSelector, getIsLoadingSelector } from '@/services/slices/ingredients-slice';
import { useEffect } from 'react';
import type { AppDispatch } from '@/services/store';
import { getCookie } from '@/utils/cookie';
import { authChecked, getUser } from '@/services/slices/user-slice';

const App = (): React.JSX.Element => {
  const ingredients: TIngredient[] = useSelector(getIngredientsSelector);
  const isIngredientsLoading = useSelector(getIsLoadingSelector);
  const ingredientsError = useSelector(getErrorSelector);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getIngredients());
    if (getCookie('accessToken') || localStorage.getItem('refreshToken')) {
      dispatch(getUser());
    } else {
      dispatch(authChecked());
    }
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

/* Маршруты показываются только когда ингредиенты загружены: без них не
   отрисовать ни конструктор, ни состав заказа. */
const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();
  const state = location.state as { background?: Location } | null;
  const background = state?.background;
  const navigate = useNavigate();

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/login' element={
          <ProtectedRoute unAuth>
            <Login />
          </ProtectedRoute>} />
        <Route path='/register' element={
          <ProtectedRoute unAuth>
            <Register />
          </ProtectedRoute>} />
        <Route path='/forgot-password' element={
          <ProtectedRoute unAuth>
            <ForgotPassword />
          </ProtectedRoute>} />
        <Route path='/reset-password' element={
          <ProtectedRoute unAuth>
            <ResetPassword />
          </ProtectedRoute>} />
        <Route path='/profile' element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>} />
        <Route path='/profile/orders' element={
          <ProtectedRoute>
            <ProfileOrders/>
          </ProtectedRoute>} />
        <Route path='/profile/orders/:number' element={
          <ProtectedRoute>
            <OrderInfo />
          </ProtectedRoute>} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='*' element={<NotFound404/>} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path="/feed/:number"
            element={
              <Modal
                title={''}
                onClose={() => {
                  void navigate(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path="/ingredients/:id"
            element={
              <Modal
                title={'Детали ингредиента'}
                onClose={() => {
                  void navigate(-1);
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <Modal
                  title={''}
                  onClose={() => {
                    void navigate(-1);
                  }}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};
