class XblListbox extends XblListboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children includes="listcols">
<listcols>
<listcol flex="1">
</listcol>
</listcols>
</children>
<listrows>
<children includes="listhead">
</children>
<listboxbody xbl:inherits="rows,size,minheight">
<children includes="listitem">
</children>
</listboxbody>
</listrows>`;
    let comment = document.createComment("Creating xbl-listbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get listBoxObject() {
    return this.boxObject;
  }

  get itemCount() {
    return this.listBoxObject.getRowCount();
  }
}
customElements.define("xbl-listbox", XblListbox);
