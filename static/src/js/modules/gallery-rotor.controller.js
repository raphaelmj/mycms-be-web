export default class GalleryRotorController {
  constructor($http, $scope, $document, $window) {
    this.window = $window;
    this.http = $http;
    this.scope = $scope;
    this.document = $document;
    // this.scope.prevC = '';
    // this.scope.nextC = '';
    this.id = 'rotor-gallery';
    this.margin = 64;
    this.flatsRotor = document
      .getElementById(this.id)
      .querySelector('.g-elements-container');
    this.flatTor = this.flatsRotor.querySelector('.tor');
    this.fSlides = this.flatsRotor.querySelectorAll('.g-element-slide');
    this.initView();
    this.onResize();
    this.onOrientationChange();
  }

  initView() {
    this.createRotor();
  }

  prev() {
    if (this.current < this.lastSlide) {
      let pos = this.getAttrPos();
      pos += this.slWidth + this.margin;
      this.setAttrPos(pos);
      this.current++;
      $('#' + this.id + ' .tor').animate({ marginLeft: -pos + 'px' });
      this.setButtonsState();
    }
  }

  next() {
    if (this.current != 1) {
      let pos = this.getAttrPos();
      pos -= this.slWidth + this.margin;
      this.setAttrPos(pos);
      this.current--;
      $('#' + this.id + ' .tor').animate({ marginLeft: -pos + 'px' });
      this.setButtonsState();
    }
  }

  getAttrPos() {
    return Number(this.flatsRotor.getAttribute('data-position'));
  }

  setAttrPos(position) {
    this.flatsRotor.setAttribute('data-position', position);
  }

  createRotor() {
    let w = this.window.innerWidth;
    if (w >= 1160) {
      this.margin = 32;
    } else if (w < 1160 && w >= 992) {
      this.margin = 32;
    } else {
      this.margin = 32;
    }
    if (w >= 1160) {
      this.initRotorData(3);
    } else if (w < 1160 && w >= 992) {
      this.initRotorData(2);
    } else {
      this.initRotorData(1);
    }
  }

  onResize() {
    angular.element(this.window).on('resize', () => {
      this.createRotor();
    });
  }
  onOrientationChange() {
    this.window.addEventListener('orientationchange', () => {
      this.createRotor();
    });
  }

  setButtonsState() {
    if (this.current == 1) {
      this.scope.prevC = 'disable';
    } else {
      this.scope.prevC = '';
    }
    if (this.current == this.lastSlide) {
      this.scope.nextC = 'disable';
    } else {
      this.scope.nextC = '';
    }
  }

  initRotorData(inView) {
    this.current = 1;
    this.inView = inView;
    this.countSlides = [...this.fSlides].length;
    this.lastSlide = this.countSlides - (this.inView - 1);
    this.flatSlWidth =
      this.flatsRotor.getBoundingClientRect().width / this.inView;
    this.slWidth =
      this.flatSlWidth - (this.margin * (this.inView - 1)) / this.inView;
    this.flatTor.style.marginLeft = -this.margin + 'px';
    this.setAttrPos(this.margin);
    this.setButtonsState();
    [...this.fSlides].map((f, i) => {
      f.style.marginLeft = this.margin + 'px';
      f.style.width = this.slWidth + 'px';
    });
  }

  onSwipeLeft(event) {
    this.prev();
  }
  onSwipeRight(event) {
    this.next();
  }
}
