class XblTab extends XblControlItem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="tab-middle box-inherit" inherits="align,dir,pack,orient,selected,visuallyselected" flex="1">
<image class="tab-icon" inherits="validate,src=image" role="presentation">
</image>
<xbl-text-label class="tab-text" inherits="value=label,accesskey,crop,disabled" flex="1" role="presentation">
</xbl-text-label>
</hbox>`;
    let comment = document.createComment("Creating xbl-tab");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get selected() {
    return this.getAttribute("selected") == "true";
  }

  set linkedPanel(val) {
    this.setAttribute("linkedpanel", val);
    return val;
  }

  get linkedPanel() {
    return this.getAttribute("linkedpanel");
  }
}
customElements.define("xbl-tab", XblTab);
