/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozTabbrowserTabs extends MozTabs {
  constructor() {
    super();

    this.addEventListener("TabSelect", (event) => {
      this._handleTabSelect();
      gBrowser.clearMultiSelectedTabs(true);
    });

    this.addEventListener("TabClose", (event) => {
      this._hiddenSoundPlayingStatusChanged(event.target, { closed: true });
    });

    this.addEventListener("TabAttrModified", (event) => {
      if (event.detail.changed.includes("soundplaying") && event.target.hidden) {
        this._hiddenSoundPlayingStatusChanged(event.target);
      }
    });

    this.addEventListener("TabHide", (event) => {
      if (event.target.soundPlaying) {
        this._hiddenSoundPlayingStatusChanged(event.target);
      }
    });

    this.addEventListener("TabShow", (event) => {
      if (event.target.soundPlaying) {
        this._hiddenSoundPlayingStatusChanged(event.target);
      }
    });

    this.addEventListener("transitionend", (event) => {
      if (event.propertyName != "max-width") {
        return;
      }

      var tab = event.target;

      if (tab.getAttribute("fadein") == "true") {
        if (tab._fullyOpen) {
          this._updateCloseButtons();
        } else {
          this._handleNewTab(tab);
        }
      } else if (tab.closing) {
        gBrowser._endRemoveTab(tab);
      }
    });

    this.addEventListener("dblclick", (event) => {
      // When the tabbar has an unified appearance with the titlebar
      // and menubar, a double-click in it should have the same behavior
      // as double-clicking the titlebar
      if (TabsInTitlebar.enabled || this.parentNode._dragBindingAlive)
        return;

      if (event.button != 0 ||
        event.originalTarget.localName != "box")
        return;

      if (!this._blockDblClick)
        BrowserOpenTab();

      event.preventDefault();
    });

    this.addEventListener("click", (event) => {
      if (event.button != 0) { return; }
      /* Catches extra clicks meant for the in-tab close button.
       * Placed here to avoid leaking (a temporary handler added from the
       * in-tab close button binding would close over the tab and leak it
       * until the handler itself was removed). (bug 897751)
       *
       * The only sequence in which a second click event (i.e. dblclik)
       * can be dispatched on an in-tab close button is when it is shown
       * after the first click (i.e. the first click event was dispatched
       * on the tab). This happens when we show the close button only on
       * the active tab. (bug 352021)
       * The only sequence in which a third click event can be dispatched
       * on an in-tab close button is when the tab was opened with a
       * double click on the tabbar. (bug 378344)
       * In both cases, it is most likely that the close button area has
       * been accidentally clicked, therefore we do not close the tab.
       *
       * We don't want to ignore processing of more than one click event,
       * though, since the user might actually be repeatedly clicking to
       * close many tabs at once.
       */
      let target = event.originalTarget;
      if (target.classList.contains("tab-close-button")) {
        // We preemptively set this to allow the closing-multiple-tabs-
        // in-a-row case.
        if (this._blockDblClick) {
          target._ignoredCloseButtonClicks = true;
        } else if (event.detail > 1 && !target._ignoredCloseButtonClicks) {
          target._ignoredCloseButtonClicks = true;
          event.stopPropagation();
          return;
        } else {
          // Reset the "ignored click" flag
          target._ignoredCloseButtonClicks = false;
        }
      }

      /* Protects from close-tab-button errant doubleclick:
       * Since we're removing the event target, if the user
       * double-clicks the button, the dblclick event will be dispatched
       * with the tabbar as its event target (and explicit/originalTarget),
       * which treats that as a mouse gesture for opening a new tab.
       * In this context, we're manually blocking the dblclick event.
       */
      if (this._blockDblClick) {
        if (!("_clickedTabBarOnce" in this)) {
          this._clickedTabBarOnce = true;
          return;
        }
        delete this._clickedTabBarOnce;
        this._blockDblClick = false;
      }
    }, true);

    this.addEventListener("click", (event) => {
      if (event.button != 1) {
        return;
      }

      if (event.target.localName == "tab") {
        gBrowser.removeTab(event.target, {
          animate: true,
          byMouse: event.mozInputSource == MouseEvent.MOZ_SOURCE_MOUSE,
        });
      } else if (event.originalTarget.localName == "box") {
        // The user middleclicked an open space on the tabstrip. This could
        // be because they intend to open a new tab, but it could also be
        // because they just removed a tab and they now middleclicked on the
        // resulting space while that tab is closing. In that case, we don't
        // want to open a tab. So if we're removing one or more tabs, and
        // the tab click is before the end of the last visible tab, we do
        // nothing.
        if (gBrowser._removingTabs.length) {
          let visibleTabs = this._getVisibleTabs();
          let ltr = (window.getComputedStyle(this).direction == "ltr");
          let lastTab = visibleTabs[visibleTabs.length - 1];
          let endOfTab = lastTab.getBoundingClientRect()[ltr ? "right" : "left"];
          if ((ltr && event.clientX > endOfTab) ||
            (!ltr && event.clientX < endOfTab)) {
            BrowserOpenTab();
          }
        } else {
          BrowserOpenTab();
        }
      } else {
        return;
      }

      event.stopPropagation();
    });

    this.addEventListener("keydown", (event) => {
      let { altKey, shiftKey } = event;
      let [accel, nonAccel] = AppConstants.platform == "macosx" ? [event.metaKey, event.ctrlKey] : [event.ctrlKey, event.metaKey];

      let keyComboForMove = accel && shiftKey && !altKey && !nonAccel;
      let keyComboForFocus = accel && !shiftKey && !altKey && !nonAccel;

      if (!keyComboForMove && !keyComboForFocus) {
        return;
      }

      // Don't check if the event was already consumed because tab navigation
      // should work always for better user experience.
      let { visibleTabs, selectedTab } = gBrowser;
      let { arrowKeysShouldWrap } = this;
      let focusedTabIndex = this.ariaFocusedIndex;
      if (focusedTabIndex == -1) {
        focusedTabIndex = visibleTabs.indexOf(selectedTab);
      }
      let lastFocusedTabIndex = focusedTabIndex;
      switch (event.keyCode) {
        case KeyEvent.DOM_VK_UP:
          if (keyComboForMove) {
            gBrowser.moveTabBackward();
          } else {
            focusedTabIndex--;
          }
          break;
        case KeyEvent.DOM_VK_DOWN:
          if (keyComboForMove) {
            gBrowser.moveTabForward();
          } else {
            focusedTabIndex++;
          }
          break;
        case KeyEvent.DOM_VK_RIGHT:
        case KeyEvent.DOM_VK_LEFT:
          if (keyComboForMove) {
            gBrowser.moveTabOver(event);
          } else {
            let isRTL = Services.locale.isAppLocaleRTL;
            if ((!isRTL && event.keyCode == KeyEvent.DOM_VK_RIGHT) ||
              (isRTL && event.keyCode == KeyEvent.DOM_VK_LEFT)) {
              focusedTabIndex++;
            } else {
              focusedTabIndex--;
            }
          }
          break;
        case KeyEvent.DOM_VK_HOME:
          if (keyComboForMove) {
            gBrowser.moveTabToStart();
          } else {
            focusedTabIndex = 0;
          }
          break;
        case KeyEvent.DOM_VK_END:
          if (keyComboForMove) {
            gBrowser.moveTabToEnd();
          } else {
            focusedTabIndex = visibleTabs.length - 1;
          }
          break;
        case KeyEvent.DOM_VK_SPACE:
          if (visibleTabs[lastFocusedTabIndex].multiselected) {
            gBrowser.removeFromMultiSelectedTabs(visibleTabs[lastFocusedTabIndex]);
          } else {
            gBrowser.addToMultiSelectedTabs(visibleTabs[lastFocusedTabIndex], false);
          }
          break;
        default:
          // Consume the keydown event for the above keyboard
          // shortcuts only.
          return;
      }

      if (arrowKeysShouldWrap) {
        if (focusedTabIndex >= visibleTabs.length) {
          focusedTabIndex = 0;
        } else if (focusedTabIndex < 0) {
          focusedTabIndex = visibleTabs.length - 1;
        }
      } else {
        focusedTabIndex = Math.min(visibleTabs.length - 1, Math.max(0, focusedTabIndex));
      }

      if (keyComboForFocus &&
        focusedTabIndex != lastFocusedTabIndex) {
        this.ariaFocusedItem = visibleTabs[focusedTabIndex];
      }

      event.preventDefault();
    }, { mozSystemGroup: true });

    this.addEventListener("dragstart", (event) => {
      var tab = this._getDragTargetTab(event, false);
      if (!tab || this._isCustomizing)
        return;

      let selectedTabs = gBrowser.selectedTabs;
      let otherSelectedTabs = selectedTabs.filter(selectedTab => selectedTab != tab);
      let dataTransferOrderedTabs = [tab].concat(otherSelectedTabs);

      let dt = event.dataTransfer;
      for (let i = 0; i < dataTransferOrderedTabs.length; i++) {
        let dtTab = dataTransferOrderedTabs[i];

        dt.mozSetDataAt(TAB_DROP_TYPE, dtTab, i);
        let dtBrowser = dtTab.linkedBrowser;

        // We must not set text/x-moz-url or text/plain data here,
        // otherwise trying to detach the tab by dropping it on the desktop
        // may result in an "internet shortcut"
        dt.mozSetDataAt("text/x-moz-text-internal", dtBrowser.currentURI.spec, i);
      }

      // Set the cursor to an arrow during tab drags.
      dt.mozCursor = "default";

      // Set the tab as the source of the drag, which ensures we have a stable
      // node to deliver the `dragend` event.  See bug 1345473.
      dt.addElement(tab);

      if (tab.multiselected) {
        this._groupSelectedTabs(tab);
      }

      // Create a canvas to which we capture the current tab.
      // Until canvas is HiDPI-aware (bug 780362), we need to scale the desired
      // canvas size (in CSS pixels) to the window's backing resolution in order
      // to get a full-resolution drag image for use on HiDPI displays.
      let windowUtils = window.windowUtils;
      let scale = windowUtils.screenPixelsPerCSSPixel / windowUtils.fullZoom;
      let canvas = this._dndCanvas;
      if (!canvas) {
        this._dndCanvas = canvas =
          document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.mozOpaque = true;
      }

      canvas.width = 160 * scale;
      canvas.height = 90 * scale;
      let toDrag = canvas;
      let dragImageOffset = -16;
      let browser = tab.linkedBrowser;
      if (gMultiProcessBrowser) {
        var context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        let captureListener;
        let platform = AppConstants.platform;
        // On Windows and Mac we can update the drag image during a drag
        // using updateDragImage. On Linux, we can use a panel.
        if (platform == "win" || platform == "macosx") {
          captureListener = function() {
            dt.updateDragImage(canvas, dragImageOffset, dragImageOffset);
          };
        } else {
          // Create a panel to use it in setDragImage
          // which will tell xul to render a panel that follows
          // the pointer while a dnd session is on.
          if (!this._dndPanel) {
            this._dndCanvas = canvas;
            this._dndPanel = document.createXULElement("panel");
            this._dndPanel.className = "dragfeedback-tab";
            this._dndPanel.setAttribute("type", "drag");
            let wrapper = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
            wrapper.style.width = "160px";
            wrapper.style.height = "90px";
            wrapper.appendChild(canvas);
            this._dndPanel.appendChild(wrapper);
            document.documentElement.appendChild(this._dndPanel);
          }
          toDrag = this._dndPanel;
        }
        // PageThumb is async with e10s but that's fine
        // since we can update the image during the dnd.
        PageThumbs.captureToCanvas(browser, canvas, captureListener);
      } else {
        // For the non e10s case we can just use PageThumbs
        // sync, so let's use the canvas for setDragImage.
        PageThumbs.captureToCanvas(browser, canvas);
        dragImageOffset = dragImageOffset * scale;
      }
      dt.setDragImage(toDrag, dragImageOffset, dragImageOffset);

      // _dragData.offsetX/Y give the coordinates that the mouse should be
      // positioned relative to the corner of the new window created upon
      // dragend such that the mouse appears to have the same position
      // relative to the corner of the dragged tab.
      function clientX(ele) {
        return ele.getBoundingClientRect().left;
      }
      let tabOffsetX = clientX(tab) - clientX(this);
      tab._dragData = {
        offsetX: event.screenX - window.screenX - tabOffsetX,
        offsetY: event.screenY - window.screenY,
        scrollX: this.arrowScrollbox._scrollbox.scrollLeft,
        screenX: event.screenX,
        movingTabs: (tab.multiselected ? gBrowser.selectedTabs : [tab])
          .filter(t => t.pinned == tab.pinned),
      };

      event.stopPropagation();
    });

    this.addEventListener("dragover", (event) => {
      var effects = this._getDropEffectForTabDrag(event);

      var ind = this._tabDropIndicator;
      if (effects == "" || effects == "none") {
        ind.collapsed = true;
        return;
      }
      event.preventDefault();
      event.stopPropagation();

      var arrowScrollbox = this.arrowScrollbox;
      var ltr = (window.getComputedStyle(this).direction == "ltr");

      // autoscroll the tab strip if we drag over the scroll
      // buttons, even if we aren't dragging a tab, but then
      // return to avoid drawing the drop indicator
      var pixelsToScroll = 0;
      if (this.getAttribute("overflow") == "true") {
        var targetAnonid = event.originalTarget.getAttribute("anonid");
        switch (targetAnonid) {
          case "scrollbutton-up":
            pixelsToScroll = arrowScrollbox.scrollIncrement * -1;
            break;
          case "scrollbutton-down":
            pixelsToScroll = arrowScrollbox.scrollIncrement;
            break;
        }
        if (pixelsToScroll)
          arrowScrollbox.scrollByPixels((ltr ? 1 : -1) * pixelsToScroll, true);
      }

      let draggedTab = event.dataTransfer.mozGetDataAt(TAB_DROP_TYPE, 0);
      if ((effects == "move" || effects == "copy") &&
        this == draggedTab.parentNode) {
        ind.collapsed = true;

        if (!this._isGroupTabsAnimationOver()) {
          // Wait for grouping tabs animation to finish
          return;
        }
        this._finishGroupSelectedTabs(draggedTab);

        if (effects == "move") {
          this._animateTabMove(event);
          return;
        }
      }

      this._finishAnimateTabMove();

      if (effects == "link") {
        let tab = this._getDragTargetTab(event, true);
        if (tab) {
          if (!this._dragTime)
            this._dragTime = Date.now();
          if (Date.now() >= this._dragTime + this._dragOverDelay)
            this.selectedItem = tab;
          ind.collapsed = true;
          return;
        }
      }

      var rect = arrowScrollbox.getBoundingClientRect();
      var newMargin;
      if (pixelsToScroll) {
        // if we are scrolling, put the drop indicator at the edge
        // so that it doesn't jump while scrolling
        let scrollRect = arrowScrollbox.scrollClientRect;
        let minMargin = scrollRect.left - rect.left;
        let maxMargin = Math.min(minMargin + scrollRect.width,
          scrollRect.right);
        if (!ltr)
          [minMargin, maxMargin] = [this.clientWidth - maxMargin,
            this.clientWidth - minMargin
          ];
        newMargin = (pixelsToScroll > 0) ? maxMargin : minMargin;
      } else {
        let newIndex = this._getDropIndex(event, effects == "link");
        if (newIndex == this.children.length) {
          let tabRect = this.children[newIndex - 1].getBoundingClientRect();
          if (ltr)
            newMargin = tabRect.right - rect.left;
          else
            newMargin = rect.right - tabRect.left;
        } else {
          let tabRect = this.children[newIndex].getBoundingClientRect();
          if (ltr)
            newMargin = tabRect.left - rect.left;
          else
            newMargin = rect.right - tabRect.right;
        }
      }

      ind.collapsed = false;

      newMargin += ind.clientWidth / 2;
      if (!ltr)
        newMargin *= -1;

      ind.style.transform = "translate(" + Math.round(newMargin) + "px)";
      ind.style.marginInlineStart = (-ind.clientWidth) + "px";
    });

    this.addEventListener("drop", (event) => {
      var dt = event.dataTransfer;
      var dropEffect = dt.dropEffect;
      var draggedTab;
      let movingTabs;
      if (dt.mozTypesAt(0)[0] == TAB_DROP_TYPE) { // tab copy or move
        draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
        // not our drop then
        if (!draggedTab)
          return;
        movingTabs = draggedTab._dragData.movingTabs;
        draggedTab.parentNode._finishGroupSelectedTabs(draggedTab);
      }

      this._tabDropIndicator.collapsed = true;
      event.stopPropagation();
      if (draggedTab && dropEffect == "copy") {
        // copy the dropped tab (wherever it's from)
        let newIndex = this._getDropIndex(event, false);
        let draggedTabCopy;
        for (let tab of movingTabs) {
          let newTab = gBrowser.duplicateTab(tab);
          gBrowser.moveTabTo(newTab, newIndex++);
          if (tab == draggedTab)
            draggedTabCopy = newTab;
        }
        if (draggedTab.parentNode != this || event.shiftKey) {
          this.selectedItem = draggedTabCopy;
        }
      } else if (draggedTab && draggedTab.parentNode == this) {
        let oldTranslateX = Math.round(draggedTab._dragData.translateX);
        let tabWidth = Math.round(draggedTab._dragData.tabWidth);
        let translateOffset = oldTranslateX % tabWidth;
        let newTranslateX = oldTranslateX - translateOffset;
        if (oldTranslateX > 0 && translateOffset > tabWidth / 2) {
          newTranslateX += tabWidth;
        } else if (oldTranslateX < 0 && -translateOffset > tabWidth / 2) {
          newTranslateX -= tabWidth;
        }

        let dropIndex = "animDropIndex" in draggedTab._dragData &&
          draggedTab._dragData.animDropIndex;
        let incrementDropIndex = true;
        if (dropIndex && dropIndex > movingTabs[0]._tPos) {
          dropIndex--;
          incrementDropIndex = false;
        }

        let animate = gBrowser.animationsEnabled;
        if (oldTranslateX && oldTranslateX != newTranslateX && animate) {
          for (let tab of movingTabs) {
            tab.setAttribute("tabdrop-samewindow", "true");
            tab.style.transform = "translateX(" + newTranslateX + "px)";
            let onTransitionEnd = transitionendEvent => {
              if (transitionendEvent.propertyName != "transform" ||
                transitionendEvent.originalTarget != tab) {
                return;
              }
              tab.removeEventListener("transitionend", onTransitionEnd);

              tab.removeAttribute("tabdrop-samewindow");

              this._finishAnimateTabMove();
              if (dropIndex !== false) {
                gBrowser.moveTabTo(tab, dropIndex);
                if (incrementDropIndex)
                  dropIndex++;
              }

              gBrowser.syncThrobberAnimations(tab);
            };
            tab.addEventListener("transitionend", onTransitionEnd);
          }
        } else {
          this._finishAnimateTabMove();
          if (dropIndex !== false) {
            for (let tab of movingTabs) {
              gBrowser.moveTabTo(tab, dropIndex);
              if (incrementDropIndex)
                dropIndex++;
            }
          }
        }
      } else if (draggedTab) {
        let newIndex = this._getDropIndex(event, false);
        let newTabs = [];
        for (let tab of movingTabs) {
          let newTab = gBrowser.adoptTab(tab, newIndex++, tab == draggedTab);
          newTabs.push(newTab);
        }

        // Restore tab selection
        gBrowser.addRangeToMultiSelectedTabs(newTabs[0], newTabs[newTabs.length - 1]);
      } else {
        // Pass true to disallow dropping javascript: or data: urls
        let links;
        try {
          links = browserDragAndDrop.dropLinks(event, true);
        } catch (ex) {}

        if (!links || links.length === 0)
          return;

        let inBackground = Services.prefs.getBoolPref("browser.tabs.loadInBackground");
        if (event.shiftKey)
          inBackground = !inBackground;

        let targetTab = this._getDragTargetTab(event, true);
        let userContextId = this.selectedItem.getAttribute("usercontextid");
        let replace = !!targetTab;
        let newIndex = this._getDropIndex(event, true);
        let urls = links.map(link => link.url);

        let triggeringPrincipal = browserDragAndDrop.getTriggeringPrincipal(event);

        (async () => {
          if (urls.length >= Services.prefs.getIntPref("browser.tabs.maxOpenBeforeWarn")) {
            // Sync dialog cannot be used inside drop event handler.
            let answer = await OpenInTabsUtils.promiseConfirmOpenInTabs(urls.length,
              window);
            if (!answer) {
              return;
            }
          }

          gBrowser.loadTabs(urls, {
            inBackground,
            replace,
            allowThirdPartyFixup: true,
            targetTab,
            newIndex,
            userContextId,
            triggeringPrincipal,
          });
        })();
      }

      if (draggedTab) {
        delete draggedTab._dragData;
      }
    });

    this.addEventListener("dragend", (event) => {
      var dt = event.dataTransfer;
      var draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);

      // Prevent this code from running if a tabdrop animation is
      // running since calling _finishAnimateTabMove would clear
      // any CSS transition that is running.
      if (draggedTab.hasAttribute("tabdrop-samewindow"))
        return;

      this._finishGroupSelectedTabs(draggedTab);
      this._finishAnimateTabMove();

      if (dt.mozUserCancelled || dt.dropEffect != "none" || this._isCustomizing) {
        delete draggedTab._dragData;
        return;
      }

      // Disable detach within the browser toolbox
      var eX = event.screenX;
      var eY = event.screenY;
      var wX = window.screenX;
      // check if the drop point is horizontally within the window
      if (eX > wX && eX < (wX + window.outerWidth)) {
        let bo = this.arrowScrollbox.boxObject;
        // also avoid detaching if the the tab was dropped too close to
        // the tabbar (half a tab)
        let endScreenY = bo.screenY + 1.5 * bo.height;
        if (eY < endScreenY && eY > window.screenY)
          return;
      }

      // screen.availLeft et. al. only check the screen that this window is on,
      // but we want to look at the screen the tab is being dropped onto.
      var screen = Cc["@mozilla.org/gfx/screenmanager;1"]
        .getService(Ci.nsIScreenManager)
        .screenForRect(eX, eY, 1, 1);
      var fullX = {},
        fullY = {},
        fullWidth = {},
        fullHeight = {};
      var availX = {},
        availY = {},
        availWidth = {},
        availHeight = {};
      // get full screen rect and available rect, both in desktop pix
      screen.GetRectDisplayPix(fullX, fullY, fullWidth, fullHeight);
      screen.GetAvailRectDisplayPix(availX, availY, availWidth, availHeight);

      // scale factor to convert desktop pixels to CSS px
      var scaleFactor =
        screen.contentsScaleFactor / screen.defaultCSSScaleFactor;
      // synchronize CSS-px top-left coordinates with the screen's desktop-px
      // coordinates, to ensure uniqueness across multiple screens
      // (compare the equivalent adjustments in nsGlobalWindow::GetScreenXY()
      // and related methods)
      availX.value = (availX.value - fullX.value) * scaleFactor + fullX.value;
      availY.value = (availY.value - fullY.value) * scaleFactor + fullY.value;
      availWidth.value *= scaleFactor;
      availHeight.value *= scaleFactor;

      // ensure new window entirely within screen
      var winWidth = Math.min(window.outerWidth, availWidth.value);
      var winHeight = Math.min(window.outerHeight, availHeight.value);
      var left = Math.min(Math.max(eX - draggedTab._dragData.offsetX, availX.value),
        availX.value + availWidth.value - winWidth);
      var top = Math.min(Math.max(eY - draggedTab._dragData.offsetY, availY.value),
        availY.value + availHeight.value - winHeight);

      delete draggedTab._dragData;

      if (gBrowser.tabs.length == 1) {
        // resize _before_ move to ensure the window fits the new screen.  if
        // the window is too large for its screen, the window manager may do
        // automatic repositioning.
        window.resizeTo(winWidth, winHeight);
        window.moveTo(left, top);
        window.focus();
      } else {
        let props = { screenX: left, screenY: top, suppressanimation: 1 };
        if (AppConstants.platform != "win") {
          props.outerWidth = winWidth;
          props.outerHeight = winHeight;
        }
        gBrowser.replaceTabsWithWindow(draggedTab, props);
      }
      event.stopPropagation();
    });

    this.addEventListener("dragexit", (event) => {
      this._dragTime = 0;

      // This does not work at all (see bug 458613)
      var target = event.relatedTarget;
      while (target && target != this)
        target = target.parentNode;
      if (target)
        return;

      this._tabDropIndicator.collapsed = true;
      event.stopPropagation();
    });

  }

  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox class="tab-drop-indicator-box">
        <image class="tab-drop-indicator" anonid="tab-drop-indicator" collapsed="true"></image>
      </hbox>
      <arrowscrollbox anonid="arrowscrollbox" orient="horizontal" flex="1" style="min-width: 1px;" clicktoscroll="true" class="tabbrowser-arrowscrollbox">
        <children includes="tab"></children>
        <children></children>
        <toolbarbutton class="tabs-newtab-button toolbarbutton-1" anonid="tabs-newtab-button" command="cmd_newNavigatorTab" onclick="checkForMiddleClick(this, event);" tooltip="dynamic-shortcut-tooltip"></toolbarbutton>
        <spacer class="closing-tabs-spacer" anonid="closing-tabs-spacer" style="width: 0;"></spacer>
      </arrowscrollbox>
    `));
    this.tabbox = document.getElementById("tabbrowser-tabbox");

    this.contextMenu = document.getElementById("tabContextMenu");

    this.arrowScrollbox = document.getAnonymousElementByAttribute(this, "anonid", "arrowscrollbox");

    this._firstTab = null;

    this._lastTab = null;

    this._beforeSelectedTab = null;

    this._beforeHoveredTab = null;

    this._afterHoveredTab = null;

    this._hoveredTab = null;

    this._blockDblClick = false;

    this._tabDropIndicator = document.getAnonymousElementByAttribute(this, "anonid", "tab-drop-indicator");

    this._dragOverDelay = 350;

    this._dragTime = 0;

    this._closeButtonsUpdatePending = false;

    this._closingTabsSpacer = document.getAnonymousElementByAttribute(this, "anonid", "closing-tabs-spacer");

    this._tabDefaultMaxWidth = NaN;

    this._lastTabClosedByMouse = false;

    this._hasTabTempMaxWidth = false;

    this._lastNumPinned = 0;

    this._pinnedTabsLayoutCache = null;

    this._animateElement = this.arrowScrollbox._scrollButtonDown;

    this._tabClipWidth = Services.prefs.getIntPref("browser.tabs.tabClipWidth");
    this._hiddenSoundPlayingTabs = new Set();

    let strId = PrivateBrowsingUtils.isWindowPrivate(window) ?
      "emptyPrivateTabTitle" : "emptyTabTitle";
    this.emptyTabTitle = gTabBrowserBundle.GetStringFromName("tabs." + strId);

    var tab = this.firstElementChild;
    tab.label = this.emptyTabTitle;

    window.addEventListener("resize", this);

    Services.prefs.addObserver("privacy.userContext", this);
    this.observe(null, "nsPref:changed", "privacy.userContext.enabled");

    XPCOMUtils.defineLazyPreferenceGetter(this, "_tabMinWidthPref",
      "browser.tabs.tabMinWidth", null,
      (pref, prevValue, newValue) => this._tabMinWidth = newValue,
      newValue => {
        const LIMIT = 50;
        return Math.max(newValue, LIMIT);
      },
    );

    this._tabMinWidth = this._tabMinWidthPref;

    XPCOMUtils.defineLazyPreferenceGetter(this, "_multiselectEnabledPref",
      "browser.tabs.multiselect", null,
      (pref, prevValue, newValue) => this._multiselectEnabled = newValue);
    this._multiselectEnabled = this._multiselectEnabledPref;

    this._setPositionalAttributes();

    CustomizableUI.addListener(this);
    this._updateNewTabVisibility();

    XPCOMUtils.defineLazyPreferenceGetter(this, "_closeTabByDblclick",
      "browser.tabs.closeTabByDblclick", false);

    if (gMultiProcessBrowser) {
      this.tabbox.tabpanels.setAttribute("async", "true");
    }

  }

  set _tabMinWidth(val) {
    this.style.setProperty("--tab-min-width", val + "px");
    return val;
  }

  set _multiselectEnabled(val) {
    // Unlike boolean HTML attributes, the value of boolean ARIA attributes actually matters.
    this.setAttribute("aria-multiselectable", !!val);
    return val;
  }

  get _multiselectEnabled() {
    return this.getAttribute("aria-multiselectable") == "true";
  }

  get _isCustomizing() {
    return document.documentElement.getAttribute("customizing") == "true";
  }

  observe(aSubject, aTopic, aData) {
    switch (aTopic) {
      case "nsPref:changed":
        // This is has to deal with changes in
        // privacy.userContext.enabled and
        // privacy.userContext.longPressBehavior.
        let containersEnabled = Services.prefs.getBoolPref("privacy.userContext.enabled") &&
          !PrivateBrowsingUtils.isWindowPrivate(window);

        // This pref won't change so often, so just recreate the menu.
        let longPressBehavior = Services.prefs.getIntPref("privacy.userContext.longPressBehavior");

        // If longPressBehavior pref is set to 0 (or any invalid value)
        // long press menu is disabled.
        if (containersEnabled && (longPressBehavior <= 0 || longPressBehavior > 2)) {
          containersEnabled = false;
        }

        const newTab = document.getElementById("new-tab-button");
        const newTab2 = document.getAnonymousElementByAttribute(this, "anonid", "tabs-newtab-button");

        for (let parent of [newTab, newTab2]) {
          if (!parent)
            continue;

          gClickAndHoldListenersOnElement.remove(parent);
          parent.removeAttribute("type");
          if (parent.firstElementChild) {
            parent.firstElementChild.remove();
          }

          if (containersEnabled) {
            let popup = document.createElementNS(
              "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
              "menupopup");
            if (parent.id) {
              popup.id = "newtab-popup";
            } else {
              popup.setAttribute("anonid", "newtab-popup");
            }
            popup.className = "new-tab-popup";
            popup.setAttribute("position", "after_end");
            popup.addEventListener("popupshowing", event => {
              createUserContextMenu(event, {
                useAccessKeys: false,
                showDefaultTab: Services.prefs.getIntPref("privacy.userContext.longPressBehavior") == 1,
              });
            });
            parent.appendChild(popup);

            // longPressBehavior == 2 means that the menu is shown after X
            // millisecs. Otherwise, with 1, the menu is open immediatelly.
            if (longPressBehavior == 2) {
              gClickAndHoldListenersOnElement.add(parent);
            }

            parent.setAttribute("type", "menu");
          }
        }

        break;
    }
  }

  _getVisibleTabs() {
    // Cannot access gBrowser before it's initialized.
    if (!gBrowser) {
      return [this.firstElementChild];
    }

    return gBrowser.visibleTabs;
  }

  _setPositionalAttributes() {
    let visibleTabs = this._getVisibleTabs();
    if (!visibleTabs.length) {
      return;
    }
    let selectedTab = this.selectedItem;
    let selectedIndex = visibleTabs.indexOf(selectedTab);
    if (this._beforeSelectedTab) {
      this._beforeSelectedTab.removeAttribute("beforeselected-visible");
    }

    if (selectedTab.closing || selectedIndex <= 0) {
      this._beforeSelectedTab = null;
    } else {
      let beforeSelectedTab = visibleTabs[selectedIndex - 1];
      let separatedByScrollButton = this.getAttribute("overflow") == "true" &&
        beforeSelectedTab.pinned && !selectedTab.pinned;
      if (!separatedByScrollButton) {
        this._beforeSelectedTab = beforeSelectedTab;
        this._beforeSelectedTab.setAttribute("beforeselected-visible",
          "true");
      }
    }

    if (this._firstTab)
      this._firstTab.removeAttribute("first-visible-tab");
    this._firstTab = visibleTabs[0];
    this._firstTab.setAttribute("first-visible-tab", "true");
    if (this._lastTab)
      this._lastTab.removeAttribute("last-visible-tab");
    this._lastTab = visibleTabs[visibleTabs.length - 1];
    this._lastTab.setAttribute("last-visible-tab", "true");

    let hoveredTab = this._hoveredTab;
    if (hoveredTab) {
      hoveredTab._mouseleave();
    }
    hoveredTab = this.querySelector("tab:hover");
    if (hoveredTab) {
      hoveredTab._mouseenter();
    }

    // Update before-multiselected attributes.
    // gBrowser may not be initialized yet, so avoid using it
    for (let i = 0; i < visibleTabs.length - 1; i++) {
      let tab = visibleTabs[i];
      let nextTab = visibleTabs[i + 1];
      tab.removeAttribute("before-multiselected");
      if (nextTab.multiselected) {
        tab.setAttribute("before-multiselected", "true");
      }
    }
  }

  _updateCloseButtons() {
    // If we're overflowing, tabs are at their minimum widths.
    if (this.getAttribute("overflow") == "true") {
      this.setAttribute("closebuttons", "activetab");
      return;
    }

    if (this._closeButtonsUpdatePending) {
      return;
    }
    this._closeButtonsUpdatePending = true;

    // Wait until after the next paint to get current layout data from
    // getBoundsWithoutFlushing.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        this._closeButtonsUpdatePending = false;

        // The scrollbox may have started overflowing since we checked
        // overflow earlier, so check again.
        if (this.getAttribute("overflow") == "true") {
          this.setAttribute("closebuttons", "activetab");
          return;
        }

        // Check if tab widths are below the threshold where we want to
        // remove close buttons from background tabs so that people don't
        // accidentally close tabs by selecting them.
        let rect = ele => {
          return window.windowUtils.getBoundsWithoutFlushing(ele);
        };
        let tab = this._getVisibleTabs()[gBrowser._numPinnedTabs];
        if (tab && rect(tab).width <= this._tabClipWidth) {
          this.setAttribute("closebuttons", "activetab");
        } else {
          this.removeAttribute("closebuttons");
        }
      });
    });
  }

  _updateHiddenTabsStatus() {
    if (gBrowser.visibleTabs.length < gBrowser.tabs.length) {
      this.setAttribute("hashiddentabs", "true");
    } else {
      this.removeAttribute("hashiddentabs");
    }
  }

  _handleTabSelect(aInstant) {
    let selectedTab = this.selectedItem;
    if (this.getAttribute("overflow") == "true")
      this.arrowScrollbox.ensureElementIsVisible(selectedTab, aInstant);

    selectedTab._notselectedsinceload = false;
  }

  /**
   * Try to keep the active tab's close button under the mouse cursor
   */
  _lockTabSizing(aTab, aTabWidth) {
    let tabs = this._getVisibleTabs();
    if (!tabs.length) {
      return;
    }

    var isEndTab = (aTab._tPos > tabs[tabs.length - 1]._tPos);

    if (!this._tabDefaultMaxWidth) {
      this._tabDefaultMaxWidth =
        parseFloat(window.getComputedStyle(aTab).maxWidth);
    }
    this._lastTabClosedByMouse = true;

    if (this.getAttribute("overflow") == "true") {
      // Don't need to do anything if we're in overflow mode and aren't scrolled
      // all the way to the right, or if we're closing the last tab.
      if (isEndTab || !this.arrowScrollbox._scrollButtonDown.disabled) {
        return;
      }
      // If the tab has an owner that will become the active tab, the owner will
      // be to the left of it, so we actually want the left tab to slide over.
      // This can't be done as easily in non-overflow mode, so we don't bother.
      if (aTab.owner) {
        return;
      }
      this._expandSpacerBy(aTabWidth);
    } else { // non-overflow mode
      // Locking is neither in effect nor needed, so let tabs expand normally.
      if (isEndTab && !this._hasTabTempMaxWidth) {
        return;
      }
      let numPinned = gBrowser._numPinnedTabs;
      // Force tabs to stay the same width, unless we're closing the last tab,
      // which case we need to let them expand just enough so that the overall
      // tabbar width is the same.
      if (isEndTab) {
        let numNormalTabs = tabs.length - numPinned;
        aTabWidth = aTabWidth * (numNormalTabs + 1) / numNormalTabs;
        if (aTabWidth > this._tabDefaultMaxWidth) {
          aTabWidth = this._tabDefaultMaxWidth;
        }
      }
      aTabWidth += "px";
      let tabsToReset = [];
      for (let i = numPinned; i < tabs.length; i++) {
        let tab = tabs[i];
        tab.style.setProperty("max-width", aTabWidth, "important");
        if (!isEndTab) { // keep tabs the same width
          tab.style.transition = "none";
          tabsToReset.push(tab);
        }
      }

      if (tabsToReset.length) {
        window.promiseDocumentFlushed(() => {}).then(() => {
          window.requestAnimationFrame(() => {
            for (let tab of tabsToReset) {
              tab.style.transition = "";
            }
          });
        });
      }

      this._hasTabTempMaxWidth = true;
      gBrowser.addEventListener("mousemove", this);
      window.addEventListener("mouseout", this);
    }
  }

  _expandSpacerBy(pixels) {
    let spacer = this._closingTabsSpacer;
    spacer.style.width = parseFloat(spacer.style.width) + pixels + "px";
    this.setAttribute("using-closing-tabs-spacer", "true");
    gBrowser.addEventListener("mousemove", this);
    window.addEventListener("mouseout", this);
  }

  _unlockTabSizing() {
    gBrowser.removeEventListener("mousemove", this);
    window.removeEventListener("mouseout", this);

    if (this._hasTabTempMaxWidth) {
      this._hasTabTempMaxWidth = false;
      let tabs = this._getVisibleTabs();
      for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.maxWidth = "";
      }
    }

    if (this.hasAttribute("using-closing-tabs-spacer")) {
      this.removeAttribute("using-closing-tabs-spacer");
      this._closingTabsSpacer.style.width = 0;
    }
  }

  uiDensityChanged() {
    this._positionPinnedTabs();
    this._updateCloseButtons();
    this._handleTabSelect(true);
  }

  _positionPinnedTabs() {
    let numPinned = gBrowser._numPinnedTabs;
    let doPosition = this.getAttribute("overflow") == "true" &&
      this._getVisibleTabs().length > numPinned &&
      numPinned > 0;

    if (doPosition) {
      this.setAttribute("positionpinnedtabs", "true");

      let layoutData = this._pinnedTabsLayoutCache;
      let uiDensity = document.documentElement.getAttribute("uidensity");
      if (!layoutData ||
        layoutData.uiDensity != uiDensity) {
        let arrowScrollbox = this.arrowScrollbox;
        layoutData = this._pinnedTabsLayoutCache = {
          uiDensity,
          pinnedTabWidth: this.children[0].getBoundingClientRect().width,
          scrollButtonWidth: arrowScrollbox._scrollButtonDown.getBoundingClientRect().width,
        };
      }

      let width = 0;
      for (let i = numPinned - 1; i >= 0; i--) {
        let tab = this.children[i];
        width += layoutData.pinnedTabWidth;
        tab.style.setProperty("margin-inline-start", -(width + layoutData.scrollButtonWidth) + "px", "important");
        tab._pinnedUnscrollable = true;
      }
      this.style.paddingInlineStart = width + "px";
    } else {
      this.removeAttribute("positionpinnedtabs");

      for (let i = 0; i < numPinned; i++) {
        let tab = this.children[i];
        tab.style.marginInlineStart = "";
        tab._pinnedUnscrollable = false;
      }

      this.style.paddingInlineStart = "";
    }

    if (this._lastNumPinned != numPinned) {
      this._lastNumPinned = numPinned;
      this._handleTabSelect(true);
    }
  }

  _animateTabMove(event) {
    let draggedTab = event.dataTransfer.mozGetDataAt(TAB_DROP_TYPE, 0);
    let movingTabs = draggedTab._dragData.movingTabs;

    if (this.getAttribute("movingtab") != "true") {
      this.setAttribute("movingtab", "true");
      this.parentNode.setAttribute("movingtab", "true");
      if (!draggedTab.multiselected)
        this.selectedItem = draggedTab;
    }

    if (!("animLastScreenX" in draggedTab._dragData))
      draggedTab._dragData.animLastScreenX = draggedTab._dragData.screenX;

    let screenX = event.screenX;
    if (screenX == draggedTab._dragData.animLastScreenX)
      return;

    // Direction of the mouse movement.
    let ltrMove = screenX > draggedTab._dragData.animLastScreenX;

    draggedTab._dragData.animLastScreenX = screenX;

    let rtl = (window.getComputedStyle(this).direction == "rtl");
    let pinned = draggedTab.pinned;
    let numPinned = gBrowser._numPinnedTabs;
    let tabs = this._getVisibleTabs()
      .slice(pinned ? 0 : numPinned,
        pinned ? numPinned : undefined);

    if (rtl) {
      tabs.reverse();
      // Copy moving tabs array to avoid infinite reversing.
      movingTabs = [...movingTabs].reverse();
    }
    let tabWidth = draggedTab.getBoundingClientRect().width;
    let shiftWidth = tabWidth * movingTabs.length;
    draggedTab._dragData.tabWidth = tabWidth;

    // Move the dragged tab based on the mouse position.

    let leftTab = tabs[0];
    let rightTab = tabs[tabs.length - 1];
    let rightMovingTabScreenX = movingTabs[movingTabs.length - 1].boxObject.screenX;
    let leftMovingTabScreenX = movingTabs[0].boxObject.screenX;
    let translateX = screenX - draggedTab._dragData.screenX;
    if (!pinned) {
      translateX += this.arrowScrollbox._scrollbox.scrollLeft - draggedTab._dragData.scrollX;
    }
    let leftBound = leftTab.boxObject.screenX - leftMovingTabScreenX;
    let rightBound = (rightTab.boxObject.screenX + rightTab.boxObject.width) -
      (rightMovingTabScreenX + tabWidth);
    translateX = Math.min(Math.max(translateX, leftBound), rightBound);

    for (let tab of movingTabs) {
      tab.style.transform = "translateX(" + translateX + "px)";
    }

    draggedTab._dragData.translateX = translateX;

    // Determine what tab we're dragging over.
    // * Single tab dragging: Point of reference is the center of the dragged tab. If that
    //   point touches a background tab, the dragged tab would take that
    //   tab's position when dropped.
    // * Multiple tabs dragging: All dragged tabs are one "giant" tab with two
    //   points of reference (center of tabs on the extremities). When
    //   mouse is moving from left to right, the right reference gets activated,
    //   otherwise the left reference will be used. Everything else works the same
    //   as single tab dragging.
    // * We're doing a binary search in order to reduce the amount of
    //   tabs we need to check.

    tabs = tabs.filter(t => !movingTabs.includes(t) || t == draggedTab);
    let leftTabCenter = leftMovingTabScreenX + translateX + tabWidth / 2;
    let rightTabCenter = rightMovingTabScreenX + translateX + tabWidth / 2;
    let tabCenter = ltrMove ? rightTabCenter : leftTabCenter;
    let newIndex = -1;
    let oldIndex = "animDropIndex" in draggedTab._dragData ?
      draggedTab._dragData.animDropIndex : movingTabs[0]._tPos;
    let low = 0;
    let high = tabs.length - 1;
    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      if (tabs[mid] == draggedTab && ++mid > high)
        break;
      let boxObject = tabs[mid].boxObject;
      screenX = boxObject.screenX + getTabShift(tabs[mid], oldIndex);
      if (screenX > tabCenter) {
        high = mid - 1;
      } else if (screenX + boxObject.width < tabCenter) {
        low = mid + 1;
      } else {
        newIndex = tabs[mid]._tPos;
        break;
      }
    }
    if (newIndex >= oldIndex)
      newIndex++;
    if (newIndex < 0 || newIndex == oldIndex)
      return;
    draggedTab._dragData.animDropIndex = newIndex;

    // Shift background tabs to leave a gap where the dragged tab
    // would currently be dropped.

    for (let tab of tabs) {
      if (tab != draggedTab) {
        let shift = getTabShift(tab, newIndex);
        tab.style.transform = shift ? "translateX(" + shift + "px)" : "";
      }
    }

    function getTabShift(tab, dropIndex) {
      if (tab._tPos < draggedTab._tPos && tab._tPos >= dropIndex)
        return (rtl ? -shiftWidth : shiftWidth);
      if (tab._tPos > draggedTab._tPos && tab._tPos < dropIndex)
        return (rtl ? shiftWidth : -shiftWidth);
      return 0;
    }
  }

  _finishAnimateTabMove() {
    if (this.getAttribute("movingtab") != "true") {
      return;
    }

    for (let tab of this._getVisibleTabs()) {
      tab.style.transform = "";
    }

    this.removeAttribute("movingtab");
    this.parentNode.removeAttribute("movingtab");

    this._handleTabSelect();
  }

  /**
   * Regroup all selected tabs around the
   * tab in param
   */
  _groupSelectedTabs(tab) {
    let draggedTabPos = tab._tPos;
    let selectedTabs = gBrowser.selectedTabs;
    let animate = gBrowser.animationsEnabled;

    tab.groupingTabsData = {
      finished: !animate,
    };

    // Animate left selected tabs

    let insertAtPos = draggedTabPos - 1;
    for (let i = selectedTabs.indexOf(tab) - 1; i > -1; i--) {
      let movingTab = selectedTabs[i];
      insertAtPos = newIndex(movingTab, insertAtPos);

      if (animate) {
        movingTab.groupingTabsData = {};
        addAnimationData(movingTab, insertAtPos, "left");
      } else {
        gBrowser.moveTabTo(movingTab, insertAtPos);
      }
      insertAtPos--;
    }

    // Animate right selected tabs

    insertAtPos = draggedTabPos + 1;
    for (let i = selectedTabs.indexOf(tab) + 1; i < selectedTabs.length; i++) {
      let movingTab = selectedTabs[i];
      insertAtPos = newIndex(movingTab, insertAtPos);

      if (animate) {
        movingTab.groupingTabsData = {};
        addAnimationData(movingTab, insertAtPos, "right");
      } else {
        gBrowser.moveTabTo(movingTab, insertAtPos);
      }
      insertAtPos++;
    }

    // Slide the relevant tabs to their new position.
    let rtl = Services.locale.isAppLocaleRTL ? -1 : 1;
    for (let t of this._getVisibleTabs()) {
      if (t.groupingTabsData && t.groupingTabsData.translateX) {
        let translateX = rtl * t.groupingTabsData.translateX;
        t.style.transform = "translateX(" + translateX + "px)";
      }
    }

    function newIndex(aTab, index) {
      // Don't allow mixing pinned and unpinned tabs.
      if (aTab.pinned) {
        return Math.min(index, gBrowser._numPinnedTabs - 1);
      }
      return Math.max(index, gBrowser._numPinnedTabs);
    }

    function addAnimationData(movingTab, movingTabNewIndex, side) {
      let movingTabOldIndex = movingTab._tPos;

      if (movingTabOldIndex == movingTabNewIndex) {
        // movingTab is already at the right position
        // and thus don't need to be animated.
        return;
      }

      let movingTabWidth = movingTab.boxObject.width;
      let shift = (movingTabNewIndex - movingTabOldIndex) * movingTabWidth;

      movingTab.groupingTabsData.animate = true;
      movingTab.setAttribute("tab-grouping", "true");

      movingTab.groupingTabsData.translateX = shift;

      let onTransitionEnd = transitionendEvent => {
        if (transitionendEvent.propertyName != "transform" ||
          transitionendEvent.originalTarget != movingTab) {
          return;
        }
        movingTab.removeEventListener("transitionend", onTransitionEnd);
        movingTab.groupingTabsData.newIndex = movingTabNewIndex;
        movingTab.groupingTabsData.animate = false;
      };

      movingTab.addEventListener("transitionend", onTransitionEnd);

      // Add animation data for tabs between movingTab (selected
      // tab moving towards the dragged tab) and draggedTab.
      // Those tabs in the middle should move in
      // the opposite direction of movingTab.

      let lowerIndex = Math.min(movingTabOldIndex, draggedTabPos);
      let higherIndex = Math.max(movingTabOldIndex, draggedTabPos);

      for (let i = lowerIndex + 1; i < higherIndex; i++) {
        let middleTab = gBrowser.visibleTabs[i];

        if (middleTab.pinned != movingTab.pinned) {
          // Don't mix pinned and unpinned tabs
          break;
        }

        if (middleTab.multiselected) {
          // Skip because this selected tab should
          // be shifted towards the dragged Tab.
          continue;
        }

        if (!middleTab.groupingTabsData || !middleTab.groupingTabsData.translateX) {
          middleTab.groupingTabsData = { translateX: 0 };
        }
        if (side == "left") {
          middleTab.groupingTabsData.translateX -= movingTabWidth;
        } else {
          middleTab.groupingTabsData.translateX += movingTabWidth;
        }

        middleTab.setAttribute("tab-grouping", "true");
      }
    }
  }

  _finishGroupSelectedTabs(tab) {
    if (!tab.groupingTabsData || tab.groupingTabsData.finished)
      return;

    tab.groupingTabsData.finished = true;

    let selectedTabs = gBrowser.selectedTabs;
    let tabIndex = selectedTabs.indexOf(tab);

    // Moving left tabs
    for (let i = tabIndex - 1; i > -1; i--) {
      let movingTab = selectedTabs[i];
      if (movingTab.groupingTabsData.newIndex) {
        gBrowser.moveTabTo(movingTab, movingTab.groupingTabsData.newIndex);
      }
    }

    // Moving right tabs
    for (let i = tabIndex + 1; i < selectedTabs.length; i++) {
      let movingTab = selectedTabs[i];
      if (movingTab.groupingTabsData.newIndex) {
        gBrowser.moveTabTo(movingTab, movingTab.groupingTabsData.newIndex);
      }
    }

    for (let t of this._getVisibleTabs()) {
      t.style.transform = "";
      t.removeAttribute("tab-grouping");
      delete t.groupingTabsData;
    }
  }

  _isGroupTabsAnimationOver() {
    for (let tab of gBrowser.selectedTabs) {
      if (tab.groupingTabsData && tab.groupingTabsData.animate)
        return false;
    }
    return true;
  }

  handleEvent(aEvent) {
    switch (aEvent.type) {
      case "resize":
        if (aEvent.target != window)
          break;

        this._updateCloseButtons();
        this._handleTabSelect(true);
        break;
      case "mouseout":
        // If the "related target" (the node to which the pointer went) is not
        // a child of the current document, the mouse just left the window.
        let relatedTarget = aEvent.relatedTarget;
        if (relatedTarget && relatedTarget.ownerDocument == document)
          break;
      case "mousemove":
        if (document.getElementById("tabContextMenu").state != "open")
          this._unlockTabSizing();
        break;
    }
  }

  _notifyBackgroundTab(aTab) {
    if (aTab.pinned || aTab.hidden)
      return;

    var scrollRect = this.arrowScrollbox.scrollClientRect;
    var tab = aTab.getBoundingClientRect();

    // DOMRect left/right properties are immutable.
    tab = { left: tab.left, right: tab.right };

    // Is the new tab already completely visible?
    if (scrollRect.left <= tab.left && tab.right <= scrollRect.right)
      return;

    if (this.arrowScrollbox.smoothScroll) {
      let selectedTab = this.selectedItem;
      let selected = !selectedTab.pinned &&
        selectedTab.getBoundingClientRect();

      // Can we make both the new tab and the selected tab completely visible?
      if (!selected ||
        Math.max(tab.right - selected.left, selected.right - tab.left) <=
        scrollRect.width) {
        this.arrowScrollbox.ensureElementIsVisible(aTab);
        return;
      }

      this.arrowScrollbox.scrollByPixels(this.arrowScrollbox._isRTLScrollbox ?
        selected.right - scrollRect.right :
        selected.left - scrollRect.left);
    }

    if (!this._animateElement.hasAttribute("highlight")) {
      this._animateElement.setAttribute("highlight", "true");
      setTimeout(function(ele) {
        ele.removeAttribute("highlight");
      }, 150, this._animateElement);
    }
  }

  _getDragTargetTab(event, isLink) {
    let tab = event.target.localName == "tab" ? event.target : null;
    if (tab && isLink) {
      let boxObject = tab.boxObject;
      if (event.screenX < boxObject.screenX + boxObject.width * .25 ||
        event.screenX > boxObject.screenX + boxObject.width * .75)
        return null;
    }
    return tab;
  }

  _getDropIndex(event, isLink) {
    var tabs = this.children;
    var tab = this._getDragTargetTab(event, isLink);
    if (window.getComputedStyle(this).direction == "ltr") {
      for (let i = tab ? tab._tPos : 0; i < tabs.length; i++)
        if (event.screenX < tabs[i].boxObject.screenX + tabs[i].boxObject.width / 2)
          return i;
    } else {
      for (let i = tab ? tab._tPos : 0; i < tabs.length; i++)
        if (event.screenX > tabs[i].boxObject.screenX + tabs[i].boxObject.width / 2)
          return i;
    }
    return tabs.length;
  }

  _getDropEffectForTabDrag(event) {
    var dt = event.dataTransfer;

    let isMovingTabs = dt.mozItemCount > 0;
    for (let i = 0; i < dt.mozItemCount; i++) {
      // tabs are always added as the first type
      let types = dt.mozTypesAt(0);
      if (types[0] != TAB_DROP_TYPE) {
        isMovingTabs = false;
        break;
      }
    }

    if (isMovingTabs) {
      let sourceNode = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
      if (sourceNode instanceof XULElement &&
        sourceNode.localName == "tab" &&
        sourceNode.ownerGlobal.isChromeWindow &&
        sourceNode.ownerDocument.documentElement.getAttribute("windowtype") == "navigator:browser" &&
        sourceNode.ownerGlobal.gBrowser.tabContainer == sourceNode.parentNode) {
        // Do not allow transfering a private tab to a non-private window
        // and vice versa.
        if (PrivateBrowsingUtils.isWindowPrivate(window) !=
          PrivateBrowsingUtils.isWindowPrivate(sourceNode.ownerGlobal))
          return "none";

        if (window.gMultiProcessBrowser !=
          sourceNode.ownerGlobal.gMultiProcessBrowser)
          return "none";

        return dt.dropEffect == "copy" ? "copy" : "move";
      }
    }

    if (browserDragAndDrop.canDropLink(event)) {
      return "link";
    }
    return "none";
  }

  _handleNewTab(tab) {
    if (tab.parentNode != this) {
      return;
    }
    tab._fullyOpen = true;
    gBrowser.tabAnimationsInProgress--;

    this._updateCloseButtons();

    if (tab.getAttribute("selected") == "true") {
      this._handleTabSelect();
    } else if (!tab.hasAttribute("skipbackgroundnotify")) {
      this._notifyBackgroundTab(tab);
    }

    // XXXmano: this is a temporary workaround for bug 345399
    // We need to manually update the scroll buttons disabled state
    // if a tab was inserted to the overflow area or removed from it
    // without any scrolling and when the tabbar has already
    // overflowed.
    this.arrowScrollbox._updateScrollButtonsDisabledState();

    // Preload the next about:newtab if there isn't one already.
    gBrowser._createPreloadBrowser();
  }

  _canAdvanceToTab(aTab) {
    return !aTab.closing;
  }

  getRelatedElement(aTab) {
    if (!aTab) {
      return null;
    }

    // Cannot access gBrowser before it's initialized.
    if (!gBrowser) {
      return this.tabbox.tabpanels.firstElementChild;
    }

    // If the tab's browser is lazy, we need to `_insertBrowser` in order
    // to have a linkedPanel.  This will also serve to bind the browser
    // and make it ready to use when the tab is selected.
    gBrowser._insertBrowser(aTab);
    return document.getElementById(aTab.linkedPanel);
  }

  _updateNewTabVisibility() {
    // Helper functions to help deal with customize mode wrapping some items
    let wrap = n => n.parentNode.localName == "toolbarpaletteitem" ? n.parentNode : n;
    let unwrap = n => n && n.localName == "toolbarpaletteitem" ? n.firstElementChild : n;

    // Starting from the tabs element, find the next sibling that:
    // - isn't hidden; and
    // - isn't one of the titlebar placeholder elements; and
    // - isn't the all-tabs button.
    // If it's the new tab button, consider the new tab button adjacent to the tabs.
    // If the new tab button is marked as adjacent and the tabstrip doesn't
    // overflow, we'll display the 'new tab' button inline in the tabstrip.
    // In all other cases, the separate new tab button is displayed in its
    // customized location.
    let sib = this;
    do {
      sib = unwrap(wrap(sib).nextElementSibling);
    } while (sib && (sib.hidden ||
        sib.getAttribute("skipintoolbarset") == "true" ||
        sib.id == "alltabs-button"));

    const kAttr = "hasadjacentnewtabbutton";
    if (sib && sib.id == "new-tab-button") {
      this.setAttribute(kAttr, "true");
    } else {
      this.removeAttribute(kAttr);
    }
  }

  onWidgetAfterDOMChange(aNode, aNextNode, aContainer) {
    if (aContainer.ownerDocument == document &&
      aContainer.id == "TabsToolbar") {
      this._updateNewTabVisibility();
    }
  }

  onAreaNodeRegistered(aArea, aContainer) {
    if (aContainer.ownerDocument == document &&
      aArea == "TabsToolbar") {
      this._updateNewTabVisibility();
    }
  }

  onAreaReset(aArea, aContainer) {
    this.onAreaNodeRegistered(aArea, aContainer);
  }

  _hiddenSoundPlayingStatusChanged(tab, opts) {
    let closed = opts && opts.closed;
    if (!closed && tab.soundPlaying && tab.hidden) {
      this._hiddenSoundPlayingTabs.add(tab);
      this.setAttribute("hiddensoundplaying", "true");
    } else {
      this._hiddenSoundPlayingTabs.delete(tab);
      if (this._hiddenSoundPlayingTabs.size == 0) {
        this.removeAttribute("hiddensoundplaying");
      }
    }
  }
  disconnectedCallback() {
    Services.prefs.removeObserver("privacy.userContext", this);

    CustomizableUI.removeListener(this);
  }
}

MozXULElement.implementCustomInterface(MozTabbrowserTabs, [Ci.nsIObserver]);
customElements.define("tabbrowser-tabs", MozTabbrowserTabs);

}
