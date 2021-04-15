$(document).ready(function() {
    // Instantiate the Bootstrap carousel

    const carouselElm = $('#carouselProductsSlider');

    carouselElm.carousel({
        interval: false
    });
    
    carouselElm.on('slide.bs.carousel', function (e) {
        const $e = $(e.relatedTarget);
        const idx = $e.index();
        const itemsPerSlide = 5;
        const carouselItem = $('.carousel-item');
        const totalItems = carouselItem.length;
     
        if (idx >= totalItems - (itemsPerSlide-1)) {
            const it = itemsPerSlide - (totalItems - idx);

            for (var i=0; i<it; i++) {
                if (e.direction=="left") {
                    carouselItem.eq(i).appendTo('.carousel-inner');
                } else {
                    carouselItem.eq(0).appendTo('.carousel-inner');
                }
            }
        }
    });
});