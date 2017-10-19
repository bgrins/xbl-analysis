class FirefoxPrefpane extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<xul:vbox class="content-box" inherits="flex">
<children>
</children>
</xul:vbox>`;
    let comment = document.createComment("Creating firefox-prefpane");
    this.prepend(comment);

    Object.defineProperty(this, "_loaded", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._loaded;
        return (this._loaded = false);
      },
      set(val) {
        delete this._loaded;
        return (this._loaded = val);
      }
    });
    Object.defineProperty(this, "_deferredValueUpdateElements", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._deferredValueUpdateElements;
        return (this._deferredValueUpdateElements = new Set());
      },
      set(val) {
        delete this._deferredValueUpdateElements;
        return (this._deferredValueUpdateElements = val);
      }
    });
    Object.defineProperty(this, "_content", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._content;
        return (this._content = document.getAnonymousElementByAttribute(
          this,
          "class",
          "content-box"
        ));
      },
      set(val) {
        delete this._content;
        return (this._content = val);
      }
    });

    this.addEventListener("command", event => {
      // This "command" event handler tracks changes made to preferences by
      // the user in this window.
      if (event.sourceEvent) event = event.sourceEvent;
      this.userChangedValue(event.target);
    });

    this.addEventListener("select", event => {
      // This "select" event handler tracks changes made to colorpicker
      // preferences by the user in this window.
      if (event.target.localName == "colorpicker")
        this.userChangedValue(event.target);
    });

    this.addEventListener("change", event => {
      // This "change" event handler tracks changes made to preferences by
      // the user in this window.
      this.userChangedValue(event.target);
    });

    this.addEventListener("input", event => {
      // This "input" event handler tracks changes made to preferences by
      // the user in this window.
      this.userChangedValue(event.target);
    });

    this.addEventListener("paneload", event => {
      // Initialize all values from preferences.
      var elements = this.preferenceElements;
      for (var i = 0; i < elements.length; ++i) {
        try {
          var preference = this.preferenceForElement(elements[i]);
          preference.setElementValue(elements[i]);
        } catch (e) {
          dump(
            "*** No preference found for " +
              elements[i].getAttribute("preference") +
              "\n"
          );
        }
      }
    });
  }
  disconnectedCallback() {}

  set src(val) {
    this.setAttribute("src", val);
    return val;
  }

  get src() {
    return this.getAttribute("src");
  }

  set selected(val) {
    this.setAttribute("selected", val);
    return val;
  }

  get selected() {
    return this.getAttribute("selected") == "true";
  }

  set image(val) {
    this.setAttribute("image", val);
    return val;
  }

  get image() {
    return this.getAttribute("image");
  }

  set label(val) {
    this.setAttribute("label", val);
    return val;
  }

  get label() {
    return this.getAttribute("label");
  }

  get preferenceElements() {
    return this.getElementsByAttribute("preference", "*");
  }

  get preferences() {
    return this.getElementsByTagName("preference");
  }

  get helpTopic() {
    // if there are tabs, and the selected tab provides a helpTopic, return that
    var box = this.getElementsByTagName("tabbox");
    if (box[0]) {
      var tab = box[0].selectedTab;
      if (tab && tab.hasAttribute("helpTopic"))
        return tab.getAttribute("helpTopic");
    }

    // otherwise, return the helpTopic of the current panel
    return this.getAttribute("helpTopic");
  }

  set loaded(val) {
    this._loaded = val;
    return val;
  }

  get loaded() {
    return !this.src ? true : this._loaded;
  }

  get DeferredTask() {
    let module = {};
    Components.utils.import("resource://gre/modules/DeferredTask.jsm", module);
    Object.defineProperty(this, "DeferredTask", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: module.DeferredTask
    });
    return module.DeferredTask;
  }

  get contentHeight() {
    var targetHeight = parseInt(window.getComputedStyle(this._content).height);
    targetHeight += parseInt(window.getComputedStyle(this._content).marginTop);
    targetHeight += parseInt(
      window.getComputedStyle(this._content).marginBottom
    );
    return targetHeight;
  }
  writePreferences(aFlushToDisk) {
    // Write all values to preferences.
    if (this._deferredValueUpdateElements.size) {
      this._finalizeDeferredElements();
    }

    var preferences = this.preferences;
    for (var i = 0; i < preferences.length; ++i) {
      var preference = preferences[i];
      preference.batching = true;
      preference.valueFromPreferences = preference.value;
      preference.batching = false;
    }
    if (aFlushToDisk) {
      var psvc = Components.classes[
        "@mozilla.org/preferences-service;1"
      ].getService(Components.interfaces.nsIPrefService);
      psvc.savePrefFile(null);
    }
  }
  preferenceForElement(aElement) {
    return document.getElementById(aElement.getAttribute("preference"));
  }
  getPreferenceElement(aStartElement) {
    var temp = aStartElement;
    while (
      temp &&
      temp.nodeType == Node.ELEMENT_NODE &&
      !temp.hasAttribute("preference")
    )
      temp = temp.parentNode;
    return temp && temp.nodeType == Node.ELEMENT_NODE ? temp : aStartElement;
  }
  _deferredValueUpdate(aElement) {
    delete aElement._deferredValueUpdateTask;
    let preference = document.getElementById(
      aElement.getAttribute("preference")
    );
    let prefVal = preference.getElementValue(aElement);
    preference.value = prefVal;
    this._deferredValueUpdateElements.delete(aElement);
  }
  _finalizeDeferredElements() {
    for (let el of this._deferredValueUpdateElements) {
      if (el._deferredValueUpdateTask) {
        el._deferredValueUpdateTask.finalize();
      }
    }
  }
  userChangedValue(aElement) {
    let element = this.getPreferenceElement(aElement);
    if (element.hasAttribute("preference")) {
      if (element.getAttribute("delayprefsave") != "true") {
        var preference = document.getElementById(
          element.getAttribute("preference")
        );
        var prefVal = preference.getElementValue(element);
        preference.value = prefVal;
      } else {
        if (!element._deferredValueUpdateTask) {
          element._deferredValueUpdateTask = new this.DeferredTask(
            this._deferredValueUpdate.bind(this, element),
            1000
          );
          this._deferredValueUpdateElements.add(element);
        } else {
          // Each time the preference is changed, restart the delay.
          element._deferredValueUpdateTask.disarm();
        }
        element._deferredValueUpdateTask.arm();
      }
    }
  }
}
customElements.define("firefox-prefpane", FirefoxPrefpane);
