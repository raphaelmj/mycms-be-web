import {
  clickOpen,
  openFromThumbGallery,
  openFromCollectionProgress,
} from './modules/gallery.js';
import BodyController from './modules/body.controller';
import PageRotorController from './modules/page-rotor.controller';
import GalleryRotorController from './modules/gallery-rotor.controller';
import ContactFormController from './modules/contact-form.controller';
import PopupController from './modules/popup.controller';
import CookieController from './modules/cookie.controller';
import './helpers/lazy-images';

const angular = window.angular;

const app = angular
  .module(
    'app',
    ['hmTouchEvents', 'ngSanitize', 'ngCookies'],
    ($interpolateProvider) => {
      $interpolateProvider.startSymbol('[[');
      $interpolateProvider.endSymbol(']]');
    },
  )
  .config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
    $sceDelegateProvider.trustedResourceUrlList(['self', '**']);
    $sceDelegateProvider.bannedResourceUrlList(['**']);
  })
  .config(($locationProvider) => {
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('');
  })
  .run(() => {
    if (location.hash) {
      try {
        const element = document.querySelector(location.hash);
        if (element) {
          setTimeout(() => {
            const y =
              element.getBoundingClientRect().top + window.pageYOffset - 200;

            window.scrollTo({ top: y, behavior: 'smooth' });
          });
        }
      } catch {}
    }
  })
  .factory('isProblemResolution', ($window) => {
    return () => {
      let w = $window.innerWidth;
      let h = $window.innerHeight;
      return w > h && w > 1200 && w < 1400 && h <= 800;
    };
  })
  .factory('AppService', ($location) => {
    return {
      url: $location.protocol() + '://' + $location.host(), //+ ':3000',
    };
  })
  .filter('isValid', function () {
    return function (obj) {
      var bool = true;

      Object.keys(obj).forEach(function (key) {
        if (!obj[key].isValid) {
          bool = false;
        }
      });

      return bool;
    };
  })
  .directive('a', function () {
    return {
      restrict: 'E',
      link: function (scope, elem, attrs) {
        elem.on('click', function (e) {
          // console.log(e.target);
          if (e.target.href) {
            if (e.target.href.indexOf('#') !== -1 && e.target.href != '#') {
              const split = e.target.href.split('#');
              if (split[split.length - 1] !== '') {
                const element = document.querySelector(
                  '#' + split[split.length - 1],
                );
                const y =
                  element.getBoundingClientRect().top +
                  window.pageYOffset -
                  200;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }
          }
        });
      },
    };
  })
  .controller('BodyController', BodyController)
  .controller('PageRotorController', [
    '$scope',
    '$interval',
    PageRotorController,
  ])
  .controller('GalleryRotorController', [
    '$http',
    '$scope',
    '$document',
    '$window',
    GalleryRotorController,
  ])
  .controller('ContactFormController', [
    '$http',
    '$scope',
    '$document',
    '$filter',
    'AppService',
    ContactFormController,
  ])
  .controller('PopupController', [
    '$http',
    '$scope',
    '$document',
    '$window',
    '$timeout',
    PopupController,
  ])
  .controller('CookieController', ['$scope', '$cookies', CookieController]);
app
  .controller('AboutPolandMapsController', [
    '$scope',
    function ($scope) {
      $scope.initData = function (data) {
        $scope.data = JSON.parse(mapPolandData);
        $scope.classes = [];
        $scope.createClassMap();
        // console.log($scope.classes)
      };

      $scope.createClassMap = function () {
        $scope.data.forEach(function (d, i) {
          if (d.type == 'single') {
            $scope.classes[d.key] = {
              visibleCloud: 'hidden-cloud',
              sizeCloud: 'small-cloud',
              zIndexMore: 'normal',
            };
          } else {
            var dCls = [];
            d.childs.forEach(function (dd, ii) {
              dCls[dd.key] = {
                visibleCloud: 'hidden-cloud',
                sizeCloud: 'small-cloud',
                zIndexMore: 'normal',
              };
            });
            $scope.classes[d.key] = {
              clouds: dCls,
            };
          }
        });
      };

      $scope.showCloud = function (key) {
        if ($scope.classes[key].visibleCloud == 'hidden-cloud') {
          $scope.createClassMap();
          $scope.classes[key].visibleCloud = '';
        } else {
          $scope.classes[key].visibleCloud = 'hidden-cloud';
        }
      };

      $scope.showClouds = function (string, parentKey) {
        if ($scope.checkIsCloudsOpen($scope.classes[parentKey].clouds)) {
          $scope.classes[parentKey].clouds.forEach(function (c, i) {
            $scope.classes[parentKey].clouds[i].visibleCloud = 'hidden-cloud';
          });
        } else {
          $scope.createClassMap();
          var toOpen = string.split(',');
          toOpen.forEach(function (v) {
            $scope.classes[parentKey].clouds[v].visibleCloud = '';
          });
        }
      };

      $scope.checkIsCloudsOpen = function (clouds) {
        var bool = false;
        clouds.forEach(function (ob) {
          if (ob.visibleCloud == '') {
            bool = true;
          }
        });
        return bool;
      };

      $scope.showFullCloud = function (key) {
        $scope.classes[key].sizeCloud = '';
        $scope.classes[key].zIndexMore = 'overshow';
      };

      $scope.hideFullCloud = function (key) {
        $scope.classes[key].sizeCloud = 'small-cloud';
        $scope.classes[key].zIndexMore = '';
      };

      $scope.showFullClouds = function (key, parentKey) {
        $scope.classes[parentKey].clouds[key].sizeCloud = '';
        $scope.classes[parentKey].clouds[key].zIndexMore = 'overshow';
      };

      $scope.hideFullClouds = function (key, parentKey) {
        $scope.classes[parentKey].clouds[key].sizeCloud = 'small-cloud';
        $scope.classes[parentKey].clouds[key].zIndexMore = '';
      };

      $scope.hideAll = function () {
        $scope.createClassMap();
      };
    },
  ])
  .controller('AboutWarsawMapsController', [
    '$scope',
    function ($scope) {
      $scope.initData = function (data) {
        $scope.data = JSON.parse(mapWarsawData);
        $scope.classes = [];
        $scope.createClassMap();
        // console.log($scope.classes)
      };

      $scope.createClassMap = function () {
        $scope.data.forEach(function (d, i) {
          if (d.type == 'single') {
            $scope.classes[d.key] = {
              visibleCloud: 'hidden-cloud',
              sizeCloud: 'small-cloud',
              zIndexMore: 'normal',
            };
          } else {
            var dCls = [];
            d.childs.forEach(function (dd, ii) {
              dCls[dd.key] = {
                visibleCloud: 'hidden-cloud',
                sizeCloud: 'small-cloud',
                zIndexMore: 'normal',
              };
            });
            $scope.classes[d.key] = {
              clouds: dCls,
            };
          }
        });
      };

      $scope.showCloud = function (key) {
        if ($scope.classes[key].visibleCloud == 'hidden-cloud') {
          $scope.createClassMap();
          $scope.classes[key].visibleCloud = '';
        } else {
          $scope.classes[key].visibleCloud = 'hidden-cloud';
        }
      };

      $scope.showClouds = function (string, parentKey) {
        if ($scope.checkIsCloudsOpen($scope.classes[parentKey].clouds)) {
          $scope.classes[parentKey].clouds.forEach(function (c, i) {
            $scope.classes[parentKey].clouds[i].visibleCloud = 'hidden-cloud';
          });
        } else {
          $scope.createClassMap();
          var toOpen = string.split(',');
          toOpen.forEach(function (v) {
            $scope.classes[parentKey].clouds[v].visibleCloud = '';
          });
        }
      };

      $scope.checkIsCloudsOpen = function (clouds) {
        var bool = false;
        clouds.forEach(function (ob) {
          if (ob.visibleCloud == '') {
            bool = true;
          }
        });
        return bool;
      };

      $scope.showFullCloud = function (key) {
        $scope.classes[key].sizeCloud = '';
        $scope.classes[key].zIndexMore = 'overshow';
      };

      $scope.hideFullCloud = function (key) {
        $scope.classes[key].sizeCloud = 'small-cloud';
        $scope.classes[key].zIndexMore = '';
      };

      $scope.showFullClouds = function (key, parentKey) {
        $scope.classes[parentKey].clouds[key].sizeCloud = '';
        $scope.classes[parentKey].clouds[key].zIndexMore = 'overshow';
      };

      $scope.hideFullClouds = function (key, parentKey) {
        $scope.classes[parentKey].clouds[key].sizeCloud = 'small-cloud';
        $scope.classes[parentKey].clouds[key].zIndexMore = '';
      };

      $scope.hideAll = function () {
        $scope.createClassMap();
      };
    },
  ]);

[...document.querySelectorAll('.click-open')].forEach((el) => {
  el.addEventListener('click', (ev) => {
    clickOpen(ev.target);
  });
});

[...document.querySelectorAll('.gallery-r-element')].forEach((el) => {
  el.addEventListener('click', (ev) => {
    openFromThumbGallery(ev.target);
  });
});

[...document.querySelectorAll('.gallery-collection')].forEach((el) => {
  el.addEventListener('click', (ev) => {
    openFromCollectionProgress(
      ev.target.dataset.collection,
      0,
      'progress',
      ev.target,
    );
  });
});
