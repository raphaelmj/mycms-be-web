export default class PopupController {
  constructor($http, $scope, $document, $window, $timeout) {
    this.scope = $scope;
    this.document = $document;
    this.window = $window;
    this.timeout = $timeout;
    this.sessionStorage = sessionStorage;
    this.angular = window.angular;
    this.scope.loadState = 'before-load';
  }

  initData() {
    this.scope.$watch('$viewContentLoaded', () => {
      this.scope.popup = document.querySelector('.image-popup');
      this.popupBase = angular.element(document.getElementById('popupBase'));
      this.popupContentBase = angular.element(
        document.getElementById('popupContentBase'),
      );
      this.scope.loadState = 'after-load';
      this.timeout(() => {
        this.initVisible();
        this.setTop();
        this.eventsChange();
      }, 500);
    });
  }

  initVisible() {
    if (this.sessionStorage.getItem('hidePopup')) {
      const hiddenPopups = JSON.parse(this.sessionStorage.getItem('hidePopup'));
      if (
        hiddenPopups.filter((id) => id == this.scope.config.popupId).length > 0
      ) {
        this.popupBase.addClass('hidden-pop-up');
        this.popupContentBase.addClass('hidden-pop-up');
        this.scope.loadState = 'before-load';
      } else {
        this.popupBase.removeClass('hidden-pop-up');
        this.popupContentBase.removeClass('hidden-pop-up');
        // this.timeout(() => {
        //   this.scope.loadState = 'after-load';
        // }, 2000);
      }
    } else {
      this.popupBase.removeClass('hidden-pop-up');
      this.popupContentBase.removeClass('hidden-pop-up');
      // this.timeout(() => {
      //   this.scope.loadState = 'after-load';
      // }, 2000);
    }
  }

  hidePopup() {
    this.popupBase.addClass('hidden-pop-up');
    this.popupContentBase.addClass('hidden-pop-up');
    if (this.sessionStorage.getItem('hidePopup')) {
      const hiddenPopups = JSON.parse(this.sessionStorage.getItem('hidePopup'));
      hiddenPopups.push(this.scope.config.popupId);
      this.sessionStorage.setItem('hidePopup', JSON.stringify(hiddenPopups));
    } else {
      this.sessionStorage.setItem(
        'hidePopup',
        JSON.stringify([this.scope.config.popupId]),
      );
    }
  }

  eventsChange() {
    this.window.addEventListener('resize', () => {
      this.setTop();
    });
    this.window.addEventListener(
      'orientationchange',
      () => {
        this.setTop();
      },
      false,
    );
  }

  setTop() {
    const ofw = this.scope.popup.offsetWidth;
    const ofh = this.scope.popup.offsetHeight;
    const wofw = this.window.innerWidth;
    const wofh = this.window.innerHeight;
    switch (this.scope.config.orient) {
      case 'vertical':
        var left = (wofw - ofw) / 2;
        document.querySelector('.pop-up-content-base').style.left = left + 'px';
        var top = (wofh - ofh) / 2;
        document.querySelector('.pop-up-content-base').style.top = top + 'px';
        break;
      case 'horizontal':
        var left = (wofw - ofw) / 2;
        document.querySelector('.pop-up-content-base').style.left = left + 'px';
        var top = (wofh - ofh) / 2;
        document.querySelector('.pop-up-content-base').style.top = top + 'px';
        break;
    }
  }
}
