class XblAutocomplete extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox class="autocomplete-textbox-container" flex="1" xbl:inherits="focused">
<children includes="image|deck|stack|box">
<image class="autocomplete-icon" allowevents="true">
</image>
</children>
<hbox anonid="textbox-input-box" class="textbox-input-box" flex="1" xbl:inherits="tooltiptext=inputtooltiptext">
<children>
</children>
<input anonid="input" class="autocomplete-textbox textbox-input" allowevents="true" xbl:inherits="tooltiptext=inputtooltiptext,value,type=inputtype,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey,mozactionhint">
</input>
</hbox>
<children includes="hbox">
</children>
</hbox>
<dropmarker anonid="historydropmarker" class="autocomplete-history-dropmarker" allowevents="true" xbl:inherits="open,enablehistory,parentfocused=focused">
</dropmarker>
<popupset anonid="popupset" class="autocomplete-result-popupset">
</popupset>
<children includes="toolbarbutton">
</children>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-autocomplete ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-autocomplete", XblAutocomplete);
