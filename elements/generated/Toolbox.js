class FirefoxToolbox extends FirefoxToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-toolbox");
    this.prepend(comment);

    Object.defineProperty(this, "palette", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.palette;
        return (this.palette = null);
      },
      set(val) {
        delete this["palette"];
        return (this["palette"] = val);
      }
    });
    Object.defineProperty(this, "toolbarset", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.toolbarset;
        return (this.toolbarset = null);
      },
      set(val) {
        delete this["toolbarset"];
        return (this["toolbarset"] = val);
      }
    });
    Object.defineProperty(this, "customToolbarCount", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.customToolbarCount;
        return (this.customToolbarCount = 0);
      },
      set(val) {
        delete this["customToolbarCount"];
        return (this["customToolbarCount"] = val);
      }
    });
    Object.defineProperty(this, "externalToolbars", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.externalToolbars;
        return (this.externalToolbars = []);
      },
      set(val) {
        delete this["externalToolbars"];
        return (this["externalToolbars"] = val);
      }
    });

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
  }
  disconnectedCallback() {}

  set customizing(val) {
    if (val) this.setAttribute("customizing", "true");
    else this.removeAttribute("customizing");
    return val;
  }

  get customizing() {
    return this.getAttribute("customizing") == "true";
  }
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
customElements.define("firefox-toolbox", FirefoxToolbox);
