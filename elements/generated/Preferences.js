class FirefoxPreferences extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-preferences");
    this.prepend(comment);

    try {
      this._preferenceChildren = this.getElementsByTagName("preference");
    } catch (e) {}
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
