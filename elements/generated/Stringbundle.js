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
