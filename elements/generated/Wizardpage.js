class FirefoxWizardpage extends FirefoxWizardBase {
  connectedCallback() {
    super.connectedCallback()

    this.pageIndex = -1;

    this.setupHandlers();
  }

  set pageid(val) {
    this.setAttribute('pageid', val);
  }

  get pageid() {
    return this.getAttribute('pageid');
  }

  set next(val) {
    this.setAttribute('next', val);
    this.parentNode._accessMethod = 'random';
    return val;
  }

  get next() {
    return this.getAttribute('next');
  }

  setupHandlers() {

  }
}