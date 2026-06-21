import { initModal, howToUseModal } from './modal.js';
import { initMap, moveToStation } from './map.js'; 
import { initSearch, handleSearch } from './search.js';

function mainInit() { 
    initSearch(moveToStation);
    howToUseModal();
    initModal();
    initMap((stationName) => {
        handleSearch(stationName, 'location');
    });
}

mainInit();