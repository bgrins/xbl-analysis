class PlacesPopupArrow extends PlacesPopupBase {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <vbox anonid="container" class="panel-arrowcontainer" flex="1" inherits="side,panelopen">
        <box anonid="arrowbox" class="panel-arrowbox">
          <image anonid="arrow" class="panel-arrow" inherits="side"></image>
        </box>
        <box class="panel-arrowcontent" inherits="side,align,dir,orient,pack" flex="1">
          <vbox class="menupopup-drop-indicator-bar" hidden="true">
            <image class="menupopup-drop-indicator" mousethrough="always"></image>
          </vbox>
          <arrowscrollbox class="popup-internal-box" flex="1" orient="vertical" smoothscroll="false">
            <children></children>
          </arrowscrollbox>
        </box>
      </vbox>
    `));

    this.style.pointerEvents = "none";

    this._setupEventListeners();
  }

  adjustArrowPosition() {
    var arrow = document.getAnonymousElementByAttribute(this, "anonid", "arrow");

    var anchor = this.anchorNode;
    if (!anchor) {
      arrow.hidden = true;
      return;
    }

    var container = document.getAnonymousElementByAttribute(this, "anonid", "container");
    var arrowbox = document.getAnonymousElementByAttribute(this, "anonid", "arrowbox");

    var position = this.alignmentPosition;
    var offset = this.alignmentOffset;

    this.setAttribute("arrowposition", position);

    // if this panel has a "sliding" arrow, we may have previously set margins...
    arrowbox.style.removeProperty("transform");
    if (position.indexOf("start_") == 0 || position.indexOf("end_") == 0) {
      container.orient = "horizontal";
      arrowbox.orient = "vertical";
      if (position.indexOf("_after") > 0) {
        arrowbox.pack = "end";
      } else {
        arrowbox.pack = "start";
      }
      arrowbox.style.transform = "translate(0, " + -offset + "px)";

      // The assigned side stays the same regardless of direction.
      var isRTL = (window.getComputedStyle(this).direction == "rtl");

      if (position.indexOf("start_") == 0) {
        container.dir = "reverse";
        this.setAttribute("side", isRTL ? "left" : "right");
      } else {
        container.dir = "";
        this.setAttribute("side", isRTL ? "right" : "left");
      }
    } else if (position.indexOf("before_") == 0 || position.indexOf("after_") == 0) {
      container.orient = "";
      arrowbox.orient = "";
      if (position.indexOf("_end") > 0) {
        arrowbox.pack = "end";
      } else {
        arrowbox.pack = "start";
      }
      arrowbox.style.transform = "translate(" + -offset + "px, 0)";

      if (position.indexOf("before_") == 0) {
        container.dir = "reverse";
        this.setAttribute("side", "bottom");
      } else {
        container.dir = "";
        this.setAttribute("side", "top");
      }
    }

    arrow.hidden = false;
  }

  _setupEventListeners() {
    this.addEventListener("popupshowing", (event) => {
      this.adjustArrowPosition();
      this.setAttribute("animate", "open");
    });

    this.addEventListener("popupshown", (event) => {
      this.setAttribute("panelopen", "true");
      let disablePointerEvents;
      if (!this.hasAttribute("disablepointereventsfortransition")) {
        let container = document.getAnonymousElementByAttribute(this, "anonid", "container");
        let cs = getComputedStyle(container);
        let transitionProp = cs.transitionProperty;
        let transitionTime = parseFloat(cs.transitionDuration);
        disablePointerEvents = (transitionProp.includes("transform") ||
            transitionProp == "all") &&
          transitionTime > 0;
        this.setAttribute("disablepointereventsfortransition", disablePointerEvents);
      } else {
        disablePointerEvents = this.getAttribute("disablepointereventsfortransition") == "true";
      }
      if (!disablePointerEvents) {
        this.style.removeProperty("pointer-events");
      }
    });

    this.addEventListener("transitionend", (event) => {
      if (event.originalTarget.getAttribute("anonid") == "container" &&
        (event.propertyName == "transform" || event.propertyName == "-moz-window-transform")) {
        this.style.removeProperty("pointer-events");
      }
    });

    this.addEventListener("popuphiding", (event) => {
      this.setAttribute("animate", "cancel");
    });

    this.addEventListener("popuphidden", (event) => {
      this.removeAttribute("panelopen");
      if (this.getAttribute("disablepointereventsfortransition") == "true") {
        this.style.pointerEvents = "none";
      }
      this.removeAttribute("animate");
    });

  }
}