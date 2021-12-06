export default class PageRotorController {
  constructor($scope, $interval) {
    this.scope = $scope;
    this.interval = $interval;
  }

  init() {
    if (this.scope.pageRotor.total > 1) {
      this.startRotorInterval();
    }
  }

  startRotorInterval() {
    this.interval(() => {
      this.scope.pageRotor.stop--;
      if (this.scope.pageRotor.stop > 0) {
        return;
      }

      this.changeSlidesState();

      if (this.scope.pageRotor.next === this.scope.pageRotor.total - 1) {
        this.scope.pageRotor.next = 0;
        this.scope.pageRotor.current++;
      } else if (
        this.scope.pageRotor.current ===
        this.scope.pageRotor.total - 1
      ) {
        this.scope.pageRotor.next++;
        this.scope.pageRotor.current = 0;
      } else {
        this.scope.pageRotor.next++;
        this.scope.pageRotor.current++;
      }
    }, 5000);
  }

  changeSlidesState() {
    angular
      .element(document.querySelector(`.slide-${this.scope.pageRotor.current}`))
      .removeClass('active');
    angular
      .element(
        document.querySelector(`.slide-logo-${this.scope.pageRotor.current}`),
      )
      .removeClass('active');
    angular
      .element(document.querySelector(`.slide-${this.scope.pageRotor.next}`))
      .addClass('active');
    angular
      .element(
        document.querySelector(`.slide-logo-${this.scope.pageRotor.next}`),
      )
      .addClass('active');
  }

  onSwipeLeft(event) {
    this.scope.pageRotor.stop = 3;

    if (this.scope.pageRotor.next === this.scope.pageRotor.total - 1) {
      this.scope.pageRotor.next = 0;
      this.scope.pageRotor.current++;
    } else if (
      this.scope.pageRotor.current ===
      this.scope.pageRotor.total - 1
    ) {
      this.scope.pageRotor.next++;
      this.scope.pageRotor.current = 0;
    } else {
      this.scope.pageRotor.next++;
      this.scope.pageRotor.current++;
    }

    this.onSwipeUpdateState();
  }

  onSwipeRight(event) {
    this.scope.pageRotor.stop = 2;

    if (this.scope.pageRotor.current === 0) {
      this.scope.pageRotor.current = this.scope.pageRotor.total - 1;
      this.scope.pageRotor.next = 0;
    } else if (this.scope.pageRotor.next === 0) {
      this.scope.pageRotor.current--;
      this.scope.pageRotor.next = this.scope.pageRotor.total - 1;
    } else {
      this.scope.pageRotor.next--;
      this.scope.pageRotor.current--;
    }

    this.onSwipeUpdateState();
  }

  onSwipeUpdateState() {
    angular.element(document.querySelectorAll(`.slide`)).removeClass('active');
    angular
      .element(document.querySelectorAll(`.slide-logo`))
      .removeClass('active');
    angular
      .element(document.querySelector(`.slide-${this.scope.pageRotor.current}`))
      .addClass('active');
    angular
      .element(
        document.querySelector(`.slide-logo-${this.scope.pageRotor.current}`),
      )
      .addClass('active');
  }
}
