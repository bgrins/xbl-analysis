class XblDatepickerGrid extends XblDatepicker {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<vbox class="datepicker-mainbox">
<hbox class="datepicker-monthbox" align="center">
<button class="datepicker-previous datepicker-button" type="repeat" xbl:inherits="disabled" oncommand="document.getBindingParent(this)._increaseOrDecreaseMonth(-1);">
</button>
<spacer flex="1">
</spacer>
<deck anonid="monthlabeldeck">
<label class="datepicker-gridlabel" value="">
</label>
<label class="datepicker-gridlabel" value="">
</label>
<label class="datepicker-gridlabel" value="">
</label>
<label class="datepicker-gridlabel" value="">
</label>
<label class="datepicker-gridlabel" value="">
</label>
<label class="datepicker-gridlabel" value="">
</label>
<label class="datepicker-gridlabel" value="">
</label>
<label class="datepicker-gridlabel" value="">
</label>
<label class="datepicker-gridlabel" value="">
</label>
<label class="datepicker-gridlabel" value="">
</label>
<label class="datepicker-gridlabel" value="">
</label>
<label class="datepicker-gridlabel" value="">
</label>
</deck>
<label anonid="yearlabel" class="datepicker-gridlabel">
</label>
<spacer flex="1">
</spacer>
<button class="datepicker-next datepicker-button" type="repeat" xbl:inherits="disabled" oncommand="document.getBindingParent(this)._increaseOrDecreaseMonth(1);">
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
<label class="datepicker-weeklabel" role="columnheader">
</label>
<label class="datepicker-weeklabel" role="columnheader">
</label>
<label class="datepicker-weeklabel" role="columnheader">
</label>
<label class="datepicker-weeklabel" role="columnheader">
</label>
<label class="datepicker-weeklabel" role="columnheader">
</label>
<label class="datepicker-weeklabel" role="columnheader">
</label>
<label class="datepicker-weeklabel" role="columnheader">
</label>
</row>
<row>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
</row>
<row>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
</row>
<row>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
</row>
<row>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
</row>
<row>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
</row>
<row>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
<label class="datepicker-gridlabel" role="gridcell">
</label>
</row>
</rows>
</grid>
</vbox>`;
    let comment = document.createComment("Creating xbl-datepicker-grid");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-datepicker-grid", XblDatepickerGrid);
