class FirefoxScrollbar extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:scrollbarbutton sbattr="scrollbar-up-top" type="decrement" inherits="curpos,maxpos,disabled"></xul:scrollbarbutton>
      <xul:scrollbarbutton sbattr="scrollbar-down-top" type="increment" inherits="curpos,maxpos,disabled"></xul:scrollbarbutton>
      <xul:slider flex="1" inherits="disabled,curpos,maxpos,pageincrement,increment,orient">
        <xul:thumb sbattr="scrollbar-thumb" inherits="orient,collapsed=disabled" align="center" pack="center"></xul:thumb>
      </xul:slider>
      <xul:scrollbarbutton sbattr="scrollbar-up-bottom" type="decrement" inherits="curpos,maxpos,disabled"></xul:scrollbarbutton>
      <xul:scrollbarbutton sbattr="scrollbar-down-bottom" type="increment" inherits="curpos,maxpos,disabled"></xul:scrollbarbutton>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}