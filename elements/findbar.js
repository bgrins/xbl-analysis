class XblFindbar extends XblToolbar {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox anonid="findbar-container" class="findbar-container" flex="1" align="center">
<hbox anonid="findbar-textbox-wrapper" align="stretch">
<textbox anonid="findbar-textbox" class="findbar-textbox findbar-find-fast" xbl:inherits="flash">
</textbox>
<toolbarbutton anonid="find-previous" class="findbar-find-previous tabbable" tooltiptext="&previous.tooltip;" oncommand="onFindAgainCommand(true);" disabled="true" xbl:inherits="accesskey=findpreviousaccesskey">
</toolbarbutton>
<toolbarbutton anonid="find-next" class="findbar-find-next tabbable" tooltiptext="&next.tooltip;" oncommand="onFindAgainCommand(false);" disabled="true" xbl:inherits="accesskey=findnextaccesskey">
</toolbarbutton>
</hbox>
<toolbarbutton anonid="highlight" class="findbar-highlight findbar-button tabbable" label="&highlightAll.label;" accesskey="&highlightAll.accesskey;" tooltiptext="&highlightAll.tooltiptext;" oncommand="toggleHighlight(this.checked);" type="checkbox" xbl:inherits="accesskey=highlightaccesskey">
</toolbarbutton>
<toolbarbutton anonid="find-case-sensitive" class="findbar-case-sensitive findbar-button tabbable" label="&caseSensitive.label;" accesskey="&caseSensitive.accesskey;" tooltiptext="&caseSensitive.tooltiptext;" oncommand="_setCaseSensitivity(this.checked ? 1 : 0);" type="checkbox" xbl:inherits="accesskey=matchcaseaccesskey">
</toolbarbutton>
<toolbarbutton anonid="find-entire-word" class="findbar-entire-word findbar-button tabbable" label="&entireWord.label;" accesskey="&entireWord.accesskey;" tooltiptext="&entireWord.tooltiptext;" oncommand="toggleEntireWord(this.checked);" type="checkbox" xbl:inherits="accesskey=entirewordaccesskey">
</toolbarbutton>
<label anonid="match-case-status" class="findbar-find-fast">
</label>
<label anonid="entire-word-status" class="findbar-find-fast">
</label>
<label anonid="found-matches" class="findbar-find-fast found-matches" hidden="true">
</label>
<image anonid="find-status-icon" class="findbar-find-fast find-status-icon">
</image>
<description anonid="find-status" control="findbar-textbox" class="findbar-find-fast findbar-find-status">
</description>
</hbox>
<toolbarbutton anonid="find-closebutton" class="findbar-closebutton close-icon" tooltiptext="&findCloseButton.tooltip;" oncommand="close();">
</toolbarbutton>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-findbar ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-findbar", XblFindbar);
