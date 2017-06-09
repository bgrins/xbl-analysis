class XblStatusbarpanelIconic extends XblStatusbarpanel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<image class="statusbarpanel-icon" xbl:inherits="src,src=image">
</image>`;
    let comment = document.createComment("Creating xbl-statusbarpanel-iconic");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-statusbarpanel-iconic", XblStatusbarpanelIconic);
