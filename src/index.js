$(window).on("load", () => {
  "use strict";

  const users = [
    "ESL_SC2",
    "OgamingSC2",
    "cretetion",
    "freecodecamp",
    "storbeck",
    "habathcx",
    "RobotCaleb",
    "noobs2ninjas",
  ];
  let promisesArr = [];
  const $userContainer = $(".userContainer");

  users.map((user) => {
    // for each user, create a promise consisting of a call to the twitch.tv
    // API to get data about the user. Push the promises into an array.
    promisesArr.push(
      new Promise((resolve, reject) => {
        $.ajax({
          // use a proxy server to prevent CORS error
          url:
            "https://cors-anywhere.herokuapp.com/" +
            "wind-bow.gomix.me/twitch-api/channels/" +
            user,
          success: resolve,
          error: reject,
        });
      })
    );
  });

  // wait until all the API calls have returned, then, for each user, append
  // the returned data to the document we need to wait until all the API calls
  // have been returned to ensure that the users are appended
  // to the doument in the same order each time
  Promise.all(promisesArr)
    .then((values) => {
      let i = 0;
      let username = "";
      let link = "";
      let img = "";
      let html = "";
      const $userContainer = $(".userContainer");

      for (i = 0; i < promisesArr.length; i++) {
        username = values[i].display_name;
        link = values[i].url;
        img = values[i].logo;
        html = buildProfileHTML(username, img, link);
        $userContainer.append(html);
        checkStreamStatus(username);
      }
    })
    .catch(() => {
      $userContainer.append(
        "<div><p>Sorry, something went wrong" +
          " when we tried to get data from Twitch.tv. Please try again later" +
          ".</p></div>"
      );
    });
});

// return a string which can be appended to the HTML document in order to
// build the user's profile
function buildProfileHTML(username, img, link) {
  "use strict";

  const statusBox =
    "<span class='streamStatus'>" +
    "<i class='fa fa-circle' aria-hidden='true'></i></span>";

  const html =
    "<div class='" +
    username +
    " userBox'>" +
    statusBox +
    "<p class='header'><img src=" +
    img +
    " alt='(Image not available)'" +
    " class='img-responsive'><a href=" +
    link +
    ">" +
    username +
    "</a></p></div>";

  return html;
}

function checkStreamStatus(user) {
  "use strict";

  const $userBox = $("." + user);
  const $statusBox = $("." + user + " span");
  const $statusIndicator = $("." + user + " span .fa-circle");
  let html = "";
  let game = "";
  let status = "";
  let viewers = 0;

  // make a call to the twitch.tv API to check whether a given user is
  // currently streaming. If they are streaming, get details about the stream.
  $.ajax({
    // use a proxy server to prevent CORS error
    url:
      "https://cors-anywhere.herokuapp.com/" +
      "wind-bow.gomix.me/twitch-api/streams/" +
      user,
    success: (json) => {
      if (json.stream === null) {
        html = "<p>Not currently streaming.</p>";
        $statusBox.append(" Offline");
      } else {
        // get details of stream
        game = json.stream.game;
        viewers = json.stream.viewers;
        status = json.stream.channel.status;
        html = buildStatusHTML(game, status, viewers);
        $statusBox.append(" <b>Online</b>");
        $statusIndicator.css("color", "green");
      }
      $userBox.append(html);
    },
    error: () => {
      $userBox.append(
        "<p>Sorry, something went wrong" +
          " when we tried to get streaming data about this user.</p>"
      );
    },
  });
}

// return a string which can be appended to the HTML document in order to
// display the user's current streaming status
function buildStatusHTML(game, status, viewers) {
  "use strict";

  let html = "";

  if (game === null || game === undefined) {
    html =
      "<p>Currently streaming.</p><p><b>Status:</b> " +
      status +
      ";  <b>Viewers:</b> " +
      viewers +
      "</p>";
  } else {
    html =
      "<p>Currently streaming.</p><p><b>Game:</b> " +
      game +
      ";  <b>Status:</b> " +
      status +
      ";  <b>Viewers:</b> " +
      viewers +
      "</p>";
  }

  return html;
}

// refresh the page
$(".refresh").on("click", () => {
  "use strict";
  // refresh from the server, not the cache
  location.reload(true);
});
