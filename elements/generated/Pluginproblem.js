class FirefoxPluginproblem extends XULElement {
  connectedCallback() {
    this.innerHTML = `
      <html:div class="mainBox" anonid="main" chromedir="FROM-DTD-locale-dir">
        <html:div class="hoverBox">
          <html:label>
            <html:button class="icon" anonid="icon"></html:button>
            <html:div class="msg msgVulnerabilityStatus" anonid="vulnerabilityStatus"></html:div>
            <html:div class="msg msgTapToPlay"></html:div>
            <html:div class="msg msgClickToPlay" anonid="clickToPlay"></html:div>
          </html:label>
          <html:div class="msg msgBlocked"></html:div>
          <html:div class="msg msgCrashed">
            <html:div class="msgCrashedText" anonid="crashedText"></html:div>
            <html:div class="msgReload">
              <html:a class="reloadLink" anonid="reloadLink" href=""></html:a>
            </html:div>
          </html:div>
          <html:div class="msg msgManagePlugins">
            <html:a class="action-link" anonid="managePluginsLink" href=""></html:a>
          </html:div>
          <html:div class="submitStatus" anonid="submitStatus">
            <html:div class="msg msgPleaseSubmit" anonid="pleaseSubmit">
              <html:textarea class="submitComment" anonid="submitComment" placeholder="FROM-DTD-report-comment"></html:textarea>
              <html:div class="submitURLOptInBox">
                <html:label>
                  <html:input class="submitURLOptIn" anonid="submitURLOptIn" type="checkbox"></html:input>
                </html:label>
              </html:div>
              <html:div class="submitButtonBox">
                <html:span class="helpIcon" anonid="helpIcon" role="link"></html:span>
                <html:input class="submitButton" type="button" anonid="submitButton" value="FROM-DTD-report-please"></html:input>
              </html:div>
            </html:div>
            <html:div class="msg msgSubmitting">
              <html:span class="throbber"></html:span>
            </html:div>
            <html:div class="msg msgSubmitted"></html:div>
            <html:div class="msg msgNotSubmitted"></html:div>
            <html:div class="msg msgSubmitFailed"></html:div>
            <html:div class="msg msgNoCrashReport"></html:div>
          </html:div>
          <html:div class="msg msgCheckForUpdates">
            <html:a class="action-link" anonid="checkForUpdatesLink" href=""></html:a>
          </html:div>
        </html:div>
        <html:button class="closeIcon" anonid="closeIcon" title="FROM-DTD-hidePluginBtn-label"></html:button>
      </html:div>
      <html:div style="display:none;">
        <children></children>
      </html:div>
    `;

    // Notify browser-plugins.js that we were attached, on a delay because
    // this binding doesn't complete layout until the constructor
    // completes.
    this.dispatchEvent(new CustomEvent("PluginBindingAttached"));
  }
}
customElements.define("firefox-pluginproblem", FirefoxPluginproblem);
