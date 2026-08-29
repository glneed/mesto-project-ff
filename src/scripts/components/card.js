export function handleDeleteCard(cardElement) {
  cardElement.remove();
}

export function handleCardLike(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}

export function createCard(cardData, onImageClick) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener('click', () => {
    handleDeleteCard(cardElement);
  });

  likeButton.addEventListener('click', () => {
    handleCardLike(likeButton);
  });

  cardImage.addEventListener('click', () => {
    onImageClick(cardData);
  });

  return cardElement;
}