import { renderMessage } from "./ui.js";

let handleSearchFn;

export function onSearch() {
    const keyword = document.getElementById('search').value.trim();
    const type = document.getElementById("search-filter").value;
    if (!keyword) {
        renderMessage("검색어를 입력해주세요.");
        return;
    }
    handleSearchFn(keyword, type);
}

export function initSearch(handleSearchCallback) {
    handleSearchFn = handleSearchCallback;
    document.getElementById('search-btn').addEventListener('click', onSearch);
    document.getElementById('search').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    });
}