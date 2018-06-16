const issuesText = document.getElementsByTagName('pre')[0].innerText;
const issues = JSON.parse(issuesText);

const classifiedIssues = classifyIssues(issues);
console.log('classifiedIssues: ', classifiedIssues);


function classifyIssues(issues) {
  let open = [];
  let closed = [];
  let inProgress = [];

  issues.forEach(issue => {
    if (issue.state === 'closed') {
      closed.push(issue);
    } else if (issue.state === 'open') {
      open.push(open)
    }
    if (issue.labels.find(label => label === 'in progress')) {
      open.push(inProgress)
    }
  });

  return {open, closed, inProgress};
}

const h1 = document.createElement('h1')
h1.appendChild(document.createTextNode('Muffin!'))
console.log('h1: ', h1);

const pre = document.getElementsByTagName('pre')
// console.log('body: ', body);

document.body.insertBefore(h1, pre[0])