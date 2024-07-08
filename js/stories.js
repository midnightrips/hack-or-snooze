"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showTrash = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const showStar = Boolean(currentUser);

  //const showTrash = Boolean(currentUser); //if current user logged in, show trashcan


  return $(`
      <li id="${story.storyId}">
        ${showTrash ? getTrashHTML() : ""}
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function getTrashHTML() {
  return `
    <span class="trash">
      <i class="fas fa-trash-alt"></i>
    </span>`;
}

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

async function toggleStar(evt) {
  console.debug("toggleStar");

  let $star = $(evt.target).closest('i');
  
  const storyId = $star.closest('li').attr('id');  // https://api.jquery.com/closest/
  const story = storyList.stories.find(s => s.storyId === storyId);

  if ($star.hasClass('fas')) {
    await currentUser.removeFavorite(story);
    $star.removeClass('fas').addClass('far');
    //solution has closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $star.removeClass('far').addClass('fas'); // Change to filled star
  }
}

$allStoriesList.on("click", ".star", toggleStar);
//$('.star').on('click', toggleStar);
//$(document).on("click", ".star", toggleStar);



/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");
  $ownStories.empty();

  if(currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  }
  else {
    for(let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();

}

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");
  $favorites.empty();

  if(currentUser.favorites.length === 0) {
    $favorites.append("<h5>No stories favorited by user yet!</h5>");
  }
  else {
    for(let story of currentUser.favorites) {
      let $story = generateStoryMarkup(story);
      $favorites.append($story);
    }
  }

  $favorites.show();
}

//takes info from story submit form and calls .addStory
async function createNewStory(evt) {
  console.debug("createNewStory");
  evt.preventDefault();
  let title = $("#create-title").val();
  let author = $("#create-author").val();
  let url = $("#create-url").val();
  let username = currentUser.username; //why is this necessary?
  const storyData = { title, author, url, username}; //why do I need username here?

  const newStory = await storyList.addStory(currentUser, storyData);
  const $newStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStory);
  $("#submit-story")[0].reset(); //had to look up how to reset a form withour individually resetting each input field
}

$("#submit-story").on("submit", createNewStory);


// delete a story
async function deleteStory(evt){
  console.debug('deleteStory');
  const $storyId = $(evt.target).closest('li').attr('id');  // https://api.jquery.com/closest/

  await storyList.removeStory(currentUser, $storyId);
  
  //putUserStoriesOnPage(); //show remaining stories

}

$ownStories.on("click", ".trash", deleteStory);
