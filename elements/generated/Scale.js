class XblScale extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<slider anonid="slider" class="scale-slider" snap="true" flex="1" inherits="disabled,orient,dir,curpos=value,minpos=min,maxpos=max,increment,pageincrement,movetoclick">
<thumb class="scale-thumb" inherits="disabled,orient">
</thumb>
</slider>`;
    let comment = document.createComment("Creating xbl-scale");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set value(val) {
    return this._setIntegerAttribute("curpos", val);
  }

  get value() {
    return this._getIntegerAttribute("curpos", 0);
  }

  set min(val) {
    return this._setIntegerAttribute("minpos", val);
  }

  get min() {
    return this._getIntegerAttribute("minpos", 0);
  }

  set max(val) {
    return this._setIntegerAttribute("maxpos", val);
  }

  get max() {
    return this._getIntegerAttribute("maxpos", 100);
  }

  set increment(val) {
    return this._setIntegerAttribute("increment", val);
  }

  get increment() {
    return this._getIntegerAttribute("increment", 1);
  }

  set pageIncrement(val) {
    return this._setIntegerAttribute("pageincrement", val);
  }

  get pageIncrement() {
    return this._getIntegerAttribute("pageincrement", 10);
  }
}
customElements.define("xbl-scale", XblScale);
