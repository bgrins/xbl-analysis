class FirefoxStatusbarpanel extends XULElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
      <children>
        <xul:label class="statusbarpanel-text" inherits="value=label,crop" crop="right" flex="1"></xul:label>
      </children>
    `;
  }

  set label(val) {
    this.setAttribute("label", val);
    return val;
  }

  get label() {
    return this.getAttribute("label");
  }

  set image(val) {
    this.setAttribute("image", val);
    return val;
  }

  get image() {
    return this.getAttribute("image");
  }

  set src(val) {
    this.setAttribute("src", val);
    return val;
  }

  get src() {
    return this.getAttribute("src");
  }
}
customElements.define("firefox-statusbarpanel", FirefoxStatusbarpanel);
