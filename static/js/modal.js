const infoModal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.getElementById('modal-close');

export function openModal(item) {
    modalBody.replaceChildren();
    infoModal.style.display = 'flex';

    const modalImg = document.createElement('img');
    modalImg.className = 'modal-img';
    modalImg.src = item.fdFilePathImg;
    modalImg.alt = item.fdPrdtNm;
    modalImg.loading = 'lazy';

    const infoContainer = document.createElement('div');
    infoContainer.className = 'modal-info-container'; 

    const itemInfo = [
        ['물품명', item.fdPrdtNm],
        ['물품분류', item.prdtClNm],
        ['색상', item.clrNm],
        ['습득일자', item.fdYmd + ' ' + item.fdHor + '시'],
        ['습득장소', item.fdPlace],
        ['보관장소', item.depPlace],
        ['전화번호', item.tel],
        ['설명', item.uniq]
    ]

    itemInfo.forEach(([row, column]) => {
        const infoRow = document.createElement('div'); 
        infoRow.className = 'modal-info-row';
        const label = document.createElement('strong');
        label.textContent = row;  
        const value = document.createElement('span');
        value.textContent = column;

        infoRow.append(label, value);
        infoContainer.appendChild(infoRow);
    });
    modalBody.append(modalImg, infoContainer); 
}

export function closeModal() {
    infoModal.style.display = 'none'; 
}

export function initModal() {
    closeBtn.addEventListener('click', closeModal); 
    
    infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) {
            closeModal(); 
        }
    });
}
