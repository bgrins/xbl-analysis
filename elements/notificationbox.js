class XblNotificationbox extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-notificationbox";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-notificationbox", XblNotificationbox);
