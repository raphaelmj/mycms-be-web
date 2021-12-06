export default class CookieController {
  constructor($scope, $cookies) {
    $scope.hideCookieCloud = () => {
      const date = new Date();
      const nDate = new Date(date.getTime() + 24 * 60 * 60000 * 14);
      document.querySelector('.cookie-cloud').style.display = 'none';
      $cookies.put('cookie_confirm', 'accept', { expires: nDate });
    };
  }
}
