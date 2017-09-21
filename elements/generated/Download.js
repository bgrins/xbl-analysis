class FirefoxDownload extends FirefoxRichlistitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="downloadMainArea" flex="1" align="center">
<stack>
<image class="downloadTypeIcon" validate="always" inherits="src=image">
</image>
<image class="downloadBlockedBadge">
</image>
</stack>
<vbox pack="center" flex="1" class="downloadContainer" style="width:  ">
<description class="downloadTarget" crop="center" style="min-width:  " inherits="value=displayName,tooltiptext=displayName">
</description>
<progressmeter anonid="progressmeter" class="downloadProgress" min="0" max="100" inherits="mode=progressmode,value=progress,paused=progresspaused">
</progressmeter>
<description class="downloadDetails downloadDetailsNormal" crop="end" inherits="value=status">
</description>
<description class="downloadDetails downloadDetailsHover" crop="end" inherits="value=hoverStatus">
</description>
<description class="downloadDetails downloadDetailsFull" crop="end" inherits="value=fullStatus,tooltiptext=fullStatus">
</description>
<description class="downloadDetails downloadOpenFile" crop="end" value="&openFile.label;">
</description>
<description class="downloadDetails downloadShowMoreInfo" crop="end" value="&showMoreInformation.label;">
</description>
<stack class="downloadButtonLabels">
<description class="downloadDetails downloadShow" crop="end" value="&cmd.show.label;">
</description>
<description class="downloadDetails downloadCancel" crop="end" value="&cancelDownload.label;">
</description>
<description class="downloadDetails downloadRetry" crop="end" value="&retryDownload.label;">
</description>
</stack>
</vbox>
</hbox>
<toolbarseparator>
</toolbarseparator>
<stack class="downloadButtonArea">
<button class="downloadButton downloadCancel downloadIconCancel" tooltiptext="&cmd.cancel.label;" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_cancel');">
</button>
<button class="downloadButton downloadRetry downloadIconRetry" tooltiptext="&cmd.retry.label;" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_retry');">
</button>
<button class="downloadButton downloadShow downloadIconShow" tooltiptext="&cmd.show.label;" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_show');">
</button>
<button class="downloadButton downloadConfirmBlock downloadIconCancel" tooltiptext="&cmd.removeFile.label;" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_confirmBlock');">
</button>
<button class="downloadButton downloadChooseUnblock downloadIconShow" tooltiptext="&cmd.chooseUnblock.label;" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_chooseUnblock');">
</button>
<button class="downloadButton downloadChooseOpen downloadIconShow" tooltiptext="&cmd.chooseOpen.label;" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_chooseOpen');">
</button>
<button class="downloadButton downloadShowBlockedInfo" tooltiptext="&cmd.chooseUnblock.label;" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_showBlockedInfo');">
</button>
</stack>`;
    let comment = document.createComment("Creating firefox-download");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-download", FirefoxDownload);
