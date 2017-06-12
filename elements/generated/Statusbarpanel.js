class XblStatusbarpanel extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<children>
<label class="statusbarpanel-text" xbl:inherits="value=label,crop" crop="right" flex="1">
</label>
</children>`;
    let comment = document.createComment("Creating xbl-statusbarpanel");
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
customElements.define("xbl-statusbarpanel", XblStatusbarpanel);
