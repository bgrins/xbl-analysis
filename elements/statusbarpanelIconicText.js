class XblStatusbarpanelIconicText extends XblStatusbarpanel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<image class="statusbarpanel-icon" xbl:inherits="src,src=image">
</image>
<label class="statusbarpanel-text" xbl:inherits="value=label,crop">
</label>`;
    let comment = document.createComment(
      "Creating xbl-statusbarpanel-iconic-text"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-statusbarpanel-iconic-text",
  XblStatusbarpanelIconicText
);
