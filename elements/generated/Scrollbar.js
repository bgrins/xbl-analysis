class XblScrollbar extends XblScrollbarBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<scrollbarbutton sbattr="scrollbar-up-top" type="decrement" inherits="curpos,maxpos,disabled,sborient=orient">
</scrollbarbutton>
<scrollbarbutton sbattr="scrollbar-down-top" type="increment" inherits="curpos,maxpos,disabled,sborient=orient">
</scrollbarbutton>
<slider flex="1" inherits="disabled,curpos,maxpos,pageincrement,increment,orient,sborient=orient">
<thumb sbattr="scrollbar-thumb" inherits="orient,sborient=orient,collapsed=disabled" align="center" pack="center">
</thumb>
</slider>
<scrollbarbutton sbattr="scrollbar-up-bottom" type="decrement" inherits="curpos,maxpos,disabled,sborient=orient">
</scrollbarbutton>
<scrollbarbutton sbattr="scrollbar-down-bottom" type="increment" inherits="curpos,maxpos,disabled,sborient=orient">
</scrollbarbutton>`;
    let comment = document.createComment("Creating xbl-scrollbar");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-scrollbar", XblScrollbar);
