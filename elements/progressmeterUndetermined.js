class XblProgressmeterUndetermined extends XblProgressmeter {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<stack class="progress-remainder" flex="1" anonid="stack" style="overflow: -moz-hidden-unscrollable;">
<spacer class="progress-bar" anonid="spacer" top="0" style="margin-right: -1000px;">
</spacer>
</stack>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-progressmeter-undetermined ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-progressmeter-undetermined",
  XblProgressmeterUndetermined
);
