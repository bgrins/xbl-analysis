class FirefoxTextbox extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<children>
</children>
<hbox class="textbox-input-box" flex="1" inherits="context,spellcheck">
<input class="textbox-input" anonid="input" inherits="value,type,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey,noinitialfocus,mozactionhint,spellcheck">
</input>
</hbox>`;
    let comment = document.createComment("Creating firefox-textbox");
    this.prepend(comment);

    Object.defineProperty(this, "crop", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.crop;
        return (this.crop = "");
      },
      set(val) {
        delete this["crop"];
        return (this["crop"] = val);
      }
    });
    Object.defineProperty(this, "image", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.image;
        return (this.image = "");
      },
      set(val) {
        delete this["image"];
        return (this["image"] = val);
      }
    });
    Object.defineProperty(this, "command", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.command;
        return (this.command = "");
      },
      set(val) {
        delete this["command"];
        return (this["command"] = val);
      }
    });
    Object.defineProperty(this, "accessKey", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.accessKey;
        return (this.accessKey = "");
      },
      set(val) {
        delete this["accessKey"];
        return (this["accessKey"] = val);
      }
    });
    Object.defineProperty(this, "mInputField", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mInputField;
        return (this.mInputField = null);
      },
      set(val) {
        delete this["mInputField"];
        return (this["mInputField"] = val);
      }
    });
    Object.defineProperty(this, "mIgnoreClick", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mIgnoreClick;
        return (this.mIgnoreClick = false);
      },
      set(val) {
        delete this["mIgnoreClick"];
        return (this["mIgnoreClick"] = val);
      }
    });
    Object.defineProperty(this, "mIgnoreFocus", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mIgnoreFocus;
        return (this.mIgnoreFocus = false);
      },
      set(val) {
        delete this["mIgnoreFocus"];
        return (this["mIgnoreFocus"] = val);
      }
    });
    Object.defineProperty(this, "mEditor", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mEditor;
        return (this.mEditor = null);
      },
      set(val) {
        delete this["mEditor"];
        return (this["mEditor"] = val);
      }
    });

    try {
      var str = this.boxObject.getProperty("value");
      if (str) {
        this.inputField.value = str;
        this.boxObject.removeProperty("value");
      }

      this._setNewlineHandling();

      if (this.hasAttribute("emptytext"))
        this.placeholder = this.getAttribute("emptytext");
    } catch (e) {}
  }
  disconnectedCallback() {
    try {
      var field = this.inputField;
      if (field && field.value)
        this.boxObject.setProperty("value", field.value);
      this.mInputField = null;
    } catch (e) {}
  }

  get inputField() {
    if (!this.mInputField)
      this.mInputField = document.getAnonymousElementByAttribute(
        this,
        "anonid",
        "input"
      );
    return this.mInputField;
  }

  set value(val) {
    this.inputField.value = val;
    return val;
  }

  get value() {
    return this.inputField.value;
  }

  set defaultValue(val) {
    this.inputField.defaultValue = val;
    return val;
  }

  get defaultValue() {
    return this.inputField.defaultValue;
  }

  set label(val) {
    this.setAttribute("label", val);
    return val;
  }

  get label() {
    return (
      this.getAttribute("label") ||
      (this.labelElement ? this.labelElement.value : this.placeholder)
    );
  }

  set placeholder(val) {
    this.inputField.placeholder = val;
    return val;
  }

  get placeholder() {
    return this.inputField.placeholder;
  }

  set emptyText(val) {
    this.placeholder = val;
    return val;
  }

  get emptyText() {
    return this.placeholder;
  }

  set type(val) {
    if (val) this.setAttribute("type", val);
    else this.removeAttribute("type");
    return val;
  }

  get type() {
    return this.getAttribute("type");
  }

  set maxLength(val) {
    this.inputField.maxLength = val;
    return val;
  }

  get maxLength() {
    return this.inputField.maxLength;
  }

  set disabled(val) {
    this.inputField.disabled = val;
    if (val) this.setAttribute("disabled", "true");
    else this.removeAttribute("disabled");
    return val;
  }

  get disabled() {
    return this.inputField.disabled;
  }

  set tabIndex(val) {
    this.inputField.tabIndex = val;
    if (val) this.setAttribute("tabindex", val);
    else this.removeAttribute("tabindex");
    return val;
  }

  get tabIndex() {
    return parseInt(this.getAttribute("tabindex"));
  }

  set size(val) {
    this.inputField.size = val;
    return val;
  }

  get size() {
    return this.inputField.size;
  }

  set readOnly(val) {
    this.inputField.readOnly = val;
    if (val) this.setAttribute("readonly", "true");
    else this.removeAttribute("readonly");
    return val;
  }

  get readOnly() {
    return this.inputField.readOnly;
  }

  set clickSelectsAll(val) {
    if (val) this.setAttribute("clickSelectsAll", "true");
    else this.removeAttribute("clickSelectsAll");
    return val;
  }

  get clickSelectsAll() {
    return this.getAttribute("clickSelectsAll") == "true";
  }

  get editor() {
    if (!this.mEditor) {
      const nsIDOMNSEditableElement =
        Components.interfaces.nsIDOMNSEditableElement;
      this.mEditor = this.inputField.QueryInterface(
        nsIDOMNSEditableElement
      ).editor;
    }
    return this.mEditor;
  }

  get controllers() {
    return this.inputField.controllers;
  }

  get textLength() {
    return this.inputField.textLength;
  }

  set selectionStart(val) {
    this.inputField.selectionStart = val;
    return val;
  }

  get selectionStart() {
    return this.inputField.selectionStart;
  }

  set selectionEnd(val) {
    this.inputField.selectionEnd = val;
    return val;
  }

  get selectionEnd() {
    return this.inputField.selectionEnd;
  }
  reset() {
    this.value = this.defaultValue;
    try {
      this.editor.transactionManager.clear();
      return true;
    } catch (e) {}
    return false;
  }
  select() {
    this.inputField.select();
  }
  setSelectionRange(aSelectionStart, aSelectionEnd) {
    this.inputField.setSelectionRange(aSelectionStart, aSelectionEnd);
  }
  _setNewlineHandling() {
    var str = this.getAttribute("newlines");
    if (str && this.editor) {
      const nsIPlaintextEditor = Components.interfaces.nsIPlaintextEditor;
      for (var x in nsIPlaintextEditor) {
        if (/^eNewlines/.test(x)) {
          if (str == RegExp.rightContext.toLowerCase()) {
            this.editor.QueryInterface(nsIPlaintextEditor).newlineHandling =
              nsIPlaintextEditor[x];
            break;
          }
        }
      }
    }
  }
  _maybeSelectAll() {
    if (
      !this.mIgnoreClick &&
      this.clickSelectsAll &&
      document.activeElement == this.inputField &&
      this.inputField.selectionStart == this.inputField.selectionEnd
    )
      this.editor.selectAll();
  }
}
customElements.define("firefox-textbox", FirefoxTextbox);
