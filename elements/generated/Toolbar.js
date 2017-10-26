class FirefoxToolbar extends FirefoxToolbarBase {
  connectedCallback() {
    super.connectedCallback();

    Object.defineProperty(this, "_toolbox", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._toolbox;
        return (this._toolbox = null);
      },
      set(val) {
        delete this._toolbox;
        return (this._toolbox = val);
      }
    });
    Object.defineProperty(this, "_newElementCount", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._newElementCount;
        return (this._newElementCount = 0);
      },
      set(val) {
        delete this._newElementCount;
        return (this._newElementCount = val);
      }
    });

    if (document.readyState == "complete") {
      this._init();
    } else {
      // Need to wait until XUL overlays are loaded. See bug 554279.
      let self = this;
      document.addEventListener("readystatechange", function listener(event) {
        if (document.readyState != "complete") return;
        document.removeEventListener("readystatechange", listener);
        self._init();
      });
    }
  }

  set toolbarName(val) {
    this.setAttribute("toolbarname", val);
    return val;
  }

  get toolbarName() {
    return this.getAttribute("toolbarname");
  }

  get toolbox() {
    if (this._toolbox) return this._toolbox;

    let toolboxId = this.getAttribute("toolboxid");
    if (toolboxId) {
      let toolbox = document.getElementById(toolboxId);
      if (!toolbox) {
        let tbName = this.toolbarName;
        if (tbName) tbName = " (" + tbName + ")";
        else tbName = "";
        throw new Error(
          `toolbar ID ${this
            .id}${tbName}: toolboxid attribute '${toolboxId}' points to a toolbox that doesn't exist`
        );
      }

      if (toolbox.externalToolbars.indexOf(this) == -1)
        toolbox.externalToolbars.push(this);

      return (this._toolbox = toolbox);
    }

    return (this._toolbox = this.parentNode &&
      this.parentNode.localName == "toolbox"
      ? this.parentNode
      : null);
  }

  set currentSet(val) {
    if (val == this.currentSet) return val;

    var ids = val == "__empty" ? [] : val.split(",");

    var nodeidx = 0;
    var paletteItems = {},
      added = {};

    var palette = this.toolbox ? this.toolbox.palette : null;

    // build a cache of items in the toolbarpalette
    var paletteChildren = palette ? palette.childNodes : [];
    for (let c = 0; c < paletteChildren.length; c++) {
      let curNode = paletteChildren[c];
      paletteItems[curNode.id] = curNode;
    }

    var children = this.childNodes;

    // iterate over the ids to use on the toolbar
    for (let i = 0; i < ids.length; i++) {
      let id = ids[i];
      // iterate over the existing nodes on the toolbar. nodeidx is the
      // spot where we want to insert items.
      let found = false;
      for (let c = nodeidx; c < children.length; c++) {
        let curNode = children[c];
        if (this._idFromNode(curNode) == id) {
          // the node already exists. If c equals nodeidx, we haven't
          // iterated yet, so the item is already in the right position.
          // Otherwise, insert it here.
          if (c != nodeidx) {
            this.insertBefore(curNode, children[nodeidx]);
          }

          added[curNode.id] = true;
          nodeidx++;
          found = true;
          break;
        }
      }
      if (found) {
        // move on to the next id
        continue;
      }

      // the node isn't already on the toolbar, so add a new one.
      var nodeToAdd = paletteItems[id] || this._getToolbarItem(id);
      if (nodeToAdd && !(nodeToAdd.id in added)) {
        added[nodeToAdd.id] = true;
        this.insertBefore(nodeToAdd, children[nodeidx] || null);
        nodeToAdd.setAttribute("removable", "true");
        nodeidx++;
      }
    }

    // remove any leftover removable nodes
    for (let i = children.length - 1; i >= nodeidx; i--) {
      let curNode = children[i];

      let curNodeId = this._idFromNode(curNode);
      // skip over fixed items
      if (curNodeId && curNode.getAttribute("removable") == "true") {
        if (palette) palette.appendChild(curNode);
        else this.removeChild(curNode);
      }
    }

    return val;
  }

  get currentSet() {
    var node = this.firstChild;
    var currentSet = [];
    while (node) {
      var id = this._idFromNode(node);
      if (id) {
        currentSet.push(id);
      }
      node = node.nextSibling;
    }

    return currentSet.join(",") || "__empty";
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
customElements.define("firefox-toolbar", FirefoxToolbar);
