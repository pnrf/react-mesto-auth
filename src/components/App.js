import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import '../index.css';

import { CurrentUserContext } from '../contexts/CurrentUserContext';

import api from '../utils/api';
import {baseUrl, signUp, signIn, getToken} from '../utils/apiAuth';

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


function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false)
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false)
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false)
  const [selectedCard, setSelectedCard] = React.useState(null)
  const [isConfirmationPopupOpen, setConfirmationPopupOpen] = React.useState(null)

  const [isLoading, setLoading] = React.useState(false)

  const [currentUser, setCurrentUser] = React.useState({})
  const [cards, setCards] = React.useState([])

  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [emailValue, setEmailValue] = React.useState(null)
  const [popupImage, setPopupImage] = React.useState("")
  const [popupMessage, setPopupMessage] = React.useState("")
  const [infoTooltip, setInfoTooltip] = React.useState(false)


  function onLogin(password, email) {
    signIn(password, email).then((res) => {
      localStorage.setItem('jwt', res.token);
      setIsLoggedIn(true);
      setEmailValue(email);
      <Redirect to='/' />
    }).catch(() => {
      setPopupImage(crossImg);
      setPopupMessage('Что-то пошло не так! Попробуйте еще раз.')
    }).finally(handleInfoTooltip);
  };

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      getToken(jwt).then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setEmailValue(res.data.email);
        }
      }).catch((err) => {
        console.error(err);
      });
    }
  }, []);


  function handleInfoTooltip() {
    setInfoTooltip(true);
  };

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
    api.updateUserInfo(data).then((newUser) => {
      setCurrentUser(newUser);
      closeAllPopups();
    }).catch((err) => {
      console.error(err);
    }).finally(() => {setLoading(false)});
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  };

  function handleUpdateAvatar(data) {
    setLoading(true);
    api.updateProfileAvatar(data).then((newAvatar) => {
      setCurrentUser(newAvatar);
      closeAllPopups();
    }).catch((err) => {
      console.error(err);
    }).finally(() => {setLoading(false)});
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  };

  function handleAddPlaceSubmit(data) {
    setLoading(true);
    api.addNewCard(data).then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    }).catch((err) => {
      console.error(err);
    }).finally(() => {setLoading(false)});
  }

  function handleConfimationClick(card) {
    setConfirmationPopupOpen(card);
  }

  function handleCardDelete(card) {
    api.removeCard(card._id).then(() => {
      setCards((items) => items.filter((c) => c._id !== card._id && c));
    }).catch((err) => {
      console.error(err);
    });
  }

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setSelectedCard(null);
    setConfirmationPopupOpen(null);
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

        <Switch>
          <Route exact path='/'>
            <Header title='Выход' route='' />
            <ProtectedRoute
              component={Main}
              isLogged={isLoggedIn}
              onEditProfile = {handleEditProfileClick}
              onAddPlace = {handleAddPlaceClick}
              onEditAvatar = {handleEditAvatarClick}
              onCardClick = {handleCardClick}
              onCardLike = {handleCardLike}
              cards={cards}
              onConfirmCardDelete = {handleConfimationClick}
            >
            </ProtectedRoute>
          </Route>

          <Route path='/signup'>
            <Header title='Регистрация' route='/signup' />
            <Register />
          </Route>

          <Route path='/signin'>
            <Header title='Войти' route='/signin' />
            <Login onLogin={onLogin}/>
          </Route>
        </Switch>

        {/* <Main
          onEditProfile = {handleEditProfileClick}
          onAddPlace = {handleAddPlaceClick}
          onEditAvatar = {handleEditAvatarClick}
          onCardClick = {handleCardClick}
          onCardLike = {handleCardLike}
          cards={cards}
          onConfirmCardDelete = {handleConfimationClick}
        /> */}

        <Footer />

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

export default App;
