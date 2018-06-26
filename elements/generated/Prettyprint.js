class Prettyprint extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <html:div id="top"></html:div>
      <html:span style="display: none;">
        <children></children>
      </html:span>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {
    this.addEventListener("prettyprint-dom-created", (event) => {
      let container = document.getAnonymousNodes(this).item(0);
      // Take the child nodes from the passed <div id="top">
      // and append them to our own.
      for (let el of event.detail.childNodes) {
        container.appendChild(el);
      }
    });

  }
}