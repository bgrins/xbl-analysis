class XblTreecols extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    try {
      // Set resizeafter="farthest" on the splitters if nothing else has been
      // specified.
      Array.forEach(this.getElementsByTagName("splitter"), function(splitter) {
        if (!splitter.hasAttribute("resizeafter"))
          splitter.setAttribute("resizeafter", "farthest");
      });
    } catch (e) {}

    console.log(this, "connected");

    this.innerHTML = `<hbox class="tree-scrollable-columns" flex="1">
<children includes="treecol|splitter">
</children>
</hbox>
<treecolpicker class="treecol-image" fixed="true" inherits="tooltiptext=pickertooltiptext">
</treecolpicker>`;
    let comment = document.createComment("Creating xbl-treecols");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-treecols", XblTreecols);
