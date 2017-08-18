class XblFeed extends XblRichlistitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<vbox flex="1">
<hbox flex="1">
<textbox flex="1" readonly="true" inherits="value=name" class="feedTitle">
</textbox>
<xbl-text-label inherits="value=type">
</xbl-text-label>
</hbox>
<vbox>
<vbox align="start">
<hbox>
<xbl-text-label inherits="value=feedURL,tooltiptext=feedURL" class="text-link" flex="1" onclick="openUILink(this.value, event);" crop="end">
</xbl-text-label>
</hbox>
</vbox>
</vbox>
<hbox flex="1" class="feed-subscribe">
<spacer flex="1">
</spacer>
<button label="&feedSubscribe;" accesskey="&feedSubscribe.accesskey;" oncommand="onSubscribeFeed()">
</button>
</hbox>
</vbox>`;
    let comment = document.createComment("Creating xbl-feed");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-feed", XblFeed);
