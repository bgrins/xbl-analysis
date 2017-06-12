class XblScrollbar extends XblScrollbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<scrollbarbutton sbattr="scrollbar-up-top" type="decrement" xbl:inherits="curpos,maxpos,disabled,sborient=orient">
</scrollbarbutton>
<scrollbarbutton sbattr="scrollbar-down-top" type="increment" xbl:inherits="curpos,maxpos,disabled,sborient=orient">
</scrollbarbutton>
<slider flex="1" xbl:inherits="disabled,curpos,maxpos,pageincrement,increment,orient,sborient=orient">
<thumb sbattr="scrollbar-thumb" xbl:inherits="orient,sborient=orient,collapsed=disabled" align="center" pack="center">
</thumb>
</slider>
<scrollbarbutton sbattr="scrollbar-up-bottom" type="decrement" xbl:inherits="curpos,maxpos,disabled,sborient=orient">
</scrollbarbutton>
<scrollbarbutton sbattr="scrollbar-down-bottom" type="increment" xbl:inherits="curpos,maxpos,disabled,sborient=orient">
</scrollbarbutton>`;
    let comment = document.createComment("Creating xbl-scrollbar");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-scrollbar", XblScrollbar);
