class XblDatepickerGrid extends XblDatepicker {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<vbox class="datepicker-mainbox">
<hbox class="datepicker-monthbox" align="center">
<button class="datepicker-previous datepicker-button" type="repeat" inherits="disabled" oncommand="document.getBindingParent(this)._increaseOrDecreaseMonth(-1);">
</button>
<spacer flex="1">
</spacer>
<deck anonid="monthlabeldeck">
<xbl-text-label class="datepicker-gridlabel" value="">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" value="">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" value="">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" value="">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" value="">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" value="">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" value="">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" value="">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" value="">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" value="">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" value="">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" value="">
</xbl-text-label>
</deck>
<xbl-text-label anonid="yearlabel" class="datepicker-gridlabel">
</xbl-text-label>
<spacer flex="1">
</spacer>
<button class="datepicker-next datepicker-button" type="repeat" inherits="disabled" oncommand="document.getBindingParent(this)._increaseOrDecreaseMonth(1);">
</button>
</hbox>
<grid class="datepicker-grid" role="grid">
<columns>
<column class="datepicker-gridrow" flex="1">
</column>
<column class="datepicker-gridrow" flex="1">
</column>
<column class="datepicker-gridrow" flex="1">
</column>
<column class="datepicker-gridrow" flex="1">
</column>
<column class="datepicker-gridrow" flex="1">
</column>
<column class="datepicker-gridrow" flex="1">
</column>
<column class="datepicker-gridrow" flex="1">
</column>
</columns>
<rows anonid="datebox">
<row anonid="dayofweekbox">
<xbl-text-label class="datepicker-weeklabel" role="columnheader">
</xbl-text-label>
<xbl-text-label class="datepicker-weeklabel" role="columnheader">
</xbl-text-label>
<xbl-text-label class="datepicker-weeklabel" role="columnheader">
</xbl-text-label>
<xbl-text-label class="datepicker-weeklabel" role="columnheader">
</xbl-text-label>
<xbl-text-label class="datepicker-weeklabel" role="columnheader">
</xbl-text-label>
<xbl-text-label class="datepicker-weeklabel" role="columnheader">
</xbl-text-label>
<xbl-text-label class="datepicker-weeklabel" role="columnheader">
</xbl-text-label>
</row>
<row>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
</row>
<row>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
</row>
<row>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
</row>
<row>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
</row>
<row>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
</row>
<row>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
<xbl-text-label class="datepicker-gridlabel" role="gridcell">
</xbl-text-label>
</row>
</rows>
</grid>
</vbox>`;
    let comment = document.createComment("Creating xbl-datepicker-grid");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get selectedItem() {
    return this._selectedItem;
  }
}
customElements.define("xbl-datepicker-grid", XblDatepickerGrid);
