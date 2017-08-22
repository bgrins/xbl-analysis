class FirefoxGrippy extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-grippy");
    this.prepend(comment);

    this.addEventListener("command", event => {
      var splitter = this.parentNode;
      if (splitter) {
        var state = splitter.getAttribute("state");
        if (state == "collapsed") splitter.setAttribute("state", "open");
        else splitter.setAttribute("state", "collapsed");
      }
    });
  }
  disconnectedCallback() {}
}
customElements.define("firefox-grippy", FirefoxGrippy);
