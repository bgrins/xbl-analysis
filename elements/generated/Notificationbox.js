class XblNotificationbox extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<stack xbl:inherits="hidden=notificationshidden" class="notificationbox-stack">
<spacer>
</spacer>
<children includes="notification">
</children>
</stack>
<children>
</children>`;
    let comment = document.createComment("Creating xbl-notificationbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-notificationbox", XblNotificationbox);
