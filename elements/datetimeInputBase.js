class XblDatetimeInputBase extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<div class="datetime-input-box-wrapper" anonid="input-box-wrapper" xbl:inherits="context,disabled,readonly">
<span class="datetime-input-edit-wrapper" anonid="edit-wrapper">
</span>
<button class="datetime-reset-button" anonid="reset-button" tabindex="-1" xbl:inherits="disabled">
</button>
</div>`;
    let comment = document.createComment("Creating xbl-datetime-input-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-datetime-input-base", XblDatetimeInputBase);
