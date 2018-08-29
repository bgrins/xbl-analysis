class MozTreecols extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox class="tree-scrollable-columns" flex="1">
        <children includes="treecol|splitter"></children>
      </hbox>
      <treecolpicker class="treecol-image" fixed="true" inherits="tooltiptext=pickertooltiptext"></treecolpicker>
    `));

    // Set resizeafter="farthest" on the splitters if nothing else has been
    // specified.
    Array.forEach(this.getElementsByTagName("splitter"), function(splitter) {
      if (!splitter.hasAttribute("resizeafter"))
        splitter.setAttribute("resizeafter", "farthest");
    });

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}