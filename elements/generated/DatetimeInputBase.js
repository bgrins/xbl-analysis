class XblDatetimeInputBase extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<div class="datetime-input-box-wrapper" anonid="input-box-wrapper" inherits="context,disabled,readonly">
<span class="datetime-input-edit-wrapper" anonid="edit-wrapper">
</span>
<button class="datetime-reset-button" anonid="reset-button" tabindex="-1" inherits="disabled">
</button>
</div>`;
    let comment = document.createComment("Creating xbl-datetime-input-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-datetime-input-base", XblDatetimeInputBase);
