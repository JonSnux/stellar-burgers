import { registerUser } from '@/services/slices/user-slice';
import { useDispatch } from '@/services/store';
import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    dispatch(registerUser({name: userName, email, password}));
  };

  return (
    <RegisterUI
      errorText=""
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
