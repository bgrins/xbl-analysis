class XblToolbox extends XblToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    try {
      // Look to see if there is a toolbarset.
      this.toolbarset = this.firstChild;
      while (this.toolbarset && this.toolbarset.localName != "toolbarset")
        this.toolbarset = this.toolbarset.nextSibling;

      if (this.toolbarset) {
        // Create each toolbar described by the toolbarset.
        var index = 0;
        while (this.toolbarset.hasAttribute("toolbar" + ++index)) {
          var toolbarInfo = this.toolbarset.getAttribute("toolbar" + index);
          var infoSplit = toolbarInfo.split(":");
          this.appendCustomToolbar(infoSplit[0], infoSplit[1]);
        }
      }
    } catch (e) {}
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-toolbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
  appendCustomToolbar(aName, aCurrentSet) {
    if (!this.toolbarset) return null;
    var toolbar = document.createElementNS(
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
      "toolbar"
    );
    toolbar.id = "__customToolbar_" + aName.replace(" ", "_");
    toolbar.setAttribute("customizable", "true");
    toolbar.setAttribute("customindex", ++this.customToolbarCount);
    toolbar.setAttribute("toolbarname", aName);
    toolbar.setAttribute("currentset", aCurrentSet);
    toolbar.setAttribute("mode", this.getAttribute("mode"));
    toolbar.setAttribute("iconsize", this.getAttribute("iconsize"));
    toolbar.setAttribute("context", this.toolbarset.getAttribute("context"));
    toolbar.setAttribute("class", "chromeclass-toolbar");

    this.insertBefore(toolbar, this.toolbarset);
    return toolbar;
  }
}
customElements.define("xbl-toolbox", XblToolbox);
