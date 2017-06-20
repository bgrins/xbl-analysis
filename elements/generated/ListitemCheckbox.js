class XblListitemCheckbox extends XblListitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<listcell type="checkbox" inherits="label,crop,checked,disabled,flexlabel">
</listcell>
</children>`;
    let comment = document.createComment("Creating xbl-listitem-checkbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set checked(val) {
    if (val) this.setAttribute("checked", "true");
    else this.removeAttribute("checked");
    var event = document.createEvent("Events");
    event.initEvent("CheckboxStateChange", true, true);
    this.dispatchEvent(event);
    return val;
  }

  get checked() {
    return this.getAttribute("checked") == "true";
  }
}
customElements.define("xbl-listitem-checkbox", XblListitemCheckbox);
