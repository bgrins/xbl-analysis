class XblPopupNotification extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<hbox align="start" class="popup-notification-body-container">
<image class="popup-notification-icon" inherits="popupid,src=icon,class=iconclass">
</image>
<vbox flex="1" pack="start" class="popup-notification-body" inherits="popupid">
<hbox align="start">
<vbox flex="1">
<xbl-text-label class="popup-notification-origin header" inherits="value=origin,tooltiptext=origin" crop="center">
</xbl-text-label>
<description class="popup-notification-description" inherits="text=label,popupid">
</description>
</vbox>
<toolbarbutton anonid="closebutton" class="messageCloseButton close-icon popup-notification-closebutton tabbable" inherits="oncommand=closebuttoncommand,hidden=closebuttonhidden" tooltiptext="&closeNotification.tooltip;">
</toolbarbutton>
</hbox>
<children includes="popupnotificationcontent">
</children>
<xbl-text-label class="text-link popup-notification-learnmore-link" inherits="onclick=learnmoreclick,href=learnmoreurl">
</xbl-text-label>
<checkbox anonid="checkbox" inherits="hidden=checkboxhidden,checked=checkboxchecked,label=checkboxlabel,oncommand=checkboxcommand">
</checkbox>
<description class="popup-notification-warning" inherits="hidden=warninghidden,text=warninglabel">
</description>
</vbox>
</hbox>
<hbox class="popup-notification-button-container">
<children includes="button">
</children>
<button anonid="secondarybutton" class="popup-notification-button" inherits="oncommand=secondarybuttoncommand,label=secondarybuttonlabel,accesskey=secondarybuttonaccesskey,hidden=secondarybuttonhidden">
</button>
<toolbarseparator inherits="hidden=dropmarkerhidden">
</toolbarseparator>
<button anonid="menubutton" type="menu" class="popup-notification-button popup-notification-dropmarker" inherits="onpopupshown=dropmarkerpopupshown,hidden=dropmarkerhidden">
<menupopup anonid="menupopup" position="after_end" inherits="oncommand=menucommand">
<children>
</children>
</menupopup>
</button>
<button anonid="button" class="popup-notification-button" default="true" label="&defaultButton.label;" accesskey="&defaultButton.accesskey;" inherits="oncommand=buttoncommand,label=buttonlabel,accesskey=buttonaccesskey,disabled=mainactiondisabled">
</button>
</hbox>`;
    let comment = document.createComment("Creating xbl-popup-notification");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-popup-notification", XblPopupNotification);
