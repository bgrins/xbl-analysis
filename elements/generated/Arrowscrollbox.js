class XblArrowscrollbox extends XblScrollboxBase {
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
<scrollbox class="arrowscrollbox-scrollbox" anonid="scrollbox" flex="1" inherits="orient,align,pack,dir">
<children>
</children>
</scrollbox>
<spacer class="arrowscrollbox-overflow-end-indicator" inherits="collapsed=scrolledtoend">
</spacer>
<autorepeatbutton class="autorepeatbutton-down" anonid="scrollbutton-down" inherits="orient,collapsed=notoverflowing,disabled=scrolledtoend" oncommand="_autorepeatbuttonScroll(event);">
</autorepeatbutton>`;
    let comment = document.createComment("Creating xbl-arrowscrollbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
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
  ensureElementIsVisible(element, aSmoothScroll) {
    if (!this._canScrollToElement(element)) return;

    var vertical = this.orient == "vertical";
    var rect = this.scrollClientRect;
    var containerStart = vertical ? rect.top : rect.left;
    var containerEnd = vertical ? rect.bottom : rect.right;
    rect = element.getBoundingClientRect();
    var elementStart = vertical ? rect.top : rect.left;
    var elementEnd = vertical ? rect.bottom : rect.right;

    var scrollPaddingRect = this.scrollPaddingRect;
    let style = window.getComputedStyle(this._scrollbox);
    var scrollContentRect = {
      left: scrollPaddingRect.left + parseFloat(style.paddingLeft),
      top: scrollPaddingRect.top + parseFloat(style.paddingTop),
      right: scrollPaddingRect.right - parseFloat(style.paddingRight),
      bottom: scrollPaddingRect.bottom - parseFloat(style.paddingBottom)
    };

    // Provide an entry point for derived bindings to adjust these values.
    if (this._adjustElementStartAndEnd) {
      [elementStart, elementEnd] = this._adjustElementStartAndEnd(
        element,
        elementStart,
        elementEnd
      );
    }

    if (
      elementStart <=
      (vertical ? scrollContentRect.top : scrollContentRect.left)
    ) {
      elementStart = vertical ? scrollPaddingRect.top : scrollPaddingRect.left;
    }
    if (
      elementEnd >=
      (vertical ? scrollContentRect.bottom : scrollContentRect.right)
    ) {
      elementEnd = vertical
        ? scrollPaddingRect.bottom
        : scrollPaddingRect.right;
    }

    var amountToScroll;

    if (elementStart < containerStart) {
      amountToScroll = elementStart - containerStart;
    } else if (containerEnd < elementEnd) {
      amountToScroll = elementEnd - containerEnd;
    } else if (this._isScrolling) {
      // decelerate if a currently-visible element is selected during the scroll
      const STOP_DISTANCE = 15;
      if (
        this._isScrolling == -1 &&
        elementStart - STOP_DISTANCE < containerStart
      )
        amountToScroll = elementStart - containerStart;
      else if (
        this._isScrolling == 1 &&
        containerEnd - STOP_DISTANCE < elementEnd
      )
        amountToScroll = elementEnd - containerEnd;
      else amountToScroll = this._isScrolling * STOP_DISTANCE;
    } else {
      return;
    }

    this._stopSmoothScroll();

    if (aSmoothScroll != false && this.smoothScroll) {
      this._smoothScrollByPixels(amountToScroll, element);
    } else {
      this.scrollByPixels(amountToScroll);
    }
  }
  _smoothScrollByPixels(amountToScroll, element) {
    if (amountToScroll == 0) return;

    // Shouldn't forget pending scroll amount if the scroll direction
    // isn't changed because this may be called high frequency with very
    // small pixel values.
    var scrollDirection = 0;
    if (amountToScroll) {
      // Positive amountToScroll makes us scroll right (elements fly left),
      // negative scrolls left.
      scrollDirection = amountToScroll < 0 ? -1 : 1;
    }

    // However, if the scroll direction is changed, let's cancel the
    // pending scroll because user must want to scroll from current
    // position.
    if (this._isScrolling && this._isScrolling != scrollDirection)
      this._stopSmoothScroll();

    this._scrollTarget = element;
    this._isScrolling = scrollDirection;

    this._scrollAnim.start(amountToScroll, !this._scrollTarget);
  }
  scrollByIndex(index, aSmoothScroll) {
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
        this.ensureElementIsVisible(this._scrollTarget, false);
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

    this.ensureElementIsVisible(targetElement, aSmoothScroll);
  }
  scrollByPage(pageDelta, aSmoothScroll) {
    if (pageDelta == 0) return;

    // If a previous call is still in progress because of smooth
    // scrolling, we need to complete it before starting a new one.
    if (this._scrollTarget) {
      let elements = this._getScrollableElements();
      if (
        this._scrollTarget != elements[0] &&
        this._scrollTarget != elements[elements.length - 1]
      )
        this.ensureElementIsVisible(this._scrollTarget, false);
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

    this.ensureElementIsVisible(targetElement, aSmoothScroll);
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
  scrollByPixels(px) {
    this.scrollPosition += px;
  }
  _stopSmoothScroll() {
    if (this._isScrolling) {
      this._scrollAnim.stop();
      this._isScrolling = 0;
      this._scrollTarget = null;
    }
  }
  _updateScrollButtonsDisabledState(aScrolling) {
    let scrolledToStart;
    let scrolledToEnd;

    // Avoid flushing layout when not overflowing or when scrolling.
    if (this.hasAttribute("notoverflowing")) {
      scrolledToStart = true;
      scrolledToEnd = true;
    } else if (aScrolling) {
      scrolledToStart = false;
      scrolledToEnd = false;
    } else if (this.scrollPosition == 0) {
      // In the RTL case, this means the _last_ element in the
      // scrollbox is visible
      scrolledToEnd = this._isRTLScrollbox;
      scrolledToStart = !this._isRTLScrollbox;
    } else if (this.scrollClientSize + this.scrollPosition == this.scrollSize) {
      // In the RTL case, this means the _first_ element in the
      // scrollbox is visible
      scrolledToStart = this._isRTLScrollbox;
      scrolledToEnd = !this._isRTLScrollbox;
    }

    if (scrolledToEnd) this.setAttribute("scrolledtoend", "true");
    else this.removeAttribute("scrolledtoend");

    if (scrolledToStart) this.setAttribute("scrolledtostart", "true");
    else this.removeAttribute("scrolledtostart");
  }
}
customElements.define("xbl-arrowscrollbox", XblArrowscrollbox);
