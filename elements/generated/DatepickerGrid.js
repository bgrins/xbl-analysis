class FirefoxDatepickerGrid extends FirefoxDatepicker {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<vbox class="datepicker-mainbox">
<hbox class="datepicker-monthbox" align="center">
<button class="datepicker-previous datepicker-button" type="repeat" inherits="disabled" oncommand="document.getBindingParent(this)._increaseOrDecreaseMonth(-1);">
</button>
<spacer flex="1">
</spacer>
<deck anonid="monthlabeldeck">
<firefox-text-label class="datepicker-gridlabel" value="">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" value="">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" value="">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" value="">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" value="">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" value="">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" value="">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" value="">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" value="">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" value="">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" value="">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" value="">
</firefox-text-label>
</deck>
<firefox-text-label anonid="yearlabel" class="datepicker-gridlabel">
</firefox-text-label>
<spacer flex="1">
</spacer>
<button class="datepicker-next datepicker-button" type="repeat" inherits="disabled" oncommand="document.getBindingParent(this)._increaseOrDecreaseMonth(1);">
</button>
</hbox>
<grid class="datepicker-grid" role="grid">
<columns>
<column class="datepicker-gridrow" flex="1">
</column>
<column class="datepicker-gridrow" flex="1">
</column>
<column class="datepicker-gridrow" flex="1">
</column>
<column class="datepicker-gridrow" flex="1">
</column>
<column class="datepicker-gridrow" flex="1">
</column>
<column class="datepicker-gridrow" flex="1">
</column>
<column class="datepicker-gridrow" flex="1">
</column>
</columns>
<rows anonid="datebox">
<row anonid="dayofweekbox">
<firefox-text-label class="datepicker-weeklabel" role="columnheader">
</firefox-text-label>
<firefox-text-label class="datepicker-weeklabel" role="columnheader">
</firefox-text-label>
<firefox-text-label class="datepicker-weeklabel" role="columnheader">
</firefox-text-label>
<firefox-text-label class="datepicker-weeklabel" role="columnheader">
</firefox-text-label>
<firefox-text-label class="datepicker-weeklabel" role="columnheader">
</firefox-text-label>
<firefox-text-label class="datepicker-weeklabel" role="columnheader">
</firefox-text-label>
<firefox-text-label class="datepicker-weeklabel" role="columnheader">
</firefox-text-label>
</row>
<row>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
</row>
<row>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
</row>
<row>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
</row>
<row>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
</row>
<row>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
</row>
<row>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
<firefox-text-label class="datepicker-gridlabel" role="gridcell">
</firefox-text-label>
</row>
</rows>
</grid>
</vbox>`;
    let comment = document.createComment("Creating firefox-datepicker-grid");
    this.prepend(comment);

    Object.defineProperty(this, "_hasEntry", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._hasEntry;
        return (this._hasEntry = false);
      },
      set(val) {
        delete this["_hasEntry"];
        return (this["_hasEntry"] = val);
      }
    });
    Object.defineProperty(this, "_weekStart", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._weekStart;
        return (this._weekStart = "");
      },
      set(val) {
        delete this["_weekStart"];
        return (this["_weekStart"] = val);
      }
    });
    Object.defineProperty(this, "_displayedDate", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._displayedDate;
        return (this._displayedDate = null);
      },
      set(val) {
        delete this["_displayedDate"];
        return (this["_displayedDate"] = val);
      }
    });
    Object.defineProperty(this, "_todayItem", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._todayItem;
        return (this._todayItem = null);
      },
      set(val) {
        delete this["_todayItem"];
        return (this["_todayItem"] = val);
      }
    });
    Object.defineProperty(this, "yearField", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.yearField;
        return (this.yearField = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "yearlabel"
        ));
      },
      set(val) {
        delete this["yearField"];
        return (this["yearField"] = val);
      }
    });
    Object.defineProperty(this, "monthField", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.monthField;
        return (this.monthField = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "monthlabeldeck"
        ));
      },
      set(val) {
        delete this["monthField"];
        return (this["monthField"] = val);
      }
    });
    Object.defineProperty(this, "dateField", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.dateField;
        return (this.dateField = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "datebox"
        ));
      },
      set(val) {
        delete this["dateField"];
        return (this["dateField"] = val);
      }
    });
    Object.defineProperty(this, "_selectedItem", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._selectedItem;
        return (this._selectedItem = null);
      },
      set(val) {
        delete this["_selectedItem"];
        return (this["_selectedItem"] = val);
      }
    });
  }
  disconnectedCallback() {}

  set selectedItem(val) {
    if (!val.value) return val;
    if (val.parentNode.parentNode != this.dateField) return val;

    if (this._selectedItem) this._selectedItem.removeAttribute("selected");
    this._selectedItem = val;
    val.setAttribute("selected", "true");
    this._displayedDate.setDate(val.value);
    return val;
  }

  get selectedItem() {
    return this._selectedItem;
  }

  set displayedMonth(val) {
    undefined;
  }

  get displayedMonth() {
    undefined;
  }

  set displayedYear(val) {
    undefined;
  }

  get displayedYear() {
    undefined;
  }
  _init() {
    var locale =
      Intl.DateTimeFormat().resolvedOptions().locale + "-u-ca-gregory";
    var dtfMonth = Intl.DateTimeFormat(locale, {
      month: "long",
      timeZone: "UTC"
    });
    var dtfWeekday = Intl.DateTimeFormat(locale, { weekday: "narrow" });

    var monthLabel = this.monthField.firstChild;
    var tempDate = new Date(Date.UTC(2005, 0, 1));
    for (var month = 0; month < 12; month++) {
      tempDate.setUTCMonth(month);
      monthLabel.setAttribute("value", dtfMonth.format(tempDate));
      monthLabel = monthLabel.nextSibling;
    }

    var fdow = Number(this.getAttribute("firstdayofweek"));
    if (!isNaN(fdow) && fdow >= 0 && fdow <= 6) this._weekStart = fdow;

    var weekbox = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "dayofweekbox"
    ).childNodes;
    var date = new Date();
    date.setDate(date.getDate() - (date.getDay() - this._weekStart));
    for (var i = 0; i < weekbox.length; i++) {
      weekbox[i].value = dtfWeekday.format(date);
      date.setDate(date.getDate() + 1);
    }
  }
  _setValueNoSync(aValue) {
    var dt = new Date(aValue);
    if (!isNaN(dt)) {
      this._dateValue = dt;
      this.setAttribute("value", this.value);
      this._updateUI();
    }
  }
  _updateUI(aField, aValue, aCheckMonth) {
    var date;
    var currentMonth;
    if (aCheckMonth) {
      if (!this._displayedDate) this._displayedDate = this.dateValue;

      var expectedMonth = aValue;
      if (aField == this.monthField) {
        this._displayedDate.setMonth(aValue);
      } else {
        expectedMonth = this._displayedDate.getMonth();
        this._displayedDate.setFullYear(aValue);
      }

      if (
        expectedMonth != -1 &&
        expectedMonth != 12 &&
        expectedMonth != this._displayedDate.getMonth()
      ) {
        // If the month isn't what was expected, then the month overflowed.
        // Setting the date to 0 will go back to the last day of the right month.
        this._displayedDate.setDate(0);
      }

      date = new Date(this._displayedDate);
      currentMonth = this._displayedDate.getMonth();
    } else {
      var samemonth =
        this._displayedDate &&
        this._displayedDate.getMonth() == this.month &&
        this._displayedDate.getFullYear() == this.year;
      if (samemonth) {
        var items = this.dateField.getElementsByAttribute("value", this.date);
        if (items.length) this.selectedItem = items[0];
        return;
      }

      date = this.dateValue;
      this._displayedDate = new Date(date);
      currentMonth = this.month;
    }

    if (this._todayItem) {
      this._todayItem.removeAttribute("today");
      this._todayItem = null;
    }

    if (this._selectedItem) {
      this._selectedItem.removeAttribute("selected");
      this._selectedItem = null;
    }

    // Update the month and year title
    this.monthField.selectedIndex = currentMonth;
    this.yearField.setAttribute("value", date.getFullYear());

    date.setDate(1);
    var firstWeekday = (7 + date.getDay() - this._weekStart) % 7;
    date.setDate(date.getDate() - firstWeekday);

    var today = new Date();
    var datebox = this.dateField;
    for (var k = 1; k < datebox.childNodes.length; k++) {
      var row = datebox.childNodes[k];
      for (var i = 0; i < 7; i++) {
        var item = row.childNodes[i];

        if (currentMonth == date.getMonth()) {
          item.value = date.getDate();

          // highlight today
          if (this._isSameDay(today, date)) {
            this._todayItem = item;
            item.setAttribute("today", "true");
          }

          // highlight the selected date
          if (this._isSameDay(this._dateValue, date)) {
            this._selectedItem = item;
            item.setAttribute("selected", "true");
          }
        } else {
          item.value = "";
        }

        date.setDate(date.getDate() + 1);
      }
    }

    this._fireEvent("monthchange", this);
  }
  _increaseOrDecreaseDateFromEvent(aEvent, aDiff) {
    if (aEvent.originalTarget == this && !this.disabled && !this.readOnly) {
      var newdate = this.dateValue;
      newdate.setDate(newdate.getDate() + aDiff);
      this.dateValue = newdate;
      this._fireEvent("change", this);
    }
    aEvent.stopPropagation();
    aEvent.preventDefault();
  }
  _increaseOrDecreaseMonth(aDir) {
    if (!this.disabled) {
      var month = this._displayedDate
        ? this._displayedDate.getMonth()
        : this.month;
      this._updateUI(this.monthField, month + aDir, true);
    }
  }
  _isSameDay(aDate1, aDate2) {
    return (
      aDate1 &&
      aDate2 &&
      aDate1.getDate() == aDate2.getDate() &&
      aDate1.getMonth() == aDate2.getMonth() &&
      aDate1.getFullYear() == aDate2.getFullYear()
    );
  }
}
customElements.define("firefox-datepicker-grid", FirefoxDatepickerGrid);
