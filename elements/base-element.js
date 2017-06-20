

// https://html.spec.whatwg.org/multipage/scripting.html#custom-elements-autonomous-example

class BaseElement extends HTMLElement {
  constructor() {
    super();
    this.observerConnector = new ObserverConnector(this);
    this.inheritsConnector = new InheritsConnector(this);
  }

  connectedCallback() {

  }

  disconnectedCallback() {

  }

  static get observedAttributes() { return ["observes"]; }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "observes") {
      this.observerConnector.watch(newValue);
    }
  }
}

function InheritsConnector(host) {
  this._host = host;
  this._nodesToAttributes = new Map();
  this.watch();
}
InheritsConnector.prototype.destroy = function() {

}
InheritsConnector.prototype.setInherits = function(node) {
  let inherits = node.getAttribute("inherits");
  if (inherits) {
    this._nodesToAttributes.set(node, inherits.split(','));
  }
}
InheritsConnector.prototype.copyAttribute = function(attributeName) {
  for (let [node, list] of this._nodesToAttributes.entries()) {
    // Handle both inherits="accesskey" and inherits="text=label"
    list.forEach(a => {
      if (a === attributeName) {
        node.setAttribute(a, this._host.getAttribute(a));
      } else if (a.endsWith('=' + attributeName)) {
        let mapFrom = a.split('=')[1];
        let mapTo = a.split('=')[0];
        node.setAttribute(mapTo, this._host.getAttribute(mapFrom));
      }
    });
  }
};

InheritsConnector.prototype.watch = function() {
  if (this._observer) {
    this._observer.disconnect();
    this._observer = null;
  }

  this._observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(added => {
          if (added.nodeType !== 1) {
            return;
          }
          this.setInherits(added);
          [...added.querySelectorAll("[inherits]")].forEach(child => this.setInherits(child));
          for (var i = 0; i < this._host.attributes.length; i++) {
            var attrib = this._host.attributes[i];
            if (attrib.name !== "id") {
              this.copyAttribute(attrib.name);
            }
          }
        });
      }

      if (mutation.type === "attributes" && mutation.target === this._host) {
        this.copyAttribute(mutation.attributeName);
      }
    });

    // this.copyAttributes();
  });
  this._observer.observe(this._host, {
    attributes: true,
    subtree: true,
    childList: true,
  });

}

function ObserverConnector(host) {
  this._host = host;
}
ObserverConnector.prototype.destroy = function() {

}

ObserverConnector.prototype.copyAttributes = function() {
  if (!this._observeTarget) {
    return;
  }

  for (var i = 0; i < this._observeTarget.attributes.length; i++) {
    var attrib = this._observeTarget.attributes[i];
    if (attrib.name !== "id") {
      this._host.setAttribute(attrib.name, attrib.value);
    }
  }
}

ObserverConnector.prototype.watch = function(targetID) {
  if (this._observer) {
    this._observer.disconnect();
    this._observer = null;
  }

  this._observeTarget = document.getElementById(targetID);
  if (this._observeTarget) {
    this._observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (!this._observeTarget.hasAttribute(mutation.attributeName)) {
          this.removeAttribute(mutation.attributeName);
        }
      });

      this.copyAttributes();
    });
    this._observer.observe(this._observeTarget, {
      attributes: true,
    });
    this.copyAttributes();
  }
}
