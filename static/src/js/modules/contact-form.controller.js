export default class ContactFormController {
  constructor($http, $scope, $document, $filter, AppService) {
    this.http = $http;
    this.scope = $scope;
    this.document = $document;
    this.filter = $filter;
    this.container = document.querySelector('#contactForm');
    this.appService = AppService;
    this.emailRegex = /^[0-9a-z_.-]+@[0-9a-z.-]+\.[a-z]{2,3}$/i;
    this.phoneRegex = /^[0-9]+$/i;
    this.scope.sentRaport = '';
    this.scope.errorRaport = '';
  }
  initData() {
    this.scope.data = {
      name: '',
      email: '',
      phone: '',
      description: '',
      reg1: false,
      reg2: false,
      reg3: false,
    };

    this.scope.valid = {
      name: {
        className: '',
        isValid: false,
      },
      email: {
        className: '',
        isValid: false,
      },
      phone: {
        className: '',
        isValid: false,
      },
      description: {
        className: '',
        isValid: false,
      },
    };

    this.scope.regsContent = {
      reg1: false,
      // reg2: false,
      // reg3: false,
    };

    this.scope.req1Class = '';

    this.scope.sendingRaport = '';
  }

  checkName() {
    if (this.scope.data.name.length > 2) {
      this.scope.valid.name.className = '';
      this.scope.valid.name.isValid = true;
    } else {
      this.scope.valid.name.className = 'is-invalid';
      this.scope.valid.name.isValid = false;
    }
  }

  checkPhone() {
    if (
      this.scope.data.phone.length == 9 &&
      this.phoneRegex.test(this.scope.data.phone)
    ) {
      this.scope.valid.phone.className = '';
      this.scope.valid.phone.isValid = true;
    } else {
      this.scope.valid.phone.className = 'is-invalid';
      this.scope.valid.phone.isValid = false;
    }
  }

  checkClientEmail() {
    if (this.emailRegex.test(this.scope.data.email)) {
      this.scope.valid.email.className = '';
      this.scope.valid.email.isValid = true;
    } else {
      this.scope.valid.email.className = 'is-invalid';
      this.scope.valid.email.isValid = false;
    }
  }

  checkDescription() {
    if (this.scope.data.description.length > 2) {
      this.scope.valid.description.className = '';
      this.scope.valid.description.isValid = true;
    } else {
      this.scope.valid.description.className = 'is-invalid';
      this.scope.valid.description.isValid = false;
    }
  }

  setRegsValidClasses() {
    if (this.scope.data.reg1) {
      this.scope.req1Class = '';
    } else {
      this.scope.req1Class = 'not-selected';
    }
    // if (this.scope.data.reg2) {
    //   this.scope.req2Class = '';
    // } else {
    //   this.scope.req2Class = 'not-selected';
    // }
    // if (this.scope.data.reg3) {
    //   this.scope.req3Class = '';
    // } else {
    //   this.scope.req3Class = 'not-selected';
    // }
  }

  submitForm() {
    this.checkName();
    this.checkClientEmail();
    this.checkPhone();
    this.checkDescription();
    this.setRegsValidClasses();

    if (this.filter('isValid')(this.scope.valid) && this.scope.data.reg1) {
      this.scope.sendingRaport = 'visible';
      this.scope.data.sendTo = document.getElementById(
        'contactForm',
      ).dataset.email;
      this.http
        .post(this.appService.url + '/api/form/contact/send', this.scope.data)
        .then(
          (res) => {
            console.log(res);
            // dataLayer.push({ event: 'formularz' });
            this.initData();
            this.scope.sentRaport = 'visible';
            this.scope.errorRaport = '';
          },
          (err) => {
            this.scope.sentRaport = '';
            this.scope.sendingRaport = '';
            this.scope.errorRaport = 'visible';
          },
        );
    }
  }

  closeForm() {
    this.container.classList.remove('visible');
  }
}
