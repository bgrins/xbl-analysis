class FirefoxTreecols extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<xul:hbox class="tree-scrollable-columns" flex="1">
<children includes="treecol|splitter">
</children>
</xul:hbox>
<xul:treecolpicker class="treecol-image" fixed="true" inherits="tooltiptext=pickertooltiptext">
</xul:treecolpicker>`;
    let comment = document.createComment("Creating firefox-treecols");
    this.prepend(comment);

    // Set resizeafter="farthest" on the splitters if nothing else has been
    // specified.
    Array.forEach(this.getElementsByTagName("splitter"), function(splitter) {
      if (!splitter.hasAttribute("resizeafter"))
        splitter.setAttribute("resizeafter", "farthest");
    });
  }
  disconnectedCallback() {}
}
customElements.define("firefox-treecols", FirefoxTreecols);
