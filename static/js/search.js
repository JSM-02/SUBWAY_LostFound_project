import { fetchLostItems } from './api.js';
import { renderLostList } from './ui.js';
import { setupPagination } from './pagination.js';

let moveToStation;

export async function handleSearch(keyword, type, page = 1) {
    if (type === 'item') {
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

export function onSearch() {
    const keyword = document.getElementById('search').value.trim();
    if (!keyword) {
        alert('검색어를 입력하세요.');
        return;
    }
    handleSearch(keyword, 'item');
}

export function initSearch(moveToStationCallback) {
    moveToStation = moveToStationCallback;
    document.getElementById('search-btn').addEventListener('click', onSearch);
    document.getElementById('search').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    });
}