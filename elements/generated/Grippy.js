class FirefoxGrippy extends XULElement {
  connectedCallback() {

    this.setupHandlers();
  }

  setupHandlers() {

    this.addEventListener("command", (event) => {
      var splitter = this.parentNode;
      if (splitter) {
        var state = splitter.getAttribute("state");
        if (state == "collapsed")
          splitter.setAttribute("state", "open");
        else
          splitter.setAttribute("state", "collapsed");
      }
    });

  }
}