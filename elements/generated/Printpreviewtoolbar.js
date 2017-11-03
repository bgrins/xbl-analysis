class FirefoxPrintpreviewtoolbar extends FirefoxToolbar {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:button label="FROM-DTD-print-label" accesskey="FROM-DTD-print-accesskey" oncommand="this.parentNode.print();" icon="print"></xul:button>
      <xul:button anonid="pageSetup" label="FROM-DTD-pageSetup-label" accesskey="FROM-DTD-pageSetup-accesskey" oncommand="this.parentNode.doPageSetup();"></xul:button>
      <xul:vbox align="center" pack="center">
        <xul:label value="FROM-DTD-page-label" accesskey="FROM-DTD-page-accesskey" control="pageNumber"></xul:label>
      </xul:vbox>
      <xul:toolbarbutton anonid="navigateHome" class="navigate-button tabbable" oncommand="parentNode.navigate(0, 0, 'home');" tooltiptext="FROM-DTD-homearrow-tooltip"></xul:toolbarbutton>
      <xul:toolbarbutton anonid="navigatePrevious" class="navigate-button tabbable" oncommand="parentNode.navigate(-1, 0, 0);" tooltiptext="FROM-DTD-previousarrow-tooltip"></xul:toolbarbutton>
      <xul:hbox align="center" pack="center">
        <xul:textbox id="pageNumber" size="3" value="1" min="1" type="number" hidespinbuttons="true" onchange="navigate(0, this.valueNumber, 0);"></xul:textbox>
        <xul:label value="FROM-DTD-of-label"></xul:label>
        <xul:label value="1"></xul:label>
      </xul:hbox>
      <xul:toolbarbutton anonid="navigateNext" class="navigate-button tabbable" oncommand="parentNode.navigate(1, 0, 0);" tooltiptext="FROM-DTD-nextarrow-tooltip"></xul:toolbarbutton>
      <xul:toolbarbutton anonid="navigateEnd" class="navigate-button tabbable" oncommand="parentNode.navigate(0, 0, 'end');" tooltiptext="FROM-DTD-endarrow-tooltip"></xul:toolbarbutton>
      <xul:toolbarseparator class="toolbarseparator-primary"></xul:toolbarseparator>
      <xul:vbox align="center" pack="center">
        <xul:label value="FROM-DTD-scale-label" accesskey="FROM-DTD-scale-accesskey" control="scale"></xul:label>
      </xul:vbox>
      <xul:hbox align="center" pack="center">
        <xul:menulist id="scale" crop="none" oncommand="parentNode.parentNode.scale(this.selectedItem.value);">
          <xul:menupopup>
            <xul:menuitem value="0.3" label="FROM-DTD-p30-label"></xul:menuitem>
            <xul:menuitem value="0.4" label="FROM-DTD-p40-label"></xul:menuitem>
            <xul:menuitem value="0.5" label="FROM-DTD-p50-label"></xul:menuitem>
            <xul:menuitem value="0.6" label="FROM-DTD-p60-label"></xul:menuitem>
            <xul:menuitem value="0.7" label="FROM-DTD-p70-label"></xul:menuitem>
            <xul:menuitem value="0.8" label="FROM-DTD-p80-label"></xul:menuitem>
            <xul:menuitem value="0.9" label="FROM-DTD-p90-label"></xul:menuitem>
            <xul:menuitem value="1" label="FROM-DTD-p100-label"></xul:menuitem>
            <xul:menuitem value="1.25" label="FROM-DTD-p125-label"></xul:menuitem>
            <xul:menuitem value="1.5" label="FROM-DTD-p150-label"></xul:menuitem>
            <xul:menuitem value="1.75" label="FROM-DTD-p175-label"></xul:menuitem>
            <xul:menuitem value="2" label="FROM-DTD-p200-label"></xul:menuitem>
            <xul:menuseparator></xul:menuseparator>
            <xul:menuitem flex="1" value="ShrinkToFit" label="FROM-DTD-ShrinkToFit-label"></xul:menuitem>
            <xul:menuitem value="Custom" label="FROM-DTD-Custom-label"></xul:menuitem>
          </xul:menupopup>
        </xul:menulist>
      </xul:hbox>
      <xul:toolbarseparator class="toolbarseparator-primary"></xul:toolbarseparator>
      <xul:hbox align="center" pack="center">
        <xul:toolbarbutton label="FROM-DTD-portrait-label" checked="true" accesskey="FROM-DTD-portrait-accesskey" type="radio" group="orient" class="toolbar-portrait-page tabbable" oncommand="parentNode.parentNode.orient('portrait');"></xul:toolbarbutton>
        <xul:toolbarbutton label="FROM-DTD-landscape-label" accesskey="FROM-DTD-landscape-accesskey" type="radio" group="orient" class="toolbar-landscape-page tabbable" oncommand="parentNode.parentNode.orient('landscape');"></xul:toolbarbutton>
      </xul:hbox>
      <xul:toolbarseparator class="toolbarseparator-primary"></xul:toolbarseparator>
      <xul:checkbox label="FROM-DTD-simplifyPage-label" checked="false" disabled="true" accesskey="FROM-DTD-simplifyPage-accesskey" tooltiptext-disabled="FROM-DTD-simplifyPage-disabled-tooltip" tooltiptext-enabled="FROM-DTD-simplifyPage-enabled-tooltip" oncommand="this.parentNode.simplify();"></xul:checkbox>
      <xul:toolbarseparator class="toolbarseparator-primary"></xul:toolbarseparator>
      <xul:button label="FROM-DTD-close-label" accesskey="FROM-DTD-close-accesskey" oncommand="PrintUtils.exitPrintPreview();" icon="close"></xul:button>
      <xul:data value="FROM-DTD-customPrompt-title"></xul:data>
    `;
    Object.defineProperty(this, "mPrintButton", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mPrintButton;
        return (this.mPrintButton = document.getAnonymousNodes(this)[0]);
      },
      set(val) {
        delete this.mPrintButton;
        return (this.mPrintButton = val);
      }
    });
    Object.defineProperty(this, "mPageSetupButton", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mPageSetupButton;
        return (this.mPageSetupButton = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "pageSetup"
        ));
      },
      set(val) {
        delete this.mPageSetupButton;
        return (this.mPageSetupButton = val);
      }
    });
    Object.defineProperty(this, "mNavigateHomeButton", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mNavigateHomeButton;
        return (this.mNavigateHomeButton = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "navigateHome"
        ));
      },
      set(val) {
        delete this.mNavigateHomeButton;
        return (this.mNavigateHomeButton = val);
      }
    });
    Object.defineProperty(this, "mNavigatePreviousButton", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mNavigatePreviousButton;
        return (this.mNavigatePreviousButton = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "navigatePrevious"
        ));
      },
      set(val) {
        delete this.mNavigatePreviousButton;
        return (this.mNavigatePreviousButton = val);
      }
    });
    Object.defineProperty(this, "mPageTextBox", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mPageTextBox;
        return (this.mPageTextBox = document.getAnonymousNodes(
          this
        )[5].childNodes[0]);
      },
      set(val) {
        delete this.mPageTextBox;
        return (this.mPageTextBox = val);
      }
    });
    Object.defineProperty(this, "mNavigateNextButton", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mNavigateNextButton;
        return (this.mNavigateNextButton = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "navigateNext"
        ));
      },
      set(val) {
        delete this.mNavigateNextButton;
        return (this.mNavigateNextButton = val);
      }
    });
    Object.defineProperty(this, "mNavigateEndButton", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mNavigateEndButton;
        return (this.mNavigateEndButton = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "navigateEnd"
        ));
      },
      set(val) {
        delete this.mNavigateEndButton;
        return (this.mNavigateEndButton = val);
      }
    });
    Object.defineProperty(this, "mTotalPages", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mTotalPages;
        return (this.mTotalPages = document.getAnonymousNodes(
          this
        )[5].childNodes[2]);
      },
      set(val) {
        delete this.mTotalPages;
        return (this.mTotalPages = val);
      }
    });
    Object.defineProperty(this, "mScaleLabel", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mScaleLabel;
        return (this.mScaleLabel = document.getAnonymousNodes(
          this
        )[9].firstChild);
      },
      set(val) {
        delete this.mScaleLabel;
        return (this.mScaleLabel = val);
      }
    });
    Object.defineProperty(this, "mScaleCombobox", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mScaleCombobox;
        return (this.mScaleCombobox = document.getAnonymousNodes(
          this
        )[10].firstChild);
      },
      set(val) {
        delete this.mScaleCombobox;
        return (this.mScaleCombobox = val);
      }
    });
    Object.defineProperty(this, "mOrientButtonsBox", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mOrientButtonsBox;
        return (this.mOrientButtonsBox = document.getAnonymousNodes(this)[12]);
      },
      set(val) {
        delete this.mOrientButtonsBox;
        return (this.mOrientButtonsBox = val);
      }
    });
    Object.defineProperty(this, "mPortaitButton", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mPortaitButton;
        return (this.mPortaitButton = this.mOrientButtonsBox.childNodes[0]);
      },
      set(val) {
        delete this.mPortaitButton;
        return (this.mPortaitButton = val);
      }
    });
    Object.defineProperty(this, "mLandscapeButton", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mLandscapeButton;
        return (this.mLandscapeButton = this.mOrientButtonsBox.childNodes[1]);
      },
      set(val) {
        delete this.mLandscapeButton;
        return (this.mLandscapeButton = val);
      }
    });
    Object.defineProperty(this, "mSimplifyPageCheckbox", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mSimplifyPageCheckbox;
        return (this.mSimplifyPageCheckbox = document.getAnonymousNodes(
          this
        )[14]);
      },
      set(val) {
        delete this.mSimplifyPageCheckbox;
        return (this.mSimplifyPageCheckbox = val);
      }
    });
    Object.defineProperty(this, "mSimplifyPageNotAllowed", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mSimplifyPageNotAllowed;
        return (this.mSimplifyPageNotAllowed = this.mSimplifyPageCheckbox.disabled);
      },
      set(val) {
        delete this.mSimplifyPageNotAllowed;
        return (this.mSimplifyPageNotAllowed = val);
      }
    });
    Object.defineProperty(this, "mSimplifyPageToolbarSeparator", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mSimplifyPageToolbarSeparator;
        return (this.mSimplifyPageToolbarSeparator = document.getAnonymousNodes(
          this
        )[15]);
      },
      set(val) {
        delete this.mSimplifyPageToolbarSeparator;
        return (this.mSimplifyPageToolbarSeparator = val);
      }
    });
    Object.defineProperty(this, "mCustomTitle", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mCustomTitle;
        return (this.mCustomTitle = document.getAnonymousNodes(
          this
        )[17].firstChild);
      },
      set(val) {
        delete this.mCustomTitle;
        return (this.mCustomTitle = val);
      }
    });
    Object.defineProperty(this, "mPrintPreviewObs", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mPrintPreviewObs;
        return (this.mPrintPreviewObs = "");
      },
      set(val) {
        delete this.mPrintPreviewObs;
        return (this.mPrintPreviewObs = val);
      }
    });
    Object.defineProperty(this, "mWebProgress", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mWebProgress;
        return (this.mWebProgress = "");
      },
      set(val) {
        delete this.mWebProgress;
        return (this.mWebProgress = val);
      }
    });
    Object.defineProperty(this, "mPPBrowser", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mPPBrowser;
        return (this.mPPBrowser = null);
      },
      set(val) {
        delete this.mPPBrowser;
        return (this.mPPBrowser = val);
      }
    });
    Object.defineProperty(this, "mMessageManager", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mMessageManager;
        return (this.mMessageManager = null);
      },
      set(val) {
        delete this.mMessageManager;
        return (this.mMessageManager = val);
      }
    });
  }

  initialize(aPPBrowser) {
    let { Services } = Components.utils.import(
      "resource://gre/modules/Services.jsm",
      {}
    );
    if (!Services.prefs.getBoolPref("print.use_simplify_page")) {
      this.mSimplifyPageCheckbox.hidden = true;
      this.mSimplifyPageToolbarSeparator.hidden = true;
    }
    this.mPPBrowser = aPPBrowser;
    this.mMessageManager = aPPBrowser.messageManager;
    this.mMessageManager.addMessageListener(
      "Printing:Preview:UpdatePageCount",
      this
    );
    this.updateToolbar();

    let $ = id => document.getAnonymousElementByAttribute(this, "anonid", id);
    let ltr = document.documentElement.matches(":root:-moz-locale-dir(ltr)");
    // Windows 7 doesn't support ⏮ and ⏭ by default, and fallback doesn't
    // always work (bug 1343330).
    let { AppConstants } = Components.utils.import(
      "resource://gre/modules/AppConstants.jsm",
      {}
    );
    let useCompatCharacters = AppConstants.isPlatformAndVersionAtMost(
      "win",
      "6.1"
    );
    let leftEnd = useCompatCharacters ? "⏪" : "⏮";
    let rightEnd = useCompatCharacters ? "⏩" : "⏭";
    $("navigateHome").label = ltr ? leftEnd : rightEnd;
    $("navigatePrevious").label = ltr ? "◂" : "▸";
    $("navigateNext").label = ltr ? "▸" : "◂";
    $("navigateEnd").label = ltr ? rightEnd : leftEnd;
  }
  destroy() {
    this.mMessageManager.removeMessageListener(
      "Printing:Preview:UpdatePageCount",
      this
    );
    delete this.mMessageManager;
    delete this.mPPBrowser;
  }
  disableUpdateTriggers(aDisabled) {
    this.mPrintButton.disabled = aDisabled;
    this.mPageSetupButton.disabled = aDisabled;
    this.mNavigateHomeButton.disabled = aDisabled;
    this.mNavigatePreviousButton.disabled = aDisabled;
    this.mPageTextBox.disabled = aDisabled;
    this.mNavigateNextButton.disabled = aDisabled;
    this.mNavigateEndButton.disabled = aDisabled;
    this.mScaleCombobox.disabled = aDisabled;
    this.mPortaitButton.disabled = aDisabled;
    this.mLandscapeButton.disabled = aDisabled;
    this.mSimplifyPageCheckbox.disabled =
      this.mSimplifyPageNotAllowed || aDisabled;
  }
  doPageSetup() {
    /* import-globals-from printUtils.js */
    var didOK = PrintUtils.showPageSetup();
    if (didOK) {
      // the changes that effect the UI
      this.updateToolbar();

      // Now do PrintPreview
      PrintUtils.printPreview();
    }
  }
  navigate(aDirection, aPageNum, aHomeOrEnd) {
    const nsIWebBrowserPrint = Components.interfaces.nsIWebBrowserPrint;
    let navType, pageNum;

    // we use only one of aHomeOrEnd, aDirection, or aPageNum
    if (aHomeOrEnd) {
      // We're going to either the very first page ("home"), or the
      // very last page ("end").
      if (aHomeOrEnd == "home") {
        navType = nsIWebBrowserPrint.PRINTPREVIEW_HOME;
        this.mPageTextBox.value = 1;
      } else {
        navType = nsIWebBrowserPrint.PRINTPREVIEW_END;
        this.mPageTextBox.value = this.mPageTextBox.max;
      }
      pageNum = 0;
    } else if (aDirection) {
      // aDirection is either +1 or -1, and allows us to increment
      // or decrement our currently viewed page.
      this.mPageTextBox.valueNumber += aDirection;
      navType = nsIWebBrowserPrint.PRINTPREVIEW_GOTO_PAGENUM;
      pageNum = this.mPageTextBox.value; // TODO: back to valueNumber?
    } else {
      // We're going to a specific page (aPageNum)
      navType = nsIWebBrowserPrint.PRINTPREVIEW_GOTO_PAGENUM;
      pageNum = aPageNum;
    }

    this.mMessageManager.sendAsyncMessage("Printing:Preview:Navigate", {
      navType,
      pageNum
    });
  }
  print() {
    PrintUtils.printWindow(this.mPPBrowser.outerWindowID, this.mPPBrowser);
  }
  promptForScaleValue(aValue) {
    var value = Math.round(aValue);
    var promptService = Components.classes[
      "@mozilla.org/embedcomp/prompt-service;1"
    ].getService(Components.interfaces.nsIPromptService);
    var promptStr = this.mScaleLabel.value;
    var renameTitle = this.mCustomTitle;
    var result = { value };
    var confirmed = promptService.prompt(
      window,
      renameTitle,
      promptStr,
      result,
      null,
      { value }
    );
    if (!confirmed || !result.value || result.value == "") {
      return -1;
    }
    return result.value;
  }
  setScaleCombobox(aValue) {
    var scaleValues = [
      0.3,
      0.4,
      0.5,
      0.6,
      0.7,
      0.8,
      0.9,
      1,
      1.25,
      1.5,
      1.75,
      2
    ];

    aValue = Number(aValue);

    for (var i = 0; i < scaleValues.length; i++) {
      if (aValue == scaleValues[i]) {
        this.mScaleCombobox.selectedIndex = i;
        return;
      }
    }
    this.mScaleCombobox.value = "Custom";
  }
  scale(aValue) {
    var settings = PrintUtils.getPrintSettings();
    if (aValue == "ShrinkToFit") {
      if (!settings.shrinkToFit) {
        settings.shrinkToFit = true;
        this.savePrintSettings(
          settings,
          settings.kInitSaveShrinkToFit | settings.kInitSaveScaling
        );
        PrintUtils.printPreview();
      }
      return;
    }

    if (aValue == "Custom") {
      aValue = this.promptForScaleValue(settings.scaling * 100.0);
      if (aValue >= 10) {
        aValue /= 100.0;
      } else {
        if (this.mScaleCombobox.hasAttribute("lastValidInx")) {
          this.mScaleCombobox.selectedIndex = this.mScaleCombobox.getAttribute(
            "lastValidInx"
          );
        }
        return;
      }
    }

    this.setScaleCombobox(aValue);
    this.mScaleCombobox.setAttribute(
      "lastValidInx",
      this.mScaleCombobox.selectedIndex
    );

    if (settings.scaling != aValue || settings.shrinkToFit) {
      settings.shrinkToFit = false;
      settings.scaling = aValue;
      this.savePrintSettings(
        settings,
        settings.kInitSaveShrinkToFit | settings.kInitSaveScaling
      );
      PrintUtils.printPreview();
    }
  }
  orient(aOrientation) {
    const kIPrintSettings = Components.interfaces.nsIPrintSettings;
    var orientValue = aOrientation == "portrait"
      ? kIPrintSettings.kPortraitOrientation
      : kIPrintSettings.kLandscapeOrientation;
    var settings = PrintUtils.getPrintSettings();
    if (settings.orientation != orientValue) {
      settings.orientation = orientValue;
      this.savePrintSettings(settings, settings.kInitSaveOrientation);
      PrintUtils.printPreview();
    }
  }
  simplify() {
    PrintUtils.setSimplifiedMode(this.mSimplifyPageCheckbox.checked);
    PrintUtils.printPreview();
  }
  enableSimplifyPage() {
    this.mSimplifyPageNotAllowed = false;
    this.mSimplifyPageCheckbox.disabled = false;
    this.mSimplifyPageCheckbox.setAttribute(
      "tooltiptext",
      this.mSimplifyPageCheckbox.getAttribute("tooltiptext-enabled")
    );
  }
  disableSimplifyPage() {
    this.mSimplifyPageNotAllowed = true;
    this.mSimplifyPageCheckbox.disabled = true;
    this.mSimplifyPageCheckbox.setAttribute(
      "tooltiptext",
      this.mSimplifyPageCheckbox.getAttribute("tooltiptext-disabled")
    );
  }
  updateToolbar() {
    var settings = PrintUtils.getPrintSettings();

    var isPortrait =
      settings.orientation ==
      Components.interfaces.nsIPrintSettings.kPortraitOrientation;

    this.mPortaitButton.checked = isPortrait;
    this.mLandscapeButton.checked = !isPortrait;

    if (settings.shrinkToFit) {
      this.mScaleCombobox.value = "ShrinkToFit";
    } else {
      this.setScaleCombobox(settings.scaling);
    }

    this.mPageTextBox.value = 1;
  }
  savePrintSettings(settings, flags) {
    var PSSVC = Components.classes[
      "@mozilla.org/gfx/printsettings-service;1"
    ].getService(Components.interfaces.nsIPrintSettingsService);
    PSSVC.savePrintSettingsToPrefs(settings, true, flags);
  }
  receiveMessage(message) {
    if (message.name == "Printing:Preview:UpdatePageCount") {
      let numPages = message.data.numPages;
      this.mTotalPages.value = numPages;
      this.mPageTextBox.max = numPages;
    }
  }
}
customElements.define(
  "firefox-printpreviewtoolbar",
  FirefoxPrintpreviewtoolbar
);
