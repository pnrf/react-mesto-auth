import logo from '../images/logo-white.svg';
import {Link} from 'react-router-dom';

function Header(props) {
  return (
    <header className="header">
      <img src={logo} alt="Логотип" className="header__logo" />
      <div className='header__auth'>
        <p className='header__text'>{props.mail}</p>
        <Link to={props.route} className='header__text header__link' onClick={props.onClick}>{props.title}</Link>
      </div>
    </header>
  )
};

export default Header;
