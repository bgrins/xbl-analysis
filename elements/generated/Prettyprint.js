class FirefoxPrettyprint extends XULElement {
  connectedCallback() {
    this.innerHTML = `
      <html:div id="top" class="highlight"></html:div>
      <html:span style="display: none;">
        <children></children>
      </html:span>
    `;

    this.addEventListener("click", event => {
      try {
        var par = event.originalTarget;
        if (par.nodeName == "div" && par.className == "expander") {
          if (par.parentNode.className == "expander-closed") {
            par.parentNode.className = "expander-open";
            event.originalTarget.firstChild.data = "\u2212";
          } else {
            par.parentNode.className = "expander-closed";
            event.originalTarget.firstChild.data = "+";
          }
        }
      } catch (e) {}
    });

    this.addEventListener("prettyprint-dom-created", event => {
      document.getAnonymousNodes(this).item(0).appendChild(event.detail);
    });
  }
}
customElements.define("firefox-prettyprint", FirefoxPrettyprint);
