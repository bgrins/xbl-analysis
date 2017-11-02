

var fs = require('fs');
var sortedBindings = require('./sorted-bindings').latest;
var {getParsedFiles, files, revs, getPrettyRev} = require('./xbl-files');

var maxBindings = 0;
var remainingBindings = 0;
var idsForRev = { };
var KNOWN_BUGS = {
  "": ""
};

function diff(base, compared) {
  var deleted = [],
      added = [];

  for (var i in compared) {
    if (!(i in base)) {
      added.push(i);
    }
  }
  for (var i in base) {
    if (!(i in compared)) {
      deleted.push(i);
    }
  }

  return {
    added,
    deleted,
  };
};


function getBindingsForRev(rev, last) {
  return getParsedFiles(rev).then(docs => {
    let totalBindings = 0;
    docs.forEach(({doc}, i) => {
      let bindings = doc.find('binding');
      totalBindings += bindings.length;
      return bindings.forEach(binding => {
        idsForRev[rev][binding.attrs.id] = true;
      })
    });

    maxBindings = Math.max(maxBindings, totalBindings);
    if (last) {
      remainingBindings = totalBindings;
    }
  });
}

function getMarkup(added, date, name) {
  return `
  <div class="cd-timeline-block">
    <div class="cd-timeline-img cd-${added ? 'addition' : 'subtraction'}">
    </div>

    <div class="cd-timeline-content">
      <h2><span class="cd-date">${date}</span> ${(added ? "Added new binding: " : "Removed binding: ")} ${name}</h2>
      <p style='display: none'><a href="#">Bug</a>.</p>
    </div>
  </div>`;
}

Promise.all(
  revs.map((rev, i) => {
    idsForRev[rev] = {};
    return getBindingsForRev(rev, i === revs.length - 1);
  })
).then(() => {
  var text = fs.readFileSync('index.html', 'utf8');
  var newText = text.split("<!-- REPLACE-TIMELINE -->")[0] + "<!-- REPLACE-TIMELINE -->\n";
  newText += `<p>Starting with <b>${maxBindings}</b> bindings - there are <b>${remainingBindings}</b> bindings remaining.</p>`;
  newText += `<section id="cd-timeline" class="cd-container">`;
  for (var i = revs.length - 1; i > 0; i--) {
    var {added, deleted} = diff(idsForRev[revs[i-1]], idsForRev[revs[i]]);
    console.log(revs[i], added, deleted);
    if (added.length) {
      newText += added.map(add => {
        return getMarkup(true, getPrettyRev(revs[i]), add);
      }).join("\n");
    }
    if (deleted.length) {
      newText += deleted.map(del => {
        return getMarkup(false, getPrettyRev(revs[i]), del);
      }).join("\n");
    }
  }
  newText += `</section`;
  // console.log(idsForRev);
  newText += "\n<!-- END-REPLACE-TIMELINE -->" + text.split("<!-- END-REPLACE-TIMELINE -->")[1];
  fs.writeFileSync('index.html', newText);
})


  //   <div class="cd-timeline-block">
  //     <div class="cd-timeline-img cd-addition">
  //     </div>

  //     <div class="cd-timeline-content">
  //       <h2><span class="cd-date">2017-05-10</span> Added foo-binding</h2>
  //       <p><a href="#0">Bug foo</a>.</p>

  //     </div> <!-- cd-timeline-content -->
  //   </div> <!-- cd-timeline-block -->

  //   <div class="cd-timeline-block">
  //     <div class="cd-timeline-img cd-subtraction">
  //     </div>

  //     <div class="cd-timeline-content">
  //       <h2>Title of section 2</h2>
  //       <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto, optio, dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde?</p>
  //       <a href="#0" class="cd-read-more">Read more</a>
  //       <span class="cd-date">Jan 18</span>
  //     </div> <!-- cd-timeline-content -->
  //   </div> <!-- cd-timeline-block -->
