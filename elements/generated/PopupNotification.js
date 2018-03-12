class FirefoxPopupNotification extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:hbox align="start" class="popup-notification-body-container">
        <xul:image class="popup-notification-icon" inherits="popupid,src=icon,class=iconclass"></xul:image>
        <xul:vbox flex="1" pack="start" class="popup-notification-body" inherits="popupid">
          <xul:hbox align="start">
            <xul:vbox flex="1">
              <xul:label class="popup-notification-origin header" inherits="value=origin,tooltiptext=origin" crop="center"></xul:label>
              <xul:description class="popup-notification-description" inherits="popupid">
                <html:span inherits="text=label,popupid"></html:span>
                <html:b inherits="text=name,popupid"></html:b>
                <html:span inherits="text=endlabel,popupid"></html:span>
              </xul:description>
            </xul:vbox>
            <xul:toolbarbutton anonid="closebutton" class="messageCloseButton close-icon popup-notification-closebutton tabbable" inherits="oncommand=closebuttoncommand,hidden=closebuttonhidden" tooltiptext="FROM-DTD-closeNotification-tooltip"></xul:toolbarbutton>
          </xul:hbox>
          <children includes="popupnotificationcontent"></children>
          <xul:label class="text-link popup-notification-learnmore-link" inherits="onclick=learnmoreclick,href=learnmoreurl"></xul:label>
          <xul:checkbox anonid="checkbox" inherits="hidden=checkboxhidden,checked=checkboxchecked,label=checkboxlabel,oncommand=checkboxcommand"></xul:checkbox>
          <xul:description class="popup-notification-warning" inherits="hidden=warninghidden,text=warninglabel"></xul:description>
        </xul:vbox>
      </xul:hbox>
      <xul:hbox class="popup-notification-button-container">
        <children includes="button"></children>
        <xul:button anonid="secondarybutton" class="popup-notification-button" inherits="oncommand=secondarybuttoncommand,label=secondarybuttonlabel,accesskey=secondarybuttonaccesskey,hidden=secondarybuttonhidden"></xul:button>
        <xul:toolbarseparator inherits="hidden=dropmarkerhidden"></xul:toolbarseparator>
        <xul:button anonid="menubutton" type="menu" class="popup-notification-button popup-notification-dropmarker" inherits="onpopupshown=dropmarkerpopupshown,hidden=dropmarkerhidden">
          <xul:menupopup anonid="menupopup" position="after_end" inherits="oncommand=menucommand">
            <children></children>
          </xul:menupopup>
        </xul:button>
        <xul:button anonid="button" class="popup-notification-button" default="true" label="FROM-DTD-defaultButton-label" accesskey="FROM-DTD-defaultButton-accesskey" inherits="oncommand=buttoncommand,label=buttonlabel,accesskey=buttonaccesskey,highlight=buttonhighlight,disabled=mainactiondisabled"></xul:button>
      </xul:hbox>
    `;
    this.checkbox = document.getAnonymousElementByAttribute(this, "anonid", "checkbox");

    this.closebutton = document.getAnonymousElementByAttribute(this, "anonid", "closebutton");

    this.button = document.getAnonymousElementByAttribute(this, "anonid", "button");

    this.secondaryButton = document.getAnonymousElementByAttribute(this, "anonid", "secondarybutton");

    this.menubutton = document.getAnonymousElementByAttribute(this, "anonid", "menubutton");

    this.menupopup = document.getAnonymousElementByAttribute(this, "anonid", "menupopup");

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}