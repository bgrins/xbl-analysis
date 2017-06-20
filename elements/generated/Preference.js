class XblPreference extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    try {
      this._constructed = true;

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
      } else this._value = this.valueFromPreferences;
      this.preferences._constructAfterChildren();
    } catch (e) {}

    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-preference");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get preferences() {
    return this.parentNode;
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
  _setValue(aValue) {
    if (this.value !== aValue) {
      this._value = aValue;
      if (this.instantApply) this.valueFromPreferences = aValue;
      this.preferences.fireChangedEvent(this);
    }
    return aValue;
  }
  reset() {}
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
customElements.define("xbl-preference", XblPreference);
