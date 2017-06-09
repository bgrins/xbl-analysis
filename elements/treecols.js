class XblTreecols extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox class="tree-scrollable-columns" flex="1">
<children includes="treecol|splitter">
</children>
</hbox>
<treecolpicker class="treecol-image" fixed="true" xbl:inherits="tooltiptext=pickertooltiptext">
</treecolpicker>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-treecols ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-treecols", XblTreecols);
