class FirefoxScrollbarBase extends XULElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.addEventListener("contextmenu", event => {
      event.stopPropagation();
    });

    this.addEventListener("click", event => {
      event.stopPropagation();
    });

    this.addEventListener("dblclick", event => {
      event.stopPropagation();
    });

    this.addEventListener("command", event => {
      event.stopPropagation();
    });
  }
}
customElements.define("firefox-scrollbar-base", FirefoxScrollbarBase);
