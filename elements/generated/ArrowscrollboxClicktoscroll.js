class XblArrowscrollboxClicktoscroll extends XblArrowscrollbox {
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
<scrollbox class="arrowscrollbox-scrollbox" anonid="scrollbox" flex="1" inherits="orient,align,pack,dir">
<children>
</children>
</scrollbox>
<spacer class="arrowscrollbox-overflow-end-indicator" inherits="collapsed=scrolledtoend">
</spacer>
<toolbarbutton class="scrollbutton-down" inherits="orient,collapsed=notoverflowing,disabled=scrolledtoend" anonid="scrollbutton-down" onclick="_distanceScroll(event);" onmousedown="if (event.button == 0) _startScroll(1);" onmouseup="if (event.button == 0) _stopScroll();" onmouseover="_continueScroll(1);" onmouseout="_pauseScroll();">
</toolbarbutton>`;
    let comment = document.createComment(
      "Creating xbl-arrowscrollbox-clicktoscroll"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-arrowscrollbox-clicktoscroll",
  XblArrowscrollboxClicktoscroll
);
