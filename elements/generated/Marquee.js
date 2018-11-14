/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozMarquee extends MozXULElement {
  connectedCallback() {

    this.setStartStopCallback(val => {
      if (val == "start") {
        this.doStart();
      } else if (val == "stop") {
        this.doStop();
      } else {
        throw new Error(`setStartStopCallback passed an invalid value: ${val}`);
      }
    });
    // Set up state.
    this._currentDirection = this.direction || "left";
    this._currentLoop = this.loop;
    this.dirsign = 1;
    this.startAt = 0;
    this.stopAt = 0;
    this.newPosition = 0;
    this.runId = 0;
    this.originalHeight = 0;
    this.invalidateCache = true;

    // hack needed to fix js error, see bug 386470
    var myThis = this;
    var lambda = function myScopeFunction() { if (myThis.init) myThis.init(); }

    this._mutationObserver = new MutationObserver(this._mutationActor);
    this._mutationObserver.observe(this, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['loop', '', 'behavior',
        'direction', 'width', 'height'
      ]
    });

    // init needs to be run after the page has loaded in order to calculate
    // the correct height/width
    if (document.readyState == "complete") {
      lambda();
    } else {
      window.addEventListener("load", lambda);
    }

  }

  get outerDiv() {
    return document.getAnonymousNodes(this)[0]
  }

  get innerDiv() {
    return document.getAnonymousElementByAttribute(this, 'class', 'innerDiv');
  }

  get scrollDelayWithTruespeed() {
    if (this.scrollDelay < 60 && !this.trueSpeed) {
      return 60;
    }
    return this.scrollDelay;
  }

  doStart() {
    if (this.runId == 0) {
      var lambda = () => this._doMove(false);
      this.runId = window.setTimeout(lambda, this.scrollDelayWithTruespeed - this._deltaStartStop);
      this._deltaStartStop = 0;
    }
  }

  doStop() {
    if (this.runId != 0) {
      this._deltaStartStop = Date.now() - this._lastMoveDate;
      clearTimeout(this.runId);
    }

    this.runId = 0;
  }

  _fireEvent(aName, aBubbles, aCancelable) {
    var e = document.createEvent("Events");
    e.initEvent(aName, aBubbles, aCancelable);
    this.dispatchEvent(e);
  }

  _doMove(aResetPosition) {
    this._lastMoveDate = Date.now();

    // invalidateCache is true at first load and whenever an attribute
    // is changed
    if (this.invalidateCache) {
      this.invalidateCache = false; //we only want this to run once every scroll direction change

      var corrvalue = 0;

      switch (this._currentDirection) {
        case "up":
          var height = document.defaultView.getComputedStyle(this).height;
          this.outerDiv.style.height = height;
          if (this.originalHeight > this.outerDiv.offsetHeight) {
            corrvalue = this.originalHeight - this.outerDiv.offsetHeight;
          }
          this.innerDiv.style.padding = height + " 0";
          this.dirsign = 1;
          this.startAt = (this.behavior == 'alternate') ? (this.originalHeight - corrvalue) : 0;
          this.stopAt = (this.behavior == 'alternate' || this.behavior == 'slide') ?
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
          this.startAt = (this.behavior == 'alternate') ?
            (parseInt(height) + corrvalue) : (this.originalHeight + parseInt(height));
          this.stopAt = (this.behavior == 'alternate' || this.behavior == 'slide') ?
            (this.originalHeight - corrvalue) : 0;
          break;

        case "right":
          if (this.innerDiv.offsetWidth > this.outerDiv.offsetWidth) {
            corrvalue = this.innerDiv.offsetWidth - this.outerDiv.offsetWidth;
          }
          this.dirsign = -1;
          this.stopAt = (this.behavior == 'alternate' || this.behavior == 'slide') ?
            (this.innerDiv.offsetWidth - corrvalue) : 0;
          this.startAt = this.outerDiv.offsetWidth + ((this.behavior == 'alternate') ?
            corrvalue : (this.innerDiv.offsetWidth + this.stopAt));
          break;

        case "left":
        default:
          if (this.innerDiv.offsetWidth > this.outerDiv.offsetWidth) {
            corrvalue = this.innerDiv.offsetWidth - this.outerDiv.offsetWidth;
          }
          this.dirsign = 1;
          this.startAt = (this.behavior == 'alternate') ? (this.innerDiv.offsetWidth - corrvalue) : 0;
          this.stopAt = this.outerDiv.offsetWidth +
            ((this.behavior == 'alternate' || this.behavior == 'slide') ?
              corrvalue : (this.innerDiv.offsetWidth + this.startAt));
      }

      if (aResetPosition) {
        this.newPosition = this.startAt;
        this._fireEvent("start", false, false);
      }
    } //end if

    this.newPosition = this.newPosition + (this.dirsign * this.scrollAmount);

    if ((this.dirsign == 1 && this.newPosition > this.stopAt) ||
      (this.dirsign == -1 && this.newPosition < this.stopAt)) {
      switch (this.behavior) {
        case 'alternate':
          // lets start afresh
          this.invalidateCache = true;

          // swap direction
          const swap = { left: "right", down: "up", up: "down", right: "left" };
          this._currentDirection = swap[this._currentDirection] || "left";
          this.newPosition = this.stopAt;

          if ((this._currentDirection == "up") || (this._currentDirection == "down")) {
            this.outerDiv.scrollTop = this.newPosition;
          } else {
            this.outerDiv.scrollLeft = this.newPosition;
          }

          if (this._currentLoop != 1) {
            this._fireEvent("bounce", false, true);
          }
          break;

        case 'slide':
          if (this._currentLoop > 1) {
            this.newPosition = this.startAt;
          }
          break;

        default:
          this.newPosition = this.startAt;

          if ((this._currentDirection == "up") || (this._currentDirection == "down")) {
            this.outerDiv.scrollTop = this.newPosition;
          } else {
            this.outerDiv.scrollLeft = this.newPosition;
          }

          //dispatch start event, even when this._currentLoop == 1, comp. with IE6
          this._fireEvent("start", false, false);
      }

      if (this._currentLoop > 1) {
        this._currentLoop--;
      } else if (this._currentLoop == 1) {
        if ((this._currentDirection == "up") || (this._currentDirection == "down")) {
          this.outerDiv.scrollTop = this.stopAt;
        } else {
          this.outerDiv.scrollLeft = this.stopAt;
        }
        this.stop();
        this._fireEvent("finish", false, true);
        return;
      }
    } else {
      if ((this._currentDirection == "up") || (this._currentDirection == "down")) {
        this.outerDiv.scrollTop = this.newPosition;
      } else {
        this.outerDiv.scrollLeft = this.newPosition;
      }
    }

    var myThis = this;
    var lambda = function myTimeOutFunction() { myThis._doMove(false); }
    this.runId = window.setTimeout(lambda, this.scrollDelayWithTruespeed);
  }

  init() {
    this.stop();

    if ((this._currentDirection != "up") && (this._currentDirection != "down")) {
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
        target.invalidateCache = true;
        switch (attrName) {
          case "loop":
            target._currentLoop = target.loop;
            break;
          case "direction":
            target._currentDirection = target.direction;
            break;
        }
      }
    }
  }
  disconnectedCallback() {
    this.setStartStopCallback(null);
  }
}

customElements.define("marquee", MozMarquee);

}
