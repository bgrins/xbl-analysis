class FirefoxScrollbarBase extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-scrollbar-base");
    this.prepend(comment);

    this.addEventListener("contextmenu", event => {
      undefined;
    });

    this.addEventListener("click", event => {
      undefined;
    });

    this.addEventListener("dblclick", event => {
      undefined;
    });

    this.addEventListener("command", event => {
      undefined;
    });
  }
  disconnectedCallback() {}
}
customElements.define("firefox-scrollbar-base", FirefoxScrollbarBase);
