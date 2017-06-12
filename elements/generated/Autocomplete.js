class XblAutocomplete extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

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
    let comment = document.createComment("Creating xbl-autocomplete");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get controller() {
    return this.mController;
  }

  set popupOpen(val) {
    if (val) this.openPopup();
    else this.closePopup();
  }

  get popupOpen() {
    return this.popup.popupOpen;
  }

  set disableAutoComplete(val) {
    this.setAttribute("disableautocomplete", val);
    return val;
  }

  get disableAutoComplete() {
    return this.getAttribute("disableautocomplete") == "true";
  }

  set completeDefaultIndex(val) {
    this.setAttribute("completedefaultindex", val);
    return val;
  }

  get completeDefaultIndex() {
    return this.getAttribute("completedefaultindex") == "true";
  }

  set completeSelectedIndex(val) {
    this.setAttribute("completeselectedindex", val);
    return val;
  }

  get completeSelectedIndex() {
    return this.getAttribute("completeselectedindex") == "true";
  }

  set forceComplete(val) {
    this.setAttribute("forcecomplete", val);
    return val;
  }

  get forceComplete() {
    return this.getAttribute("forcecomplete") == "true";
  }

  set minResultsForPopup(val) {
    this.setAttribute("minresultsforpopup", val);
    return val;
  }

  get minResultsForPopup() {
    var m = parseInt(this.getAttribute("minresultsforpopup"));
    return isNaN(m) ? 1 : m;
  }

  set showCommentColumn(val) {
    this.setAttribute("showcommentcolumn", val);
    return val;
  }

  get showCommentColumn() {
    return this.getAttribute("showcommentcolumn") == "true";
  }

  set showImageColumn(val) {
    this.setAttribute("showimagecolumn", val);
    return val;
  }

  get showImageColumn() {
    return this.getAttribute("showimagecolumn") == "true";
  }

  set timeout(val) {
    this.setAttribute("timeout", val);
    return val;
  }

  set searchParam(val) {
    this.setAttribute("autocompletesearchparam", val);
    return val;
  }

  get searchParam() {
    return this.getAttribute("autocompletesearchparam") || "";
  }

  get searchCount() {
    this.initSearchNames();
    return this.mSearchNames.length;
  }

  get inPrivateContext() {
    return this.PrivateBrowsingUtils.isWindowPrivate(window);
  }

  get noRollupOnCaretMove() {
    return this.popup.getAttribute("norolluponanchor") == "true";
  }

  get editable() {
    return true;
  }

  set crop(val) {
    this.setAttribute("crop", val);
    return val;
  }

  get crop() {
    return this.getAttribute("crop");
  }

  get open() {
    return this.getAttribute("open") == "true";
  }

  get focused() {
    return this.getAttribute("focused") == "true";
  }

  set maxRows(val) {
    this.setAttribute("maxrows", val);
    return val;
  }

  get maxRows() {
    return parseInt(this.getAttribute("maxrows")) || 0;
  }

  set tabScrolling(val) {
    this.setAttribute("tabscrolling", val);
    return val;
  }

  get tabScrolling() {
    return this.getAttribute("tabscrolling") == "true";
  }

  set ignoreBlurWhileSearching(val) {
    this.setAttribute("ignoreblurwhilesearching", val);
    return val;
  }

  get ignoreBlurWhileSearching() {
    return this.getAttribute("ignoreblurwhilesearching") == "true";
  }

  set disableKeyNavigation(val) {
    this.setAttribute("disablekeynavigation", val);
    return val;
  }

  get disableKeyNavigation() {
    return this.getAttribute("disablekeynavigation") == "true";
  }

  set highlightNonMatches(val) {
    this.setAttribute("highlightnonmatches", val);
    return val;
  }

  get highlightNonMatches() {
    return this.getAttribute("highlightnonmatches") == "true";
  }
}
customElements.define("xbl-autocomplete", XblAutocomplete);
