import { useState, useEffect } from 'react';
import { Logo, FormRow, Alert , FormRowSelect } from '../components';
import Wrapper from '../assets/wrappers/RegisterPage';
import { useAppContext } from '../context/appContext';
import { useNavigate } from 'react-router-dom';
const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
  group:'MVO',
  groupOptions: ['MVO','CM NOKIA','CM ERICSSON','CM HUAWEI','MANAGEMENT','PLANNING','ADMIN']
};

const Register = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialState);
  const { user, isLoading, showAlert, displayAlert, setupUser } =
    useAppContext();

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember , group } = values;
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }
    const currentUser = { name, email, password , group};
    if (isMember) {
      setupUser({
        currentUser,
        endPoint: 'login',
        alertText: 'Login Successful! Redirecting...',
      });
    } else {
      setupUser({
        currentUser,
        endPoint: 'register',
        alertText: 'User Created! Redirecting...',
      });
    }
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [user, navigate]);

  return (   <Wrapper className='full-page'>
  <form className='form' onSubmit={onSubmit}>
    <Logo />
    <h3>{values.isMember ? 'Login' : 'Register'}</h3>
    {showAlert && <Alert />}
    {/* name input */}
    {!values.isMember && (
      <>
        <FormRow
          type='text'
          name='name'
          value={values.name}
          handleChange={handleChange}
        />
        <FormRowSelect
          name='group'
          labelText='group'
          value={values.group}
          handleChange={handleChange}
          list={values.groupOptions}
        />
      </>
    )}
    {/* email input */}
    <FormRow
      type='email'
      name='email'
      value={values.email}
      handleChange={handleChange}
    />
    {/* password input */}
    <FormRow
      type='password'
      name='password'
      value={values.password}
      handleChange={handleChange}
    />
    <button type='submit' className='btn btn-block' disabled={isLoading}>
      submit
    </button>
    <button
      type='button'
      className='btn btn-block btn-hipster'
      disabled={isLoading}
      onClick={() => {
        setupUser({
          currentUser: { email: 'testUser@test.com', password: 'secret' },
          endPoint: 'login',
          alertText: 'Login Successful! Redirecting...',
        });
      }}
    >
      {isLoading ? 'loading...' : 'demo app'}
    </button>
    <p>
      {values.isMember ? 'Not a member yet?' : 'Already a member?'}
      <button type='button' onClick={toggleMember} className='member-btn'>
        {values.isMember ? 'Register' : 'Login'}
      </button>
    </p>
  </form>
</Wrapper>
);
};

export default Register;