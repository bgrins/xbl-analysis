class FirefoxArrowscrollbox extends FirefoxScrollboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<autorepeatbutton class="autorepeatbutton-up" anonid="scrollbutton-up" inherits="orient,collapsed=notoverflowing,disabled=scrolledtostart" oncommand="_autorepeatbuttonScroll(event);">
</autorepeatbutton>
<spacer class="arrowscrollbox-overflow-start-indicator" inherits="collapsed=scrolledtostart">
</spacer>
<scrollbox class="arrowscrollbox-scrollbox" anonid="scrollbox" flex="1" inherits="orient,align,pack,dir,smoothscroll">
<children>
</children>
</scrollbox>
<spacer class="arrowscrollbox-overflow-end-indicator" inherits="collapsed=scrolledtoend">
</spacer>
<autorepeatbutton class="autorepeatbutton-down" anonid="scrollbutton-down" inherits="orient,collapsed=notoverflowing,disabled=scrolledtoend" oncommand="_autorepeatbuttonScroll(event);">
</autorepeatbutton>`;
    let comment = document.createComment("Creating firefox-arrowscrollbox");
    this.prepend(comment);

    Object.defineProperty(this, "_scrollbox", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._scrollbox;
        return (this._scrollbox = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "scrollbox"
        ));
      },
      set(val) {
        delete this._scrollbox;
        return (this._scrollbox = val);
      }
    });
    Object.defineProperty(this, "_scrollButtonUp", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._scrollButtonUp;
        return (this._scrollButtonUp = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "scrollbutton-up"
        ));
      },
      set(val) {
        delete this._scrollButtonUp;
        return (this._scrollButtonUp = val);
      }
    });
    Object.defineProperty(this, "_scrollButtonDown", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._scrollButtonDown;
        return (this._scrollButtonDown = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "scrollbutton-down"
        ));
      },
      set(val) {
        delete this._scrollButtonDown;
        return (this._scrollButtonDown = val);
      }
    });
    Object.defineProperty(this, "__prefBranch", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.__prefBranch;
        return (this.__prefBranch = null);
      },
      set(val) {
        delete this.__prefBranch;
        return (this.__prefBranch = val);
      }
    });
    Object.defineProperty(this, "_scrollIncrement", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._scrollIncrement;
        return (this._scrollIncrement = null);
      },
      set(val) {
        delete this._scrollIncrement;
        return (this._scrollIncrement = val);
      }
    });
    Object.defineProperty(this, "_scrollBoxObject", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._scrollBoxObject;
        return (this._scrollBoxObject = null);
      },
      set(val) {
        delete this._scrollBoxObject;
        return (this._scrollBoxObject = val);
      }
    });
    Object.defineProperty(this, "_startEndProps", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._startEndProps;
        return (this._startEndProps = this.orient == "vertical"
          ? ["top", "bottom"]
          : ["left", "right"]);
      },
      set(val) {
        delete this._startEndProps;
        return (this._startEndProps = val);
      }
    });
    Object.defineProperty(this, "_isRTLScrollbox", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._isRTLScrollbox;
        return (this._isRTLScrollbox =
          this.orient != "vertical" &&
          document.defaultView.getComputedStyle(this._scrollbox).direction ==
            "rtl");
      },
      set(val) {
        delete this._isRTLScrollbox;
        return (this._isRTLScrollbox = val);
      }
    });
    Object.defineProperty(this, "_scrollTarget", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._scrollTarget;
        return (this._scrollTarget = null);
      },
      set(val) {
        delete this._scrollTarget;
        return (this._scrollTarget = val);
      }
    });
    Object.defineProperty(this, "_prevMouseScrolls", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._prevMouseScrolls;
        return (this._prevMouseScrolls = [null, null]);
      },
      set(val) {
        delete this._prevMouseScrolls;
        return (this._prevMouseScrolls = val);
      }
    });
    Object.defineProperty(this, "_touchStart", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._touchStart;
        return (this._touchStart = -1);
      },
      set(val) {
        delete this._touchStart;
        return (this._touchStart = val);
      }
    });
    Object.defineProperty(this, "_scrollButtonUpdatePending", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._scrollButtonUpdatePending;
        return (this._scrollButtonUpdatePending = false);
      },
      set(val) {
        delete this._scrollButtonUpdatePending;
        return (this._scrollButtonUpdatePending = val);
      }
    });

    if (!this.hasAttribute("smoothscroll")) {
      this.smoothScroll = this._prefBranch.getBoolPref(
        "toolkit.scrollbox.smoothScroll",
        true
      );
    }

    this.setAttribute("notoverflowing", "true");
    this._updateScrollButtonsDisabledState();

    this.addEventListener("wheel", event => {
      let doScroll = false;
      let instant;
      let scrollAmount = 0;
      if (this.orient == "vertical") {
        doScroll = true;
        if (event.deltaMode == event.DOM_DELTA_PIXEL)
          scrollAmount = event.deltaY;
        else if (event.deltaMode == event.DOM_DELTA_PAGE)
          scrollAmount = event.deltaY * this.scrollClientSize;
        else scrollAmount = event.deltaY * this.lineScrollAmount;
      } else {
        // We allow vertical scrolling to scroll a horizontal scrollbox
        // because many users have a vertical scroll wheel but no
        // horizontal support.
        // Because of this, we need to avoid scrolling chaos on trackpads
        // and mouse wheels that support simultaneous scrolling in both axes.
        // We do this by scrolling only when the last two scroll events were
        // on the same axis as the current scroll event.
        // For diagonal scroll events we only respect the dominant axis.
        let isVertical = Math.abs(event.deltaY) > Math.abs(event.deltaX);
        let delta = isVertical ? event.deltaY : event.deltaX;
        let scrollByDelta = isVertical && this._isRTLScrollbox ? -delta : delta;

        if (this._prevMouseScrolls.every(prev => prev == isVertical)) {
          doScroll = true;
          if (event.deltaMode == event.DOM_DELTA_PIXEL) {
            scrollAmount = scrollByDelta;
            instant = true;
          } else if (event.deltaMode == event.DOM_DELTA_PAGE) {
            scrollAmount = scrollByDelta * this.scrollClientSize;
          } else {
            scrollAmount = scrollByDelta * this.lineScrollAmount;
          }
        }

        if (this._prevMouseScrolls.length > 1) this._prevMouseScrolls.shift();
        this._prevMouseScrolls.push(isVertical);
      }

      if (doScroll) {
        this.scrollByPixels(scrollAmount, instant);
      }

      event.stopPropagation();
      event.preventDefault();
    });

    this.addEventListener("touchstart", event => {
      if (event.touches.length > 1) {
        // Multiple touch points detected, abort. In particular this aborts
        // the panning gesture when the user puts a second finger down after
        // already panning with one finger. Aborting at this point prevents
        // the pan gesture from being resumed until all fingers are lifted
        // (as opposed to when the user is back down to one finger).
        this._touchStart = -1;
      } else {
        this._touchStart = this.orient == "vertical"
          ? event.touches[0].screenY
          : event.touches[0].screenX;
      }
    });

    this.addEventListener("touchmove", event => {
      if (event.touches.length == 1 && this._touchStart >= 0) {
        var touchPoint = this.orient == "vertical"
          ? event.touches[0].screenY
          : event.touches[0].screenX;
        var delta = this._touchStart - touchPoint;
        if (Math.abs(delta) > 0) {
          this.scrollByPixels(delta, true);
          this._touchStart = touchPoint;
        }
        event.preventDefault();
      }
    });

    this.addEventListener("touchend", event => {
      this._touchStart = -1;
    });

    this.addEventListener(
      "underflow",
      event => {
        // filter underflow events which were dispatched on nested scrollboxes
        if (event.target != this) return;

        // Ignore events that doesn't match our orientation.
        // Scrollport event orientation:
        //   0: vertical
        //   1: horizontal
        //   2: both
        if (this.orient == "vertical") {
          if (event.detail == 1) return;
        } else if (event.detail == 0) {
          // horizontal scrollbox
          return;
        }

        this.setAttribute("notoverflowing", "true");
        this._updateScrollButtonsDisabledState();
      },
      true
    );

    this.addEventListener(
      "overflow",
      event => {
        // filter underflow events which were dispatched on nested scrollboxes
        if (event.target != this) return;

        // Ignore events that doesn't match our orientation.
        // Scrollport event orientation:
        //   0: vertical
        //   1: horizontal
        //   2: both
        if (this.orient == "vertical") {
          if (event.detail == 1) return;
        } else if (event.detail == 0) {
          // horizontal scrollbox
          return;
        }

        this.removeAttribute("notoverflowing");
        this._updateScrollButtonsDisabledState();
      },
      true
    );

    this.addEventListener("scroll", event => {
      this._updateScrollButtonsDisabledState();
    });
  }
  disconnectedCallback() {}

  get _prefBranch() {
    if (this.__prefBranch === null) {
      this.__prefBranch = Components.classes[
        "@mozilla.org/preferences-service;1"
      ].getService(Components.interfaces.nsIPrefBranch);
    }
    return this.__prefBranch;
  }

  get scrollIncrement() {
    if (this._scrollIncrement === null) {
      this._scrollIncrement = this._prefBranch.getIntPref(
        "toolkit.scrollbox.scrollIncrement",
        20
      );
    }
    return this._scrollIncrement;
  }

  set smoothScroll(val) {
    this.setAttribute("smoothscroll", !!val);
    return val;
  }

  get smoothScroll() {
    return this.getAttribute("smoothscroll") == "true";
  }

  get scrollBoxObject() {
    if (!this._scrollBoxObject) {
      this._scrollBoxObject = this._scrollbox.boxObject;
    }
    return this._scrollBoxObject;
  }

  get scrollClientRect() {
    return this._scrollbox.getBoundingClientRect();
  }

  get scrollClientSize() {
    return this.orient == "vertical"
      ? this._scrollbox.clientHeight
      : this._scrollbox.clientWidth;
  }

  get scrollSize() {
    return this.orient == "vertical"
      ? this._scrollbox.scrollHeight
      : this._scrollbox.scrollWidth;
  }

  get lineScrollAmount() {
    // line scroll amout should be the width (at horizontal scrollbox) or
    // the height (at vertical scrollbox) of the scrolled elements.
    // However, the elements may have different width or height.  So,
    // for consistent speed, let's use avalage with of the elements.
    var elements = this._getScrollableElements();
    return elements.length && this.scrollSize / elements.length;
  }
  _boundsWithoutFlushing(element) {
    if (!("_DOMWindowUtils" in this)) {
      try {
        this._DOMWindowUtils = window
          .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
          .getInterface(Components.interfaces.nsIDOMWindowUtils);
      } catch (e) {
        // Can't access nsIDOMWindowUtils if we're unprivileged.
        this._DOMWindowUtils = null;
      }
    }

    return this._DOMWindowUtils
      ? this._DOMWindowUtils.getBoundsWithoutFlushing(element)
      : element.getBoundingClientRect();
  }
  _canScrollToElement(element) {
    if (element.hidden) {
      return false;
    }

    // See if the element is hidden via CSS without the hidden attribute.
    // If we get only zeros for the client rect, this means the element
    // is hidden. As a performance optimization, we don't flush layout
    // here which means that on the fly changes aren't fully supported.
    let rect = this._boundsWithoutFlushing(element);
    return !!(rect.top || rect.left || rect.width || rect.height);
  }
  ensureElementIsVisible(element, aInstant) {
    if (!this._canScrollToElement(element)) return;

    element.scrollIntoView({ behavior: aInstant ? "instant" : "auto" });
  }
  scrollByIndex(index, aInstant) {
    if (index == 0) return;

    // Each scrollByIndex call is expected to scroll the given number of
    // items. If a previous call is still in progress because of smooth
    // scrolling, we need to complete it before starting a new one.
    if (this._scrollTarget) {
      let elements = this._getScrollableElements();
      if (
        this._scrollTarget != elements[0] &&
        this._scrollTarget != elements[elements.length - 1]
      )
        this.ensureElementIsVisible(this._scrollTarget, true);
    }

    var rect = this.scrollClientRect;
    var [start, end] = this._startEndProps;
    var x = index > 0 ? rect[end] + 1 : rect[start] - 1;
    var nextElement = this._elementFromPoint(x, index);
    if (!nextElement) return;

    var targetElement;
    if (this._isRTLScrollbox) index *= -1;
    while (index < 0 && nextElement) {
      if (this._canScrollToElement(nextElement)) targetElement = nextElement;
      nextElement = nextElement.previousSibling;
      index++;
    }
    while (index > 0 && nextElement) {
      if (this._canScrollToElement(nextElement)) targetElement = nextElement;
      nextElement = nextElement.nextSibling;
      index--;
    }
    if (!targetElement) return;

    this.ensureElementIsVisible(targetElement, aInstant);
  }
  scrollByPage(pageDelta, aInstant) {
    if (pageDelta == 0) return;

    // If a previous call is still in progress because of smooth
    // scrolling, we need to complete it before starting a new one.
    if (this._scrollTarget) {
      let elements = this._getScrollableElements();
      if (
        this._scrollTarget != elements[0] &&
        this._scrollTarget != elements[elements.length - 1]
      )
        this.ensureElementIsVisible(this._scrollTarget, true);
    }

    var [start, end] = this._startEndProps;
    var rect = this.scrollClientRect;
    var containerEdge = pageDelta > 0 ? rect[end] + 1 : rect[start] - 1;
    var pixelDelta = pageDelta * (rect[end] - rect[start]);
    var destinationPosition = containerEdge + pixelDelta;
    var nextElement = this._elementFromPoint(containerEdge, pageDelta);
    if (!nextElement) return;

    // We need to iterate over our elements in the direction of pageDelta.
    // pageDelta is the physical direction, so in a horizontal scroll box,
    // positive values scroll to the right no matter if the scrollbox is
    // LTR or RTL. But RTL changes how we need to advance the iteration
    // (whether to get the next or the previous sibling of the current
    // element).
    var logicalAdvanceDir = pageDelta * (this._isRTLScrollbox ? -1 : 1);
    var advance = logicalAdvanceDir > 0
      ? e => e.nextSibling
      : e => e.previousSibling;

    var extendsPastTarget = pageDelta > 0
      ? e => e.getBoundingClientRect()[end] > destinationPosition
      : e => e.getBoundingClientRect()[start] < destinationPosition;

    // We want to scroll to the last element we encounter before we find
    // an element which extends past destinationPosition.
    var targetElement;
    do {
      if (this._canScrollToElement(nextElement)) targetElement = nextElement;
      nextElement = advance(nextElement);
    } while (nextElement && !extendsPastTarget(nextElement));

    if (!targetElement) return;

    this.ensureElementIsVisible(targetElement, aInstant);
  }
  _getScrollableElements() {
    var nodes = this.childNodes;
    if (
      nodes.length == 1 &&
      nodes[0].localName == "children" &&
      nodes[0].namespaceURI == "http://www.mozilla.org/xbl"
    ) {
      nodes = document.getBindingParent(this).childNodes;
    }

    return Array.filter(nodes, this._canScrollToElement, this);
  }
  _elementFromPoint(aX, aPhysicalScrollDir) {
    var elements = this._getScrollableElements();
    if (!elements.length) return null;

    if (this._isRTLScrollbox) elements.reverse();

    var [start, end] = this._startEndProps;
    var low = 0;
    var high = elements.length - 1;

    if (
      aX < elements[low].getBoundingClientRect()[start] ||
      aX > elements[high].getBoundingClientRect()[end]
    )
      return null;

    var mid, rect;
    while (low <= high) {
      mid = Math.floor((low + high) / 2);
      rect = elements[mid].getBoundingClientRect();
      if (rect[start] > aX) high = mid - 1;
      else if (rect[end] < aX) low = mid + 1;
      else return elements[mid];
    }

    // There's no element at the requested coordinate, but the algorithm
    // from above yields an element next to it, in a random direction.
    // The desired scrolling direction leads to the correct element.

    if (!aPhysicalScrollDir) return null;

    if (aPhysicalScrollDir < 0 && rect[start] > aX) mid = Math.max(mid - 1, 0);
    else if (aPhysicalScrollDir > 0 && rect[end] < aX)
      mid = Math.min(mid + 1, elements.length - 1);

    return elements[mid];
  }
  _autorepeatbuttonScroll(event) {
    var dir = event.originalTarget == this._scrollButtonUp ? -1 : 1;
    if (this._isRTLScrollbox) dir *= -1;

    this.scrollByPixels(this.scrollIncrement * dir);

    event.stopPropagation();
  }
  scrollByPixels(aPixels, aInstant) {
    let scrollOptions = { behavior: aInstant ? "instant" : "auto" };
    scrollOptions[this._startEndProps[0]] = aPixels;
    this._scrollbox.scrollBy(scrollOptions);
  }
  _updateScrollButtonsDisabledState() {
    if (this.hasAttribute("notoverflowing")) {
      this.setAttribute("scrolledtoend", "true");
      this.setAttribute("scrolledtostart", "true");
      return;
    }

    if (this._scrollButtonUpdatePending) {
      return;
    }
    this._scrollButtonUpdatePending = true;

    // Wait until after the next paint to get current layout data from
    // getBoundsWithoutFlushing.
    window.requestAnimationFrame(() => {
      setTimeout(() => {
        this._scrollButtonUpdatePending = false;

        let scrolledToStart = false;
        let scrolledToEnd = false;

        if (this.hasAttribute("notoverflowing")) {
          scrolledToStart = true;
          scrolledToEnd = true;
        } else {
          let [leftOrTop, rightOrBottom] = this._startEndProps;
          let leftOrTopEdge = ele =>
            Math.round(this._boundsWithoutFlushing(ele)[leftOrTop]);
          let rightOrBottomEdge = ele =>
            Math.round(this._boundsWithoutFlushing(ele)[rightOrBottom]);

          let elements = this._getScrollableElements();
          let [leftOrTopElement, rightOrBottomElement] = [
            elements[0],
            elements[elements.length - 1]
          ];
          if (this._isRTLScrollbox) {
            [leftOrTopElement, rightOrBottomElement] = [
              rightOrBottomElement,
              leftOrTopElement
            ];
          }

          if (
            leftOrTopElement &&
            leftOrTopEdge(leftOrTopElement) >= leftOrTopEdge(this._scrollbox)
          ) {
            scrolledToStart = !this._isRTLScrollbox;
            scrolledToEnd = this._isRTLScrollbox;
          } else if (
            rightOrBottomElement &&
            rightOrBottomEdge(rightOrBottomElement) <=
              rightOrBottomEdge(this._scrollbox)
          ) {
            scrolledToStart = this._isRTLScrollbox;
            scrolledToEnd = !this._isRTLScrollbox;
          }
        }

        if (scrolledToEnd) {
          this.setAttribute("scrolledtoend", "true");
        } else {
          this.removeAttribute("scrolledtoend");
        }

        if (scrolledToStart) {
          this.setAttribute("scrolledtostart", "true");
        } else {
          this.removeAttribute("scrolledtostart");
        }
      }, 0);
    });
  }
}
customElements.define("firefox-arrowscrollbox", FirefoxArrowscrollbox);
