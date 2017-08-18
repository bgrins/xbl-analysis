class FirefoxPopupNotification extends BaseElement {
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
<firefox-text-label class="popup-notification-origin header" inherits="value=origin,tooltiptext=origin" crop="center">
</firefox-text-label>
<description class="popup-notification-description" inherits="text=label,popupid">
</description>
</vbox>
<toolbarbutton anonid="closebutton" class="messageCloseButton close-icon popup-notification-closebutton tabbable" inherits="oncommand=closebuttoncommand,hidden=closebuttonhidden" tooltiptext="&closeNotification.tooltip;">
</toolbarbutton>
</hbox>
<children includes="popupnotificationcontent">
</children>
<firefox-text-label class="text-link popup-notification-learnmore-link" inherits="onclick=learnmoreclick,href=learnmoreurl">
</firefox-text-label>
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
    let comment = document.createComment("Creating firefox-popup-notification");
    this.prepend(comment);

    Object.defineProperty(this, "checkbox", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.checkbox;
        return (this.checkbox = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "checkbox"
        ));
      },
      set(val) {
        delete this["checkbox"];
        return (this["checkbox"] = val);
      }
    });
    Object.defineProperty(this, "closebutton", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.closebutton;
        return (this.closebutton = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "closebutton"
        ));
      },
      set(val) {
        delete this["closebutton"];
        return (this["closebutton"] = val);
      }
    });
    Object.defineProperty(this, "button", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.button;
        return (this.button = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "button"
        ));
      },
      set(val) {
        delete this["button"];
        return (this["button"] = val);
      }
    });
    Object.defineProperty(this, "secondaryButton", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.secondaryButton;
        return (this.secondaryButton = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "secondarybutton"
        ));
      },
      set(val) {
        delete this["secondaryButton"];
        return (this["secondaryButton"] = val);
      }
    });
    Object.defineProperty(this, "menubutton", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.menubutton;
        return (this.menubutton = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "menubutton"
        ));
      },
      set(val) {
        delete this["menubutton"];
        return (this["menubutton"] = val);
      }
    });
    Object.defineProperty(this, "menupopup", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.menupopup;
        return (this.menupopup = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "menupopup"
        ));
      },
      set(val) {
        delete this["menupopup"];
        return (this["menupopup"] = val);
      }
    });
  }
  disconnectedCallback() {}
}
customElements.define("firefox-popup-notification", FirefoxPopupNotification);
