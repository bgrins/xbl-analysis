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
    let comment = document.createComment("Creating xbl-treecols");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-treecols", XblTreecols);
