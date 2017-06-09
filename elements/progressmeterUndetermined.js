class XblProgressmeterUndetermined extends XblProgressmeter {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-progressmeter-undetermined";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-progressmeter-undetermined",
  XblProgressmeterUndetermined
);
