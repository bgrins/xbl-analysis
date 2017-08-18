class FirefoxPlacesPopupBase extends FirefoxPopup {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox flex="1">
<vbox class="menupopup-drop-indicator-bar" hidden="true">
<image class="menupopup-drop-indicator" mousethrough="always">
</image>
</vbox>
<arrowscrollbox class="popup-internal-box" flex="1" orient="vertical" smoothscroll="false">
<children>
</children>
</arrowscrollbox>
</hbox>`;
    let comment = document.createComment("Creating firefox-places-popup-base");
    this.prepend(comment);

    Object.defineProperty(this, "AppConstants", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.AppConstants;
        return (this.AppConstants = Components.utils.import(
          "resource://gre/modules/AppConstants.jsm",
          {}
        ).AppConstants);
      },
      set(val) {
        delete this["AppConstants"];
        return (this["AppConstants"] = val);
      }
    });
    Object.defineProperty(this, "_indicatorBar", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._indicatorBar;
        return (this._indicatorBar = document.getAnonymousElementByAttribute(
          this,
          "class",
          "menupopup-drop-indicator-bar"
        ));
      },
      set(val) {
        delete this["_indicatorBar"];
        return (this["_indicatorBar"] = val);
      }
    });
    Object.defineProperty(this, "_scrollBox", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._scrollBox;
        return (this._scrollBox = document.getAnonymousElementByAttribute(
          this,
          "class",
          "popup-internal-box"
        ));
      },
      set(val) {
        delete this["_scrollBox"];
        return (this["_scrollBox"] = val);
      }
    });
    Object.defineProperty(this, "_rootView", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._rootView;
        return (this._rootView = PlacesUIUtils.getViewForNode(this));
      },
      set(val) {
        delete this["_rootView"];
        return (this["_rootView"] = val);
      }
    });
    Object.defineProperty(this, "_overFolder", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._overFolder;
        return (this._overFolder = {
          _self: this,
          _folder: {
            elt: null,
            openTimer: null,
            hoverTime: 350,
            closeTimer: null
          },
          _closeMenuTimer: null,

          get elt() {
            return this._folder.elt;
          },
          set elt(val) {
            return (this._folder.elt = val);
          },

          get openTimer() {
            return this._folder.openTimer;
          },
          set openTimer(val) {
            return (this._folder.openTimer = val);
          },

          get hoverTime() {
            return this._folder.hoverTime;
          },
          set hoverTime(val) {
            return (this._folder.hoverTime = val);
          },

          get closeTimer() {
            return this._folder.closeTimer;
          },
          set closeTimer(val) {
            return (this._folder.closeTimer = val);
          },

          get closeMenuTimer() {
            return this._closeMenuTimer;
          },
          set closeMenuTimer(val) {
            return (this._closeMenuTimer = val);
          },

          setTimer: function OF__setTimer(aTime) {
            var timer = Cc["@mozilla.org/timer;1"].createInstance(Ci.nsITimer);
            timer.initWithCallback(this, aTime, timer.TYPE_ONE_SHOT);
            return timer;
          },

          notify: function OF__notify(aTimer) {
            // Function to process all timer notifications.

            if (aTimer == this._folder.openTimer) {
              // Timer to open a submenu that's being dragged over.
              this._folder.elt.lastChild.setAttribute("autoopened", "true");
              this._folder.elt.lastChild.showPopup(this._folder.elt);
              this._folder.openTimer = null;
            } else if (aTimer == this._folder.closeTimer) {
              // Timer to close a submenu that's been dragged off of.
              // Only close the submenu if the mouse isn't being dragged over any
              // of its child menus.
              var draggingOverChild = PlacesControllerDragHelper.draggingOverChildNode(
                this._folder.elt
              );
              if (draggingOverChild) this._folder.elt = null;
              this.clear();

              // Close any parent folders which aren't being dragged over.
              // (This is necessary because of the above code that keeps a folder
              // open while its children are being dragged over.)
              if (!draggingOverChild) this.closeParentMenus();
            } else if (aTimer == this.closeMenuTimer) {
              // Timer to close this menu after the drag exit.
              var popup = this._self;
              // if we are no more dragging we can leave the menu open to allow
              // for better D&D bookmark organization
              if (
                PlacesControllerDragHelper.getSession() &&
                !PlacesControllerDragHelper.draggingOverChildNode(
                  popup.parentNode
                )
              ) {
                popup.hidePopup();
                // Close any parent menus that aren't being dragged over;
                // otherwise they'll stay open because they couldn't close
                // while this menu was being dragged over.
                this.closeParentMenus();
              }
              this._closeMenuTimer = null;
            }
          },

          //  Helper function to close all parent menus of this menu,
          //  as long as none of the parent's children are currently being
          //  dragged over.
          closeParentMenus: function OF__closeParentMenus() {
            var popup = this._self;
            var parent = popup.parentNode;
            while (parent) {
              if (parent.localName == "menupopup" && parent._placesNode) {
                if (
                  PlacesControllerDragHelper.draggingOverChildNode(
                    parent.parentNode
                  )
                )
                  break;
                parent.hidePopup();
              }
              parent = parent.parentNode;
            }
          },

          //  The mouse is no longer dragging over the stored menubutton.
          //  Close the menubutton, clear out drag styles, and clear all
          //  timers for opening/closing it.
          clear: function OF__clear() {
            if (this._folder.elt && this._folder.elt.lastChild) {
              if (!this._folder.elt.lastChild.hasAttribute("dragover"))
                this._folder.elt.lastChild.hidePopup();
              // remove menuactive style
              this._folder.elt.removeAttribute("_moz-menuactive");
              this._folder.elt = null;
            }
            if (this._folder.openTimer) {
              this._folder.openTimer.cancel();
              this._folder.openTimer = null;
            }
            if (this._folder.closeTimer) {
              this._folder.closeTimer.cancel();
              this._folder.closeTimer = null;
            }
          }
        });
      },
      set(val) {
        delete this["_overFolder"];
        return (this["_overFolder"] = val);
      }
    });
  }
  disconnectedCallback() {}
  _hideDropIndicator(aEvent) {
    let target = aEvent.target;

    // Don't draw the drop indicator outside of markers or if current
    // node is not a Places node.
    let betweenMarkers =
      this._startMarker.compareDocumentPosition(target) &
        Node.DOCUMENT_POSITION_FOLLOWING &&
      this._endMarker.compareDocumentPosition(target) &
        Node.DOCUMENT_POSITION_PRECEDING;

    // Hide the dropmarker if current node is not a Places node.
    return !(target && target._placesNode && betweenMarkers);
  }
  _getDropPoint(aEvent) {
    // Can't drop if the menu isn't a folder
    let resultNode = this._placesNode;

    if (
      !PlacesUtils.nodeIsFolder(resultNode) ||
      PlacesControllerDragHelper.disallowInsertion(resultNode)
    ) {
      return null;
    }

    var dropPoint = { ip: null, folderElt: null };

    // The element we are dragging over
    let elt = aEvent.target;
    if (elt.localName == "menupopup") elt = elt.parentNode;

    // Calculate positions taking care of arrowscrollbox
    let scrollbox = this._scrollBox;
    let eventY = aEvent.layerY + (scrollbox.boxObject.y - this.boxObject.y);
    let scrollboxOffset =
      scrollbox.scrollBoxObject.y - (scrollbox.boxObject.y - this.boxObject.y);
    let eltY = elt.boxObject.y - scrollboxOffset;
    let eltHeight = elt.boxObject.height;

    if (!elt._placesNode) {
      // If we are dragging over a non places node drop at the end.
      dropPoint.ip = new InsertionPoint({
        parentId: PlacesUtils.getConcreteItemId(resultNode),
        parentGuid: PlacesUtils.getConcreteItemGuid(resultNode)
      });
      // We can set folderElt if we are dropping over a static menu that
      // has an internal placespopup.
      let isMenu =
        elt.localName == "menu" ||
        (elt.localName == "toolbarbutton" &&
          elt.getAttribute("type") == "menu");
      if (isMenu && elt.lastChild && elt.lastChild.hasAttribute("placespopup"))
        dropPoint.folderElt = elt;
      return dropPoint;
    }

    let tagName = PlacesUtils.nodeIsTagQuery(elt._placesNode)
      ? elt._placesNode.title
      : null;
    if (
      (PlacesUtils.nodeIsFolder(elt._placesNode) &&
        !PlacesUIUtils.isContentsReadOnly(elt._placesNode)) ||
      PlacesUtils.nodeIsTagQuery(elt._placesNode)
    ) {
      // This is a folder or a tag container.
      if (eventY - eltY < eltHeight * 0.2) {
        // If mouse is in the top part of the element, drop above folder.
        dropPoint.ip = new InsertionPoint({
          parentId: PlacesUtils.getConcreteItemId(resultNode),
          parentGuid: PlacesUtils.getConcreteItemGuid(resultNode),
          orientation: Ci.nsITreeView.DROP_BEFORE,
          tagName,
          dropNearNode: elt._placesNode
        });
        return dropPoint;
      } else if (eventY - eltY < eltHeight * 0.8) {
        // If mouse is in the middle of the element, drop inside folder.
        dropPoint.ip = new InsertionPoint({
          parentId: PlacesUtils.getConcreteItemId(elt._placesNode),
          parentGuid: PlacesUtils.getConcreteItemGuid(elt._placesNode),
          tagName
        });
        dropPoint.folderElt = elt;
        return dropPoint;
      }
    } else if (eventY - eltY <= eltHeight / 2) {
      // This is a non-folder node or a readonly folder.
      // If the mouse is above the middle, drop above this item.
      dropPoint.ip = new InsertionPoint({
        parentId: PlacesUtils.getConcreteItemId(resultNode),
        parentGuid: PlacesUtils.getConcreteItemGuid(resultNode),
        orientation: Ci.nsITreeView.DROP_BEFORE,
        tagName,
        dropNearNode: elt._placesNode
      });
      return dropPoint;
    }

    // Drop below the item.
    dropPoint.ip = new InsertionPoint({
      parentId: PlacesUtils.getConcreteItemId(resultNode),
      parentGuid: PlacesUtils.getConcreteItemGuid(resultNode),
      orientation: Ci.nsITreeView.DROP_AFTER,
      tagName,
      dropNearNode: elt._placesNode
    });
    return dropPoint;
  }
  _cleanupDragDetails() {
    // Called on dragend and drop.
    PlacesControllerDragHelper.currentDropTarget = null;
    this._rootView._draggedElt = null;
    this.removeAttribute("dragover");
    this.removeAttribute("dragstart");
    this._indicatorBar.hidden = true;
  }
}
customElements.define("firefox-places-popup-base", FirefoxPlacesPopupBase);
