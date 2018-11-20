

var fs = require('fs');
var sortedBindings = require('./sorted-bindings').latest;
var { getParsedFiles, files, revsEveryDay: revs, getPrettyRev, getBindingMetadata} = require('./xbl-files');

var maxBindings = 0;
var remainingBindings = 0;
var idsForRev = { };

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
    if (maxBindings === totalBindings) {
      console.log("Found max " + maxBindings + " " + rev);
    }
    if (last) {
      remainingBindings = totalBindings;
    }
  });
}

function getMarkup(added, date, name, metadata) {
  metadata = metadata || {};
  var link = (metadata.bug && `<small><a href='${metadata.bug}'>bug ${metadata.bug.match(/\d+$/)[0]}</a></small>`);
  var type = (metadata.type && `<small>${metadata.type}</small>`) || '';
  var assignee = (metadata.assignee && `<small>${metadata.assignee}</small>`) || '';
  var metadata = (metadata.bug && `<span style='float: right'>${assignee} ${type} ${link}</span>`) || '';
  return `
  <div class="cd-timeline-block">
    <div class="cd-timeline-img cd-${added ? 'addition' : 'subtraction'}">
    </div>

    <div class="cd-timeline-content">
      <h2>
        <span class="cd-date">${date}</span> ${(added ? "Added new binding: " : "Removed binding: ")} ${name}
        ${metadata}
      </h2>
    </div>
  </div>`;
}

function processSequential(list, cb) {
  list = list.slice();
  return list.reduce(function (chain, item, i) {
    return chain.then(cb.bind(null, item, i === list.length - 1));
  }, cb(list.shift(), false));
}

function processRev(rev, last) {
  idsForRev[rev] = {};
  console.log("Processing", rev, last);
  return getBindingsForRev(rev, last);
}



// Cache files in sequence since we are doing every day. Slower but prevents oom.
getBindingMetadata().then(({metadataForBindings, totalMetadata}) => {
  return processSequential(revs, processRev).then(() => {
    var text = fs.readFileSync('index.html', 'utf8');
    var metadataSeen = 0;
    var newText = text.split("<!-- REPLACE-TIMELINE -->")[0] + "<!-- REPLACE-TIMELINE -->\n";
    newText += `<p>Starting with <b>${maxBindings}</b> bindings - there are <b>${remainingBindings}</b> bindings remaining.</p>`;
    newText += `<section id="cd-timeline" class="cd-container">`;
    for (var i = revs.length - 1; i > 0; i--) {
      var {added, deleted} = diff(idsForRev[revs[i-1]], idsForRev[revs[i]]);
      console.log(revs[i], added, deleted);
      if (added.length) {
        newText += added.map(add => {
          return getMarkup(true, getPrettyRev(revs[i]), add, metadataForBindings[add]);
        }).join("\n");
      }
      if (deleted.length) {
        newText += deleted.map(del => {
          if (del == "customizableui-toolbarpaletteitem") {
            del = "toolbarpaletteitem";
          }
          if (metadataForBindings[del]) {
            metadataSeen++;
          }
          return getMarkup(false, getPrettyRev(revs[i]), del, metadataForBindings[del]);
        }).join("\n");
      }
    }
    newText += `</section`;
    // console.log(idsForRev);
    newText += "\n<!-- END-REPLACE-TIMELINE -->" + text.split("<!-- END-REPLACE-TIMELINE -->")[1];
    fs.writeFileSync('index.html', newText);

    console.log(`Finished processing. We have metadata for ${totalMetadata} bindings, and ${metadataSeen} of them have been removed. So we know of ${totalMetadata - metadataSeen} still in progress.`);
  })
});
