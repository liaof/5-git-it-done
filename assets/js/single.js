var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

//This script finds the issues in the repo selected in homepage.js and creates a list of it's issues, linking to the github pages

//find issues in our given repo
var getRepoIssues = function(repo) {
    console.log(repo);
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function(response){
        //request was successful
        if (response.ok) {
            response.json().then(function(data){
                ///pass response data to dom function
                displayIssues(data);

                // check if api has paginated issues aka more than 30 issues
                if (response.headers.get("Link")) {
                    console.log("repo has more than 30 issues");
                    displayWarning(data);
                }
            });
        }
        else {
            Document.location.replace("./index.html");
        }
    });
};

var displayIssues = function(issues) {
    //if ther are no issues
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    
    for (var i = 0; i < issues.length; i++) {
        
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        //link to the full issue on GitHub
        issueEl.setAttribute("href", issues[i].html_url);
        //open link in new tab instead of replacing current page
        issueEl.setAttribute("target", "_blank");

        //create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        //append to container
        issueEl.appendChild(titleEl);

        //create a type element
        var typeEl = document.createElement("span");

        //check if issues is an actual issue or a pull request
        if (issues[i].pull_request){
            typeEl.textContent = "(Pull Request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        //append to container
        issueEl.appendChild(typeEl);

        issueContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function(repo) {
    //add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on Github.com";
    linkEl.setAttribute("href", "https://github.com/"+repo+"/issues");
    linkEl.setAttribute("target", "_blank");

    //append to warning container
    limitWarningEl.appendChild(linkEl);
};

var getRepoName=function(){
    var queryString = document.location.search;
    //?q=value is split at '='
    //creates 2 values in array, '?' and 'value'
    //our repo name is located at the 2nd array
    var repoName= queryString.split("=")[1];
    if (repoName){
        //update the page element displaying the repo name
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    } else {
        document.location.replace("./index.html");
    }
};

getRepoName();


    
   