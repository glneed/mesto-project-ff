import '../pages/index.css';

import { createCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import { initialCards } from './utils/initial-cards.js';

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');

const placesList = document.querySelector('.places__list');

const popupEdit = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const popups = document.querySelectorAll('.popup');

const formEditProfile = document.forms['edit-profile'];
const nameInput = formEditProfile.elements.name;
const descriptionInput = formEditProfile.elements.description;

const formNewPlace = document.forms['new-place'];
const placeNameInput = formNewPlace.elements['place-name'];
const placeLinkInput = formNewPlace.elements.link;

const popupImageElement = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');


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

profileEditButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  openModal(popupEdit);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  closeModal(popupEdit);
}

formEditProfile.addEventListener('submit', handleEditProfileSubmit);


profileAddButton.addEventListener('click', () => {
  formNewPlace.reset();
  openModal(popupNewCard);
});

function handleNewPlaceSubmit(evt) {
  evt.preventDefault();

  const cardData = {
    name: placeNameInput.value,
    link: placeLinkInput.value,
  };

  const cardElement = createCard(cardData, handleCardImageClick);
  placesList.prepend(cardElement);

  closeModal(popupNewCard);
  formNewPlace.reset();
}

formNewPlace.addEventListener('submit', handleNewPlaceSubmit);


initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData, handleCardImageClick);
  placesList.append(cardElement);
});