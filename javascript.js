$(window).on("load", () => {
 "use strict";

    const users = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
    const $userContainer = $(".userContainer");
    const statusBox = "<span class='streamStatus'><i class='fa fa-circle' aria-hidden='true'></i></span>";
    let link = "";
    let img = "";
    let html = "";

//  for each item in the users array, make a call to the twitch.tv API to get the link to the user's twitch.tv channel and the channel logo
    users.map( (val) => {
      $.ajax({
//      use a proxy server to prevent CORS error
        url: "https://thingproxy.freeboard.io/fetch/https://wind-bow.gomix.me/twitch-api/channels/"
        + val,
        success: (json) => {
          link = json.url;
          img = json.logo;
          html = "<div class='" + val + " userBox'>" + statusBox + "<p><img src="
          + img + " alt='' class='img-responsive'><a href=" + link + ">" + val
          + "</a></p></div>";
//        link should open in new window?
//        append API data to the document in an individual container
          $userContainer.append(html);
//        call function to check if user is currently streaming
          checkStreamStatus(val);
        },
        error: () => {
          $userContainer.append("<div><p>Sorry, something went wrong when we tried to get data about "
          + val + ".</p></div>");
        }
      });
    });

});

// make a call to the twitch.tv API to check whether a given user is currently
// streaming. If they are streaming, get details about the stream.
function checkStreamStatus (user) {
  "use strict";

  const $userBox = $("." + user);
  const $statusBox = $("." + user + " span");
  const $statusIndicator = $("." + user + " span .fa-circle");
  let html = "";
  let game = "";
  let status = "";
  let viewers = 0;

  $.ajax({
    // use a proxy server to prevent CORS error
    url: "https://thingproxy.freeboard.io/fetch/https://wind-bow.gomix.me/twitch-api/streams/"
    + user,
    success: (json) => {
      if (json.stream === null) {
        html = "<p>Not currently streaming.</p>";
        $statusBox.append(" Offline");
      } else {
        // get details of stream
        game = json.stream.game;
        viewers = json.stream.viewers;
        status = json.stream.channel.status;
        html = "<p>Currently streaming.</p><p><b>Game:</b> " + game +
        ";  <b>Status:</b> " + status + ";  <b>Viewers:</b> " + viewers + "</p>";
        $statusBox.append(" <b>Online</b>");
        $statusIndicator.css("color", "green");
      }
      $userBox.append(html);
    },
    error: () => {
      $userBox.append("<p>Sorry, something went wrong when we tried to get streaming data about this user.</p>");
    }
  });

}

// refresh the page
$(".refresh").on("click", () => {
  "use strict";
// refresh from the server, not the cache
  location.reload(true);
});
