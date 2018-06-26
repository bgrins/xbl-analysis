class AutocompleteRichlistbox extends Richlistbox {
  connectedCallback() {
    super.connectedCallback()

    this.mLastMoveTime = Date.now();

    this.mousedOverIndex = -1;

    this._setupEventListeners();
  }

  _setupEventListeners() {
    this.addEventListener("mouseup", (event) => {
      // don't call onPopupClick for the scrollbar buttons, thumb, slider, etc.
      let item = event.originalTarget;
      while (item && item.localName != "richlistitem") {
        item = item.parentNode;
      }

      if (!item)
        return;

      this.parentNode.onPopupClick(event);
    });

    this.addEventListener("mousemove", (event) => {
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