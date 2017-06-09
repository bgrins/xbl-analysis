class XblTree extends XblTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children includes="treecols">
</children>
<stack class="tree-stack" flex="1">
<treerows class="tree-rows" flex="1" xbl:inherits="hidevscroll">
<children>
</children>
</treerows>
<textbox anonid="input" class="tree-input" left="0" top="0" hidden="true">
</textbox>
</stack>
<hbox xbl:inherits="collapsed=hidehscroll">
<scrollbar orient="horizontal" flex="1" increment="16" style="position:relative; z-index:2147483647;">
</scrollbar>
<scrollcorner xbl:inherits="collapsed=hidevscroll">
</scrollcorner>
</hbox>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-tree ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-tree", XblTree);
