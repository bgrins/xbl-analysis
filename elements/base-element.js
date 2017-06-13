
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
  console.log("Addd node", node, inherits);
  if (inherits) {
    this._nodesToAttributes.set(node, inherits.split(','));
  }
}
InheritsConnector.prototype.watch = function() {
  if (this._observer) {
    this._observer.disconnect();
    this._observer = null;
  }

  function setInherits(node) {
  }
  this._observer = new MutationObserver(mutations => {
    console.log("Inherits changes", mutations);
    mutations.forEach(mutation => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(added => {
          if (added.nodeType !== 1) {
            return;
          }
          this.setInherits(added);
          [...added.querySelectorAll("[inherits]")].forEach(child => this.setInherits(child));
        });
      }

      if (mutation.type === "attributes" && mutation.target === this._host) {
        for (let [node, list] of this._nodesToAttributes.entries()) {
          console.log("attribute changed", node, list, list.includes(mutation.attributeName));

          // Handle both inherits="accesskey" and inherits="text=label"
          list.forEach(a => {
            console.log(a, mutation.attributeName);
            if (a === mutation.attributeName) {
              node.setAttribute(a, this._host.getAttribute(a));
            } else if (a.endsWith('=' + mutation.attributeName)) {
              let mapFrom = a.split('=')[1];
              let mapTo = a.split('=')[0];
              node.setAttribute(mapTo, this._host.getAttribute(mapFrom));
            }
          });
        }
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
      console.log("Observed changes", mutations);
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
