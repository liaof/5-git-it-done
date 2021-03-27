var userFormEl = document.querySelector("#user-form");
var nameInputEl= document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

//This script finds the repos of a user, and creates links to those repos

//find repos of our given user
var getUserRepos = function (user) {
    console.log("function was called");
    fetch("https://api.github.com/users/"+user+"/repos").then(function(response) {
        //when the request is succsful, the .ok property will be true
        //this means the user can be found
        if (response.ok) {
            response.json().then(function(data) {
              displayRepos(data, user);
            });
          } else {//if the user cannot be found
            alert("Error: " + response.statusText);
          }

    })
    .catch(function(error){//for handling netowork and connectivity errors
        //Notice .catch() getting chained onto the end of .then()
        alert("Unable to connect to Github");
    })
};

var formSubmitHandler = function(event) {
    //prevents the browser from sending the form's input data to a URL, we do it manually
    event.preventDefault();
    //get value from input element
    var username = nameInputEl.value.trim();
    
    if(username){
        getUserRepos(username);
        nameInputEl.value="";
    } else {
        alert("Please enter a GitHub Username");
    }
    console.log(event);
};

var displayRepos = function(repos, searchTerm){
    //check if api returned any repos
    if (repos.length===0){//if the use has no repos
        repoContainerEl.textContent="No repositeories found";
        return;
    }
    console.log(repos);
    console.log(searchTerm);

    //clear old content
    repoContainerEl.textContent="";
    repoSearchTerm.textContent= searchTerm;

    //loop over repos
    for (var i = 0; i < repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for each individual repo 
        var repoEl = document.createElement ("a");
        repoEl.classList = "list-item flex-row justify-space-between alignt-center";
        repoEl.setAttribute("href","./single-repo.html?repo="+repoName);

        //create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append to individual container
        repoEl.appendChild(titleEl);

        //create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";//display a red X icon
        }
        else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";//display a blue check icon
        }

        //apend to individual container
        repoEl.appendChild(statusEl);

        //append individual container to the the repo container
        repoContainerEl.appendChild(repoEl);
    }
}

userFormEl.addEventListener("submit", formSubmitHandler);