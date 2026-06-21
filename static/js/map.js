const svgPanZoom = window.svgPanZoom; 
const subwaySvg = document.getElementById('subway-svg');
let panZoom;

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
        textElements.forEach(t => {
            t.style.cursor = 'pointer';
            t.addEventListener('click', () => {
                if (t.closest('#legend_ko')) return;
                const transform = t.getAttribute('transform'); 
                const xy = transform.replace('matrix(', '').replace(')', '').split(' ');
                const x = parseFloat(xy[4]);
                const y = parseFloat(xy[5]);
                
                smoothZoom(7, x, y);
                
                const location = t.textContent;
                onStationClick(location); 
            });
        });
    }

    if (subwaySvg.contentDocument && subwaySvg.contentDocument.querySelector('svg')) {
        setup();
    } else {
        subwaySvg.addEventListener('load', setup);
    }
}