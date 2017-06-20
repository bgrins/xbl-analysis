class XblScale extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    try {
      this._userChanged = false;
      var value = parseInt(this.getAttribute("value"), 10);
      if (!isNaN(value)) this.value = value;
      else if (this.min > 0) this.value = this.min;
      else if (this.max < 0) this.value = this.max;
    } catch (e) {}
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
  _getIntegerAttribute(aAttr, aDefaultValue) {}
  _setIntegerAttribute(aAttr, aValue) {
    var intvalue = parseInt(aValue, 10);
    if (!isNaN(intvalue)) {
      if (aAttr == "curpos") {
        if (intvalue < this.min) intvalue = this.min;
        else if (intvalue > this.max) intvalue = this.max;
      }
      this._slider.setAttribute(aAttr, intvalue);
    }
    return aValue;
  }
  decrease() {
    var newpos = this.value - this.increment;
    var startpos = this.min;
    this.value = newpos > startpos ? newpos : startpos;
  }
  increase() {
    var newpos = this.value + this.increment;
    var endpos = this.max;
    this.value = newpos < endpos ? newpos : endpos;
  }
  decreasePage() {
    var newpos = this.value - this.pageIncrement;
    var startpos = this.min;
    this.value = newpos > startpos ? newpos : startpos;
  }
  increasePage() {
    var newpos = this.value + this.pageIncrement;
    var endpos = this.max;
    this.value = newpos < endpos ? newpos : endpos;
  }
  valueChanged(which, newValue, userChanged) {
    switch (which) {
      case "curpos":
        this.setAttribute("value", newValue);

        // in the future, only fire the change event when userChanged
        // or _userChanged is true
        var changeEvent = document.createEvent("Events");
        changeEvent.initEvent("change", true, true);
        this.dispatchEvent(changeEvent);
        break;

      case "minpos":
        this.setAttribute("min", newValue);
        break;

      case "maxpos":
        this.setAttribute("max", newValue);
        break;
    }
  }
  dragStateChanged(isDragging) {}
}
customElements.define("xbl-scale", XblScale);
