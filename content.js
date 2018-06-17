/* Get nodes from DOM amd parse JSON */

const jsonWrapper = document.getElementsByTagName('pre')[0];
const newIssues = JSON.parse(jsonWrapper.innerText);
const allIssues = []
const body = document.getElementsByTagName('body')[0];

/* Get orgOrUser and repo name from the url */

const parsedUrl = window.location.href.split('/');
const orgOrUser = parsedUrl[4];
const repoName = parsedUrl[5];
const fullRepoName = `${orgOrUser}_${repoName}`;

/* Get issues from storage */

chrome.storage.sync.get(['repos'], function(data) {
  if (!data.repos) {
    data.repos = { [fullRepoName]: [...newIssues] };
    console.log('no repos');
  } else if (!data.repos[fullRepoName]) {
    data.repos[fullRepoName] = [...newIssues];
    console.log('not in repos');
  } else {
    data.repos[fullRepoName] = mergeIssues(newIssues, data.repos[fullRepoName]);
    console.log('update repo');
  }
  chrome.storage.sync.set({ repos: {}}, function() {
    console.log('repos saved', data);
    updateContent(data.repos[fullRepoName]);
  });

})

/* 
  Merge two arrays of issues. If an id from the new array matches the id from
  the old array, only use the new one.
*/

function mergeIssues(newIssues, oldIssues) {
  const allIssues = [...newIssues];
  const newIssueIds = newIssues.map(issue => issue.id);

  oldIssues.forEach(issue => {
    if (newIssueIds.indexOf(issue.id) === -1) {
      allIssues.push(issue);
    }
  })

  return allIssues;
}

/*
  Update content with list of issues
  updateContent(data.repos[fullRepoName]);
*/

function updateContent(issues) {
  const closedPullRequests = issues.filter(issue => issue.pull_request && issue.state === 'closed');
  const openPullRequests = issues.filter(issue => issue.pull_request && issue.state === 'open');
  const closedIssues = issues.filter(issue => !issue.pull_request && issue.state === 'closed');
  const openIssues = issues.filter(issue => !issue.pull_request && issue.state === 'open' && issue.labels.indexOf('in progress') === -1);
  const inProgressIssues = issues.filter(issue => !issue.pull_request && issue.state === 'open' && issue.labels.indexOf('in progress') > -1);

  const container = document.createElement('div');
  const content = `
    <svg height="48" id="svg4763" version="1.1" viewBox="0 0 48 48.000001" width="48" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg"><defs id="defs4765"/><g id="layer1" transform="translate(0,-1004.3622)"><path d="m 6.6222265,1027.5709 c -3.2236147,-3.2898 -1.1846744,-10.3348 2.1654087,-13.223 7.7104998,-6.6477 22.6052228,-6.6477 30.3157248,0 3.350082,2.8882 5.638268,10.2075 2.165409,13.223 -6.752731,5.8634 -27.893813,6.8911 -34.6465425,0 z" id="path4590" style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="m 7.0003426,1028.3765 c 0,0 0.1534498,8.8927 2.124957,12.7127 0.9167334,1.7761 2.3989884,3.4732 4.2499144,4.2376 6.544014,2.7029 14.705558,2.7029 21.249573,0 1.850928,-0.7644 3.333183,-2.4615 4.249914,-4.2376 1.971509,-3.82 2.124957,-12.7127 2.124957,-12.7127" id="path4592" style="fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/><path d="m 10.758903,1024.3497 a 5.7186151,5.7982512 0 0 1 -0.542603,-4.4659 5.7186151,5.7982512 0 0 1 2.771191,-3.5147" id="path4594" style="opacity:1;fill:none;fill-opacity:1;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"/><circle cx="33" cy="1016.3622" id="path5674" r="1" style="opacity:1;fill:#000000;fill-opacity:1;stroke:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"/><circle cx="30" cy="1020.3622" id="circle5676" r="1" style="opacity:1;fill:#000000;fill-opacity:1;stroke:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"/><circle cx="36" cy="1022.3622" id="circle5678" r="1" style="opacity:1;fill:#000000;fill-opacity:1;stroke:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"/></g></svg>
    <h1><a href="https://github.com/${orgOrUser}/${repoName}" target="_blank">${orgOrUser} / ${repoName}</a></h1>
    <hr />
    <h2>Closed Issues - (${closedIssues.length})</h2>
    <ol>
      ${renderIssues(closedIssues)}
    </ol>
    <hr />
    <h2>In Progress Issues - (${inProgressIssues.length})</h2>
    <ol>
      ${renderIssues(inProgressIssues)}
    </ol>
    <hr />
    <h2>Open Issues - (${openIssues.length})</h2>
    <ol>
      ${renderIssues(openIssues)}
    </ol>
    <hr />
    <h2>Open Pull Requests - (${openPullRequests.length})</h2>
    <ol>
      ${renderIssues(openPullRequests)}
    </ol>
    <hr />
    <h2>Closed Pull Requests - (${closedPullRequests.length})</h2>
    <ol>
      ${renderIssues(closedPullRequests)}
    </ol>
    <hr />
    <footer>
      This may not be a complete list of issues related to this repo. 
      Muffin only retrieves the last 30 issues to be updated. If you have added or
      updated more than 30 issues (including pull requests) since the last
      time you baked the muffin, some issues will be missing.
    </footer>
  `
  container.innerHTML = content;
  body.innerHTML = '';
  body.appendChild(container);
}

/* Render issues */

function renderIssues(issues) {

  return issues.map(issue => (
    `
    <li>
      <a href="https://github.com/${orgOrUser}/${repoName}/issues/${issue.number}" target="_blank">
        ${issue.title}
      </a>
      ${issue.closed ? `&nbsp;(<em>closed: ${issue.closed_at.slice(0, 10)}</em>)` : '' }
      ${issue.pull_request ? `&nbsp<svg class="octicon octicon-git-pull-request" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11 11.28V5c-.03-.78-.34-1.47-.94-2.06C9.46 2.35 8.78 2.03 8 2H7V0L4 3l3 3V4h1c.27.02.48.11.69.31.21.2.3.42.31.69v6.28A1.993 1.993 0 0 0 10 15a1.993 1.993 0 0 0 1-3.72zm-1 2.92c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zM4 3c0-1.11-.89-2-2-2a1.993 1.993 0 0 0-1 3.72v6.56A1.993 1.993 0 0 0 2 15a1.993 1.993 0 0 0 1-3.72V4.72c.59-.34 1-.98 1-1.72zm-.8 10c0 .66-.55 1.2-1.2 1.2-.65 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>` : ''}
    </li>
    `
  )).join('')
}
