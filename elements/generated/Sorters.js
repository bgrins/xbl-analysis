class FirefoxSorters extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:button anonid="name-btn" class="sorter" label="FROM-DTD-sort-name-label" tooltiptext="FROM-DTD-sort-name-tooltip" oncommand="this.parentNode._handleChange('name');"></xul:button>
      <xul:button anonid="date-btn" class="sorter" label="FROM-DTD-sort-dateUpdated-label" tooltiptext="FROM-DTD-sort-dateUpdated-tooltip" oncommand="this.parentNode._handleChange('updateDate');"></xul:button>
    `;
    this.handler = null;

    this._btnName = document.getAnonymousElementByAttribute(this, "anonid", "name-btn");

    this._btnDate = document.getAnonymousElementByAttribute(this, "anonid", "date-btn");

    if (!this.hasAttribute("sortby"))
      this.setAttribute("sortby", "name");

    this._refreshState();

    this._setupEventListeners();
  }

  set sortBy(val) {
    if (val != this.sortBy) {
      this.setAttribute("sortBy", val);
      this._refreshState();
    }
  }

  get sortBy() {
    return this.getAttribute("sortby");
  }

  set ascending(val) {
    val = !!val;
    if (val != this.ascending) {
      this.setAttribute("ascending", val);
      this._refreshState();
    }
  }

  get ascending() {
    return (this.getAttribute("ascending") == "true");
  }
  setSort(aSort, aAscending) {
    var sortChanged = false;
    if (aSort != this.sortBy) {
      this.setAttribute("sortby", aSort);
      sortChanged = true;
    }

    aAscending = !!aAscending;
    if (this.ascending != aAscending) {
      this.setAttribute("ascending", aAscending);
      sortChanged = true;
    }

    if (sortChanged)
      this._refreshState();
  }
  _handleChange(aSort) {
    const ASCENDING_SORT_FIELDS = ["name"];

    // Toggle ascending if sort by is not changing, otherwise
    // name sorting defaults to ascending, others to descending
    if (aSort == this.sortBy)
      this.ascending = !this.ascending;
    else
      this.setSort(aSort, ASCENDING_SORT_FIELDS.includes(aSort));
  }
  _refreshState() {
    var sortBy = this.sortBy;
    var checkState = this.ascending ? 2 : 1;

    if (sortBy == "name") {
      this._btnName.checkState = checkState;
      this._btnName.checked = true;
    } else {
      this._btnName.checkState = 0;
      this._btnName.checked = false;
    }

    if (sortBy == "updateDate") {
      this._btnDate.checkState = checkState;
      this._btnDate.checked = true;
    } else {
      this._btnDate.checkState = 0;
      this._btnDate.checked = false;
    }

    if (this.handler && "onSortChanged" in this.handler)
      this.handler.onSortChanged(sortBy, this.ascending);
  }

  _setupEventListeners() {

  }
}