let images = document.querySelectorAll('source, img');

if ('IntersectionObserver' in window) {
    // IntersectionObserver Supported
    let config = {
        root: null,
        rootMargin: '0px',
        threshold: 0
    };

    let observer = new IntersectionObserver(onChange, config);
    images.forEach(function(img) {
        observer.observe(img)
    });

    function onChange(changes, observer) {
        changes.forEach(function(change) {
            if (change.intersectionRatio > 0) {
                // Stop watching and load the image
                loadImage(change.target);
                observer.unobserve(change.target);
            }
        });
    }

} else {
    // IntersectionObserver NOT Supported
    images.forEach(function(image) {
        loadImage(image)
    });
}

function loadImage(image) {
    image.classList.add('fade-in');
    if (image.dataset && image.dataset.src) {
        image.src = image.dataset.src;
    }

    if (image.dataset && image.dataset.srcset) {
        image.srcset = image.dataset.srcset;
    }
}