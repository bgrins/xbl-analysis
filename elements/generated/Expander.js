class FirefoxExpander extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `<xul:hbox align="center">
<xul:button type="disclosure" class="expanderButton" anonid="disclosure" inherits="disabled" mousethrough="always">
</xul:button>
<xul:label class="header expanderButton" anonid="label" inherits="value=label,disabled" mousethrough="always" flex="1">
</xul:label>
<xul:button anonid="clear-button" inherits="label=clearlabel,disabled=cleardisabled,hidden=clearhidden" mousethrough="always" icon="clear">
</xul:button>
</xul:hbox>
<xul:vbox flex="1" anonid="settings" class="settingsContainer" collapsed="true" inherits="align">
<children>
</children>
</xul:vbox>`;

    var settings = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "settings"
    );
    var expander = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "disclosure"
    );
    var open = this.getAttribute("open") == "true";
    settings.collapsed = !open;
    expander.open = open;

    this.addEventListener("command", event => {
      this.onCommand(event);
    });

    this.addEventListener("click", event => {
      if (event.originalTarget.localName == "label") this.onCommand(event);
    });
  }

  set open(val) {
    var settings = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "settings"
    );
    var expander = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "disclosure"
    );
    settings.collapsed = !val;
    expander.open = val;
    if (val) this.setAttribute("open", "true");
    else this.setAttribute("open", "false");
    return val;
  }

  get open() {
    return this.getAttribute("open");
  }
  onCommand(aEvent) {
    var element = aEvent.originalTarget;
    var button = element.getAttribute("anonid");
    switch (button) {
      case "disclosure":
      case "label":
        if (this.open == "true") this.open = false;
        else this.open = true;
        break;
      case "clear-button":
        var event = document.createEvent("Events");
        event.initEvent("clear", true, true);
        this.dispatchEvent(event);
        break;
    }
  }
}
customElements.define("firefox-expander", FirefoxExpander);
