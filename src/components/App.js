import React from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";
import api from "../utils/api";
import AddPlacePopup from "./AddPlacePopup";
import DeleteCardPopup from "./DeleteCardPopup";
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import Footer from "./Footer";
import Header from "./Header";
import ImagePopup from "./ImagePopup";
import Main from "./Main";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import * as auth from "../utils/auth";
import { Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] =
    React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState();
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState();
  const [currentUser, setCurrentUser] = React.useState("");
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const navigate = useNavigate();

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };
  const handleDeleteCardClick = (card) => {
    setSelectedCard(card);
    setIsDeleteCardPopupOpen(true);
  };
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };
  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsDeleteCardPopupOpen(false);
  };

  const handleCardClick = (card) => {
    setIsImagePopupOpen(true);
    setSelectedCard(card);
  };
  const handleCardLike = (card) => {
    const isLiked = card.likes.some((like) => like._id === currentUser._id);
    api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
      setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
    });
  };
  const handleDeleteCard = (cardId) => {
    api.deleteCard(cardId, () =>
      setCards((state) => state.filter((c) => c._id !== cardId))
    );
  };

  const handleUpdateUser = ({ name, about }) => {
    api
      .editProfile({ name, about })
      .then((data) =>
        setCurrentUser({ ...currentUser, name: data.name, about: data.about })
      );
  };
  const handleUpdateAvatar = (link) => {
    api
      .editAvatar(link)
      .then((data) => setCurrentUser({ ...currentUser, avatar: data.avatar }));
  };
  const handleAppPlaceSubmit = ({ title, link }) => {
    api.postCard({ title, link }).then((newCard) => {
      setCards([newCard, ...cards]);
    });
  };

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setEmail("");
    setLoggedIn(false);
  };

  React.useEffect(() => {
    const handleTokenCheck = () => {
      if (localStorage.getItem("jwt")) {
        const jwt = localStorage.getItem("jwt");
        auth
          .checkToken(jwt)
          .then((res) => {
            if (res.data) {
              setEmail(res.data.email);
              setLoggedIn(true);
              navigate("/");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    handleTokenCheck();
  }, [loggedIn, navigate]);

  React.useEffect(() => {
    api.getUserInfo().then((data) => {
      setCurrentUser(data);
    });
  }, []);
  React.useEffect(() => {
    api.getInitialCards().then((data) => {
      setCards(data);
    });
  }, []);
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">
        <Header handleSignOut={handleSignOut} email={email} />
        <Routes>
          <Route
            path="/"
            exact
            element={<ProtectedRoute loggedIn={loggedIn} />}
          >
            <Route
              path="/"
              element={
                <Main
                  onEditProfileClick={handleEditProfileClick}
                  onAddPlaceClick={handleAddPlaceClick}
                  onEditAvatarClick={handleEditAvatarClick}
                  onDeleteCardClick={handleDeleteCardClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  cards={cards}
                />
              }
            />
          </Route>
          <Route exact path="/signup" element={<Register />} />
          <Route
            exact
            path="/signin"
            element={<Login handleLogin={handleLogin} />}
          />
        </Routes>
        <InfoTooltip />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlaceSubmit={handleAppPlaceSubmit}
        />
        <DeleteCardPopup
          isOpen={isDeleteCardPopupOpen}
          onClose={closeAllPopups}
          selectedCard={selectedCard}
          onDeleteCard={handleDeleteCard}
        />
        <ImagePopup
          isOpen={isImagePopupOpen}
          selectedCard={selectedCard}
          onClose={closeAllPopups}
        />
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
