import * as ps from '../vendors/photoswipe.min';
import * as psUi from '../vendors/photoswipe-ui-default.min';
const PhotoSwipe = ps.default;
const PhotoSwipeUI_Default = psUi.default;
const initPhotoSwipeFromDOM = function (gallerySelector) {
  // parse slide data (url, title, size ...) from DOM elements
  // (children of gallerySelector)
  var parseThumbnailElements = function (el) {
    var thumbElements = el.childNodes,
      numNodes = thumbElements.length,
      items = [],
      figureEl,
      linkEl,
      size,
      item;

    for (var i = 0; i < numNodes; i++) {
      figureEl = thumbElements[i]; // <figure> element

      // include only element nodes
      if (figureEl.nodeType !== 1) {
        continue;
      }

      linkEl = figureEl.children[0]; // <a> element
      // console.log(linkEl);
      size = linkEl.getAttribute('data-size').split('x');

      // create slide object
      item = {
        src: linkEl.getAttribute('href'),
        w: parseInt(size[0], 10),
        h: parseInt(size[1], 10),
      };

      if (figureEl.children.length > 1) {
        // <figcaption> content
        item.title = figureEl.children[1].innerHTML;
      }

      if (linkEl.children.length > 0) {
        // <img> thumbnail element, retrieving thumbnail url
        item.msrc = linkEl.children[0].getAttribute('src');
      }

      item.el = figureEl; // save link to element for getThumbBoundsFn
      items.push(item);
    }

    return items;
  };

  // find nearest parent element
  var closest = function closest(el, fn) {
    return el && (fn(el) ? el : closest(el.parentNode, fn));
  };

  // triggers when user clicks on thumbnail
  var onThumbnailsClick = function (e) {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);

    var eTarget = e.target || e.srcElement;

    // find root element of slide
    var clickedListItem = closest(eTarget, function (el) {
      return el.tagName && el.tagName.toUpperCase() === 'FIGURE';
    });

    if (!clickedListItem) {
      return;
    }

    // find index of clicked item by looping through all child nodes
    // alternatively, you may define index via data- attribute
    var clickedGallery = clickedListItem.parentNode,
      childNodes = clickedListItem.parentNode.childNodes,
      numChildNodes = childNodes.length,
      nodeIndex = 0,
      index;

    for (var i = 0; i < numChildNodes; i++) {
      if (childNodes[i].nodeType !== 1) {
        continue;
      }

      if (childNodes[i] === clickedListItem) {
        index = nodeIndex;
        break;
      }
      nodeIndex++;
    }

    // console.log(clickedGallery)

    if (index >= 0) {
      // open PhotoSwipe if valid index found
      openPhotoSwipe(index, clickedGallery);
    }
    return false;
  };

  // parse picture index and gallery index from URL (#&pid=1&gid=2)
  var photoswipeParseHash = function () {
    var hash = window.location.hash.substring(1),
      params = {};

    if (hash.length < 5) {
      return params;
    }

    var vars = hash.split('&');
    for (var i = 0; i < vars.length; i++) {
      if (!vars[i]) {
        continue;
      }
      var pair = vars[i].split('=');
      if (pair.length < 2) {
        continue;
      }
      params[pair[0]] = pair[1];
    }

    if (params.gid) {
      params.gid = parseInt(params.gid, 10);
    }

    return params;
  };

  var openPhotoSwipe = function (
    index,
    galleryElement,
    disableAnimation,
    fromURL,
  ) {
    var pswpElement = document.querySelectorAll('.pswp')[0],
      gallery,
      options,
      items;

    // console.log(galleryElement);
    items = parseThumbnailElements(galleryElement);

    // define options (if needed)
    options = {
      // define gallery index (for URL)
      galleryUID: galleryElement.getAttribute('data-pswp-uid'),

      getThumbBoundsFn: function (index) {
        // See Options -> getThumbBoundsFn section of documentation for more info
        var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
          pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop,
          rect = thumbnail.getBoundingClientRect();

        return {
          x: rect.left,
          y: rect.top + pageYScroll,
          w: rect.width,
        };
      },
    };

    // PhotoSwipe opened from URL
    if (fromURL) {
      if (options.galleryPIDs) {
        // parse real index when custom PIDs are used
        // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
        for (var j = 0; j < items.length; j++) {
          if (items[j].pid == index) {
            options.index = j;
            break;
          }
        }
      } else {
        // in URL indexes start from 1
        options.index = parseInt(index, 10) - 1;
      }
    } else {
      options.index = parseInt(index, 10);
    }

    // exit if index not found
    if (isNaN(options.index)) {
      return;
    }

    if (disableAnimation) {
      options.showAnimationDuration = 0;
    }

    // Pass data to PhotoSwipe and initialize it
    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
    // return gallery
  };

  var selectBigCurrent = function (e) {
    // console.log(e.target)
    // console.info(gallery)
    openPhotoSwipe(e.target.getAttribute('data-index'), gallery);
  };

  var addMouseOverChange = function (gallery, currentBig) {
    // console.log(gallery.childNodes)
    gallery.childNodes.forEach(function (el, i) {
      // console.log(el)
      el.querySelector('img').addEventListener('mouseover', function (e) {
        if (currentBig) {
          currentBig.src = e.target.src;
          currentBig.setAttribute('data-index', i);
        }
      });
    });
  };

  // loop through all gallery elements and bind events
  var galleryElements = document.querySelectorAll(gallerySelector);
  // console.log(galleryElements);

  for (var i = 0, l = galleryElements.length; i < l; i++) {
    galleryElements[i].setAttribute('data-pswp-uid', i + 1);
    galleryElements[i].onclick = onThumbnailsClick;
    var gallery = galleryElements[i];
    if (document.querySelector('#openCurrent'))
      document.querySelector('#openCurrent').onclick = selectBigCurrent.bind(
        gallery,
      );

    addMouseOverChange(
      galleryElements[i],
      document.querySelector('#openCurrent'),
    );
  }

  // Parse URL and open gallery if it contains #&pid=3&gid=1
  var hashData = photoswipeParseHash();
  if (hashData.pid && hashData.gid) {
    openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
  }
};

