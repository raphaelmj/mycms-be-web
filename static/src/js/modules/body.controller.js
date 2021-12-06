export default class BodyController {
  constructor() {}

  mobileMenuToogle() {
    $('#mobileMenuContent').toggle('fast');
  }

  openContactForm(name, email) {
    if (window.innerWidth <= 768) {
      document.getElementById('contactForm').dataset.initScroll =
        window.scrollY;
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    angular
      .element(document.getElementById('contactForm'))
      .addClass('visible')
      .attr('data-email', email);
    document.querySelector('#contactForm h3#formTitle').textContent = name;
    angular
      .element(document.getElementById('modalOverlayer'))
      .addClass('visible');
  }
  closeContactForm() {
    if (window.innerWidth <= 768) {
      if (document.getElementById('contactForm').dataset.initScroll) {
        window.scrollTo({
          top: parseInt(
            document.getElementById('contactForm').dataset.initScroll,
          ),
          behavior: 'auto',
        });
      }
    }
    angular
      .element(document.getElementById('contactForm'))
      .removeClass('visible')
      .attr('data-email', '');
    document.querySelector('#contactForm h3#formTitle').textContent = '';
    angular
      .element(document.getElementById('modalOverlayer'))
      .removeClass('visible');
  }
}
