class FirefoxAutocompleteRichlistbox extends FirefoxRichlistbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();

    Object.defineProperty(this, "mLastMoveTime", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mLastMoveTime;
        return (this.mLastMoveTime = Date.now());
      },
      set(val) {
        delete this.mLastMoveTime;
        return (this.mLastMoveTime = val);
      }
    });
    Object.defineProperty(this, "mousedOverIndex", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.mousedOverIndex;
        return (this.mousedOverIndex = -1);
      },
      set(val) {
        delete this.mousedOverIndex;
        return (this.mousedOverIndex = val);
      }
    });

    this.addEventListener("mouseup", event => {
      // don't call onPopupClick for the scrollbar buttons, thumb, slider, etc.
      let item = event.originalTarget;
      while (item && item.localName != "richlistitem") {
        item = item.parentNode;
      }

      if (!item) return;

      this.parentNode.onPopupClick(event);
    });

    this.addEventListener("mousemove", event => {
      if (Date.now() - this.mLastMoveTime <= 30) {
        return;
      }

      let item = event.target;
      while (item && item.localName != "richlistitem") {
        item = item.parentNode;
      }

      if (!item) {
        return;
      }

      let index = this.getIndexOfItem(item);

      this.mousedOverIndex = index;

      if (item.selectedByMouseOver) {
        this.selectedIndex = index;
      }

      this.mLastMoveTime = Date.now();
    });
  }
}
customElements.define(
  "firefox-autocomplete-richlistbox",
  FirefoxAutocompleteRichlistbox
);
