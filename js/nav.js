"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmitStoryClick(evt) { 
  console.debug("navSubmitStoryClick", evt);
  hidePageComponents();
  $("#submit-story").show();
  $allStoriesList.show(); 
}

$("#nav-submit-story").on("click", navSubmitStoryClick);

function navMyStoriesClick(evt) {
  console.debug("navMyStoriesClick", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}

$("#nav-my-stories").on("click", navMyStoriesClick);

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick");
  hidePageComponents();
  putFavoritesOnPage();
  $favorites.show(); //create a list of the favorites
}

$("#nav-favorites").on("click", navFavoritesClick);

function navProfileClick(evt) {
  console.debug("navProfileClick");
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on("click", navProfileClick);
