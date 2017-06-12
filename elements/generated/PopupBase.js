class XblPopupBase extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-popup-base");
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

  set position(val) {
    this.setAttribute("position", val);
    return val;
  }

  get position() {
    return this.getAttribute("position");
  }

  get state() {
    return this.popupBoxObject.popupState;
  }

  get triggerNode() {
    return this.popupBoxObject.triggerNode;
  }

  get anchorNode() {
    return this.popupBoxObject.anchorNode;
  }
}
customElements.define("xbl-popup-base", XblPopupBase);
