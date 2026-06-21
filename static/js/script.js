console.log('script.js 실행');

const tui = window.tui; // 페이지네이션 라이브러리
const svgPanZoom = window.svgPanZoom; // 줌

const listDiv = document.getElementById('list');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search');
const infoModal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.getElementById('modal-close');
let pagination = null; 
let panZoom;
// 검색
async function search(keyword, type, page=1) {
    try{
        const res = await fetch(`/${type}/${keyword}?page=${page}`);
        const data = await res.json();

        listDiv.replaceChildren();
           
        data.items.forEach(item => {
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

            // 모달
            card.addEventListener('click', () => {
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
            });
            listDiv.appendChild(card);
        });
        // 페이지네이션
        const container = document.getElementById('pagination');

        // 새 검색 시 페이지네이션 초기화
        if (page === 1 && pagination) {
            container.replaceChildren();
            pagination = null;
        }
  
        if (!pagination) {
            pagination = new tui.Pagination(container, {
                totalItems: data.totalItems,
                itemsPerPage: 10
            });

            pagination.on('afterMove', (event) => {
                search(keyword, type, event.page);
            }); 
        } else {
            pagination.setTotalItems(data.totalItems);
        }

    } catch(e){
        console.error(e);
        const errMsg = document.createElement('p');
        errMsg.textContent = '데이터 호출 중 오류 발생';
        listDiv.appendChild(errMsg);
    }
}

function onSearch() {
    const keyword = searchInput.value.trim();

    if (!keyword) {
        alert('검색어를 입력하세요.');
        return;
    }
    search(keyword,'item');
}

searchBtn.addEventListener('click', onSearch);
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        onSearch();
    }
});

// 모달 클릭 이벤트
closeBtn.addEventListener('click', () => {
    infoModal.style.display = 'none';
});

// 모달 닫기 이벤트
infoModal.addEventListener('click', (e) => {
    if (e.target === infoModal) {
        infoModal.style.display = 'none';
    }
});


// svg 역 클릭 이벤트
const subwaySvg = document.getElementById('subway-svg');
subwaySvg.addEventListener('load', () => {
    const svgDoc = subwaySvg.contentDocument;
    const svgEl = svgDoc.querySelector('svg');
    
    panZoom = svgPanZoom(svgEl, {  
        zoomEnabled: true,
        controlIconsEnabled: true,
        zoomScaleSensitivity: 0.5,
        beforePan: function(oldPan, newPan) {
            const gutterWidth = 200;
            const gutterHeight = 200;
            const sizes = this.getSizes();

            const leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth;
            const rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom);
            const topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight;
            const bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom);

            return {
                x: Math.max(leftLimit, Math.min(rightLimit, newPan.x)),
                y: Math.max(topLimit, Math.min(bottomLimit, newPan.y))
            };
        }
    });
    
    const textElements = svgDoc.querySelectorAll('text');
    textElements.forEach(t=>{
        t.addEventListener('click', () => {
            if (t.closest('#legend_ko')) return;
            const transform = t.getAttribute('transform'); 
            const xy = transform.replace('matrix(', '').replace(')', '').split(' ');
            const x = parseFloat(xy[4]);
            const y = parseFloat(xy[5]);
            
            smoothZoom(7, x, y);
            
            const location = t.textContent;
            search(location, 'location')
        })
    })
});

// 부드럽게 확대
function smoothZoom(targetZoom, svgX, svgY) {
    const startZoom = panZoom.getZoom(); 
    const totalFrames = 20; 
    let frame = 0; 
    
    const move = setInterval(() => {
    frame++;
    panZoom.zoom(startZoom + (targetZoom - startZoom) * (frame / totalFrames));
    
    const s = panZoom.getSizes();
    panZoom.pan({
        x: s.width / 2 - svgX * s.realZoom,
        y: s.height / 2 - svgY * s.realZoom
    });
    
    if (frame >= totalFrames) clearInterval(move);
}, 16);
}