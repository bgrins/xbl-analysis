class XblTree extends XblTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

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
    let comment = document.createComment("Creating xbl-tree");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get columns() {
    return this.treeBoxObject.columns;
  }

  set view(val) {
    return (this.treeBoxObject.view = val);
  }

  get view() {
    return this.treeBoxObject.view
      ? this.treeBoxObject.view.QueryInterface(
          Components.interfaces.nsITreeView
        )
      : null;
  }

  get body() {
    return this.treeBoxObject.treeBody;
  }

  set editable(val) {
    if (val) this.setAttribute("editable", "true");
    else this.removeAttribute("editable");
    return val;
  }

  get editable() {
    return this.getAttribute("editable") == "true";
  }

  set selType(val) {
    this.setAttribute("seltype", val);
    return val;
  }

  get selType() {
    return this.getAttribute("seltype");
  }

  set currentIndex(val) {
    if (this.view) return (this.view.selection.currentIndex = val);
    return val;
  }

  get currentIndex() {
    return this.view ? this.view.selection.currentIndex : -1;
  }

  get treeBoxObject() {
    return this.boxObject;
  }

  get contentView() {
    return this
      .view; /*.QueryInterface(Components.interfaces.nsITreeContentView)*/
  }

  get builderView() {
    return this
      .view; /*.QueryInterface(Components.interfaces.nsIXULTreeBuilder)*/
  }

  set keepCurrentInView(val) {
    if (val) this.setAttribute("keepcurrentinview", "true");
    else this.removeAttribute("keepcurrentinview");
    return val;
  }

  get keepCurrentInView() {
    return this.getAttribute("keepcurrentinview") == "true";
  }

  set enableColumnDrag(val) {
    if (val) this.setAttribute("enableColumnDrag", "true");
    else this.removeAttribute("enableColumnDrag");
    return val;
  }

  get enableColumnDrag() {
    return this.hasAttribute("enableColumnDrag");
  }

  set disableKeyNavigation(val) {
    if (val) this.setAttribute("disableKeyNavigation", "true");
    else this.removeAttribute("disableKeyNavigation");
    return val;
  }

  get disableKeyNavigation() {
    return this.hasAttribute("disableKeyNavigation");
  }

  get editingRow() {
    return this._editingRow;
  }

  get editingColumn() {
    return this._editingColumn;
  }

  set _selectDelay(val) {
    this.setAttribute("_selectDelay", val);
  }

  get _selectDelay() {
    return this.getAttribute("_selectDelay") || 50;
  }
}
customElements.define("xbl-tree", XblTree);
