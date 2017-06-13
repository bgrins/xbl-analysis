class XblPreferences extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-preferences");
    this.prepend(comment);
  }
  disconnectedCallback() {}
  _constructAfterChildren() {
    // This method will be called after each one of the child
    // <preference> elements is constructed. Its purpose is to propagate
    // the values to the associated form elements

    var elements = this.getElementsByTagName("preference");
    for (let element of elements) {
      if (!element._constructed) {
        return;
      }
    }
    for (let element of elements) {
      element.updateElements();
    }
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
customElements.define("xbl-preferences", XblPreferences);
