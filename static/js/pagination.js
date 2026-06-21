const tui = window.tui;
let pagination = null;

export function setupPagination(totalItems, onPageChange, reset) {
    const container = document.getElementById('pagination');

    if (reset && pagination) {
        container.replaceChildren();
        pagination = null;
    }

    if (!pagination) {
        pagination = new tui.Pagination(container, {
            totalItems: totalItems,
            itemsPerPage: 10
        });

        pagination.on('afterMove', (event) => {
            onPageChange(event.page);
        });
    } else {
        pagination.setTotalItems(totalItems);
    }
}