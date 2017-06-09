class XblArrowscrollboxClicktoscroll extends XblArrowscrollbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<toolbarbutton class="scrollbutton-up" xbl:inherits="orient,collapsed=notoverflowing,disabled=scrolledtostart" anonid="scrollbutton-up" onclick="_distanceScroll(event);" onmousedown="if (event.button == 0) _startScroll(-1);" onmouseup="if (event.button == 0) _stopScroll();" onmouseover="_continueScroll(-1);" onmouseout="_pauseScroll();">
</toolbarbutton>
<spacer class="arrowscrollbox-overflow-start-indicator" xbl:inherits="collapsed=scrolledtostart">
</spacer>
<scrollbox class="arrowscrollbox-scrollbox" anonid="scrollbox" flex="1" xbl:inherits="orient,align,pack,dir">
<children>
</children>
</scrollbox>
<spacer class="arrowscrollbox-overflow-end-indicator" xbl:inherits="collapsed=scrolledtoend">
</spacer>
<toolbarbutton class="scrollbutton-down" xbl:inherits="orient,collapsed=notoverflowing,disabled=scrolledtoend" anonid="scrollbutton-down" onclick="_distanceScroll(event);" onmousedown="if (event.button == 0) _startScroll(1);" onmouseup="if (event.button == 0) _stopScroll();" onmouseover="_continueScroll(1);" onmouseout="_pauseScroll();">
</toolbarbutton>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-arrowscrollbox-clicktoscroll ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-arrowscrollbox-clicktoscroll",
  XblArrowscrollboxClicktoscroll
);
