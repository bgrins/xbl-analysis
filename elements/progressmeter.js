class XblProgressmeter extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<spacer class="progress-bar" xbl:inherits="mode">
</spacer>
<spacer class="progress-remainder" xbl:inherits="mode">
</spacer>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-progressmeter ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-progressmeter", XblProgressmeter);
