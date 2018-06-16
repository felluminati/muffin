const bakeButton = document.getElementById('bake')

bake.addEventListener('click', getRepoName);

/*
  Gets current url on the page and determines if it is a github repo.
  If it is, it opens two windows for repo and issues json.
*/

function getRepoName() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const url = tabs[0].url;
    if (url.match(/https:\/\/github.com\/.+\/.+/)) {
      const urlSplit = url.split('/');
      const user = urlSplit[3]
      const repo = urlSplit[4]
      const repoUrl = `https://api.github.com/repos/${user}/${repo}`
      const issuesUrl = `${repoUrl}/issues?state=all`
      window.open(issuesUrl, "_blank");
    } else {
      const app = document.getElementById('app');
      app.innerHTML = '';
      app.appendChild(document.createTextNode('No muffin to bake. Go to github.com'));
    }

  });
}