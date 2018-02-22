class FirefoxProgressmeter extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:spacer class="progress-bar" inherits="mode"></xul:spacer>
      <xul:spacer class="progress-remainder" inherits="mode"></xul:spacer>
    `;

    this._setupEventListeners();
  }

  set mode(val) {
    if (this.mode != val) this.setAttribute('mode', val);
    return val;
  }

  get mode() {
    return this.getAttribute('mode');
  }

  set value(val) {
    var p = Math.round(val);
    var max = Math.round(this.max);
    if (p < 0)
      p = 0;
    else if (p > max)
      p = max;
    var c = this.value;
    if (p != c) {
      var delta = p - c;
      if (delta < 0)
        delta = -delta;
      if (delta > 3 || p == 0 || p == max) {
        this.setAttribute("value", p);
        // Fire DOM event so that accessible value change events occur
        var event = document.createEvent("Events");
        event.initEvent("ValueChange", true, true);
        this.dispatchEvent(event);
      }
    }

    return val;
  }

  get value() {
    return this.getAttribute('value') || '0';
  }

  set max(val) {
    this.setAttribute('max', isNaN(val) ? 100 : Math.max(val, 1));
    this.value = this.value;
    return val;
  }

  get max() {
    return this.getAttribute('max') || '100';
  }

  _setupEventListeners() {

  }
}