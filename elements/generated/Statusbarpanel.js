class FirefoxStatusbarpanel extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<children>
<firefox-text-label class="statusbarpanel-text" inherits="value=label,crop" crop="right" flex="1">
</firefox-text-label>
</children>`;
    let comment = document.createComment("Creating firefox-statusbarpanel");
    this.prepend(comment);
  }
  disconnectedCallback() {}

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
