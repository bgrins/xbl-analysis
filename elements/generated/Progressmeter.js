class XblProgressmeter extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<spacer class="progress-bar" xbl:inherits="mode">
</spacer>
<spacer class="progress-remainder" xbl:inherits="mode">
</spacer>`;
    let comment = document.createComment("Creating xbl-progressmeter");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-progressmeter", XblProgressmeter);
