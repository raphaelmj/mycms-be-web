document.addEventListener('DOMContentLoaded', function () {
  const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
  const lazyIframes = [].slice.call(document.querySelectorAll('iframe.lazy'));
  const lazyBackgrounds = [].slice.call(
    document.querySelectorAll('.lazy-background'),
  );

  const lazyProgressIcons = [].slice.call(
    document.querySelectorAll('.lazy-progress-icon'),
  );

  if ('IntersectionObserver' in window) {
    let lazyImageObserver = new IntersectionObserver(function (
      entries,
      observer,
    ) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove('lazy');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function (lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });

    let lazyIFrameObserver = new IntersectionObserver(function (
      entries,
      observer,
    ) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove('lazy');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyIframes.forEach(function (lazyIf) {
      lazyIFrameObserver.observe(lazyIf);
    });

    let lazyBackgroundObserver = new IntersectionObserver(function (
      entries,
      observer,
    ) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.classList.remove('lazy-background');
          lazyBackgroundObserver.unobserve(entry.target);
        }
      });
    });

    lazyBackgrounds.forEach(function (lazyBackground) {
      lazyBackgroundObserver.observe(lazyBackground);
    });
  } else {
    const imgs = document.querySelectorAll('img.lazy');
    Object.keys(imgs).map((k) => {
      let image = k.getAttribute('data-src');
      imgs[k].src = image;
      imgs[k].classList.remove('lazy');
    });
    const iframes = document.querySelectorAll('iframe.lazy');
    Object.keys(iframes).map((k) => {
      let iframeUrl = k.getAttribute('data-src');
      iframes[k].src = iframeUrl;
      iframes[k].classList.remove('lazy');
    });
    const bgs = document.querySelectorAll('.lazy-background');
    Object.keys(bgs).map((k) => {
      bgs[k].classList.remove('lazy-background');
      bgs[k].classList.add('visible');
    });
  }
});
