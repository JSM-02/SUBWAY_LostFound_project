// 데이터 요청

export async function fetchLostItems(keyword, type, page = 1) {
    const res = await fetch(`/${type}/${keyword}?page=${page}`);
    const data = await res.json();
    return data;
}