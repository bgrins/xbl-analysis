class FirefoxListitemCheckbox extends FirefoxListitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<xul:listcell type="checkbox" inherits="label,crop,checked,disabled,flexlabel">
</xul:listcell>
</children>`;
    let comment = document.createComment("Creating firefox-listitem-checkbox");
    this.prepend(comment);

    this.addEventListener("mousedown", event => {
      if (!this.disabled && !this.control.disabled) {
        this.checked = !this.checked;
        this.doCommand();
      }
    });
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
customElements.define("firefox-listitem-checkbox", FirefoxListitemCheckbox);
