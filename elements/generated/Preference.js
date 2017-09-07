class FirefoxPreference extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-preference");
    this.prepend(comment);

    Object.defineProperty(this, "_constructed", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._constructed;
        return (this._constructed = false);
      },
      set(val) {
        delete this._constructed;
        return (this._constructed = val);
      }
    });
    Object.defineProperty(this, "_value", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._value;
        return (this._value = null);
      },
      set(val) {
        delete this._value;
        return (this._value = val);
      }
    });
    Object.defineProperty(this, "_useDefault", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._useDefault;
        return (this._useDefault = false);
      },
      set(val) {
        delete this._useDefault;
        return (this._useDefault = val);
      }
    });
    Object.defineProperty(this, "batching", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.batching;
        return (this.batching = false);
      },
      set(val) {
        delete this.batching;
        return (this.batching = val);
      }
    });

    // if the element has been inserted without the name attribute set,
    // we have nothing to do here
    if (!this.name) return;

    this.preferences.rootBranchInternal.addObserver(
      this.name,
      this.preferences
    );
    // In non-instant apply mode, we must try and use the last saved state
    // from any previous opens of a child dialog instead of the value from
    // preferences, to pick up any edits a user may have made.

    var secMan = Components.classes[
      "@mozilla.org/scriptsecuritymanager;1"
    ].getService(Components.interfaces.nsIScriptSecurityManager);
    if (
      this.preferences.type == "child" &&
      !this.instantApply &&
      window.opener &&
      secMan.isSystemPrincipal(window.opener.document.nodePrincipal)
    ) {
      var pdoc = window.opener.document;

      // Try to find a preference element for the same preference.
      var preference = null;
      var parentPreferences = pdoc.getElementsByTagName("preferences");
      for (var k = 0; k < parentPreferences.length && !preference; ++k) {
        var parentPrefs = parentPreferences[k].getElementsByAttribute(
          "name",
          this.name
        );
        for (var l = 0; l < parentPrefs.length && !preference; ++l) {
          if (parentPrefs[l].localName == "preference")
            preference = parentPrefs[l];
        }
      }

      // Don't use the value setter here, we don't want updateElements to be prematurely fired.
      this._value = preference ? preference.value : this.valueFromPreferences;
    } else {
      this._value = this.valueFromPreferences;
    }
    if (this.preferences._constructAfterChildrenCalled) {
      // This <preference> was added after _constructAfterChildren() was already called.
      // We can directly call updateElements().
      this.updateElements();
      return;
    }
    this.preferences._constructedChildrenCount++;
    if (
      this.preferences._constructedChildrenCount ==
      this.preferences._preferenceChildren.length
    ) {
      // This is the last <preference>, time to updateElements() on all of them.
      this.preferences._constructAfterChildren();
    }

    this.addEventListener("change", event => {
      this.updateElements();
    });
  }
  disconnectedCallback() {
    undefined;
  }

  get instantApply() {
    if (this.getAttribute("instantApply") == "false") return false;
    return (
      this.getAttribute("instantApply") == "true" ||
      this.preferences.instantApply
    );
  }

  get preferences() {
    return this.parentNode;
  }

  set name(val) {
    if (val == this.name) return val;

    this.preferences.rootBranchInternal.removeObserver(
      this.name,
      this.preferences
    );
    this.setAttribute("name", val);
    this.preferences.rootBranchInternal.addObserver(val, this.preferences);

    return val;
  }

  get name() {
    return this.getAttribute("name");
  }

  set type(val) {
    this.setAttribute("type", val);
    return val;
  }

  get type() {
    return this.getAttribute("type");
  }

  set inverted(val) {
    this.setAttribute("inverted", val);
    return val;
  }

  get inverted() {
    return this.getAttribute("inverted") == "true";
  }

  set readonly(val) {
    this.setAttribute("readonly", val);
    return val;
  }

  get readonly() {
    return this.getAttribute("readonly") == "true";
  }

  set value(val) {
    return this._setValue(val);
  }

  get value() {
    return this._value;
  }

  get locked() {
    return this.preferences.rootBranch.prefIsLocked(this.name);
  }

  set disabled(val) {
    if (val) this.setAttribute("disabled", "true");
    else this.removeAttribute("disabled");

    if (!this.id) return val;

    var elements = document.getElementsByAttribute("preference", this.id);
    for (var i = 0; i < elements.length; ++i) {
      elements[i].disabled = val;

      var labels = document.getElementsByAttribute("control", elements[i].id);
      for (var j = 0; j < labels.length; ++j) labels[j].disabled = val;
    }

    return val;
  }

  get disabled() {
    return this.getAttribute("disabled") == "true";
  }

  set tabIndex(val) {
    if (val) this.setAttribute("tabindex", val);
    else this.removeAttribute("tabindex");

    if (!this.id) return val;

    var elements = document.getElementsByAttribute("preference", this.id);
    for (var i = 0; i < elements.length; ++i) {
      elements[i].tabIndex = val;

      var labels = document.getElementsByAttribute("control", elements[i].id);
      for (var j = 0; j < labels.length; ++j) labels[j].tabIndex = val;
    }

    return val;
  }

  get tabIndex() {
    return parseInt(this.getAttribute("tabindex"));
  }

  get hasUserValue() {
    return (
      this.preferences.rootBranch.prefHasUserValue(this.name) &&
      this.value !== undefined
    );
  }

  get defaultValue() {
    this._useDefault = true;
    var val = this.valueFromPreferences;
    this._useDefault = false;
    return val;
  }

  get _branch() {
    return this._useDefault
      ? this.preferences.defaultBranch
      : this.preferences.rootBranch;
  }

  set valueFromPreferences(val) {
    // Exit early if nothing to do.
    if (this.readonly || this.valueFromPreferences == val) return val;

    // The special value undefined means 'reset preference to default'.
    if (val === undefined) {
      this.preferences.rootBranch.clearUserPref(this.name);
      return val;
    }

    // Force a resync of preferences with value.
    switch (this.type) {
      case "int":
        this.preferences.rootBranch.setIntPref(this.name, val);
        break;
      case "bool":
        this.preferences.rootBranch.setBoolPref(
          this.name,
          this.inverted ? !val : val
        );
        break;
      case "wstring":
        var pls = Components.classes[
          "@mozilla.org/pref-localizedstring;1"
        ].createInstance(Components.interfaces.nsIPrefLocalizedString);
        pls.data = val;
        this.preferences.rootBranch.setComplexValue(
          this.name,
          Components.interfaces.nsIPrefLocalizedString,
          pls
        );
        break;
      case "string":
      case "unichar":
      case "fontname":
        this.preferences.rootBranch.setStringPref(this.name, val);
        break;
      case "file":
        var lf;
        if (typeof val == "string") {
          lf = Components.classes["@mozilla.org/file/local;1"].createInstance(
            Components.interfaces.nsIFile
          );
          lf.persistentDescriptor = val;
          if (!lf.exists()) lf.initWithPath(val);
        } else lf = val.QueryInterface(Components.interfaces.nsIFile);
        this.preferences.rootBranch.setComplexValue(
          this.name,
          Components.interfaces.nsIFile,
          lf
        );
        break;
      default:
        this._reportUnknownType();
    }
    if (!this.batching) this.preferences.service.savePrefFile(null);
    return val;
  }

  get valueFromPreferences() {
    try {
      // Force a resync of value with preferences.
      switch (this.type) {
        case "int":
          return this._branch.getIntPref(this.name);
        case "bool":
          var val = this._branch.getBoolPref(this.name);
          return this.inverted ? !val : val;
        case "wstring":
          return this._branch.getComplexValue(
            this.name,
            Components.interfaces.nsIPrefLocalizedString
          ).data;
        case "string":
        case "unichar":
          return this._branch.getStringPref(this.name);
        case "fontname":
          var family = this._branch.getStringPref(this.name);
          var fontEnumerator = Components.classes[
            "@mozilla.org/gfx/fontenumerator;1"
          ].createInstance(Components.interfaces.nsIFontEnumerator);
          return fontEnumerator.getStandardFamilyName(family);
        case "file":
          var f = this._branch.getComplexValue(
            this.name,
            Components.interfaces.nsIFile
          );
          return f;
        default:
          this._reportUnknownType();
      }
    } catch (e) {}
    return null;
  }
  _setValue(aValue) {
    if (this.value !== aValue) {
      this._value = aValue;
      if (this.instantApply) this.valueFromPreferences = aValue;
      this.preferences.fireChangedEvent(this);
    }
    return aValue;
  }
  reset() {
    // defer reset until preference update
    this.value = undefined;
  }
  _reportUnknownType() {
    var consoleService = Components.classes[
      "@mozilla.org/consoleservice;1"
    ].getService(Components.interfaces.nsIConsoleService);
    var msg =
      "<preference> with id='" +
      this.id +
      "' and name='" +
      this.name +
      "' has unknown type '" +
      this.type +
      "'.";
    consoleService.logStringMessage(msg);
  }
  setElementValue(aElement) {
    if (this.locked) aElement.disabled = true;

    if (!this.isElementEditable(aElement)) return;

    var rv = undefined;
    if (aElement.hasAttribute("onsyncfrompreference")) {
      // Value changed, synthesize an event
      try {
        var event = document.createEvent("Events");
        event.initEvent("syncfrompreference", true, true);
        var f = new Function(
          "event",
          aElement.getAttribute("onsyncfrompreference")
        );
        rv = f.call(aElement, event);
      } catch (e) {
        Components.utils.reportError(e);
      }
    }
    var val = rv;
    if (val === undefined)
      val = this.instantApply ? this.valueFromPreferences : this.value;
    // if the preference is marked for reset, show default value in UI
    if (val === undefined) val = this.defaultValue;

    /**
           * Initialize a UI element property with a value. Handles the case
           * where an element has not yet had a XBL binding attached for it and
           * the property setter does not yet exist by setting the same attribute
           * on the XUL element using DOM apis and assuming the element's
           * constructor or property getters appropriately handle this state.
           */
    function setValue(element, attribute, value) {
      if (attribute in element) element[attribute] = value;
      else element.setAttribute(attribute, value);
    }
    if (aElement.localName == "checkbox" || aElement.localName == "listitem")
      setValue(aElement, "checked", val);
    else if (aElement.localName == "colorpicker")
      setValue(aElement, "color", val);
    else if (aElement.localName == "textbox") {
      // XXXmano Bug 303998: Avoid a caret placement issue if either the
      // preference observer or its setter calls updateElements as a result
      // of the input event handler.
      if (aElement.value !== val) setValue(aElement, "value", val);
    } else setValue(aElement, "value", val);
  }
  getElementValue(aElement) {
    if (aElement.hasAttribute("onsynctopreference")) {
      // Value changed, synthesize an event
      try {
        var event = document.createEvent("Events");
        event.initEvent("synctopreference", true, true);
        var f = new Function(
          "event",
          aElement.getAttribute("onsynctopreference")
        );
        var rv = f.call(aElement, event);
        if (rv !== undefined) return rv;
      } catch (e) {
        Components.utils.reportError(e);
      }
    }

    /**
           * Read the value of an attribute from an element, assuming the
           * attribute is a property on the element's node API. If the property
           * is not present in the API, then assume its value is contained in
           * an attribute, as is the case before a binding has been attached.
           */
    function getValue(element, attribute) {
      if (attribute in element) return element[attribute];
      return element.getAttribute(attribute);
    }
    if (aElement.localName == "checkbox" || aElement.localName == "listitem")
      var value = getValue(aElement, "checked");
    else if (aElement.localName == "colorpicker")
      value = getValue(aElement, "color");
    else value = getValue(aElement, "value");

    switch (this.type) {
      case "int":
        return parseInt(value, 10) || 0;
      case "bool":
        return typeof value == "boolean" ? value : value == "true";
    }
    return value;
  }
  isElementEditable(aElement) {
    switch (aElement.localName) {
      case "checkbox":
      case "colorpicker":
      case "radiogroup":
      case "textbox":
      case "listitem":
      case "listbox":
      case "menulist":
        return true;
    }
    return aElement.getAttribute("preference-editable") == "true";
  }
  updateElements() {
    if (!this.id) return;

    // This "change" event handler tracks changes made to preferences by
    // sources other than the user in this window.
    var elements = document.getElementsByAttribute("preference", this.id);
    for (var i = 0; i < elements.length; ++i) this.setElementValue(elements[i]);
  }
}
customElements.define("firefox-preference", FirefoxPreference);
