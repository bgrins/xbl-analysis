class MozMarquee extends MozXULElement {
  connectedCallback() {

    // Set up state.
    this._scrollAmount = 6;
    this._scrollDelay = 85;
    this._direction = "left";
    this._behavior = "scroll";
    this._loop = -1;
    this.dirsign = 1;
    this.startAt = 0;
    this.stopAt = 0;
    this.newPosition = 0;
    this.runId = 0;
    this.originalHeight = 0;
    this.startNewDirection = true;

    // hack needed to fix js error, see bug 386470
    var myThis = this;
    var lambda = function myScopeFunction() { if (myThis.init) myThis.init(); }

    this._set_direction(this.getAttribute('direction'));
    this._set_behavior(this.getAttribute('behavior'));
    this._set_scrollDelay(this.getAttribute('scrolldelay'));
    this._set_scrollAmount(this.getAttribute('scrollamount'));
    this._set_loop(this.getAttribute('loop'));
    this._setEventListener("start", this.getAttribute("onstart"));
    this._setEventListener("finish", this.getAttribute("onfinish"));
    this._setEventListener("bounce", this.getAttribute("onbounce"));
    this.startNewDirection = true;

    this._mutationObserver = new MutationObserver(this._mutationActor);
    this._mutationObserver.observe(this, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['loop', 'scrollamount', 'scrolldelay', '', 'truespeed', 'behavior',
        'direction', 'width', 'height', 'onstart', 'onfinish', 'onbounce'
      ]
    });

    // init needs to be run after the page has loaded in order to calculate
    // the correct height/width
    if (document.readyState == "complete") {
      lambda();
    } else {
      window.addEventListener("load", lambda);
    }

    this._setupEventListeners();
  }

  set scrollAmount(val) {
    var val = parseInt(val);
    if (val < 0) {
      return;
    }
    if (isNaN(val)) {
      val = 0;
    }
    this.setAttribute("scrollamount", val);
  }

  get scrollAmount() {
    this._mutationActor(this._mutationObserver.takeRecords());
    return this._scrollAmount;
  }

  set scrollDelay(val) {
    var val = parseInt(val);
    if (val > 0) {
      this.setAttribute("scrolldelay", val);
    }
  }

  get scrollDelay() {
    this._mutationActor(this._mutationObserver.takeRecords());
    var val = parseInt(this.getAttribute("scrolldelay"));

    if (val <= 0 || isNaN(val)) {
      return this._scrollDelay;
    }

    return val;
  }

  set trueSpeed(val) {
    if (val) {
      this.setAttribute("truespeed", "");
    } else {
      this.removeAttribute('truespeed');
    }
  }

  get trueSpeed() {
    if (!this.hasAttribute("truespeed")) {
      return false;
    }

    return true;
  }

  set direction(val) {
    if (typeof val == 'string') {
      val = val.toLowerCase();
    } else {
      return;
    }
    if (val != 'left' && val != 'right' && val != 'up' && val != 'down') {
      val = 'left';
    }

    this.setAttribute("direction", val);
  }

  get direction() {
    this._mutationActor(this._mutationObserver.takeRecords());
    return this._direction;
  }

  set behavior(val) {
    if (typeof val == 'string') {
      val = val.toLowerCase();
    }
    if (val == "alternate" || val == "slide" || val == 'scroll') {
      this.setAttribute("behavior", val);
    }
  }

  get behavior() {
    this._mutationActor(this._mutationObserver.takeRecords());
    return this._behavior;
  }

  set loop(val) {
    var val = parseInt(val);
    if (val == -1 || val > 0) {
      this.setAttribute("loop", val);
    }
  }

  get loop() {
    this._mutationActor(this._mutationObserver.takeRecords());
    return this._loop;
  }

  set onstart(val) {
    this._setEventListener("start", val, true);
    this.setAttribute("onstart", val);
  }

  get onstart() {
    return this.getAttribute("onstart");
  }

  set onfinish(val) {
    this._setEventListener("finish", val, true);
    this.setAttribute("onfinish", val);
  }

  get onfinish() {
    return this.getAttribute("onfinish");
  }

  set onbounce(val) {
    this._setEventListener("bounce", val, true);
    this.setAttribute("onbounce", val);
  }

  get onbounce() {
    return this.getAttribute("onbounce");
  }

  get outerDiv() {
    return document.getAnonymousNodes(this)[0]
  }

  get innerDiv() {
    return document.getAnonymousElementByAttribute(this, 'class', 'innerDiv');
  }

  set height(val) {
    this.setAttribute('height', val);
  }

  get height() {
    return this.getAttribute('height');
  }

  set width(val) {
    this.setAttribute('width', val);
  }

  get width() {
    return this.getAttribute('width');
  }

  _set_scrollDelay(aValue) {
    aValue = parseInt(aValue);
    if (aValue <= 0) {
      return;
    } else if (isNaN(aValue)) {
      this._scrollDelay = 85;
    } else if (aValue < 60) {
      if (this.trueSpeed == true) {
        this._scrollDelay = aValue;
      } else {
        this._scrollDelay = 60;
      }
    } else {
      this._scrollDelay = aValue;
    }
  }

  _set_scrollAmount(aValue) {
    aValue = parseInt(aValue);
    if (isNaN(aValue)) {
      this._scrollAmount = 6;
    } else if (aValue < 0) {
      return;
    } else {
      this._scrollAmount = aValue;
    }
  }

  _set_behavior(aValue) {
    if (typeof aValue == 'string') {
      aValue = aValue.toLowerCase();
    }
    if (aValue != 'alternate' && aValue != 'slide' && aValue != 'scroll') {
      this._behavior = 'scroll';
    } else {
      this._behavior = aValue;
    }
  }

  _set_direction(aValue) {
    if (typeof aValue == 'string') {
      aValue = aValue.toLowerCase();
    }
    if (aValue != 'left' && aValue != 'right' && aValue != 'up' && aValue != 'down') {
      aValue = 'left';
    }

    if (aValue != this._direction) {
      this.startNewDirection = true;
    }
    this._direction = aValue;
  }

  _set_loop(aValue) {
    var aValue = parseInt(aValue);
    if (aValue == 0) {
      return;
    }
    if (isNaN(aValue) || aValue <= -1) {
      aValue = -1;
    }
    this._loop = aValue;
  }

  _setEventListener(aName, aValue, aIgnoreNextCall) {
    // _setEventListener is only used for setting the attribute event
    // handlers, which we want to ignore if our document is sandboxed
    // without the allow-scripts keyword.
    if (document.hasScriptsBlockedBySandbox) {
      return true;
    }

    // attribute event handlers should only be added if the
    // document's CSP allows it.
    if (!document.inlineScriptAllowedByCSP) {
      return true;
    }

    if (this._ignoreNextCall) {
      return this._ignoreNextCall = false;
    }

    if (aIgnoreNextCall) {
      this._ignoreNextCall = true;
    }

    if (typeof this["_on" + aName] == 'function') {
      this.removeEventListener(aName, this["_on" + aName]);
    }

    switch (typeof aValue) {
      case "function":
        this["_on" + aName] = aValue;
        this.addEventListener(aName, this["_on" + aName]);
        break;

      case "string":
        if (!aIgnoreNextCall) {
          try {
            // Function Xrays make this simple and safe. \o/
            this["_on" + aName] = new window.Function("event", aValue);
          } catch (e) {
            return false;
          }
          this.addEventListener(aName, this["_on" + aName]);
        } else {
          this["_on" + aName] = aValue;
        }
        break;

      case "object":
        this["_on" + aName] = aValue;
        break;

      default:
        this._ignoreNextCall = false;
        throw new Error("Invalid argument for Marquee::on" + aName);
    }
    return true;
  }

  _fireEvent(aName, aBubbles, aCancelable) {
    var e = document.createEvent("Events");
    e.initEvent(aName, aBubbles, aCancelable);
    this.dispatchEvent(e);
  }

  start() {
    if (this.runId == 0) {
      var myThis = this;
      var lambda = function myTimeOutFunction() { myThis._doMove(false); }
      this.runId = window.setTimeout(lambda, this._scrollDelay - this._deltaStartStop);
      this._deltaStartStop = 0;
    }
  }

  stop() {
    if (this.runId != 0) {
      this._deltaStartStop = Date.now() - this._lastMoveDate;
      clearTimeout(this.runId);
    }

    this.runId = 0;
  }

  _doMove(aResetPosition) {
    this._lastMoveDate = Date.now();

    //startNewDirection is true at first load and whenever the direction is changed
    if (this.startNewDirection) {
      this.startNewDirection = false; //we only want this to run once every scroll direction change

      var corrvalue = 0;

      switch (this._direction) {
        case "up":
          var height = document.defaultView.getComputedStyle(this).height;
          this.outerDiv.style.height = height;
          if (this.originalHeight > this.outerDiv.offsetHeight) {
            corrvalue = this.originalHeight - this.outerDiv.offsetHeight;
          }
          this.innerDiv.style.padding = height + " 0";
          this.dirsign = 1;
          this.startAt = (this._behavior == 'alternate') ? (this.originalHeight - corrvalue) : 0;
          this.stopAt = (this._behavior == 'alternate' || this._behavior == 'slide') ?
            (parseInt(height) + corrvalue) : (this.originalHeight + parseInt(height));
          break;

        case "down":
          var height = document.defaultView.getComputedStyle(this).height;
          this.outerDiv.style.height = height;
          if (this.originalHeight > this.outerDiv.offsetHeight) {
            corrvalue = this.originalHeight - this.outerDiv.offsetHeight;
          }
          this.innerDiv.style.padding = height + " 0";
          this.dirsign = -1;
          this.startAt = (this._behavior == 'alternate') ?
            (parseInt(height) + corrvalue) : (this.originalHeight + parseInt(height));
          this.stopAt = (this._behavior == 'alternate' || this._behavior == 'slide') ?
            (this.originalHeight - corrvalue) : 0;
          break;

        case "right":
          if (this.innerDiv.offsetWidth > this.outerDiv.offsetWidth) {
            corrvalue = this.innerDiv.offsetWidth - this.outerDiv.offsetWidth;
          }
          this.dirsign = -1;
          this.stopAt = (this._behavior == 'alternate' || this._behavior == 'slide') ?
            (this.innerDiv.offsetWidth - corrvalue) : 0;
          this.startAt = this.outerDiv.offsetWidth + ((this._behavior == 'alternate') ?
            corrvalue : (this.innerDiv.offsetWidth + this.stopAt));
          break;

        case "left":
        default:
          if (this.innerDiv.offsetWidth > this.outerDiv.offsetWidth) {
            corrvalue = this.innerDiv.offsetWidth - this.outerDiv.offsetWidth;
          }
          this.dirsign = 1;
          this.startAt = (this._behavior == 'alternate') ? (this.innerDiv.offsetWidth - corrvalue) : 0;
          this.stopAt = this.outerDiv.offsetWidth +
            ((this._behavior == 'alternate' || this._behavior == 'slide') ?
              corrvalue : (this.innerDiv.offsetWidth + this.startAt));
      }

      if (aResetPosition) {
        this.newPosition = this.startAt;
        this._fireEvent("start", false, false);
      }
    } //end if

    this.newPosition = this.newPosition + (this.dirsign * this._scrollAmount);

    if ((this.dirsign == 1 && this.newPosition > this.stopAt) ||
      (this.dirsign == -1 && this.newPosition < this.stopAt)) {
      switch (this._behavior) {
        case 'alternate':
          // lets start afresh
          this.startNewDirection = true;

          // swap direction
          const swap = { left: "right", down: "up", up: "down", right: "left" };
          this._direction = swap[this._direction];
          this.newPosition = this.stopAt;

          if ((this._direction == "up") || (this._direction == "down")) {
            this.outerDiv.scrollTop = this.newPosition;
          } else {
            this.outerDiv.scrollLeft = this.newPosition;
          }

          if (this._loop != 1) {
            this._fireEvent("bounce", false, true);
          }
          break;

        case 'slide':
          if (this._loop > 1) {
            this.newPosition = this.startAt;
          }
          break;

        default:
          this.newPosition = this.startAt;

          if ((this._direction == "up") || (this._direction == "down")) {
            this.outerDiv.scrollTop = this.newPosition;
          } else {
            this.outerDiv.scrollLeft = this.newPosition;
          }

          //dispatch start event, even when this._loop == 1, comp. with IE6
          this._fireEvent("start", false, false);
      }

      if (this._loop > 1) {
        this._loop--;
      } else if (this._loop == 1) {
        if ((this._direction == "up") || (this._direction == "down")) {
          this.outerDiv.scrollTop = this.stopAt;
        } else {
          this.outerDiv.scrollLeft = this.stopAt;
        }
        this.stop();
        this._fireEvent("finish", false, true);
        return;
      }
    } else {
      if ((this._direction == "up") || (this._direction == "down")) {
        this.outerDiv.scrollTop = this.newPosition;
      } else {
        this.outerDiv.scrollLeft = this.newPosition;
      }
    }

    var myThis = this;
    var lambda = function myTimeOutFunction() { myThis._doMove(false); }
    this.runId = window.setTimeout(lambda, this._scrollDelay);
  }

  init() {
    this.stop();

    if ((this._direction != "up") && (this._direction != "down")) {
      var width = window.getComputedStyle(this).width;
      this.innerDiv.parentNode.style.margin = '0 ' + width;

      //XXX Adding the margin sometimes causes the marquee to widen, 
      // see testcase from bug bug 364434: 
      // https://bugzilla.mozilla.org/attachment.cgi?id=249233
      // Just add a fixed width with current marquee's width for now
      if (width != window.getComputedStyle(this).width) {
        var width = window.getComputedStyle(this).width;
        this.outerDiv.style.width = width;
        this.innerDiv.parentNode.style.margin = '0 ' + width;
      }
    } else {
      // store the original height before we add padding
      this.innerDiv.style.padding = 0;
      this.originalHeight = this.innerDiv.offsetHeight;
    }

    this._doMove(true);
  }

  _mutationActor(aMutations) {
    while (aMutations.length > 0) {
      var mutation = aMutations.shift();
      var attrName = mutation.attributeName.toLowerCase();
      var oldValue = mutation.oldValue;
      var target = mutation.target;
      var newValue = target.getAttribute(attrName);

      if (oldValue != newValue) {
        switch (attrName) {
          case "loop":
            target._set_loop(newValue);
            if (target.rundId == 0) {
              target.start();
            }
            break;
          case "scrollamount":
            target._set_scrollAmount(newValue);
            break;
          case "scrolldelay":
            target._set_scrollDelay(newValue);
            target.stop();
            target.start();
            break;
          case "truespeed":
            //needed to update target._scrollDelay
            var myThis = target;
            var lambda = function() { myThis._set_scrollDelay(myThis.getAttribute('scrolldelay')); }
            window.setTimeout(lambda, 0);
            break;
          case "behavior":
            target._set_behavior(newValue);
            target.startNewDirection = true;
            if ((oldValue == "slide" && target.newPosition == target.stopAt) ||
              newValue == "alternate" || newValue == "slide") {
              target.stop();
              target._doMove(true);
            }
            break;
          case "direction":
            if (!newValue) {
              newValue = "left";
            }
            target._set_direction(newValue);
            break;
          case "width":
          case "height":
            target.startNewDirection = true;
            break;
          case "onstart":
            target._setEventListener("start", newValue);
            break;
          case "onfinish":
            target._setEventListener("finish", newValue);
            break;
          case "onbounce":
            target._setEventListener("bounce", newValue);
            break;
        }
      }
    }
  }

  _setupEventListeners() {

  }
}