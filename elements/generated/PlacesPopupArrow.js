class FirefoxPlacesPopupArrow extends FirefoxPlacesPopupBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<vbox anonid="container" class="panel-arrowcontainer" flex="1" inherits="side,panelopen">
<box anonid="arrowbox" class="panel-arrowbox">
<image anonid="arrow" class="panel-arrow" inherits="side">
</image>
</box>
<box class="panel-arrowcontent" inherits="side,align,dir,orient,pack" flex="1">
<vbox class="menupopup-drop-indicator-bar" hidden="true">
<image class="menupopup-drop-indicator" mousethrough="always">
</image>
</vbox>
<arrowscrollbox class="popup-internal-box" flex="1" orient="vertical" smoothscroll="false">
<children>
</children>
</arrowscrollbox>
</box>
</vbox>`;
    let comment = document.createComment("Creating firefox-places-popup-arrow");
    this.prepend(comment);

    try {
      this.style.pointerEvents = "none";
    } catch (e) {}
  }
  disconnectedCallback() {}
  adjustArrowPosition() {
    var arrow = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "arrow"
    );

    var anchor = this.anchorNode;
    if (!anchor) {
      arrow.hidden = true;
      return;
    }

    var container = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "container"
    );
    var arrowbox = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "arrowbox"
    );

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
      var isRTL = window.getComputedStyle(this).direction == "rtl";

      if (position.indexOf("start_") == 0) {
        container.dir = "reverse";
        this.setAttribute("side", isRTL ? "left" : "right");
      } else {
        container.dir = "";
        this.setAttribute("side", isRTL ? "right" : "left");
      }
    } else if (
      position.indexOf("before_") == 0 ||
      position.indexOf("after_") == 0
    ) {
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
}
customElements.define("firefox-places-popup-arrow", FirefoxPlacesPopupArrow);
