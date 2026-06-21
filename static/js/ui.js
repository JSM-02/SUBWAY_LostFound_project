import { openModal } from './modal.js';

const listDiv = document.getElementById('list');

function createItemCard(item) {
    const card = document.createElement('article');
    card.className = 'lost-card';
    const cardInfo = document.createElement('div');
    cardInfo.className = 'card-info';
    const lostItem = document.createElement('h4');
    lostItem.textContent = item.fdPrdtNm;
    const date = document.createElement('p');
    date.textContent = item.fdYmd;
    const place = document.createElement('p');
    place.textContent = item.depPlace;
    cardInfo.append(lostItem, date, place); 

    const itemImg = document.createElement('img');
    itemImg.className = 'item-img'
    itemImg.src = item.fdFilePathImg;
    itemImg.alt = item.fdPrdtNm;

    card.append(cardInfo, itemImg);
    
    card.addEventListener('click', () => {
        openModal(item);
    });

    return card;
}

export function renderLostList(items) {
    listDiv.replaceChildren();
    items.forEach(item => {
        const card = createItemCard(item);
        listDiv.appendChild(card);
    });
}