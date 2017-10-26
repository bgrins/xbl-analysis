class FirefoxFeed extends FirefoxRichlistitem {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:vbox flex="1">
        <xul:hbox flex="1">
          <xul:textbox flex="1" readonly="true" inherits="value=name" class="feedTitle"></xul:textbox>
          <xul:label inherits="value=type"></xul:label>
        </xul:hbox>
        <xul:vbox>
          <xul:vbox align="start">
            <xul:hbox>
              <xul:label inherits="value=feedURL,tooltiptext=feedURL" class="text-link" flex="1" onclick="openUILink(this.value, event);" crop="end"></xul:label>
            </xul:hbox>
          </xul:vbox>
        </xul:vbox>
        <xul:hbox flex="1" class="feed-subscribe">
          <xul:spacer flex="1"></xul:spacer>
          <xul:button label="FROM-DTD-feedSubscribe" accesskey="FROM-DTD-feedSubscribe-accesskey" oncommand="onSubscribeFeed()"></xul:button>
        </xul:hbox>
      </xul:vbox>
    `;
  }
}
customElements.define("firefox-feed", FirefoxFeed);
