class XblPlacesPopupBase extends XblPopup {
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
    let comment = document.createComment("Creating xbl-places-popup-base");
    this.prepend(comment);
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
customElements.define("xbl-places-popup-base", XblPlacesPopupBase);
