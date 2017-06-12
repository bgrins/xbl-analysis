class XblPrefpane extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<vbox class="content-box" xbl:inherits="flex">
<children>
</children>
</vbox>`;
    let comment = document.createComment("Creating xbl-prefpane");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set src(val) {
    this.setAttribute("src", val);
    return val;
  }

  get src() {
    return this.getAttribute("src");
  }

  set selected(val) {
    this.setAttribute("selected", val);
    return val;
  }

  get selected() {
    return this.getAttribute("selected") == "true";
  }

  set image(val) {
    this.setAttribute("image", val);
    return val;
  }

  get image() {
    return this.getAttribute("image");
  }

  set label(val) {
    this.setAttribute("label", val);
    return val;
  }

  get label() {
    return this.getAttribute("label");
  }

  get preferenceElements() {
    return this.getElementsByAttribute("preference", "*");
  }

  get preferences() {
    return this.getElementsByTagName("preference");
  }

  set loaded(val) {
    this._loaded = val;
    return val;
  }

  get loaded() {
    return !this.src ? true : this._loaded;
  }
}
customElements.define("xbl-prefpane", XblPrefpane);
