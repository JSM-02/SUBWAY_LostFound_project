import { initModal, howToUseModal } from './modal.js';
import { initMap, moveToStation } from './map.js'; 
import { initSearch } from './search.js';
import { fetchLostItems } from './api.js';
import { renderLostList } from './ui.js';
import { setupPagination } from './pagination.js';

async function handleSearch(keyword, type, page = 1) {
    if (type === 'location') {
        moveToStation(keyword); 
    }
    try {
        const data = await fetchLostItems(keyword, type, page);
        renderLostList(data.items);
        setupPagination(data.totalItems, (newPage) => {
            handleSearch(keyword, type, newPage);
        }, page === 1);
    } catch (e) {
        console.error(e);
        alert('데이터를 불러오는데 실패했습니다.');
    }
}

function mainInit() { 
    initSearch(handleSearch);
    howToUseModal();
    initModal();
    initMap((stationName) => {
        handleSearch(stationName, 'location');
    });
}

mainInit();