class FirefoxTreerows extends FirefoxTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox flex="1" class="tree-bodybox">
<children>
</children>
</hbox>
<scrollbar height="0" minwidth="0" minheight="0" orient="vertical" inherits="collapsed=hidevscroll" style="position:relative; z-index:2147483647;">
</scrollbar>`;
    let comment = document.createComment("Creating firefox-treerows");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-treerows", FirefoxTreerows);
