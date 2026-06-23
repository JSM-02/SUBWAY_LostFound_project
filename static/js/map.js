const svgPanZoom = window.svgPanZoom; 
const subwaySvg = document.getElementById('subway-svg');
let panZoom;
let stations = [];
let selectedStation = null;

function easeOutQuad(t) {
    return t * (2 - t);
}

function smoothZoom(targetZoom, svgX, svgY) {
    const startZoom = panZoom.getZoom();
    const totalFrames = 20;
    let frame = 0;

    function animate() {
        frame++;
        const t = easeOutQuad(frame / totalFrames);
        panZoom.zoom(startZoom + (targetZoom - startZoom) * t);

        const s = panZoom.getSizes();
        panZoom.pan({
            x: s.width / 2 - svgX * s.realZoom,
            y: s.height / 2 - svgY * s.realZoom
        });

        if (frame < totalFrames) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function cleanStationName(name) {
    let clean = name.split('(')[0].replace(/\s+/g, '');
    if (!clean.endsWith('역')) clean += '역';
    return clean;
}

function getXY(transform) {
    const xy = transform.replace('matrix(', '').replace(')', '').split(' ');
    return { x: parseFloat(xy[4]), y: parseFloat(xy[5]) };
}

function highlightStation(t) {
    if (selectedStation) {
        selectedStation.style.fill = '';
    }
    t.style.fill = 'red';
    selectedStation = t;
}

export function initMap(onStationClick) {
    function setup() {
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

        panZoom.zoom(1.5);
        
        const textElements = svgDoc.querySelectorAll('text');

        // element: t 도 같이 저장
        stations = Array.from(textElements)
            .filter(t => !t.closest('#legend_ko'))
            .map(t => {
                const { x, y } = getXY(t.getAttribute('transform'));
                return { name: cleanStationName(t.textContent), x, y, element: t };
            });

        textElements.forEach(t => {
            t.style.cursor = 'pointer';
            t.addEventListener('click', () => {
                if (t.closest('#legend_ko')) return;
                const location = cleanStationName(t.textContent);
                onStationClick(location); 

                const { x, y } = getXY(t.getAttribute('transform'));
                smoothZoom(7, x, y);
                highlightStation(t);
            });
        });
    }

    if (subwaySvg.contentDocument && subwaySvg.contentDocument.querySelector('svg')) {
        setup();
    } else {
        subwaySvg.addEventListener('load', setup);
    }
}

export function moveToStation(keyword) {
    const stationKeyword = keyword.endsWith('역') ? keyword : keyword + '역';
    
    const found = stations.find(station => station.name === stationKeyword);
    
    if (found) {
        smoothZoom(7, found.x, found.y);
        highlightStation(found.element);
    }
}