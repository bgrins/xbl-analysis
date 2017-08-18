class FirefoxArrowscrollboxClicktoscroll extends FirefoxArrowscrollbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<toolbarbutton class="scrollbutton-up" inherits="orient,collapsed=notoverflowing,disabled=scrolledtostart" anonid="scrollbutton-up" onclick="_distanceScroll(event);" onmousedown="if (event.button == 0) _startScroll(-1);" onmouseup="if (event.button == 0) _stopScroll();" onmouseover="_continueScroll(-1);" onmouseout="_pauseScroll();">
</toolbarbutton>
<spacer class="arrowscrollbox-overflow-start-indicator" inherits="collapsed=scrolledtostart">
</spacer>
<scrollbox class="arrowscrollbox-scrollbox" anonid="scrollbox" flex="1" inherits="orient,align,pack,dir,smoothscroll">
<children>
</children>
</scrollbox>
<spacer class="arrowscrollbox-overflow-end-indicator" inherits="collapsed=scrolledtoend">
</spacer>
<toolbarbutton class="scrollbutton-down" inherits="orient,collapsed=notoverflowing,disabled=scrolledtoend" anonid="scrollbutton-down" onclick="_distanceScroll(event);" onmousedown="if (event.button == 0) _startScroll(1);" onmouseup="if (event.button == 0) _stopScroll();" onmouseover="_continueScroll(1);" onmouseout="_pauseScroll();">
</toolbarbutton>`;
    let comment = document.createComment(
      "Creating firefox-arrowscrollbox-clicktoscroll"
    );
    this.prepend(comment);

    try {
      this._scrollDelay = this._prefBranch.getIntPref(
        "toolkit.scrollbox.clickToScroll.scrollDelay",
        this._scrollDelay
      );
    } catch (e) {}
  }
  disconnectedCallback() {}
  notify(aTimer) {
    if (!document) aTimer.cancel();

    this.scrollByIndex(this._scrollIndex);
  }
  _startScroll(index) {
    if (this._isRTLScrollbox) index *= -1;
    this._scrollIndex = index;
    this._mousedown = true;

    if (!this._scrollTimer)
      this._scrollTimer = Components.classes[
        "@mozilla.org/timer;1"
      ].createInstance(Components.interfaces.nsITimer);
    else this._scrollTimer.cancel();

    this._scrollTimer.initWithCallback(
      this,
      this._scrollDelay,
      this._scrollTimer.TYPE_REPEATING_SLACK
    );
    this.notify(this._scrollTimer);
  }
  _stopScroll() {
    if (this._scrollTimer) this._scrollTimer.cancel();
    this._mousedown = false;
    this._scrollIndex = 0;
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
    if (this._mousedown) this._startScroll(index);
  }
  handleEvent(aEvent) {
    if (
      aEvent.type == "mouseup" ||
      (aEvent.type == "blur" && aEvent.target == document)
    ) {
      this._mousedown = false;
      document.removeEventListener("mouseup", this);
      document.removeEventListener("blur", this, true);
    }
  }
  _distanceScroll(aEvent) {
    if (aEvent.detail < 2 || aEvent.detail > 3) return;

    var scrollBack = aEvent.originalTarget == this._scrollButtonUp;
    var scrollLeftOrUp = this._isRTLScrollbox ? !scrollBack : scrollBack;
    var targetElement;

    if (aEvent.detail == 2) {
      // scroll by the size of the scrollbox
      let [start, end] = this._startEndProps;
      let x;
      if (scrollLeftOrUp)
        x = this.scrollClientRect[start] - this.scrollClientSize;
      else x = this.scrollClientRect[end] + this.scrollClientSize;
      targetElement = this._elementFromPoint(x, scrollLeftOrUp ? -1 : 1);

      // the next partly-hidden element will become fully visible,
      // so don't scroll too far
      if (targetElement)
        targetElement = scrollBack
          ? targetElement.nextSibling
          : targetElement.previousSibling;
    }

    if (!targetElement) {
      // scroll to the first resp. last element
      let elements = this._getScrollableElements();
      targetElement = scrollBack ? elements[0] : elements[elements.length - 1];
    }

    this.ensureElementIsVisible(targetElement);
  }
}
customElements.define(
  "firefox-arrowscrollbox-clicktoscroll",
  FirefoxArrowscrollboxClicktoscroll
);
