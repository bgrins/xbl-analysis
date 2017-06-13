class XblToolbar extends XblToolbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-toolbar");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set toolbarName(val) {
    this.setAttribute("toolbarname", val);
    return val;
  }

  get toolbarName() {
    return this.getAttribute("toolbarname");
  }
  _init() {
    // Searching for the toolbox palette in the toolbar binding because
    // toolbars are constructed first.
    var toolbox = this.toolbox;
    if (!toolbox) return;

    if (!toolbox.palette) {
      // Look to see if there is a toolbarpalette.
      var node = toolbox.firstChild;
      while (node) {
        if (node.localName == "toolbarpalette") break;
        node = node.nextSibling;
      }

      if (!node) return;

      // Hold on to the palette but remove it from the document.
      toolbox.palette = node;
      toolbox.removeChild(node);
    }

    // Build up our contents from the palette.
    var currentSet = this.getAttribute("currentset");
    if (!currentSet) currentSet = this.getAttribute("defaultset");
    if (currentSet) this.currentSet = currentSet;
  }
  _idFromNode(aNode) {
    if (aNode.getAttribute("skipintoolbarset") == "true") return "";

    switch (aNode.localName) {
      case "toolbarseparator":
        return "separator";
      case "toolbarspring":
        return "spring";
      case "toolbarspacer":
        return "spacer";
      default:
        return aNode.id;
    }
  }
  _getToolbarItem(aId) {
    const XUL_NS =
      "http://www.mozilla.org/keymaster/" + "gatekeeper/there.is.only.xul";

    var newItem = null;
    switch (aId) {
      // Handle special cases
      case "separator":
      case "spring":
      case "spacer":
        newItem = document.createElementNS(XUL_NS, "toolbar" + aId);
        // Due to timers resolution Date.now() can be the same for
        // elements created in small timeframes.  So ids are
        // differentiated through a unique count suffix.
        newItem.id = aId + Date.now() + ++this._newElementCount;
        if (aId == "spring") newItem.flex = 1;
        break;
      default:
        var toolbox = this.toolbox;
        if (!toolbox) break;

        // look for an item with the same id, as the item may be
        // in a different toolbar.
        var item = document.getElementById(aId);
        if (
          item &&
          item.parentNode &&
          item.parentNode.localName == "toolbar" &&
          item.parentNode.toolbox == toolbox
        ) {
          newItem = item;
          break;
        }

        if (toolbox.palette) {
          // Attempt to locate an item with a matching ID within
          // the palette.
          let paletteItem = this.toolbox.palette.firstChild;
          while (paletteItem) {
            if (paletteItem.id == aId) {
              newItem = paletteItem;
              break;
            }
            paletteItem = paletteItem.nextSibling;
          }
        }
        break;
    }

    return newItem;
  }
  insertItem(aId, aBeforeElt, aWrapper) {
    var newItem = this._getToolbarItem(aId);
    if (!newItem) return null;

    var insertItem = newItem;
    // make sure added items are removable
    newItem.setAttribute("removable", "true");

    // Wrap the item in another node if so inclined.
    if (aWrapper) {
      aWrapper.appendChild(newItem);
      insertItem = aWrapper;
    }

    // Insert the palette item into the toolbar.
    if (aBeforeElt) this.insertBefore(insertItem, aBeforeElt);
    else this.appendChild(insertItem);

    return newItem;
  }
  hasCustomInteractiveItems(aCurrentSet) {
    if (aCurrentSet == "__empty") return false;

    var defaultOrNoninteractive = (this.getAttribute("defaultset") || "")
      .split(",")
      .concat(["separator", "spacer", "spring"]);
    return aCurrentSet.split(",").some(function(item) {
      return defaultOrNoninteractive.indexOf(item) == -1;
    });
  }
}
customElements.define("xbl-toolbar", XblToolbar);
