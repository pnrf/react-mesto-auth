import {useState} from 'react';

export default function Login({onLogin}) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handlePasswordInput = event => {
    setPassword(event.target.value);
  };

  const handleEmailInput = event => {
    setEmail(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    onLogin(email, password);
  };


  return (
    <section className='auth'>
      <h3 className='auth__title'>Вход</h3>
      <form className='auth__form' onSubmit={handleSubmit}>
        <input className='auth__input' type='email' placeholder='Email' value={email} onChange={handleEmailInput} required></input>
        <input className='auth__input' type='password' placeholder='Пароль' value={password} onChange={handlePasswordInput} required></input>
        <button className='auth__submit-button'>Войти</button>
      </form>
    </section>
  );
};
