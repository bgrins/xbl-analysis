class Download extends Richlistitem {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox class="downloadMainArea" flex="1" align="center">
        <stack>
          <image class="downloadTypeIcon" validate="always" inherits="src=image"></image>
          <image class="downloadBlockedBadge"></image>
        </stack>
        <vbox pack="center" flex="1" class="downloadContainer" style="width: FROM-DTD.downloadDetails.width;">
          <description class="downloadTarget" crop="center" style="min-width: FROM-DTD.downloadsSummary.minWidth2;" inherits="value=displayName,tooltiptext=displayName"></description>
          <progressmeter anonid="progressmeter" class="downloadProgress" min="0" max="100" inherits="mode=progressmode,value=progress,paused=progresspaused"></progressmeter>
          <description class="downloadDetails downloadDetailsNormal" crop="end" inherits="value=status"></description>
          <description class="downloadDetails downloadDetailsHover" crop="end" inherits="value=hoverStatus"></description>
          <description class="downloadDetails downloadDetailsFull" crop="end" inherits="value=fullStatus,tooltiptext=fullStatus"></description>
          <description class="downloadDetails downloadOpenFile" crop="end" value="FROM-DTD.openFile.label;"></description>
          <description class="downloadDetails downloadShowMoreInfo" crop="end" value="FROM-DTD.showMoreInformation.label;"></description>
          <stack class="downloadButtonLabels">
            <description class="downloadDetails downloadShow" crop="end" value="FROM-DTD.cmd.show.label;"></description>
            <description class="downloadDetails downloadCancel" crop="end" value="FROM-DTD.cancelDownload.label;"></description>
            <description class="downloadDetails downloadRetry" crop="end" value="FROM-DTD.retryDownload.label;"></description>
          </stack>
        </vbox>
      </hbox>
      <toolbarseparator></toolbarseparator>
      <stack class="downloadButtonArea">
        <button class="downloadButton downloadCancel downloadIconCancel" tooltiptext="FROM-DTD.cmd.cancel.label;" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_cancel');"></button>
        <button class="downloadButton downloadRetry downloadIconRetry" tooltiptext="FROM-DTD.cmd.retry.label;" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_retry');"></button>
        <button class="downloadButton downloadShow downloadIconShow" tooltiptext="FROM-DTD.cmd.show.label;" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_show');"></button>
        <button class="downloadButton downloadConfirmBlock downloadIconCancel" tooltiptext="FROM-DTD.cmd.removeFile.label;" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_confirmBlock');"></button>
        <button class="downloadButton downloadChooseUnblock downloadIconShow" tooltiptext="FROM-DTD.cmd.chooseUnblock.label;" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_chooseUnblock');"></button>
        <button class="downloadButton downloadChooseOpen downloadIconShow" tooltiptext="FROM-DTD.cmd.chooseOpen.label;" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_chooseOpen');"></button>
        <button class="downloadButton downloadShowBlockedInfo" tooltiptext="FROM-DTD.cmd.chooseUnblock.label;" oncommand="DownloadsView.onDownloadCommand(event, 'downloadsCmd_showBlockedInfo');"></button>
      </stack>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}