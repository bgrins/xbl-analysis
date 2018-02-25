class FirefoxArrowpanel extends FirefoxPanel {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:vbox anonid="container" class="panel-arrowcontainer" flex="1" inherits="side,panelopen">
        <xul:box anonid="arrowbox" class="panel-arrowbox">
          <xul:image anonid="arrow" class="panel-arrow" inherits="side"></xul:image>
        </xul:box>
        <xul:box class="panel-arrowcontent" inherits="side,align,dir,orient,pack" flex="1">
          <children></children>
        </xul:box>
      </xul:vbox>
    `;
    this._fadeTimer = null;

    this._setupEventListeners();
  }

  sizeTo(aWidth, aHeight) {
    this.popupBoxObject.sizeTo(aWidth, aHeight);
    if (this.state == "open") {
      this.adjustArrowPosition();
    }
  }

  moveToAnchor(aAnchorElement, aPosition, aX, aY, aAttributesOverride) {
    this.popupBoxObject.moveToAnchor(aAnchorElement, aPosition, aX, aY, aAttributesOverride);
  }

  adjustArrowPosition() {
    var anchor = this.anchorNode;
    if (!anchor) {
      return;
    }

    var container = document.getAnonymousElementByAttribute(this, "anonid", "container");
    var arrowbox = document.getAnonymousElementByAttribute(this, "anonid", "arrowbox");

    var position = this.alignmentPosition;
    var offset = this.alignmentOffset;

    this.setAttribute("arrowposition", position);

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
  }

  _setupEventListeners() {
    this.addEventListener("popupshowing", (event) => {
      var arrow = document.getAnonymousElementByAttribute(this, "anonid", "arrow");
      arrow.hidden = this.anchorNode == null;
      document.getAnonymousElementByAttribute(this, "anonid", "arrowbox")
        .style.removeProperty("transform");

      if (this.getAttribute("animate") != "false") {
        this.setAttribute("animate", "open");
        // the animating attribute prevents user interaction during transition
        // it is removed when popupshown fires
        this.setAttribute("animating", "true");
      }

      // set fading
      var fade = this.getAttribute("fade");
      var fadeDelay = 0;
      if (fade == "fast") {
        fadeDelay = 1;
      } else if (fade == "slow") {
        fadeDelay = 4000;
      } else {
        return;
      }

      this._fadeTimer = setTimeout(() => this.hidePopup(true), fadeDelay, this);
    });

    this.addEventListener("popuphiding", (event) => {
      let animate = (this.getAttribute("animate") != "false");

      if (this._fadeTimer) {
        clearTimeout(this._fadeTimer);
        if (animate) {
          this.setAttribute("animate", "fade");
        }
      } else if (animate) {
        this.setAttribute("animate", "cancel");
      }
    });

    this.addEventListener("popupshown", (event) => {
      this.removeAttribute("animating");
      this.setAttribute("panelopen", "true");
    });

    this.addEventListener("popuphidden", (event) => {
      this.removeAttribute("panelopen");
      if (this.getAttribute("animate") != "false") {
        this.removeAttribute("animate");
      }
    });

    this.addEventListener("popuppositioned", (event) => {
      this.adjustArrowPosition();
    });

  }
}