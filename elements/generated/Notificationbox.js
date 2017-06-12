class XblNotificationbox extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

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

  get notificationsHidden() {
    return this.getAttribute("notificationshidden") == "true";
  }
}
customElements.define("xbl-notificationbox", XblNotificationbox);
