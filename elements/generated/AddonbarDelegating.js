class FirefoxAddonbarDelegating extends XULElement {
  connectedCallback() {
    Object.defineProperty(this, "_whiteListed", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._whiteListed;
        return (this._whiteListed = new Set([
          "addonbar-closebutton",
          "status-bar"
        ]));
      }
    });
    Object.defineProperty(this, "_isModifying", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._isModifying;
        return (this._isModifying = false);
      },
      set(val) {
        delete this._isModifying;
        return (this._isModifying = val);
      }
    });
    Object.defineProperty(this, "_currentSetMigrated", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._currentSetMigrated;
        return (this._currentSetMigrated = new Set());
      },
      set(val) {
        delete this._currentSetMigrated;
        return (this._currentSetMigrated = val);
      }
    });

    // Reading these immediately so nobody messes with them anymore:
    this._delegatingToolbar = this.getAttribute("toolbar-delegate");
    this._wasCollapsed = this.getAttribute("collapsed") == "true";
    // Leaving those in here to unbreak some code:
    if (document.readyState == "complete") {
      this._init();
    } else {
      // Need to wait until XUL overlays are loaded. See bug 554279.
      let self = this;
      document.addEventListener(
        "readystatechange",
        function onReadyStateChange() {
          if (document.readyState != "complete") return;
          document.removeEventListener("readystatechange", onReadyStateChange);
          self._init();
        }
      );
    }
  }

  get customizationTarget() {
    return this;
  }

  set currentSet(val) {
    let v = val.split(",");
    let newButtons = v.filter(
      x =>
        x &&
        (!this._whiteListed.has(x) &&
          !CustomizableUI.isSpecialWidget(x) &&
          !this._currentSetMigrated.has(x))
    );
    for (let newButton of newButtons) {
      this._currentSetMigrated.add(newButton);
      this.insertItem(newButton);
    }
    this._updateMigratedSet();
  }

  get currentSet() {
    return Array.from(this.children, node => node.id).join(",");
  }

  get toolbox() {
    if (
      !this._toolbox &&
      this.parentNode &&
      this.parentNode.localName == "toolbox"
    ) {
      this._toolbox = this.parentNode;
    }

    return this._toolbox;
  }
  _init() {
    // Searching for the toolbox palette in the toolbar binding because
    // toolbars are constructed first.
    let toolbox = this.toolbox;
    if (toolbox && !toolbox.palette) {
      for (let node of toolbox.children) {
        if (node.localName == "toolbarpalette") {
          // Hold on to the palette but remove it from the document.
          toolbox.palette = node;
          toolbox.removeChild(node);
        }
      }
    }

    // pass the current set of children for comparison with placements:
    let children = [];
    for (let node of this.childNodes) {
      if (node.getAttribute("skipintoolbarset") != "true" && node.id) {
        // Force everything to be removable so that buildArea can chuck stuff
        // out if the user has customized things / we've been here before:
        if (!this._whiteListed.has(node.id)) {
          node.setAttribute("removable", "true");
        }
        children.push(node);
      }
    }
    CustomizableUI.registerToolbarNode(this, children);
    let existingMigratedItems = (this.getAttribute("migratedset") || "")
      .split(",");
    for (let migratedItem of existingMigratedItems.filter(x => !!x)) {
      this._currentSetMigrated.add(migratedItem);
    }
    this.evictNodes();
    // We can't easily use |this| or strong bindings for the observer fn here
    // because that creates leaky circular references when the node goes away,
    // and XBL destructors are unreliable.
    let mutationObserver = new MutationObserver(function(mutations) {
      if (!mutations.length) {
        return;
      }
      let toolbar = mutations[0].target;
      // Can't use our own attribute because we might not have one if we're set to
      // collapsed
      let areCustomizing = toolbar.ownerDocument.documentElement.getAttribute(
        "customizing"
      );
      if (!toolbar._isModifying && !areCustomizing) {
        toolbar.evictNodes();
      }
    });
    mutationObserver.observe(this, { childList: true });
  }
  evictNodes() {
    this._isModifying = true;
    let i = this.childNodes.length;
    while (i--) {
      let node = this.childNodes[i];
      if (this.childNodes[i].id) {
        this.evictNode(this.childNodes[i]);
      } else {
        node.remove();
      }
    }
    this._isModifying = false;
    this._updateMigratedSet();
  }
  evictNode(aNode) {
    if (
      this._whiteListed.has(aNode.id) ||
      CustomizableUI.isSpecialWidget(aNode.id)
    ) {
      return;
    }
    const kItemMaxWidth = 100;
    let oldParent = aNode.parentNode;
    aNode.setAttribute("removable", "true");
    this._currentSetMigrated.add(aNode.id);

    let movedOut = false;
    if (!this._wasCollapsed) {
      try {
        let nodeWidth = aNode.getBoundingClientRect().width;
        if (nodeWidth == 0 || nodeWidth > kItemMaxWidth) {
          throw new Error(
            aNode.id +
              " is too big (" +
              nodeWidth +
              "px wide), moving to the palette"
          );
        }
        CustomizableUI.addWidgetToArea(aNode.id, this._delegatingToolbar);
        movedOut = true;
      } catch (ex) {
        // This will throw if the node is too big, or can't be moved there for
        // some reason. Report this:
        Cu.reportError(ex);
      }
    }

    /* We won't have moved the widget if either the add-on bar was collapsed,
           * or if it was too wide to be inserted into the navbar. */
    if (!movedOut) {
      try {
        CustomizableUI.removeWidgetFromArea(aNode.id);
      } catch (ex) {
        Cu.reportError(ex);
        aNode.remove();
      }
    }

    // Surprise: addWidgetToArea(palette) will get you nothing if the palette
    // is not constructed yet. Fix:
    if (aNode.parentNode == oldParent) {
      let palette = this.toolbox.palette;
      if (palette && oldParent != palette) {
        palette.appendChild(aNode);
      }
    }
  }
  insertItem(aId, aBeforeElt, aWrapper) {
    if (aWrapper) {
      Cu.reportError(
        "Can't insert " +
          aId +
          ": using insertItem " +
          "no longer supports wrapper elements."
      );
      return null;
    }

    let widget = CustomizableUI.getWidget(aId);
    widget = widget && widget.forWindow(window);
    let node = widget && widget.node;
    if (!node) {
      return null;
    }

    this._isModifying = true;
    // Temporarily add it here so it can have a width, then ditch it:
    this.appendChild(node);
    this.evictNode(node);
    this._isModifying = false;
    this._updateMigratedSet();
    // We will now have moved stuff around; kick off some events
    // so add-ons know we've just moved their stuff:
    // XXXgijs: only in this window. It's hard to know for sure what's the right
    // thing to do here - typically insertItem is used on each window, so
    // this seems to make the most sense, even if some of the effects of
    // evictNode might affect multiple windows.
    CustomizableUI.dispatchToolboxEvent("customizationchange", {}, window);
    CustomizableUI.dispatchToolboxEvent("aftercustomization", {}, window);
    return node;
  }
  getMigratedItems() {
    return [...this._currentSetMigrated];
  }
  _updateMigratedSet() {
    let newMigratedItems = this.getMigratedItems().join(",");
    if (this.getAttribute("migratedset") != newMigratedItems) {
      this.setAttribute("migratedset", newMigratedItems);
      this.ownerDocument.persist(this.id, "migratedset");
    }
  }
}
customElements.define("firefox-addonbar-delegating", FirefoxAddonbarDelegating);
