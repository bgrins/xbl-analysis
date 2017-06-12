class XblPopupNotification extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<hbox align="start" class="popup-notification-body-container">
<image class="popup-notification-icon" xbl:inherits="popupid,src=icon,class=iconclass">
</image>
<vbox flex="1" pack="start" class="popup-notification-body" xbl:inherits="popupid">
<hbox align="start">
<vbox flex="1">
<label class="popup-notification-origin header" xbl:inherits="value=origin,tooltiptext=origin" crop="center">
</label>
<description anonid="description" class="popup-notification-description" xbl:inherits="xbl:text=label,popupid">
</description>
</vbox>
<toolbarbutton anonid="closebutton" class="messageCloseButton close-icon popup-notification-closebutton tabbable" xbl:inherits="oncommand=closebuttoncommand,hidden=closebuttonhidden" tooltiptext="&closeNotification.tooltip;">
</toolbarbutton>
</hbox>
<children includes="popupnotificationcontent">
</children>
<label class="text-link popup-notification-learnmore-link" xbl:inherits="onclick=learnmoreclick,href=learnmoreurl">
</label>
<checkbox anonid="checkbox" xbl:inherits="hidden=checkboxhidden,checked=checkboxchecked,label=checkboxlabel,oncommand=checkboxcommand">
</checkbox>
<description class="popup-notification-warning" xbl:inherits="hidden=warninghidden,xbl:text=warninglabel">
</description>
</vbox>
</hbox>
<hbox class="popup-notification-button-container">
<children includes="button">
</children>
<button anonid="secondarybutton" class="popup-notification-button" xbl:inherits="oncommand=secondarybuttoncommand,label=secondarybuttonlabel,accesskey=secondarybuttonaccesskey,hidden=secondarybuttonhidden">
</button>
<toolbarseparator xbl:inherits="hidden=dropmarkerhidden">
</toolbarseparator>
<button anonid="menubutton" type="menu" class="popup-notification-button popup-notification-dropmarker" xbl:inherits="onpopupshown=dropmarkerpopupshown,hidden=dropmarkerhidden">
<menupopup anonid="menupopup" position="after_end" xbl:inherits="oncommand=menucommand">
<children>
</children>
</menupopup>
</button>
<button anonid="button" class="popup-notification-button" default="true" label="&defaultButton.label;" accesskey="&defaultButton.accesskey;" xbl:inherits="oncommand=buttoncommand,label=buttonlabel,accesskey=buttonaccesskey,disabled=mainactiondisabled">
</button>
</hbox>`;
    let comment = document.createComment("Creating xbl-popup-notification");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-popup-notification", XblPopupNotification);
