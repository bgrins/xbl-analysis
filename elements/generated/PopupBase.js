class FirefoxPopupBase extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {}

  set label(val) {
    this.setAttribute("label", val);
    return val;
  }

  get label() {
    return this.getAttribute("label");
  }

  set position(val) {
    this.setAttribute("position", val);
    return val;
  }

  get position() {
    return this.getAttribute("position");
  }

  get popupBoxObject() {
    return this.boxObject;
  }

  get state() {
    return this.popupBoxObject.popupState;
  }

  get triggerNode() {
    return this.popupBoxObject.triggerNode;
  }

  get anchorNode() {
    return this.popupBoxObject.anchorNode;
  }

  set autoPosition(val) {
    return (this.popupBoxObject.autoPosition = val);
  }

  get autoPosition() {
    return this.popupBoxObject.autoPosition;
  }

  get alignmentPosition() {
    return this.popupBoxObject.alignmentPosition;
  }

  get alignmentOffset() {
    return this.popupBoxObject.alignmentOffset;
  }
  openPopup(
    aAnchorElement,
    aPosition,
    aX,
    aY,
    aIsContextMenu,
    aAttributesOverride,
    aTriggerEvent
  ) {
    // Allow for passing an options object as the second argument.
    if (
      arguments.length == 2 &&
      arguments[1] != null &&
      typeof arguments[1] == "object"
    ) {
      let params = arguments[1];
      aPosition = params.position;
      aX = params.x;
      aY = params.y;
      aIsContextMenu = params.isContextMenu;
      aAttributesOverride = params.attributesOverride;
      aTriggerEvent = params.triggerEvent;
    }

    try {
      var popupBox = this.popupBoxObject;
      if (popupBox)
        popupBox.openPopup(
          aAnchorElement,
          aPosition,
          aX,
          aY,
          aIsContextMenu,
          aAttributesOverride,
          aTriggerEvent
        );
    } catch (e) {}
  }
  openPopupAtScreen(aX, aY, aIsContextMenu, aTriggerEvent) {
    try {
      var popupBox = this.popupBoxObject;
      if (popupBox)
        popupBox.openPopupAtScreen(aX, aY, aIsContextMenu, aTriggerEvent);
    } catch (e) {}
  }
  openPopupAtScreenRect(
    aPosition,
    aX,
    aY,
    aWidth,
    aHeight,
    aIsContextMenu,
    aAttributesOverride,
    aTriggerEvent
  ) {
    try {
      var popupBox = this.popupBoxObject;
      if (popupBox)
        popupBox.openPopupAtScreenRect(
          aPosition,
          aX,
          aY,
          aWidth,
          aHeight,
          aIsContextMenu,
          aAttributesOverride,
          aTriggerEvent
        );
    } catch (e) {}
  }
  showPopup(element, xpos, ypos, popuptype, anchoralignment, popupalignment) {
    var popupBox = null;
    var menuBox = null;
    try {
      popupBox = this.popupBoxObject;
    } catch (e) {}
    try {
      menuBox = this.parentNode.boxObject;
    } catch (e) {}
    if (menuBox instanceof MenuBoxObject) menuBox.openMenu(true);
    else if (popupBox)
      popupBox.showPopup(
        element,
        this,
        xpos,
        ypos,
        popuptype,
        anchoralignment,
        popupalignment
      );
  }
  hidePopup(cancel) {
    var popupBox = null;
    var menuBox = null;
    try {
      popupBox = this.popupBoxObject;
    } catch (e) {}
    try {
      menuBox = this.parentNode.boxObject;
    } catch (e) {}
    if (menuBox instanceof MenuBoxObject) menuBox.openMenu(false);
    else if (popupBox instanceof PopupBoxObject) popupBox.hidePopup(cancel);
  }
  enableKeyboardNavigator(aEnableKeyboardNavigator) {
    this.popupBoxObject.enableKeyboardNavigator(aEnableKeyboardNavigator);
  }
  enableRollup(aEnableRollup) {
    this.popupBoxObject.enableRollup(aEnableRollup);
  }
  sizeTo(aWidth, aHeight) {
    this.popupBoxObject.sizeTo(aWidth, aHeight);
  }
  moveTo(aLeft, aTop) {
    this.popupBoxObject.moveTo(aLeft, aTop);
  }
  moveToAnchor(aAnchorElement, aPosition, aX, aY, aAttributesOverride) {
    this.popupBoxObject.moveToAnchor(
      aAnchorElement,
      aPosition,
      aX,
      aY,
      aAttributesOverride
    );
  }
  getOuterScreenRect() {
    return this.popupBoxObject.getOuterScreenRect();
  }
  setConstraintRect(aRect) {
    this.popupBoxObject.setConstraintRect(aRect);
  }
}
customElements.define("firefox-popup-base", FirefoxPopupBase);