const clickOpen = function (element, i) {
  // console.log(element)
  // return
  var pswpElement = document.querySelectorAll('.pswp')[0],
    gallery,
    options,
    items,
    sizeString;

  var sizeString = element.getAttribute('data-size').split('x');
  // console.log(galleryElement);
  items = [
    { src: element.dataset.imageSrc, w: sizeString[0], h: sizeString[1] },
  ];

  // define options (if needed)
  options = {
    // define gallery index (for URL)
    galleryUID: i,

    getThumbBoundsFn: function (index) {
      // See Options -> getThumbBoundsFn section of documentation for more info
      var thumbnail = element, // find thumbnail
        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
        rect = thumbnail.getBoundingClientRect();

      // console.log(rect)

      return {
        x: rect.left,
        y: rect.top + pageYScroll,
        w: rect.width,
      };
    },
  };

  // PhotoSwipe opened from URL
  options.index = 0;

  // console.log(options)

  // exit if index not found
  if (isNaN(options.index)) {
    return;
  }

  // Pass data to PhotoSwipe and initialize it
  gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
  gallery.init();
  // return gallery
};

const clickOpenTargetThumb = function (id) {
  var element = document.getElementById(id);

  // console.log(element)
  // return
  var pswpElement = document.querySelectorAll('.pswp')[0],
    gallery,
    options,
    items,
    sizeString;

  var sizeString = element.getAttribute('data-size').split('x');
  // console.log(galleryElement);
  items = [
    {
      src: element.src,
      w: parseInt(sizeString[0]),
      h: parseInt(sizeString[1]),
    },
  ];

  // define options (if needed)
  options = {
    // define gallery index (for URL)
    galleryUID: id,

    getThumbBoundsFn: function (index) {
      // See Options -> getThumbBoundsFn section of documentation for more info
      var thumbnail = element, // find thumbnail
        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
        rect = thumbnail.getBoundingClientRect();

      // console.log(rect)

      return {
        x: rect.left,
        y: rect.top + pageYScroll,
        w: rect.width,
      };
    },
  };

  // PhotoSwipe opened from URL
  options.index = 0;

  // exit if index not found
  if (isNaN(options.index)) {
    return;
  }

  // Pass data to PhotoSwipe and initialize it
  gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
  gallery.init();
  // return gallery
};

