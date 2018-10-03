/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozDownload extends MozRichlistitem {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox class="downloadMainArea" flex="1" align="center">
        <stack>
          <image class="downloadTypeIcon" validate="always" inherits="src=image"></image>
          <image class="downloadBlockedBadge"></image>
        </stack>
        <vbox pack="center" flex="1" class="downloadContainer">
          <description class="downloadTarget" crop="center" inherits="value=displayName,tooltiptext=displayName"></description>
          <progressmeter anonid="progressmeter" class="downloadProgress" min="0" max="100" inherits="progress-undetermined,mode=progressmode,value=progress,paused=progresspaused"></progressmeter>
          <description class="downloadDetails downloadDetailsNormal" crop="end" inherits="value=status,tooltiptext=status"></description>
          <description class="downloadDetails downloadDetailsHover" crop="end" inherits="value=hoverStatus"></description>
          <description class="downloadDetails downloadDetailsButtonHover" crop="end" inherits="value=buttonHoverStatus"></description>
        </vbox>
      </hbox>
      <toolbarseparator></toolbarseparator>
      <button class="downloadButton" inherits="class=buttonclass,aria-label=buttonarialabel,tooltiptext=buttontooltiptext" oncommand="DownloadsView.onDownloadButton(event);"></button>
    `));

  }
}

customElements.define("download", MozDownload);

}
