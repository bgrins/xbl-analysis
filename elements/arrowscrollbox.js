class XblArrowscrollbox extends XblScrollboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<autorepeatbutton class="autorepeatbutton-up" anonid="scrollbutton-up" xbl:inherits="orient,collapsed=notoverflowing,disabled=scrolledtostart" oncommand="_autorepeatbuttonScroll(event);">
</autorepeatbutton>
<spacer class="arrowscrollbox-overflow-start-indicator" xbl:inherits="collapsed=scrolledtostart">
</spacer>
<scrollbox class="arrowscrollbox-scrollbox" anonid="scrollbox" flex="1" xbl:inherits="orient,align,pack,dir">
<children>
</children>
</scrollbox>
<spacer class="arrowscrollbox-overflow-end-indicator" xbl:inherits="collapsed=scrolledtoend">
</spacer>
<autorepeatbutton class="autorepeatbutton-down" anonid="scrollbutton-down" xbl:inherits="orient,collapsed=notoverflowing,disabled=scrolledtoend" oncommand="_autorepeatbuttonScroll(event);">
</autorepeatbutton>`;
    let comment = document.createComment("Creating xbl-arrowscrollbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-arrowscrollbox", XblArrowscrollbox);