const openFromThumbGallery = function (
  element,
  selector = '.gallery-r-element',
) {
  // console.log(element)
  // return
  var pswpElement = document.querySelectorAll('.pswp')[0],
    gallery,
    options,
    items,
    sizeString,
    id,
    currentIndex;

  id = element.getAttribute('data-gallery-id');
  currentIndex = element.getAttribute('data-gallery-index');
  // console.log(galleryElement);
  items = [];
  [...document.querySelectorAll(selector)].forEach((el) => {
    const galleryType = el.getAttribute('data-gallery-type');
    if (galleryType === 'image') {
      let sizeString = el.getAttribute('data-size').split('x');
      items.push({
        src: el.getAttribute('data-image-path'),
        w: parseInt(sizeString[0]),
        h: parseInt(sizeString[1]),
      });
    } else if (galleryType === 'movie') {
      let movieId = el.getAttribute('data-movie-id');
      items.push({
        html: `<iframe width="90%" height="85%" src="https://www.youtube.com/embed/${movieId}" style="display: block;margin: 5% auto 0 auto" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
      });
    }
  });

  // define options (if needed)
  options = {
    // define gallery index (for URL)
    galleryUID: id,

    getThumbBoundsFn: function (index) {
      // See Options -> getThumbBoundsFn section of documentation for more info
      var thumbnail = element, // find thumbnail
        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
        rect = thumbnail.getBoundingClientRect();

      // console.log(rect)

      return {
        x: rect.left,
        y: rect.top + pageYScroll,
        w: rect.width,
      };
    },
  };

  // PhotoSwipe opened from URL
  options.index = parseInt(currentIndex);

  // console.log(options)

  // exit if index not found
  if (isNaN(options.index)) {
    return;
  }

  // Pass data to PhotoSwipe and initialize it
  gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
  gallery.init();
  // return gallery
};

const openFromCollection = function (collection, index, id, element) {
  var pswpElement = document.querySelectorAll('.pswp')[0],
    gallery,
    options,
    items,
    currentIndex;

  currentIndex = index;

  items = [];
  collection.forEach((el) => {
    let sizeString = el.sizeString.split('x');
    items.push({
      src: el.path,
      w: parseInt(sizeString[0]),
      h: parseInt(sizeString[1]),
      title: `<h3></h3>`,
    });
  });

  options = {
    // define gallery index (for URL)
    galleryUID: id,

    getThumbBoundsFn: function (index) {
      // See Options -> getThumbBoundsFn section of documentation for more info
      var thumbnail = element, // find thumbnail
        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
        rect = thumbnail.getBoundingClientRect();

      // console.log(rect)

      return {
        x: rect.left,
        y: rect.top + pageYScroll,
        w: rect.width,
      };
    },
  };

  // PhotoSwipe opened from URL
  options.index = parseInt(currentIndex);

  // console.log(options)

  // exit if index not found
  if (isNaN(options.index)) {
    return;
  }

  // Pass data to PhotoSwipe and initialize it
  gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
  gallery.init();
};

const openFromCollectionProgress = function (collection, index, id, element) {
  var pswpElement = document.querySelectorAll('.pswp')[0],
    gallery,
    options,
    items;

  collection = JSON.parse(collection);
  const title = collection.name;
  const slides = collection.images;

  items = [];
  slides.forEach((el) => {
    if (el.type === 'movie') {
      items.push({
        html: `<iframe width="90%" height="85%" src="https://www.youtube.com/embed/${el.movieSelector}" style="display: block;margin: 5% auto 0 auto" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
        title: `<h3>${title}</h3>`,
      });
    } else {
      let sizeString = el.sizeString.split('x');
      items.push({
        src: el.src,
        w: parseInt(sizeString[0]),
        h: parseInt(sizeString[1]),
        title: `<h3>${title}</h3>`,
      });
    }
  });

  options = {
    // define gallery index (for URL)
    galleryUID: id,

    getThumbBoundsFn: function (index) {
      // See Options -> getThumbBoundsFn section of documentation for more info
      var thumbnail = element, // find thumbnail
        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
        rect = thumbnail.getBoundingClientRect();

      // console.log(rect)

      return {
        x: rect.left,
        y: rect.top + pageYScroll,
        w: rect.width,
      };
    },
  };

  // PhotoSwipe opened from URL
  options.index = parseInt(index);

  // console.log(options)

  // exit if index not found
  if (isNaN(options.index)) {
    return;
  }

  // Pass data to PhotoSwipe and initialize it
  gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
  gallery.init();
};

const openGalleryFromElementData = function (
  selector,
  dataKey,
  arrayIndex,
  index,
  element,
) {
  var pswpElement = document.querySelectorAll('.pswp')[0],
    gallery,
    options,
    items,
    currentIndex;
  const fullData = JSON.parse(
    document.querySelector(selector).dataset[dataKey],
  );
  currentIndex = index;
  const title = fullData[arrayIndex].title;

  items = [];
  fullData[arrayIndex].images.forEach((el) => {
    let sizeString = el.sizeString.split('x');
    items.push({
      src: el.path,
      w: parseInt(sizeString[0]),
      h: parseInt(sizeString[1]),
      title: `<h3>${title}</h3>`,
    });
  });

  options = {
    // define gallery index (for URL)
    galleryUID: fullData[arrayIndex].id,

    getThumbBoundsFn: function (index) {
      // See Options -> getThumbBoundsFn section of documentation for more info
      var thumbnail = element, // find thumbnail
        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
        rect = thumbnail.getBoundingClientRect();

      // console.log(rect)

      return {
        x: rect.left,
        y: rect.top + pageYScroll,
        w: rect.width,
      };
    },
  };

  // PhotoSwipe opened from URL
  options.index = parseInt(currentIndex);

  // console.log(options)

  // exit if index not found
  if (isNaN(options.index)) {
    return;
  }

  // Pass data to PhotoSwipe and initialize it
  gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
  gallery.init();
};

// // execute above function
// var galleryObject = initPhotoSwipeFromDOM('.swp-gallery');
export {
  initPhotoSwipeFromDOM,
  clickOpen,
  clickOpenTargetThumb,
  openFromThumbGallery,
  openFromCollection,
  openGalleryFromElementData,
  openFromCollectionProgress,
};
