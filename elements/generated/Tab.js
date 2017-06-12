class XblTab extends XblControlItem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox class="tab-middle box-inherit" xbl:inherits="align,dir,pack,orient,selected,visuallyselected" flex="1">
<image class="tab-icon" xbl:inherits="validate,src=image" role="presentation">
</image>
<label class="tab-text" xbl:inherits="value=label,accesskey,crop,disabled" flex="1" role="presentation">
</label>
</hbox>`;
    let comment = document.createComment("Creating xbl-tab");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-tab", XblTab);
