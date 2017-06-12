
// https://html.spec.whatwg.org/multipage/scripting.html#custom-elements-autonomous-example

class BaseElement extends HTMLElement {
  constructor() {
    super();
    this.observerConnector = new ObserverConnector(this);
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
