class MozProgressmeterUndetermined extends MozProgressmeter {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <stack class="progress-remainder" flex="1" anonid="stack" style="overflow: -moz-hidden-unscrollable;">
        <spacer class="progress-bar" anonid="spacer" top="0" style="margin-right: -1000px;"></spacer>
      </stack>
    `));
    this._alive = true;

    this._init();
    this._setupEventListeners();
  }

  _init() {
    var stack =
      document.getAnonymousElementByAttribute(this, "anonid", "stack");
    var spacer =
      document.getAnonymousElementByAttribute(this, "anonid", "spacer");
    var isLTR =
      document.defaultView.getComputedStyle(this).direction == "ltr";
    var startTime = performance.now();
    var self = this;

    function nextStep(t) {
      try {
        var width = stack.boxObject.width;
        if (!width) {
          // Maybe we've been removed from the document.
          if (self._alive)
            requestAnimationFrame(nextStep);
          return;
        }

        var elapsedTime = t - startTime;

        // Width of chunk is 1/5 (determined by the ratio 2000:400) of the
        // total width of the progress bar. The left edge of the chunk
        // starts at -1 and moves all the way to 4. It covers the distance
        // in 2 seconds.
        var position = isLTR ? ((elapsedTime % 2000) / 400) - 1 :
          ((elapsedTime % 2000) / -400) + 4;

        width = width >> 2;
        spacer.height = stack.boxObject.height;
        spacer.width = width;
        spacer.left = width * position;

        requestAnimationFrame(nextStep);
      } catch (e) {}
    }
    requestAnimationFrame(nextStep);
  }

  _setupEventListeners() {

  }
}