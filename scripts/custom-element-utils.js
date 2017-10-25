
function formatExtends(ext) {
  if (!ext || ext.startsWith("xul:")) {
    return null;
  }
  return titleCase(ext.split('#')[1]);
}

function titleCase(str) {
  return str[0].toUpperCase() + str.substr(1).replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

function getJSForBinding(binding) {
  let js = [];
  let elementName = 'firefox-' + binding.attrs.id;
  let className = titleCase(elementName);
  let hasExtends = !!formatExtends(binding.attrs.extends);
  js.push(`class ${className} `);
  if (hasExtends) {
    js.push(`extends Firefox${formatExtends(binding.attrs.extends)} `);
  } else {
    js.push(`extends XULElement `);
  }

  js.push('{')

  let childMarkup = [];
  let content = binding.find("content");
  if (content.length === 0) {
    content = binding.find("xbl:content");
  }
  if (content.length > 1) {
    throw "Unexpected second content field";
  } else if (content.length === 1) {
    function printChild(child, depth) {
      let attrs = '';
      for (var attr in child.attrs) {
        attrs += ' ' + attr.replace('xbl:', '') + '="' + child.attrs[attr].replace('"', '\"').replace(/xbl\:/g, '') + '"';
      }
      let padding = (new Array(depth + 3)).join("  ");
      childMarkup.push(`\n${padding}<${child.name}${attrs}>`);
      child.children.forEach(c => printChild(c, depth+1));
      let closePadding = child.children.length ? `\n${padding}` : '';
      childMarkup.push(`${closePadding}</${child.name}>`);
    }
    content[0].children.forEach(c => printChild(c, 1));
  } else {
    console.log("No content for binding", binding.attrs.id);
  }

  let innerHTML = content.length ?
        "this.innerHTML = `" + childMarkup.join('') + "\n    `;" :
        "";

  let xblconstructor = (binding.find("constructor") || [])[0];
  xblconstructor = xblconstructor ? `${xblconstructor.cdata || xblconstructor.value}` : '';
  // Or, try / catch since many components will fail when loaded in a tab due to chrome references
  // xblconstructor = xblconstructor ? `try { ${xblconstructor.cdata} } catch(e) { }` : '';

  let xbldestructor = (binding.find("destructor") || [])[0];
  xbldestructor = xbldestructor ? `${xbldestructor.cdata || xbldestructor.value}` : '';
  // Or, try / catch since many components will fail when loaded in a tab due to chrome references
  // xbldestructor = xbldestructor ? `try { ${xbldestructor.cdata} } catch(e) { }` : '';
  if (xbldestructor != '') {
    xbldestructor = `disconnectedCallback() { ${xbldestructor} }`
  }

  let handlers = [];
  // <handler>
  for (let handler of binding.find('handler')) {
    let capturing = handler.attrs.phase === "capturing" ? ", true" : "";
    handlers.push(`
      this.addEventListener("${handler.attrs.event}", (event) => {
        ${handler.cdata || handler.value || handler.attrs.action}
      }${capturing});
    `);
  }


  // <field>
  let fields = [];
  for (let field of binding.find('field')) {


    // Work around fields like _weekStart in the datepicker where the value is coming from a dtd.
    // Just print an empty string in that case.
    let data = (field.cdata || field.value || "").trim();
    if (data.startsWith("FROM-DTD")) {
      data = `"${data}"`
    }
    data = (data.length === 0) ? '""' : data;

    // Remove leading comments, which would cause the 'return' to be on a different line
    // than the expression.
    let comments = [];
    let expressions = data.split("\n");
    for (var i = 0; i < expressions.length; i++) {
      if (expressions[i].trim().startsWith("//")) {
        comments.push(expressions[i]);
      } else {
        expressions = expressions.slice(i);
        break;
      }
    }

    let setter = field.attrs.readonly ? '' :
    `set(val) {
        delete this.${field.attrs.name};
        return this.${field.attrs.name} = val;
    },`;

    fields.push(`Object.defineProperty(this, "${field.attrs.name}", {
      configurable: true,
      enumerable: true,
      get() {
        ${comments.join('\n')}
        delete this.${field.attrs.name};
        return this.${field.attrs.name} = ${expressions.join('\n')}
      },
      ${setter}
    })`);
  }

  js.push(`
    constructor() {
      super();
    }
    connectedCallback() {
      ${hasExtends ? 'super.connectedCallback()' : ''}
      ${innerHTML}
      ${fields.join('\n')}

      ${xblconstructor}

      ${handlers.join('\n')}
    }
    ${xbldestructor}
  `);

  // <property>
  for (let property of binding.find('property')) {
    if (property.attrs.onset) {
      js.push(`
        set ${property.attrs.name}(val) {
          ${property.attrs.onset}
        }
      `);
    } else if(property.find('setter').length) {
      js.push(`
        set ${property.attrs.name}(val) {
          ${property.find('setter')[0].cdata || property.find('setter')[0].value}
        }
      `);
    }
    if (property.attrs.onget) {
      js.push(`
        get ${property.attrs.name}() {
          ${property.attrs.onget}
        }
      `);
    } else if(property.find('getter').length) {
      js.push(`
        get ${property.attrs.name}() {
          ${property.find('getter')[0].cdata || property.find('getter')[0].value}
        }
      `);
    }
  }

  // <method>
  for (let method of binding.find('method')) {
    js.push(`${method.attrs.name}(`);
    js.push(`${method.find('parameter').map(p => p.attrs.name).join(',')}`);
    js.push(`) {`);
    js.push(method.find('body')[0].cdata || method.find('body')[0].value);
    js.push(`}`);
  }

  js.push('}');

  js.push(`
    customElements.define("${elementName}", ${className});
  `)
  return js.join(' ');
}

exports.getJSForBinding = getJSForBinding;
exports.titleCase = titleCase;
exports.formatExtends = formatExtends;
