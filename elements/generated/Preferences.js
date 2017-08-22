class FirefoxPreferences extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-preferences");
    this.prepend(comment);

    Object.defineProperty(this, "service", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.service;
        return (this.service = Components.classes[
          "@mozilla.org/preferences-service;1"
        ].getService(Components.interfaces.nsIPrefService));
      },
      set(val) {
        delete this.service;
        return (this.service = val);
      }
    });
    Object.defineProperty(this, "rootBranch", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.rootBranch;
        return (this.rootBranch = Components.classes[
          "@mozilla.org/preferences-service;1"
        ].getService(Components.interfaces.nsIPrefBranch));
      },
      set(val) {
        delete this.rootBranch;
        return (this.rootBranch = val);
      }
    });
    Object.defineProperty(this, "defaultBranch", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.defaultBranch;
        return (this.defaultBranch = this.service.getDefaultBranch(""));
      },
      set(val) {
        delete this.defaultBranch;
        return (this.defaultBranch = val);
      }
    });
    Object.defineProperty(this, "rootBranchInternal", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.rootBranchInternal;
        return (this.rootBranchInternal = Components.classes[
          "@mozilla.org/preferences-service;1"
        ].getService(Components.interfaces.nsIPrefBranch));
      },
      set(val) {
        delete this.rootBranchInternal;
        return (this.rootBranchInternal = val);
      }
    });
    Object.defineProperty(this, "_constructedChildrenCount", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._constructedChildrenCount;
        return (this._constructedChildrenCount = 0);
      },
      set(val) {
        delete this._constructedChildrenCount;
        return (this._constructedChildrenCount = val);
      }
    });
    Object.defineProperty(this, "_preferenceChildren", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._preferenceChildren;
        return (this._preferenceChildren = null);
      },
      set(val) {
        delete this._preferenceChildren;
        return (this._preferenceChildren = val);
      }
    });
    Object.defineProperty(this, "_constructAfterChildrenCalled", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._constructAfterChildrenCalled;
        return (this._constructAfterChildrenCalled = false);
      },
      set(val) {
        delete this._constructAfterChildrenCalled;
        return (this._constructAfterChildrenCalled = val);
      }
    });

    this._preferenceChildren = this.getElementsByTagName("preference");
  }
  disconnectedCallback() {}

  get type() {
    return document.documentElement.type || "";
  }

  get instantApply() {
    var doc = document.documentElement;
    return this.type == "child"
      ? doc.instantApply
      : doc.instantApply ||
          this.rootBranch.getBoolPref("browser.preferences.instantApply");
  }
  _constructAfterChildren() {
    // This method will be called after the last of the child
    // <preference> elements is constructed. Its purpose is to propagate
    // the values to the associated form elements. Sometimes the code for
    // some <preference> initializers depend on other <preference> elements
    // being initialized so we wait and call updateElements on all of them
    // once the last one has been constructed. See bugs 997570 and 992185.

    var elements = this.getElementsByTagName("preference");
    for (let element of elements) {
      element.updateElements();
    }

    this._constructAfterChildrenCalled = true;
  }
  observe(aSubject, aTopic, aData) {
    for (var i = 0; i < this.childNodes.length; ++i) {
      var preference = this.childNodes[i];
      if (preference.name == aData) {
        preference.value = preference.valueFromPreferences;
      }
    }
  }
  fireChangedEvent(aPreference) {
    // Value changed, synthesize an event
    try {
      var event = document.createEvent("Events");
      event.initEvent("change", true, true);
      aPreference.dispatchEvent(event);
    } catch (e) {
      Components.utils.reportError(e);
    }
  }
}
customElements.define("firefox-preferences", FirefoxPreferences);
