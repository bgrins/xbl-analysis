class XblColorpicker extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<vbox flex="1">
<hbox>
<image class="colorpickertile cp-light" color="#FFFFFF">
</image>
<image class="colorpickertile cp-light" color="#FFCCCC">
</image>
<image class="colorpickertile cp-light" color="#FFCC99">
</image>
<image class="colorpickertile cp-light" color="#FFFF99">
</image>
<image class="colorpickertile cp-light" color="#FFFFCC">
</image>
<image class="colorpickertile cp-light" color="#99FF99">
</image>
<image class="colorpickertile cp-light" color="#99FFFF">
</image>
<image class="colorpickertile cp-light" color="#CCFFFF">
</image>
<image class="colorpickertile cp-light" color="#CCCCFF">
</image>
<image class="colorpickertile cp-light" color="#FFCCFF">
</image>
</hbox>
<hbox>
<image class="colorpickertile" color="#CCCCCC">
</image>
<image class="colorpickertile" color="#FF6666">
</image>
<image class="colorpickertile" color="#FF9966">
</image>
<image class="colorpickertile cp-light" color="#FFFF66">
</image>
<image class="colorpickertile cp-light" color="#FFFF33">
</image>
<image class="colorpickertile cp-light" color="#66FF99">
</image>
<image class="colorpickertile cp-light" color="#33FFFF">
</image>
<image class="colorpickertile cp-light" color="#66FFFF">
</image>
<image class="colorpickertile" color="#9999FF">
</image>
<image class="colorpickertile" color="#FF99FF">
</image>
</hbox>
<hbox>
<image class="colorpickertile" color="#C0C0C0">
</image>
<image class="colorpickertile" color="#FF0000">
</image>
<image class="colorpickertile" color="#FF9900">
</image>
<image class="colorpickertile" color="#FFCC66">
</image>
<image class="colorpickertile cp-light" color="#FFFF00">
</image>
<image class="colorpickertile cp-light" color="#33FF33">
</image>
<image class="colorpickertile" color="#66CCCC">
</image>
<image class="colorpickertile" color="#33CCFF">
</image>
<image class="colorpickertile" color="#6666CC">
</image>
<image class="colorpickertile" color="#CC66CC">
</image>
</hbox>
<hbox>
<image class="colorpickertile" color="#999999">
</image>
<image class="colorpickertile" color="#CC0000">
</image>
<image class="colorpickertile" color="#FF6600">
</image>
<image class="colorpickertile" color="#FFCC33">
</image>
<image class="colorpickertile" color="#FFCC00">
</image>
<image class="colorpickertile" color="#33CC00">
</image>
<image class="colorpickertile" color="#00CCCC">
</image>
<image class="colorpickertile" color="#3366FF">
</image>
<image class="colorpickertile" color="#6633FF">
</image>
<image class="colorpickertile" color="#CC33CC">
</image>
</hbox>
<hbox>
<image class="colorpickertile" color="#666666">
</image>
<image class="colorpickertile" color="#990000">
</image>
<image class="colorpickertile" color="#CC6600">
</image>
<image class="colorpickertile" color="#CC9933">
</image>
<image class="colorpickertile" color="#999900">
</image>
<image class="colorpickertile" color="#009900">
</image>
<image class="colorpickertile" color="#339999">
</image>
<image class="colorpickertile" color="#3333FF">
</image>
<image class="colorpickertile" color="#6600CC">
</image>
<image class="colorpickertile" color="#993399">
</image>
</hbox>
<hbox>
<image class="colorpickertile" color="#333333">
</image>
<image class="colorpickertile" color="#660000">
</image>
<image class="colorpickertile" color="#993300">
</image>
<image class="colorpickertile" color="#996633">
</image>
<image class="colorpickertile" color="#666600">
</image>
<image class="colorpickertile" color="#006600">
</image>
<image class="colorpickertile" color="#336666">
</image>
<image class="colorpickertile" color="#000099">
</image>
<image class="colorpickertile" color="#333399">
</image>
<image class="colorpickertile" color="#663366">
</image>
</hbox>
<hbox>
<image class="colorpickertile" color="#000000">
</image>
<image class="colorpickertile" color="#330000">
</image>
<image class="colorpickertile" color="#663300">
</image>
<image class="colorpickertile" color="#663333">
</image>
<image class="colorpickertile" color="#333300">
</image>
<image class="colorpickertile" color="#003300">
</image>
<image class="colorpickertile" color="#003333">
</image>
<image class="colorpickertile" color="#000066">
</image>
<image class="colorpickertile" color="#330099">
</image>
<image class="colorpickertile" color="#330033">
</image>
</hbox>
</vbox>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-colorpicker ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-colorpicker", XblColorpicker);
