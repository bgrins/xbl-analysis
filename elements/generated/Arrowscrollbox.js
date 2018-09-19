/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozArrowscrollbox extends MozBasecontrol {
  constructor() {
    super();

    this.addEventListener("wheel", (event) => {
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
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <toolbarbutton class="scrollbutton-up" anonid="scrollbutton-up" inherits="orient,collapsed=notoverflowing,disabled=scrolledtostart" onmouseover="_startScroll(-1);" onmouseout="_stopScroll();"></toolbarbutton>
      <spacer class="arrowscrollbox-overflow-start-indicator" inherits="collapsed=scrolledtostart"></spacer>
      <scrollbox class="arrowscrollbox-scrollbox" anonid="scrollbox" flex="1" inherits="orient,align,pack,dir,smoothscroll">
        <children></children>
      </scrollbox>
      <spacer class="arrowscrollbox-overflow-end-indicator" inherits="collapsed=scrolledtoend"></spacer>
      <toolbarbutton class="scrollbutton-down" anonid="scrollbutton-down" inherits="orient,collapsed=notoverflowing,disabled=scrolledtoend" onmouseover="_startScroll(1);" onmouseout="_stopScroll();"></toolbarbutton>
    `));
    this._scrollbox = document.getAnonymousElementByAttribute(this, "anonid", "scrollbox");

    this._scrollButtonUp = document.getAnonymousElementByAttribute(this, "anonid", "scrollbutton-up");

    this._scrollButtonDown = document.getAnonymousElementByAttribute(this, "anonid", "scrollbutton-down");

    this.__prefBranch = null;

    this._scrollIncrement = null;

    this._startEndProps = this.orient == "vertical" ? ["top", "bottom"] : ["left", "right"];

    this._isRTLScrollbox = this.orient != "vertical" &&
      document.defaultView.getComputedStyle(this._scrollbox).direction == "rtl";

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

  get scrollBoxObject() {
    return this._scrollbox.boxObject;
  }

  get scrollClientRect() {
    return this._scrollbox.getBoundingClientRect();
  }

  get scrollClientSize() {
    return this.orient == "vertical" ?
      this._scrollbox.clientHeight :
      this._scrollbox.clientWidth;
  }

  get scrollSize() {
    return this.orient == "vertical" ?
      this._scrollbox.scrollHeight :
      this._scrollbox.scrollWidth;
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
      this._scrollbox.scrollTop :
      this._scrollbox.scrollLeft;
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
      element.scrollIntoView({ behavior: aInstant ? "instant" : "auto" });
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
    var nodes = this.children;
    if (nodes.length == 1 &&
      nodes[0].localName == "children" &&
      nodes[0].namespaceURI == "http://www.mozilla.org/xbl") {
      nodes = document.getBindingParent(this).children;
    }

    return Array.filter(nodes, this._canScrollToElement, this);
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

    if (!this._scrollTimer) {
      this._scrollTimer = Cc["@mozilla.org/timer;1"].createInstance(Ci.nsITimer);
    } else {
      this._scrollTimer.cancel();
    }

    let callback = () => this.scrollByPixels(this.scrollIncrement * index);

    // Use the same REPEAT_DELAY as "nsRepeatService.h".
    let scrollDelay = /Mac/.test(navigator.platform) ? 25 : 50;

    this._scrollTimer.initWithCallback(callback, scrollDelay,
      Ci.nsITimer.TYPE_REPEATING_SLACK);
    callback();
  }

  _stopScroll() {
    if (this._scrollTimer)
      this._scrollTimer.cancel();
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
          let leftOrTopEdge = ele => Math.round(this._boundsWithoutFlushing(ele)[leftOrTop]);
          let rightOrBottomEdge = ele => Math.round(this._boundsWithoutFlushing(ele)[rightOrBottom]);

          let elements = this._getScrollableElements();
          let [leftOrTopElement, rightOrBottomElement] = [elements[0], elements[elements.length - 1]];
          if (this._isRTLScrollbox) {
            [leftOrTopElement, rightOrBottomElement] = [rightOrBottomElement, leftOrTopElement];
          }

          if (leftOrTopElement &&
            leftOrTopEdge(leftOrTopElement) >= leftOrTopEdge(this._scrollbox)) {
            scrolledToStart = !this._isRTLScrollbox;
            scrolledToEnd = this._isRTLScrollbox;
          } else if (rightOrBottomElement &&
            rightOrBottomEdge(rightOrBottomElement) <= rightOrBottomEdge(this._scrollbox)) {
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
