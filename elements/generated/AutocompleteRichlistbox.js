class MozAutocompleteRichlistbox extends MozRichlistbox {
  connectedCallback() {
    super.connectedCallback()

    this.mLastMoveTime = Date.now();

    this.mousedOverIndex = -1;

    this._setupEventListeners();
  }

  _setupEventListeners() {
    this.addEventListener("mouseup", (event) => {
      // Don't call onPopupClick for the scrollbar buttons, thumb, slider, etc.
      // If we hit the richlistbox and not a richlistitem, we ignore the event.
      if (event.originalTarget.closest("richlistbox,richlistitem").localName == "richlistbox") {
        return;
      }

      this.parentNode.onPopupClick(event);
    });

    this.addEventListener("mousemove", (event) => {
      if (Date.now() - this.mLastMoveTime <= 30) {
        return;
      }

      let item = event.target.closest("richlistbox,richlistitem");

      // If we hit the richlistbox and not a richlistitem, we ignore the event.
      if (item.localName == "richlistbox") {
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