/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozArrowscrollbox extends MozBaseControl {
  constructor() {
    super();

    this.addEventListener("wheel", (event) => {
      // Don't consume the event if we can't scroll.
      if (this.hasAttribute("notoverflowing")) {
        return;
      }

      let doScroll = false;
      let instant;
      let scrollAmount = 0;
      if (this.orient == "vertical") {
        doScroll = true;
        if (event.deltaMode == event.DOM_DELTA_PIXEL)
          scrollAmount = event.deltaY;
        else if (event.deltaMode == event.DOM_DELTA_PAGE)
          scrollAmount = event.deltaY * this.scrollClientSize;
        else
          scrollAmount = event.deltaY * this.lineScrollAmount;
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

        if (this._prevMouseScrolls.length > 1)
          this._prevMouseScrolls.shift();
        this._prevMouseScrolls.push(isVertical);
      }

      if (doScroll) {
        let direction = scrollAmount < 0 ? -1 : 1;
        let startPos = this.scrollPosition;

        if (!this._isScrolling || this._direction != direction) {
          this._destination = startPos + scrollAmount;
          this._direction = direction;
        } else {
          // We were already in the process of scrolling in this direction
          this._destination = this._destination + scrollAmount;
          scrollAmount = this._destination - startPos;
        }
        this.scrollByPixels(scrollAmount, instant);
      }

      event.stopPropagation();
      event.preventDefault();
    });

    this.addEventListener("touchstart", (event) => {
      if (event.touches.length > 1) {
        // Multiple touch points detected, abort. In particular this aborts
        // the panning gesture when the user puts a second finger down after
        // already panning with one finger. Aborting at this point prevents
        // the pan gesture from being resumed until all fingers are lifted
        // (as opposed to when the user is back down to one finger).
        this._touchStart = -1;
      } else {
        this._touchStart = (this.orient == "vertical" ?
          event.touches[0].screenY :
          event.touches[0].screenX);
      }
    });

    this.addEventListener("touchmove", (event) => {
      if (event.touches.length == 1 &&
        this._touchStart >= 0) {
        var touchPoint = (this.orient == "vertical" ?
          event.touches[0].screenY :
          event.touches[0].screenX);
        var delta = this._touchStart - touchPoint;
        if (Math.abs(delta) > 0) {
          this.scrollByPixels(delta, true);
          this._touchStart = touchPoint;
        }
        event.preventDefault();
      }
    });

    this.addEventListener("touchend", (event) => {
      this._touchStart = -1;
    });

    this.addEventListener("underflow", (event) => {
      // Ignore underflow events:
      // - from nested scrollable elements
      // - corresponding to an overflow event that we ignored
      if (event.target != this ||
        this.hasAttribute("notoverflowing")) {
        return;
      }

      // Ignore events that doesn't match our orientation.
      // Scrollport event orientation:
      //   0: vertical
      //   1: horizontal
      //   2: both
      if (this.orient == "vertical") {
        if (event.detail == 1)
          return;
      } else if (event.detail == 0) {
        // horizontal scrollbox
        return;
      }

      this.setAttribute("notoverflowing", "true");
      this._updateScrollButtonsDisabledState();
    }, true);

    this.addEventListener("overflow", (event) => {
      // Ignore overflow events:
      // - from nested scrollable elements
      if (event.target != this) {
        return;
      }

      // Ignore events that doesn't match our orientation.
      // Scrollport event orientation:
      //   0: vertical
      //   1: horizontal
      //   2: both
      if (this.orient == "vertical") {
        if (event.detail == 1)
          return;
      } else if (event.detail == 0) {
        // horizontal scrollbox
        return;
      }

      this.removeAttribute("notoverflowing");
      this._updateScrollButtonsDisabledState();
    }, true);

    this.addEventListener("scroll", (event) => {
      this._isScrolling = true;
      this._updateScrollButtonsDisabledState();
    });

    this.addEventListener("scrollend", (event) => {
      this._isScrolling = false;
      this._destination = 0;
      this._direction = 0;
    });

  }

  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <toolbarbutton class="scrollbutton-up" anonid="scrollbutton-up" inherits="orient,collapsed=notoverflowing,disabled=scrolledtostart"></toolbarbutton>
      <spacer class="arrowscrollbox-overflow-start-indicator" inherits="collapsed=scrolledtostart"></spacer>
      <scrollbox class="arrowscrollbox-scrollbox" anonid="scrollbox" flex="1" inherits="orient,align,pack,dir,smoothscroll">
        <children></children>
      </scrollbox>
      <spacer class="arrowscrollbox-overflow-end-indicator" inherits="collapsed=scrolledtoend"></spacer>
      <toolbarbutton class="scrollbutton-down" anonid="scrollbutton-down" inherits="orient,collapsed=notoverflowing,disabled=scrolledtoend"></toolbarbutton>
    `));
    // XXX: Implement `this.inheritAttribute()` for the [inherits] attribute in the markup above!

    this.scrollbox = document.getAnonymousElementByAttribute(this, "anonid", "scrollbox");

    this._scrollButtonUp = document.getAnonymousElementByAttribute(this, "anonid", "scrollbutton-up");

    this._scrollButtonDown = document.getAnonymousElementByAttribute(this, "anonid", "scrollbutton-down");

    this._scrollIndex = 0;

    this._arrowScrollAnim = {
      scrollbox: this,
      requestHandle: 0,
      /* 0 indicates there is no pending request */
      start: function arrowSmoothScroll_start() {
        this.lastFrameTime = window.performance.now();
        if (!this.requestHandle)
          this.requestHandle = window.requestAnimationFrame(this.sample.bind(this));
      },
      stop: function arrowSmoothScroll_stop() {
        window.cancelAnimationFrame(this.requestHandle);
        this.requestHandle = 0;
      },
      sample: function arrowSmoothScroll_handleEvent(timeStamp) {
        const scrollIndex = this.scrollbox._scrollIndex;
        const timePassed = timeStamp - this.lastFrameTime;
        this.lastFrameTime = timeStamp;

        const scrollDelta = 0.5 * timePassed * scrollIndex;
        this.scrollbox.scrollByPixels(scrollDelta, true);
        this.requestHandle = window.requestAnimationFrame(this.sample.bind(this));
      },
    };

    this.__prefBranch = null;

    this._scrollIncrement = null;

    this._startEndProps = this.orient == "vertical" ? ["top", "bottom"] : ["left", "right"];

    this._isRTLScrollbox = this.orient != "vertical" &&
      document.defaultView.getComputedStyle(this.scrollbox).direction == "rtl";

    this._ensureElementIsVisibleAnimationFrame = 0;

    this._prevMouseScrolls = [null, null];

    this._touchStart = -1;

    this._scrollButtonUpdatePending = false;

    this._isScrolling = false;

    this._destination = 0;

    this._direction = 0;

    if (!this.hasAttribute("smoothscroll")) {
      this.smoothScroll = this._prefBranch
        .getBoolPref("toolkit.scrollbox.smoothScroll", true);
    }

    this.setAttribute("notoverflowing", "true");
    this._updateScrollButtonsDisabledState();

    // Ultimately Bug 1514926 will convert arrowscrollbox binding to a custom element.
    // For the needs of Bug 1497189, where we apply a custom CSP to about:addons, we had
    // to remove inline handlers and hence added event listeners for mouse events here.
    this.addEventListener("click", (e) => {
      if (e.originalTarget != this._scrollButtonUp && e.originalTarget != this._scrollButtonDown) {
        return;
      }
      this._onButtonClick(e);
    });
    this.addEventListener("mousedown", (e) => {
      if (e.originalTarget == this._scrollButtonUp) {
        this._onButtonMouseDown(e, -1);
      }
      if (e.originalTarget == this._scrollButtonDown) {
        this._onButtonMouseDown(e, 1);
      }
    });
    this.addEventListener("mouseup", (e) => {
      if (e.originalTarget != this._scrollButtonUp && e.originalTarget != this._scrollButtonDown) {
        return;
      }
      this._onButtonMouseUp(e);
    });
    this.addEventListener("mouseover", (e) => {
      if (e.originalTarget == this._scrollButtonUp) {
        this._onButtonMouseOver(-1);
      }
      if (e.originalTarget == this._scrollButtonDown) {
        this._onButtonMouseOver(1);
      }
    });
    this.addEventListener("mouseout", (e) => {
      if (e.originalTarget != this._scrollButtonUp && e.originalTarget != this._scrollButtonDown) {
        return;
      }
      this._onButtonMouseOut();
    });

  }

  get _clickToScroll() {
    return this.hasAttribute("clicktoscroll");
  }

  get _scrollDelay() {
    if (this._clickToScroll) {
      return this._prefBranch.getIntPref(
        "toolkit.scrollbox.clickToScroll.scrollDelay", 150);
    }

    // Use the same REPEAT_DELAY as "nsRepeatService.h".
    return /Mac/.test(navigator.platform) ? 25 : 50;
  }

  get _prefBranch() {
    if (this.__prefBranch === null) {
      this.__prefBranch = Cc["@mozilla.org/preferences-service;1"]
        .getService(Ci.nsIPrefBranch);
    }
    return this.__prefBranch;
  }

  get scrollIncrement() {
    if (this._scrollIncrement === null) {
      this._scrollIncrement = this._prefBranch
        .getIntPref("toolkit.scrollbox.scrollIncrement", 20);
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

  get scrollClientRect() {
    return this.scrollbox.getBoundingClientRect();
  }

  get scrollClientSize() {
    return this.orient == "vertical" ?
      this.scrollbox.clientHeight :
      this.scrollbox.clientWidth;
  }

  get scrollSize() {
    return this.orient == "vertical" ?
      this.scrollbox.scrollHeight :
      this.scrollbox.scrollWidth;
  }

  get lineScrollAmount() {
    // line scroll amout should be the width (at horizontal scrollbox) or
    // the height (at vertical scrollbox) of the scrolled elements.
    // However, the elements may have different width or height.  So,
    // for consistent speed, let's use avalage with of the elements.
    var elements = this._getScrollableElements();
    return elements.length && (this.scrollSize / elements.length);
  }

  get scrollPosition() {
    return this.orient == "vertical" ?
      this.scrollbox.scrollTop :
      this.scrollbox.scrollLeft;
  }

  _onButtonClick(event) {
    if (this._clickToScroll) {
      this._distanceScroll(event);
    }
  }

  _onButtonMouseDown(event, index) {
    if (this._clickToScroll && event.button == 0) {
      this._startScroll(index);
    }
  }

  _onButtonMouseUp(event) {
    if (this._clickToScroll && event.button == 0) {
      this._stopScroll();
    }
  }

  _onButtonMouseOver(index) {
    if (this._clickToScroll) {
      this._continueScroll(index);
    } else {
      this._startScroll(index);
    }
  }

  _onButtonMouseOut(index) {
    if (this._clickToScroll) {
      this._pauseScroll();
    } else {
      this._stopScroll();
    }
  }

  _boundsWithoutFlushing(element) {
    if (!("_DOMWindowUtils" in this)) {
      this._DOMWindowUtils = window.windowUtils;
    }

    return this._DOMWindowUtils ?
      this._DOMWindowUtils.getBoundsWithoutFlushing(element) :
      element.getBoundingClientRect();
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
    if (!this._canScrollToElement(element))
      return;

    if (this._ensureElementIsVisibleAnimationFrame) {
      window.cancelAnimationFrame(this._ensureElementIsVisibleAnimationFrame);
    }
    this._ensureElementIsVisibleAnimationFrame = window.requestAnimationFrame(() => {
      element.scrollIntoView({
        block: "nearest",
        behavior: aInstant ? "instant" : "auto"
      });
      this._ensureElementIsVisibleAnimationFrame = 0;
    });
  }

  scrollByIndex(index, aInstant) {
    if (index == 0)
      return;

    var rect = this.scrollClientRect;
    var [start, end] = this._startEndProps;
    var x = index > 0 ? rect[end] + 1 : rect[start] - 1;
    var nextElement = this._elementFromPoint(x, index);
    if (!nextElement)
      return;

    var targetElement;
    if (this._isRTLScrollbox)
      index *= -1;
    while (index < 0 && nextElement) {
      if (this._canScrollToElement(nextElement))
        targetElement = nextElement;
      nextElement = nextElement.previousElementSibling;
      index++;
    }
    while (index > 0 && nextElement) {
      if (this._canScrollToElement(nextElement))
        targetElement = nextElement;
      nextElement = nextElement.nextElementSibling;
      index--;
    }
    if (!targetElement)
      return;

    this.ensureElementIsVisible(targetElement, aInstant);
  }

  _getScrollableElements() {
    let nodes = this.children;
    if (nodes.length == 1) {
      let node = nodes[0];
      if (node.localName == "children" &&
        node.namespaceURI == "http://www.mozilla.org/xbl") {
        nodes = document.getBindingParent(this).children;
      } else if (node.localName == "slot" &&
        node.namespaceURI == "http://www.w3.org/1999/xhtml") {
        nodes = node.getRootNode().host.children;
      }
    }

    return Array.prototype.filter.call(nodes, this._canScrollToElement, this);
  }

  _elementFromPoint(aX, aPhysicalScrollDir) {
    var elements = this._getScrollableElements();
    if (!elements.length)
      return null;

    if (this._isRTLScrollbox)
      elements.reverse();

    var [start, end] = this._startEndProps;
    var low = 0;
    var high = elements.length - 1;

    if (aX < elements[low].getBoundingClientRect()[start] ||
      aX > elements[high].getBoundingClientRect()[end])
      return null;

    var mid, rect;
    while (low <= high) {
      mid = Math.floor((low + high) / 2);
      rect = elements[mid].getBoundingClientRect();
      if (rect[start] > aX)
        high = mid - 1;
      else if (rect[end] < aX)
        low = mid + 1;
      else
        return elements[mid];
    }

    // There's no element at the requested coordinate, but the algorithm
    // from above yields an element next to it, in a random direction.
    // The desired scrolling direction leads to the correct element.

    if (!aPhysicalScrollDir)
      return null;

    if (aPhysicalScrollDir < 0 && rect[start] > aX)
      mid = Math.max(mid - 1, 0);
    else if (aPhysicalScrollDir > 0 && rect[end] < aX)
      mid = Math.min(mid + 1, elements.length - 1);

    return elements[mid];
  }

  _startScroll(index) {
    if (this._isRTLScrollbox) {
      index *= -1;
    }

    if (this._clickToScroll) {
      this._scrollIndex = index;
      this._mousedown = true;

      if (this.smoothScroll) {
        this._arrowScrollAnim.start();
        return;
      }
    }

    if (!this._scrollTimer) {
      this._scrollTimer = Cc["@mozilla.org/timer;1"].createInstance(Ci.nsITimer);
    } else {
      this._scrollTimer.cancel();
    }

    let callback;
    if (this._clickToScroll) {
      callback = () => {
        if (!document && this._scrollTimer) {
          this._scrollTimer.cancel();
        }
        this.scrollByIndex(this._scrollIndex);
      };
    } else {
      callback = () => this.scrollByPixels(this.scrollIncrement * index);
    }

    this._scrollTimer.initWithCallback(callback, this._scrollDelay,
      Ci.nsITimer.TYPE_REPEATING_SLACK);

    callback();
  }

  _stopScroll() {
    if (this._scrollTimer)
      this._scrollTimer.cancel();

    if (this._clickToScroll) {
      this._mousedown = false;
      if (!this._scrollIndex || !this.smoothScroll)
        return;

      this.scrollByIndex(this._scrollIndex);
      this._scrollIndex = 0;

      this._arrowScrollAnim.stop();
    }
  }

  _pauseScroll() {
    if (this._mousedown) {
      this._stopScroll();
      this._mousedown = true;
      document.addEventListener("mouseup", this);
      document.addEventListener("blur", this, true);
    }
  }

  _continueScroll(index) {
    if (this._mousedown)
      this._startScroll(index);
  }

  _distanceScroll(aEvent) {
    if (aEvent.detail < 2 || aEvent.detail > 3)
      return;

    var scrollBack = (aEvent.originalTarget == this._scrollButtonUp);
    var scrollLeftOrUp = this._isRTLScrollbox ? !scrollBack : scrollBack;
    var targetElement;

    if (aEvent.detail == 2) {
      // scroll by the size of the scrollbox
      let [start, end] = this._startEndProps;
      let x;
      if (scrollLeftOrUp)
        x = this.scrollClientRect[start] - this.scrollClientSize;
      else
        x = this.scrollClientRect[end] + this.scrollClientSize;
      targetElement = this._elementFromPoint(x, scrollLeftOrUp ? -1 : 1);

      // the next partly-hidden element will become fully visible,
      // so don't scroll too far
      if (targetElement)
        targetElement = scrollBack ?
        targetElement.nextElementSibling :
        targetElement.previousElementSibling;
    }

    if (!targetElement) {
      // scroll to the first resp. last element
      let elements = this._getScrollableElements();
      targetElement = scrollBack ?
        elements[0] :
        elements[elements.length - 1];
    }

    this.ensureElementIsVisible(targetElement);
  }

  handleEvent(aEvent) {
    if (aEvent.type == "mouseup" ||
      aEvent.type == "blur" && aEvent.target == document) {
      this._mousedown = false;
      document.removeEventListener("mouseup", this);
      document.removeEventListener("blur", this, true);
    }
  }

  scrollByPixels(aPixels, aInstant) {
    let scrollOptions = { behavior: aInstant ? "instant" : "auto" };
    scrollOptions[this._startEndProps[0]] = aPixels;
    this.scrollbox.scrollBy(scrollOptions);
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
        if (!this._startEndProps) {
          // We've been destroyed in the meantime.
          return;
        }

        this._scrollButtonUpdatePending = false;

        let scrolledToStart = false;
        let scrolledToEnd = false;

        if (this.hasAttribute("notoverflowing")) {
          scrolledToStart = true;
          scrolledToEnd = true;
        } else {
          let [leftOrTop, rightOrBottom] = this._startEndProps;
          let leftOrTopEdge = ele => Math.round(this._boundsWithoutFlushing(ele)[leftOrTop]);
          let rightOrBottomEdge = ele => Math.round(this._boundsWithoutFlushing(ele)[rightOrBottom]);

          let elements = this._getScrollableElements();
          let [leftOrTopElement, rightOrBottomElement] = [elements[0], elements[elements.length - 1]];
          if (this._isRTLScrollbox) {
            [leftOrTopElement, rightOrBottomElement] = [rightOrBottomElement, leftOrTopElement];
          }

          if (leftOrTopElement &&
            leftOrTopEdge(leftOrTopElement) >= leftOrTopEdge(this.scrollbox)) {
            scrolledToStart = !this._isRTLScrollbox;
            scrolledToEnd = this._isRTLScrollbox;
          } else if (rightOrBottomElement &&
            rightOrBottomEdge(rightOrBottomElement) <= rightOrBottomEdge(this.scrollbox)) {
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
  disconnectedCallback() {
    // Release timer to avoid reference cycles.
    if (this._scrollTimer) {
      this._scrollTimer.cancel();
      this._scrollTimer = null;
    }
  }
}

customElements.define("arrowscrollbox", MozArrowscrollbox);

}
