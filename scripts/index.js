function createCard(cardData, deleteCallback) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  
  const deleteButton = cardElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', function() {
    deleteCallback(cardElement);
  });
  
  return cardElement;
}


function deleteCard(cardElement) {
  cardElement.remove();
}

const placesList = document.querySelector('.places__list');

initialCards.forEach(function(cardData) {
  const cardElement = createCard(cardData, deleteCard);
  placesList.append(cardElement);
});
