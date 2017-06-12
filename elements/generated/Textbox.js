class XblTextbox extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<children>
</children>
<hbox class="textbox-input-box" flex="1" xbl:inherits="context,spellcheck">
<input class="textbox-input" anonid="input" xbl:inherits="value,type,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey,noinitialfocus,mozactionhint,spellcheck">
</input>
</hbox>`;
    let comment = document.createComment("Creating xbl-textbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set value(val) {
    this.inputField.value = val;
    return val;
  }

  get value() {
    return this.inputField.value;
  }

  set defaultValue(val) {
    this.inputField.defaultValue = val;
    return val;
  }

  get defaultValue() {
    return this.inputField.defaultValue;
  }

  set label(val) {
    this.setAttribute("label", val);
    return val;
  }

  get label() {
    return (
      this.getAttribute("label") ||
      (this.labelElement ? this.labelElement.value : this.placeholder)
    );
  }

  set placeholder(val) {
    this.inputField.placeholder = val;
    return val;
  }

  get placeholder() {
    return this.inputField.placeholder;
  }

  set emptyText(val) {
    this.placeholder = val;
    return val;
  }

  get emptyText() {
    return this.placeholder;
  }

  set type(val) {
    if (val) this.setAttribute("type", val);
    else this.removeAttribute("type");
    return val;
  }

  get type() {
    return this.getAttribute("type");
  }

  set maxLength(val) {
    this.inputField.maxLength = val;
    return val;
  }

  get maxLength() {
    return this.inputField.maxLength;
  }

  set disabled(val) {
    this.inputField.disabled = val;
    if (val) this.setAttribute("disabled", "true");
    else this.removeAttribute("disabled");
    return val;
  }

  get disabled() {
    return this.inputField.disabled;
  }

  set tabIndex(val) {
    this.inputField.tabIndex = val;
    if (val) this.setAttribute("tabindex", val);
    else this.removeAttribute("tabindex");
    return val;
  }

  get tabIndex() {
    return parseInt(this.getAttribute("tabindex"));
  }

  set size(val) {
    this.inputField.size = val;
    return val;
  }

  get size() {
    return this.inputField.size;
  }

  set readOnly(val) {
    this.inputField.readOnly = val;
    if (val) this.setAttribute("readonly", "true");
    else this.removeAttribute("readonly");
    return val;
  }

  get readOnly() {
    return this.inputField.readOnly;
  }

  set clickSelectsAll(val) {
    if (val) this.setAttribute("clickSelectsAll", "true");
    else this.removeAttribute("clickSelectsAll");
    return val;
  }

  get clickSelectsAll() {
    return this.getAttribute("clickSelectsAll") == "true";
  }

  get controllers() {
    return this.inputField.controllers;
  }

  get textLength() {
    return this.inputField.textLength;
  }

  set selectionStart(val) {
    this.inputField.selectionStart = val;
    return val;
  }

  get selectionStart() {
    return this.inputField.selectionStart;
  }

  set selectionEnd(val) {
    this.inputField.selectionEnd = val;
    return val;
  }

  get selectionEnd() {
    return this.inputField.selectionEnd;
  }
}
customElements.define("xbl-textbox", XblTextbox);
