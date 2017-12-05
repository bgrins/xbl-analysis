class FirefoxUpdate extends FirefoxRichlistitem {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:hbox>
        <xul:label class="update-name" inherits="value=name" flex="1" crop="right"></xul:label>
        <xul:label inherits="href=detailsURL,hidden=hideDetailsURL" class="text-link" value="FROM-DTD-update-details-label"></xul:label>
      </xul:hbox>
      <xul:grid>
        <xul:columns>
          <xul:column class="update-label-column"></xul:column>
          <xul:column flex="1"></xul:column>
        </xul:columns>
        <xul:rows>
          <xul:row>
            <xul:label class="update-installedOn-label"></xul:label>
            <xul:label class="update-installedOn-value" inherits="value=installDate" flex="1" crop="right"></xul:label>
          </xul:row>
          <xul:row>
            <xul:label class="update-status-label"></xul:label>
            <xul:description class="update-status-value" flex="1"></xul:description>
          </xul:row>
        </xul:rows>
      </xul:grid>
    `;
  }

  set name(val) {
    this.setAttribute("name", val);
    return val;
  }

  get name() {
    return this.getAttribute("name");
  }

  set detailsURL(val) {
    this.setAttribute("detailsURL", val);
    return val;
  }

  get detailsURL() {
    return this.getAttribute("detailsURL");
  }

  set installDate(val) {
    this.setAttribute("installDate", val);
    return val;
  }

  get installDate() {
    return this.getAttribute("installDate");
  }

  set hideDetailsURL(val) {
    this.setAttribute("hideDetailsURL", val);
    return val;
  }

  get hideDetailsURL() {
    return this.getAttribute("hideDetailsURL");
  }

  set status(val) {
    this.setAttribute("status", val);
    var field = document.getAnonymousElementByAttribute(
      this,
      "class",
      "update-status-value"
    );
    while (field.hasChildNodes()) field.firstChild.remove();
    field.appendChild(document.createTextNode(val));
    return val;
  }

  get status() {
    return this.getAttribute("status");
  }
}
customElements.define("firefox-update", FirefoxUpdate);
