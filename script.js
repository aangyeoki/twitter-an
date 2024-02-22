"use strict";

const closeButton = document.getElementById("close-button");
const leftSide = document.getElementById("left-side");
const rightContainer = document.getElementById("right-container");
const header = document.getElementById("header");
const mediaQuery = window.matchMedia("(max-width: 1000px)");
const userList = document.getElementById("user-list");
const detailInfo = document.getElementById("user-info");
const postList = document.getElementById("user-posts");
const backContainer = document.getElementById("back-container");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const firstPage = document.getElementById("first-last-page");
const searchBar = document.getElementById("search");

let users;
async function getData(page, search) {
  const limit = 10;
  const skip = (page - 1) * limit;

  let apiUrl = `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;
  if (search) {
    apiUrl = `https://dummyjson.com/users/search?q=${search}&limit=${limit}&skip=${skip}`;
  }

  const response = await fetch(apiUrl);
  const data = await response.json();
  users = data.users;
  console.log(users);
  console.log(data.total);
  let totalUsers = data.total;

  userList.innerHTML = "";
  for (let i = 0; i < users.length; i++) {
    let currentUser = users[i];
    userList.innerHTML += `<div class="one-box" onclick="tampilinDetail(${i})">
    <!-- PROFILE PIC -->
    <img src="${currentUser.image}" class="profile-pic"></img>

    <!-- USER INFO -->
    <div class="container-name-email">
        <div class="name-gender">
            <p class="name bolder">${currentUser.firstName} ${currentUser.lastName}</p>
            <span class="material-symbols-outlined ${currentUser.gender}-symbol">${currentUser.gender}</span>
        </div>
        <p class="mini-text">${currentUser.email}</p>
    </div>
    <span class="material-symbols-outlined chevron">chevron_right</span>
    </div>`;
  }

  const pageNumber = document.getElementById("page-number");
  pageNumber.innerHTML = "";
  pageNumber.innerHTML += `<p class="page-number" id="page-number">
  Showing ${(currentPage - 1) * 10 + 1} - ${currentPage * 10}
  <br> from ${totalUsers} results</p>`;

  let remain = totalUsers % limit;
  let maxPage = Math.ceil(totalUsers / limit);
  console.log(maxPage);
  console.log(currentPage);

  if (remain > 0 && currentPage === maxPage) {
    pageNumber.innerHTML = "";
    pageNumber.innerHTML += `<p class="page-number" id="page-number">
    Showing ${(currentPage - 1) * 10 + 1} - ${(currentPage - 1) * 10 + remain}
    <br> from ${data.total} results</p>`;
  }

  if (currentPage !== Math.ceil(totalUsers / limit)) {
    nextButton.removeAttribute("disabled");
  } else {
    nextButton.setAttribute("disabled", "disabled");
  }
}

backContainer.addEventListener("click", () => {
  leftSide.classList.remove("ds-none");
  rightContainer.style.display = "none";
  twtIcon.classList.remove("ds-none");
  searchContainer.classList.remove("ds-none");
  backContainer.classList.add("ds-none");
  if (searchBar.value) {
    twtIcon.classList.add("ds-none");
  } else {
    searchBar.classList.remove("search-active");
    searchIcon.classList.remove("search-icon-active");
    searchContainer.classList.remove("search-container-active");
  }
});

async function tampilinDetail(index) {
  let currentUser = users[index];
  const response = await fetch(
    `https://dummyjson.com/users/${currentUser.id}/posts`
  );
  const data = await response.json();
  let emptycontainer = document.getElementById("posts-list");
  emptycontainer.style.display = "none";
  let posts = data.posts;
  console.log(posts);

  if (mediaQuery.matches) {
    leftSide.classList.add("ds-none");
    rightContainer.style.display = "flex";
    twtIcon.classList.add("ds-none");
    searchContainer.classList.add("ds-none");
    backContainer.classList.remove("ds-none");
  }

  detailInfo.innerHTML = `<!-- KOTAK ATAS -->
    <div class="kotak-atas">
      <div class="user-title">
        <img src="${currentUser.image}" class="profile-pic"></img>
        <div class="container-name-email-kanan">
          <div class="name-gender">
            <p class="name-kanan">${currentUser.firstName} ${currentUser.lastName}</p>
            <span class="material-symbols-outlined ${currentUser.gender}-symbol">${currentUser.gender}</span>
          </div>
          <p class="mini-text">${currentUser.email}</p>
        </div>
      </div>

      <div class="more-details">
        <div class="top-container">
          <div class="edu-user">
            <p class="tipisin">Education</p>
            <p>${currentUser.university}</p>
          </div>
          <div class="occup-user">
            <p class="tipisin">Occupation</p>
            <p>${currentUser.address.address}, ${currentUser.address.city}</p>
          </div>
        </div>

        <div class="bottom-container">
          <div class="add-user">
            <p class="tipisin">Address</p>
            <p>${currentUser.company.title}</p>
          </div>
          <div class="company-user">
            <p class="tipisin">Company Name</p>
            <p>${currentUser.company.name}</p>
          </div>
        </div>
      </div>
    </div>

  <!-- KOTAK BAWAH -->
  <div class="kotak-bawah">
    <h2>${currentUser.firstName}'s Posts</h2>
  </div>`;

  postList.innerHTML = "";

  for (let k = 0; k < posts.length; k++) {
    let currentPost = posts[k];

    let tagsHTML = "";

    for (let l = 0; l < currentPost.tags.length; l++) {
      tagsHTML += `<p class="genre-style">${currentPost.tags[l]}</p>`;
    }

    postList.innerHTML += `<div class="box">
      <h3 class="medium">${currentPost.title}</h3>
      <p class="kecilin">${currentPost.body}</p>
      <div class="genre"> 
        ${tagsHTML}
      </div>
    </div>`;
  }

  const userToggles = document.getElementsByClassName("one-box");
  for (let i = 0; i < userToggles.length; i++) {
    const button = userToggles[i];
    button.addEventListener("click", function () {
      console.log("toggling");
      for (let j = 0; j < userToggles.length; j++) {
        userToggles[j].classList.remove("active");
      }
      button.classList.toggle("active");
    });
  }
}

let currentPage = 1;
getData(currentPage);

firstPage.addEventListener("click", () => {
  if (currentPage !== 1) {
    prevButton.removeAttribute("disabled");
  } else {
    prevButton.setAttribute("disabled", "disabled");
  }
});

prevButton.addEventListener("click", function () {
  currentPage--;
  getData(currentPage, searchBar.value);
});

nextButton.addEventListener("click", function () {
  currentPage++;
  getData(currentPage, searchBar.value);
});

searchBar.addEventListener("keypress", function (event) {
  currentPage = 1;
  if (event.key === "Enter") {
    console.log("enter is pressed!", searchBar.value);
    getData(0, searchBar.value);
  }
});

const searchContainer = document.getElementById("search-container");
const twtIcon = document.getElementById("twt-icon");
const searchIcon = document.getElementById("search-icon");
searchContainer.addEventListener("click", () => {
  if (mediaQuery.matches) {
    twtIcon.classList.add("ds-none");
    searchBar.classList.add("search-active");
    searchIcon.classList.add("search-icon-active");
    searchContainer.classList.add("search-container-active");
  }
});
