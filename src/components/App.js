import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import '../index.css';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/api';
import {signUp, signIn, checkToken} from '../utils/apiAuth';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmationPopup from './ConfirmationPopup'
import ImagePopup from './ImagePopup';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import checkmarkImg from '../images/checkmark.svg'
import crossImg from '../images/cross.svg'

export default function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [isConfirmationPopupOpen, setConfirmationPopupOpen] = React.useState(null);
  const [isLoading, setLoading] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [emailValue, setEmailValue] = React.useState(null);
  const [popupImage, setPopupImage] = React.useState(" ");
  const [popupMessage, setPopupMessage] = React.useState(" ");
  const [infoTooltip, setInfoTooltip] = React.useState(false);
  const navigate = useNavigate();

  function handleLogin(email, password) {
    signIn(email, password)
      .then((res) => {
        localStorage.setItem('jwt', res.token);
        setIsLoggedIn(true);
        setEmailValue(email);
        navigate("/");
      })
      .catch(() => {
        setPopupImage(crossImg);
        setPopupMessage('Что-то пошло не так! Попробуйте еще раз.');
        handleInfoTooltip();
      });
  };

  function handleRegister(email, password) {
    signUp(email, password)
      .then(() => {
        setPopupImage(checkmarkImg);
        setPopupMessage('Вы успешно зарегистрировались!');
        navigate("/signin");
      })
      .catch(() => {
        setPopupImage(crossImg);
        setPopupMessage('Что-то пошло не так! Попробуйте еще раз.');
      })
      .finally(handleInfoTooltip);
  };

  function handleLogOut() {
    setIsLoggedIn(false);
    localStorage.removeItem('jwt');
    setEmailValue(null);
    navigate("/signin");
  };

  function handleInfoTooltip() {
    setInfoTooltip(true);
  };

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      checkToken(jwt)
        .then((res) => {
          if (res) {
            setIsLoggedIn(true);
            setEmailValue(res.data.email);
            navigate('/');
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()]).then(([profileInfo, card]) => {
      setCurrentUser(profileInfo);
      setCards(card);
    }).catch((err) => {
      console.error(err);
    })
  }, [])

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    if (!isLiked) {
      api.addCardLike(card._id).then((newCard) => {
        setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
      }).catch((err) => {
        console.error(err);
      });
    } else {
      api.deleteCardLike(card._id).then((newCard) => {
        setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
      }).catch((err) => {
        console.error(err);
      });
    }
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  };

  function handleUpdateUser(data) {
    setLoading(true);
    api.updateUserInfo(data)
      .then((newUser) => {
        setCurrentUser(newUser);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false)
      });
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  };

  function handleUpdateAvatar(data) {
    setLoading(true);
    api.updateProfileAvatar(data)
      .then((newAvatar) => {
        setCurrentUser(newAvatar);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false)
      });
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  };

  function handleAddPlaceSubmit(data) {
    setLoading(true);
    api.addNewCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false)
      });
  }

  function handleConfimationClick(card) {
    setConfirmationPopupOpen(card);
  }

  function handleCardDelete(card) {
    api.removeCard(card._id)
      .then(() => {
        setCards((items) => items.filter((c) => c._id !== card._id && c));
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setSelectedCard(null);
    setConfirmationPopupOpen(null);
    setInfoTooltip(false);
  }

  function closePopupWithEsc(event) {
    if (event.key === 'Escape') {
      closeAllPopups();
    }
  }

  function closePopupWithClickOnOverlay(event) {
     if (event.target.classList.contains('popup_opened')) {
      closeAllPopups();
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">

        <Routes>
          <Route exact path='/'
            element={
              <>
                <Header
                  title='Выйти'
                  route=''
                  email={emailValue}
                  onClick={handleLogOut}
                />
                <ProtectedRoute
                  component={Main}
                  isLoggedIn={isLoggedIn}
                  onEditProfile = {handleEditProfileClick}
                  onAddPlace = {handleAddPlaceClick}
                  onEditAvatar = {handleEditAvatarClick}
                  onCardClick = {handleCardClick}
                  onCardLike = {handleCardLike}
                  cards={cards}
                  onConfirmCardDelete = {handleConfimationClick}
                />
              </>
            }
          />

          <Route path='/signup'
            element={
              <>
                <Header
                  title='Войти'
                  route='/signin'
                />
                <Register
                  onRegister={handleRegister}
                />
              </>
            }
          />

          <Route path='/signin'
            element={
              <>
                <Header
                  title='Регистрация'
                  route='/signup'
                />
                <Login
                  onLogin={handleLogin}
                />
              </>
            }
          />

          <Route exact path="*"
            element={
              isLoggedIn ? <Navigate to="/" /> : <Navigate to="/signin"/>
            }
          />
        </Routes>

        <Footer />

        <InfoTooltip
          image={popupImage}
          message={popupMessage}
          isOpen={infoTooltip}
          onClose = {closeAllPopups}
        />

        <EditProfilePopup
          isOpen = {isEditProfilePopupOpen}
          onClose = {closeAllPopups}
          onCloseEsc = {closePopupWithEsc}
          onCloseOverlay = {closePopupWithClickOnOverlay}
          onUpdateUser = {handleUpdateUser}
          isLoading = {isLoading}
        />

        <EditAvatarPopup
          isOpen = {isEditAvatarPopupOpen}
          onClose = {closeAllPopups}
          onCloseEsc = {closePopupWithEsc}
          onCloseOverlay = {closePopupWithClickOnOverlay}
          onUpdateAvatar = {handleUpdateAvatar}
          isLoading = {isLoading}
        />

        <AddPlacePopup
          isOpen = {isAddPlacePopupOpen}
          onClose = {closeAllPopups}
          onCloseEsc = {closePopupWithEsc}
          onCloseOverlay = {closePopupWithClickOnOverlay}
          onAddPlace = {handleAddPlaceSubmit}
          isLoading = {isLoading}
        />

        <ConfirmationPopup
          card = {isConfirmationPopupOpen}
          onClose = {closeAllPopups}
          name = 'confirm-deletion'
          title = 'Вы уверены?'
          onCardDelete = {handleCardDelete}
        />

        <ImagePopup
          card = {selectedCard}
          onClose = {closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}
