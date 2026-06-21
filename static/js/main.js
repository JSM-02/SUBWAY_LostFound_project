import { fetchLostItems } from './api.js';
import { renderLostList } from './ui.js';
import { initModal, howToUseModal } from './modal.js';
import { initMap } from './map.js';
import { setupPagination } from './pagination.js';

async function handleSearch(keyword, type, page = 1) {
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

function onSearch() {
    const keyword = document.getElementById('search').value.trim();
    if (!keyword) {
        alert('검색어를 입력하세요.');
        return;
    }
    handleSearch(keyword, 'item');
}

function mainInit() {
    document.getElementById('search-btn').addEventListener('click', onSearch);

    document.getElementById('search').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    });

    howToUseModal();
    initModal();
    initMap((stationName) => {
        handleSearch(stationName, 'location');
    });
}

mainInit();