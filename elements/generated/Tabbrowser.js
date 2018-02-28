class FirefoxTabbrowser extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:tabbox anonid="tabbox" class="tabbrowser-tabbox" flex="1" eventnode="document" inherits="tabcontainer" onselect="if (event.target.localName == 'tabpanels') gBrowser.updateCurrentBrowser();">
        <xul:tabpanels flex="1" class="plain" selectedIndex="0" anonid="panelcontainer">
          <xul:notificationbox flex="1" notificationside="top">
            <xul:hbox flex="1" class="browserSidebarContainer">
              <xul:vbox flex="1" class="browserContainer">
                <xul:stack flex="1" class="browserStack" anonid="browserStack">
                  <xul:browser anonid="initialBrowser" type="content" message="true" messagemanagergroup="browsers" primary="true" blank="true" inherits="tooltip=contenttooltip,contextmenu=contentcontextmenu,autocompletepopup,selectmenulist,datetimepicker"></xul:browser>
                </xul:stack>
              </xul:vbox>
            </xul:hbox>
          </xul:notificationbox>
        </xul:tabpanels>
      </xul:tabbox>
      <children></children>
    `;

    gBrowser = new TabBrowser(this);

    this._setupEventListeners();
  }

  disconnectedCallback() {
    gBrowser.disconnectedCallback();
  }

  _setupEventListeners() {

  }
}