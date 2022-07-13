import {useState} from 'react';

function Login({onLogin}) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handlePasswordInput = event => {
    setPassword(event.target.value);
  };

  const handleEmailInput = event => {
    setEmail(event.target.value);
  };

  const handleSubmitOfLoginForm = event => {
    event.preventDefault();
    onLogin(password, email);
  };


  return (
    <section className='auth'>
      <h3 className='auth__title'>Вход</h3>
      <form className='auth__form' onSubmit={handleSubmitOfLoginForm}>
        <input className='auth__input' type='email' placeholder='Email' value={email} onChange={handleEmailInput} required></input>
        <input className='auth__input' type='password' placeholder='Пароль' value={password} onChange={handlePasswordInput} required></input>
        <button className='auth__submit-button'>Войти</button>
      </form>
    </section>
  );
};

export default Login;
