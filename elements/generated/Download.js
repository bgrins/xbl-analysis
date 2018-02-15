class FirefoxDownload extends FirefoxRichlistitem {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:hbox class="downloadMainArea" flex="1" align="center">
        <xul:stack>
          <xul:image class="downloadTypeIcon" validate="always" inherits="src=image"></xul:image>
          <xul:image class="downloadBlockedBadge"></xul:image>
        </xul:stack>
        <xul:vbox pack="center" flex="1" class="downloadContainer" style="width: FROM-DTD-downloadDetails-width">
          <xul:description class="downloadTarget" crop="center" style="min-width: FROM-DTD-downloadsSummary-minWidth2" inherits="value=displayName,tooltiptext=displayName"></xul:description>
          <xul:progressmeter anonid="progressmeter" class="downloadProgress" min="0" max="100" inherits="mode=progressmode,value=progress,paused=progresspaused"></xul:progressmeter>
          <xul:description class="downloadDetails downloadDetailsNormal" crop="end" inherits="value=status"></xul:description>
          <xul:description class="downloadDetails downloadDetailsHover" crop="end" inherits="value=hoverStatus"></xul:description>
          <xul:description class="downloadDetails downloadDetailsFull" crop="end" inherits="value=fullStatus,tooltiptext=fullStatus"></xul:description>
          <xul:description class="downloadDetails downloadOpenFile" crop="end" value="FROM-DTD-openFile-label"></xul:description>
          <xul:description class="downloadDetails downloadShowMoreInfo" crop="end" value="FROM-DTD-showMoreInformation-label"></xul:description>
          <xul:stack class="downloadButtonLabels">
            <xul:description class="downloadDetails downloadShow" crop="end" value="FROM-DTD-cmd-show-label"></xul:description>
            <xul:description class="downloadDetails downloadCancel" crop="end" value="FROM-DTD-cancelDownload-label"></xul:description>
            <xul:description class="downloadDetails downloadRetry" crop="end" value="FROM-DTD-retryDownload-label"></xul:description>
          </xul:stack>
        </xul:vbox>
      </xul:hbox>
      <xul:toolbarseparator></xul:toolbarseparator>
      <xul:stack class="downloadButtonArea">
        <xul:button class="downloadButton downloadCancel downloadIconCancel" tooltiptext="FROM-DTD-cmd-cancel-label" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_cancel');"></xul:button>
        <xul:button class="downloadButton downloadRetry downloadIconRetry" tooltiptext="FROM-DTD-cmd-retry-label" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_retry');"></xul:button>
        <xul:button class="downloadButton downloadShow downloadIconShow" tooltiptext="FROM-DTD-cmd-show-label" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_show');"></xul:button>
        <xul:button class="downloadButton downloadConfirmBlock downloadIconCancel" tooltiptext="FROM-DTD-cmd-removeFile-label" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_confirmBlock');"></xul:button>
        <xul:button class="downloadButton downloadChooseUnblock downloadIconShow" tooltiptext="FROM-DTD-cmd-chooseUnblock-label" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_chooseUnblock');"></xul:button>
        <xul:button class="downloadButton downloadChooseOpen downloadIconShow" tooltiptext="FROM-DTD-cmd-chooseOpen-label" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_chooseOpen');"></xul:button>
        <xul:button class="downloadButton downloadShowBlockedInfo" tooltiptext="FROM-DTD-cmd-chooseUnblock-label" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_showBlockedInfo');"></xul:button>
      </xul:stack>
    `;

  }

}