import {useState} from 'react';
import {Link} from 'react-router-dom';

export default function Register({onRegister}) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handlePasswordInput = event => {
    setPassword(event.target.value);
  };

  const handleEmailInput = event => {
    setEmail(event.target.value);
  };

  const handleSubmitOfRegisterForm = event => {
    event.preventDefault();
    onRegister(password, email);
  };

  return (
    <section className='auth'>
      <h3 className='auth__title'>Регистрация</h3>
      <form className='auth__form' onSubmit={handleSubmitOfRegisterForm}>
        <input className='auth__input' type='email' placeholder='Email' value={email} onChange={handleEmailInput} required></input>
        <input className='auth__input' type='password' placeholder='Пароль' value={password} onChange={handlePasswordInput} required></input>
        <button className='auth__submit-button'>Зарегистрироваться</button>
      </form>
      <p className='auth__btn-caption'>Уже зарегистрированы? <Link to="/signin" className='auth__link'>Войти</Link></p>
    </section>
  );
};
