class FirefoxSorters extends XULElement {
  connectedCallback() {
    this.innerHTML = `
      <xul:button anonid="name-btn" class="sorter" label="FROM-DTD-sort-name-label" tooltiptext="FROM-DTD-sort-name-tooltip" oncommand="this.parentNode._handleChange('name');"></xul:button>
      <xul:button anonid="date-btn" class="sorter" label="FROM-DTD-sort-dateUpdated-label" tooltiptext="FROM-DTD-sort-dateUpdated-tooltip" oncommand="this.parentNode._handleChange('updateDate');"></xul:button>
      <xul:button anonid="price-btn" class="sorter" hidden="true" label="FROM-DTD-sort-price-label" tooltiptext="FROM-DTD-sort-price-tooltip" oncommand="this.parentNode._handleChange('purchaseAmount');"></xul:button>
      <xul:button anonid="relevance-btn" class="sorter" hidden="true" label="FROM-DTD-sort-relevance-label" tooltiptext="FROM-DTD-sort-relevance-tooltip" oncommand="this.parentNode._handleChange('relevancescore');"></xul:button>
    `;
    Object.defineProperty(this, "handler", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.handler;
        return (this.handler = null);
      },
      set(val) {
        delete this.handler;
        return (this.handler = val);
      }
    });
    Object.defineProperty(this, "_btnName", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._btnName;
        return (this._btnName = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "name-btn"
        ));
      },
      set(val) {
        delete this._btnName;
        return (this._btnName = val);
      }
    });
    Object.defineProperty(this, "_btnDate", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._btnDate;
        return (this._btnDate = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "date-btn"
        ));
      },
      set(val) {
        delete this._btnDate;
        return (this._btnDate = val);
      }
    });
    Object.defineProperty(this, "_btnPrice", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._btnPrice;
        return (this._btnPrice = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "price-btn"
        ));
      },
      set(val) {
        delete this._btnPrice;
        return (this._btnPrice = val);
      }
    });
    Object.defineProperty(this, "_btnRelevance", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._btnRelevance;
        return (this._btnRelevance = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "relevance-btn"
        ));
      },
      set(val) {
        delete this._btnRelevance;
        return (this._btnRelevance = val);
      }
    });

    if (!this.hasAttribute("sortby")) this.setAttribute("sortby", "name");

    if (this.getAttribute("showrelevance") == "true")
      this._btnRelevance.hidden = false;

    if (this.getAttribute("showprice") == "true") this._btnPrice.hidden = false;

    this._refreshState();
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
    return this.getAttribute("ascending") == "true";
  }

  set showrelevance(val) {
    val = !!val;
    this.setAttribute("showrelevance", val);
    this._btnRelevance.hidden = !val;
  }

  get showrelevance() {
    return this.getAttribute("showrelevance") == "true";
  }

  set showprice(val) {
    val = !!val;
    this.setAttribute("showprice", val);
    this._btnPrice.hidden = !val;
  }

  get showprice() {
    return this.getAttribute("showprice") == "true";
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

    if (sortChanged) this._refreshState();
  }
  _handleChange(aSort) {
    const ASCENDING_SORT_FIELDS = ["name", "purchaseAmount"];

    // Toggle ascending if sort by is not changing, otherwise
    // name sorting defaults to ascending, others to descending
    if (aSort == this.sortBy) this.ascending = !this.ascending;
    else this.setSort(aSort, ASCENDING_SORT_FIELDS.indexOf(aSort) >= 0);
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

    if (sortBy == "purchaseAmount") {
      this._btnPrice.checkState = checkState;
      this._btnPrice.checked = true;
    } else {
      this._btnPrice.checkState = 0;
      this._btnPrice.checked = false;
    }

    if (sortBy == "relevancescore") {
      this._btnRelevance.checkState = checkState;
      this._btnRelevance.checked = true;
    } else {
      this._btnRelevance.checkState = 0;
      this._btnRelevance.checked = false;
    }

    if (this.handler && "onSortChanged" in this.handler)
      this.handler.onSortChanged(sortBy, this.ascending);
  }
}
customElements.define("firefox-sorters", FirefoxSorters);
