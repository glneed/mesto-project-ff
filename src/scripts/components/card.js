function isLiked(likes, userId) {
  return likes.some((user) => user._id === userId);
}

function renderLikes(likeCountElement, likeButton, likes, userId) {
  likeCountElement.textContent = likes.length;
 
  if (isLiked(likes, userId)) {
    likeButton.classList.add('card__like-button_is-active');
  } else {
    likeButton.classList.remove('card__like-button_is-active');
  }
}

export function createCard(cardData, currentUserId, handlers = {}) {
  const { onImageClick, onDeleteClick, onLikeClick } = handlers;
 
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCountElement = cardElement.querySelector('.card__like-count');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  renderLikes(likeCountElement, likeButton, cardData.likes, currentUserId);

  if (cardData.owner._id === currentUserId) {
    deleteButton.addEventListener('click', () => {
      if (onDeleteClick) {
        onDeleteClick(cardData._id, cardElement);
      }
    });
  } else {
    deleteButton.remove();
  }

  likeButton.addEventListener('click', () => {
    const shouldLike = !isLiked(cardData.likes, currentUserId);
    if (onLikeClick) {
      onLikeClick(cardData._id, shouldLike, (updatedCardData) => {
        cardData.likes = updatedCardData.likes;
        renderLikes(likeCountElement, likeButton, cardData.likes, currentUserId);
      });
    }
  });

  cardImage.addEventListener('click', () => {
    if (onImageClick) {
      onImageClick(cardData);
    }
  });

  return cardElement;
}