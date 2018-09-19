
function formatExtends(ext) {
  if (!ext || ext.startsWith("xul:")) {
    return null;
  }
  return titleCase(ext.split('#')[1]);
}

function titleCase(str) {
  return str[0].toUpperCase() + str.substr(1).replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

function formatComment(comment, spaces = 2) {
  if (!comment) {
    return '';
  }

  let spacesStr = new Array(spaces).join(" ");
  let commentArr = comment.split("\n").map(s=> s.trim());
  if (!commentArr[0]) { commentArr.shift(); }
  if (!commentArr[commentArr.length - 1]) { commentArr.pop(); }
  let commentFormatted = commentArr
    .map(s => (s ? `${spacesStr}* ${s}` : `${spacesStr}*`))
    .join("\n");

  return `${spacesStr}/**\n${commentFormatted}\n${spacesStr}*/`;
}

function getJSForBinding(binding) {
  let js = [];
  let elementName = binding.attrs.id;
  let className = 'Moz' + titleCase(elementName);
  let hasExtends = !!formatExtends(binding.attrs.extends);
  js.push(`class ${className} `);
  if (hasExtends) {
    js.push(`extends Moz${formatExtends(binding.attrs.extends)} `);
  } else {
    js.push(`extends MozXULElement `);
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
      let name = child.name.replace('xul:', '');
      let padding = (new Array(depth + 3)).join("  ");
      childMarkup.push(`\n${padding}<${name}${attrs}>`);
      child.children.forEach(c => printChild(c, depth+1));
      let closePadding = child.children.length ? `\n${padding}` : '';
      childMarkup.push(`${closePadding}</${name}>`);
    }
    content[0].children.forEach(c => printChild(c, 1));
  } else {
    console.log("No content for binding", binding.attrs.id);
  }

  let innerHTML = content.length ?
        "this.appendChild(MozXULElement.parseXULToFragment(`" + childMarkup.join('') + "\n    `));" :
        "";

  let xblconstructor = (binding.find("constructor") || [])[0];
  let xblconstructorComment = xblconstructor ? formatComment(xblconstructor.comment) : null;
  xblconstructor = xblconstructor ? `${xblconstructor.cdata || xblconstructor.value}` : '';
  if (xblconstructorComment) {
    xblconstructor = xblconstructorComment + "\n" + xblconstructor;
  }
  // Or, try / catch since many components will fail when loaded in a tab due to chrome references
  // xblconstructor = xblconstructor ? `try { ${xblconstructor.cdata} } catch(e) { }` : '';

  let xbldestructor = (binding.find("destructor") || [])[0];
  let xbldestructorComment = xbldestructor ? formatComment(xbldestructor.comment) : null;
  xbldestructor = xbldestructor ? `${xbldestructor.cdata || xbldestructor.value}` : '';
  // Or, try / catch since many components will fail when loaded in a tab due to chrome references
  // xbldestructor = xbldestructor ? `try { ${xbldestructor.cdata} } catch(e) { }` : '';
  if (xbldestructor != '') {
    xbldestructor = `disconnectedCallback() { ${xbldestructor} }`
    if (xblconstructorComment) {
      xbldestructor = xblconstructorComment + "\n" + xbldestructor;
    }
  }

  let handlers = [];
  // <handler>
  for (let handler of binding.find('handler')) {
    let comment = formatComment(handler.comment);
    if (comment) {
      handlers.push(comment);
    }

    let secondParam = "";
    let isCapturing = handler.attrs.phase === "capturing";
    if (handler.attrs.group === "system") {
      if (isCapturing) {
        secondParam = `, { capture: true, mozSystemGroup: true }`;
      } else {
        secondParam = `, { mozSystemGroup: true }`;
      }
    } else if (isCapturing) {
      secondParam = ", true";
    }

    let keycode = handler.attrs.keycode ? `if (event.keyCode != KeyEvent.DOM_${handler.attrs.keycode}) { return; }` : "";
    handlers.push(`this.addEventListener("${handler.attrs.event}", (event) => {${keycode} ${handler.cdata || handler.value || handler.attrs.action}}${secondParam});\n`);
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
    let leadingComments = [];
    let expressions = data.split("\n");
    for (var i = 0; i < expressions.length; i++) {
      if (expressions[i].trim().startsWith("//")) {
        leadingComments.push(expressions[i]);
      } else {
        expressions = expressions.slice(i);
        break;
      }
    }

    let expr = expressions.join("\n");
    if (expr[expr.length - 1] !== ";") {
      expr += ";";
    }
    // Strip away parens that were only needed for XBL
    if (expr[0] === "(" && expr[expr.length - 2] === ")") {
      expr = expr.substring(1, expr.length - 2) + ";";
    }

    let comment = formatComment(field.comment);
    if (comment) {
      fields.push(comment);
    }

    if (leadingComments.length) {
      fields.push(leadingComments.join("\n"));
    }

    fields.push(`this.${field.attrs.name} = ${expr}\n`);

    // let setter = field.attrs.readonly ? '' :
    // `set(val) {
    //     delete this.${field.attrs.name};
    //     return this.${field.attrs.name} = val;
    // },`;

    // fields.push(`Object.defineProperty(this, "${field.attrs.name}", {
    //   configurable: true,
    //   enumerable: true,
    //   get() {
    //     ${comments.join('\n')}
    //     delete this.${field.attrs.name};
    //     return this.${field.attrs.name} = ${expressions.join('\n')}
    //   },
    //   ${setter}
    // })`);
  }

  if (handlers.length) {
    js.push(`
      constructor() {
        super();

        ${handlers.join("\n")}
      }
    `)
  }

  js.push(`
    connectedCallback() {
      ${hasExtends ? "super.connectedCallback()" : ""}
      ${innerHTML}
      ${fields.join("\n")}

      ${xblconstructor}
    }
  `);

  // <property>
  for (let property of binding.find('property')) {
    let comment = formatComment(property.comment);
    if (comment) {
      js.push(comment);
    }
    if (property.attrs.onset) {
      js.push(`
        set ${property.attrs.name}(val) {
          ${property.attrs.onset}
        }
      `);
    } else if(property.find('setter').length) {
      js.push(`
        set ${property.attrs.name}(val) {${property.find('setter')[0].cdata || property.find('setter')[0].value}}
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
        get ${property.attrs.name}() {${property.find('getter')[0].cdata || property.find('getter')[0].value}}
      `);
    }
  }

  // <method>
  for (let method of binding.find('method')) {
    js.push('\n');
    let comment = formatComment(method.comment);
    if (comment) {
      js.push(comment);
    }
    js.push(`${method.attrs.name}(`);
    js.push(`${method.find('parameter').map(p => p.attrs.name).join(',')}`);
    js.push(`) {`);
    js.push(method.find('body')[0].cdata || method.find('body')[0].value);
    js.push(`}\n`);
  }

  js.push(`${xbldestructor}`);

  js.push("}\n\n");

  let implements =
    binding.find("implementation").length &&
    binding.find("implementation")[0].attrs.implements
  if (implements) {
    implements = implements.split(",").map(i=>"Ci." + i.trim()).join(", ");
    js.push(`MozXULElement.implementCustomInterface(${className}, [${implements}]);`)
  }



  js.push(`customElements.define("${elementName}", ${className});
  `)
  return js.join(' ');
}

exports.getJSForBinding = getJSForBinding;
exports.titleCase = titleCase;
exports.formatExtends = formatExtends;
exports.formatComment = formatComment;
