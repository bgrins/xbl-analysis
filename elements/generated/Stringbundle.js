class XblStringbundle extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-stringbundle");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get stringBundle() {
    if (!this._bundle) {
      try {
        this._bundle = Components.classes["@mozilla.org/intl/stringbundle;1"]
          .getService(Components.interfaces.nsIStringBundleService)
          .createBundle(this.src);
      } catch (e) {
        dump("Failed to get stringbundle:\n");
        dump(e + "\n");
      }
    }
    return this._bundle;
  }

  set src(val) {
    this._bundle = null;
    this.setAttribute("src", val);
    return val;
  }

  get src() {
    return this.getAttribute("src");
  }

  get strings() {
    // Note: this is a sucky method name! Should be:
    //       readonly attribute nsISimpleEnumerator strings;
    return this.stringBundle.getSimpleEnumeration();
  }
  getString(aStringKey) {
    try {
      return this.stringBundle.GetStringFromName(aStringKey);
    } catch (e) {
      dump(
        "*** Failed to get string " +
          aStringKey +
          " in bundle: " +
          this.src +
          "\n"
      );
      throw e;
    }
  }
  getFormattedString(aStringKey, aStringsArray) {
    try {
      return this.stringBundle.formatStringFromName(
        aStringKey,
        aStringsArray,
        aStringsArray.length
      );
    } catch (e) {
      dump(
        "*** Failed to format string " +
          aStringKey +
          " in bundle: " +
          this.src +
          "\n"
      );
      throw e;
    }
  }
}
customElements.define("xbl-stringbundle", XblStringbundle);
