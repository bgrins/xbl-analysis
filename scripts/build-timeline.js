

var fs = require('fs');
var sortedBindings = require('./sorted-bindings').latest;
var {getParsedFiles, files, revsEveryDay: revs, getPrettyRev} = require('./xbl-files');

var maxBindings = 0;
var remainingBindings = 0;
var idsForRev = { };

var metadataForBindings = {
  'tabbrowser-tabbox': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1394975',
    type: '#flatten-inheritance',
  },
  'viewbutton': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1410540',
    type: '#flatten-inheritance',
  },
  'windows-radio': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1411640',
    type: '#flatten-inheritance',
  },
  'windows-radio-with-spacing': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1411640',
    type: '#flatten-inheritance',
  },
  'checkbox-baseline': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1412361',
    type: '#remove-unused',
  },
  'android-checkbox-radio': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1412361',
    type: '#remove-unused',
  },
  'image': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1403231',
    type: '#special-case',
  },
  'android-checkbox-with-spacing': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414406',
    type: '#remove-unused',
  },
  'setting-base': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414406',
    type: '#remove-unused',
  },
  'setting-bool': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414406',
    type: '#remove-unused',
  },
  'setting-fulltoggle-bool': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414406',
    type: '#remove-unused',
  },
  'setting-fulltoggle-boolint': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414406',
    type: '#remove-unused',
  },
  'setting-fulltoggle-localized-bool': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414406',
    type: '#remove-unused',
  },
  'setting-localized-bool': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414406',
    type: '#remove-unused',
  },
  'setting-fulltoggle': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414406',
    type: '#remove-unused',
  },
  'setting-boolint': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414406',
    type: '#remove-unused',
  },
  'setting-fulltoggle': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414406',
    type: '#remove-unused',
  },
  'setting-localized': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414406',
    type: '#remove-unused',
  },
  'setting-fulltoggle': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414406',
    type: '#remove-unused',
  },
  'setting-integer': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414406',
    type: '#remove-unused',
  },
  'setting-control': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414406',
    type: '#remove-unused',
  },
  'setting-string': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414406',
    type: '#remove-unused',
  },
  'setting-color': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414406',
    type: '#remove-unused',
  },
  'setting-path': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414406',
    type: '#remove-unused',
  },
  'setting-multi': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414406',
    type: '#remove-unused',
  },
  'photonpanelmultiview': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414244',
    type: '#flatten-inheritance',
  },
  'statusbarpanel-menu-iconic': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1416368',
    type: '#remove-unused',
  },
  'statusbarpanel-iconic': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1416368',
    type: '#remove-unused',
  },
  'statusbarpanel-iconic-text': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1416368',
    type: '#remove-unused',
  },
  'panebutton': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1412369',
    type: '#flatten-inheritance',
  },
  'expander': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=930845',
    type: '#remove-unused'
  },
  'searchbar-treebody': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1414020',
    type: '#flatten-inheritance'
  },
  'control-item': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1416483',
    type: '#flatten-inheritance'
  },
  'button-image': {
    bug: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1416524',
    type: '#remove-unused'
  },
};

var totalMetadata = 0;
for (var i in metadataForBindings) {
  totalMetadata++;
}

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

function getMarkup(added, date, name) {
  var metadata = metadataForBindings[name] || {};
  var link = (metadata.bug && `<small><a href='${metadata.bug}'>bug ${metadata.bug.match(/\d+$/)[0]}</a></small>`);
  var type = (metadata.type && `<small>${metadata.type}</small>`) || '';
  var metadata = (metadata.bug && `<span style='float: right'>${type} ${link}</span>`) || '';
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
processSequential(revs, processRev).then(() => {
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
        return getMarkup(true, getPrettyRev(revs[i]), add);
      }).join("\n");
    }
    if (deleted.length) {
      newText += deleted.map(del => {
        if (metadataForBindings[del]) {
          metadataSeen++;
        }
        return getMarkup(false, getPrettyRev(revs[i]), del);
      }).join("\n");
    }
  }
  newText += `</section`;
  // console.log(idsForRev);
  newText += "\n<!-- END-REPLACE-TIMELINE -->" + text.split("<!-- END-REPLACE-TIMELINE -->")[1];
  fs.writeFileSync('index.html', newText);

  console.log(`Finished processing. We have metadata for ${totalMetadata} bindings, and ${metadataSeen} of them have been removed. So we know of ${totalMetadata - metadataSeen} still in progress.`);
})
