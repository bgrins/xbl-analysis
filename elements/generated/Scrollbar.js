class FirefoxScrollbar extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:scrollbarbutton sbattr="scrollbar-up-top" type="decrement" inherits="curpos,maxpos,disabled,sborient=orient"></xul:scrollbarbutton>
      <xul:scrollbarbutton sbattr="scrollbar-down-top" type="increment" inherits="curpos,maxpos,disabled,sborient=orient"></xul:scrollbarbutton>
      <xul:slider flex="1" inherits="disabled,curpos,maxpos,pageincrement,increment,orient,sborient=orient">
        <xul:thumb sbattr="scrollbar-thumb" inherits="orient,sborient=orient,collapsed=disabled" align="center" pack="center"></xul:thumb>
      </xul:slider>
      <xul:scrollbarbutton sbattr="scrollbar-up-bottom" type="decrement" inherits="curpos,maxpos,disabled,sborient=orient"></xul:scrollbarbutton>
      <xul:scrollbarbutton sbattr="scrollbar-down-bottom" type="increment" inherits="curpos,maxpos,disabled,sborient=orient"></xul:scrollbarbutton>
    `;

  }

}