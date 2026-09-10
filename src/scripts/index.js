import '../pages/index.css';

import { createCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import api from './utils/api.js';

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

const profileImage = document.querySelector('.profile__image');
const profileAvatarEditButton = document.querySelector('.profile__avatar-edit-button');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');

const placesList = document.querySelector('.places__list');

const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const popupAvatar = document.querySelector('.popup_type_avatar');
const popups = document.querySelectorAll('.popup');

const formEditProfile = document.forms['edit-profile'];
const nameInput = formEditProfile.elements.name;
const descriptionInput = formEditProfile.elements.description;
const editProfileSubmitButton = formEditProfile.querySelector(validationConfig.submitButtonSelector);

const formNewPlace = document.forms['new-place'];
const placeNameInput = formNewPlace.elements['place-name'];
const placeLinkInput = formNewPlace.elements.link;
const newPlaceSubmitButton = formNewPlace.querySelector(validationConfig.submitButtonSelector);

const formEditAvatar = document.forms['edit-avatar'];
const avatarLinkInput = formEditAvatar.elements.avatar;
const editAvatarSubmitButton = formEditAvatar.querySelector(validationConfig.submitButtonSelector);

const popupImageElement = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');

let currentUserId = null;


popups.forEach((popup) => {
  popup.addEventListener('click', (evt) => {
    if (evt.target === popup || evt.target.classList.contains('popup__close')) {
      closeModal(popup);
    }
  });
});

function handleCardImageClick(cardData) {
  popupImageElement.src = cardData.link;
  popupImageElement.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openModal(popupImage);
}

function handleDeleteCard(cardId, cardElement) {
  api.deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => console.log(err));
}

function handleLikeCard(cardId, shouldLike, updateCard) {
  api.changeLikeCardStatus(cardId, shouldLike)
    .then((updatedCardData) => {
      updateCard(updatedCardData);
    })
    .catch((err) => console.log(err));
}

function renderCard(cardData, container, method = 'append') {
  const cardElement = createCard(cardData, currentUserId, {
    onImageClick: handleCardImageClick,
    onDeleteClick: handleDeleteCard,
    onLikeClick: handleLikeCard,
  });
  container[method](cardElement);
}

profileEditButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  clearValidation(formEditProfile, validationConfig);
  openModal(popupEdit);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const originalButtonText = editProfileSubmitButton.textContent;
  editProfileSubmitButton.textContent = 'Сохранение...';

  api.updateUserInfo({
    name: nameInput.value,
    about: descriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(popupEdit);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      editProfileSubmitButton.textContent = originalButtonText;
    });
}

formEditProfile.addEventListener('submit', handleEditProfileSubmit);

profileAddButton.addEventListener('click', () => {
  formNewPlace.reset();
  clearValidation(formNewPlace, validationConfig);
  openModal(popupNewCard);
});

function handleNewPlaceSubmit(evt) {
  evt.preventDefault();
 
  const originalButtonText = newPlaceSubmitButton.textContent;
  newPlaceSubmitButton.textContent = 'Создание...';

  api.addCard({
    name: placeNameInput.value,
    link: placeLinkInput.value,
  })
    .then((cardData) => {
      renderCard(cardData, placesList, 'prepend');
      closeModal(popupNewCard);
      formNewPlace.reset();
      clearValidation(formNewPlace, validationConfig);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      newPlaceSubmitButton.textContent = originalButtonText;
    });
}

formNewPlace.addEventListener('submit', handleNewPlaceSubmit);

profileAvatarEditButton.addEventListener('click', () => {
  formEditAvatar.reset();
  clearValidation(formEditAvatar, validationConfig);
  openModal(popupAvatar);
});

function handleEditAvatarSubmit(evt) {
  evt.preventDefault();

  const originalButtonText = editAvatarSubmitButton.textContent;
  editAvatarSubmitButton.textContent = 'Сохранение...';

  api.updateAvatar({ avatar: avatarLinkInput.value })
    .then((userData) => {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(popupAvatar);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      editAvatarSubmitButton.textContent = originalButtonText;
    });
}

formEditAvatar.addEventListener('submit', handleEditAvatarSubmit);

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;
 
    cards.forEach((cardData) => {
      renderCard(cardData, placesList, 'append');
    });
  })
  .catch((err) => console.log(err));

enableValidation(validationConfig);