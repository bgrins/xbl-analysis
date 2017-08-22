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

    this.addEventListener("underflow", event => {
      // Scrollport event orientation
      // 0: vertical
      // 1: horizontal
      // 2: both (not used)
      var tree = document.getBindingParent(this);
      if (event.detail == 1) tree.setAttribute("hidehscroll", "true");
      else if (event.detail == 0) tree.setAttribute("hidevscroll", "true");
      event.stopPropagation();
    });

    this.addEventListener("overflow", event => {
      var tree = document.getBindingParent(this);
      if (event.detail == 1) tree.removeAttribute("hidehscroll");
      else if (event.detail == 0) tree.removeAttribute("hidevscroll");
      event.stopPropagation();
    });
  }
  disconnectedCallback() {}
}
customElements.define("firefox-treerows", FirefoxTreerows);
