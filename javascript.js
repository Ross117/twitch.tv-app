$(window).on("load", () => {
 "use strict";

    const users = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
    const $userContainer = $(".userContainer");
    let link = "";
    let img = "";
    let html = "";

//  create a loading screen for when page is loading?

//  for each item in the users array, make a call to the twitch.tv API to get the link to the user's twitch.tv channel
    users.map( (val) => {
      $.ajax({
//      use a proxy server to prevent CORS error
        url: "https://thingproxy.freeboard.io/fetch/https://wind-bow.gomix.me/twitch-api/channels/" + val,
        success: (json) => {
          link = json.url;
          img = json.logo;
          html = "<div class='" + val + " userBox'><p><a href=" + link + ">" +
          val + "</a><img src=" + img + " alt='' class='img-responsive'></p></div>";
//        link opens in new window?
          $userContainer.append(html);
//      call function to check if user is currently streaming, get details
//      if they are streaming
          checkStreamStatus(val);
        },
        error: () => {
          $userContainer.append("<div><p>Sorry, something went wrong when we tried to get data about "
          + val + ".</p></div>");
        }
      });
    });

});

// make a call to the twitch.tv API to check whether a given user is currently streaming
function checkStreamStatus (user) {
  "use strict";

  const $userBox = $("." + user);
  let html = "";
  let game = "";
  let status = "";
  let viewers = 0;

  $.ajax({
    // use a proxy server to prevent CORS error
    url: "https://thingproxy.freeboard.io/fetch/https://wind-bow.gomix.me/twitch-api/streams/"
    + user,
    success: (json) => {
//include visual indicator if channel is on or offline?
      if (json.stream === null) {
        html = "<p>Not currently streaming.</p>"
        $userBox.append(html);
      } else {
        // get details of stream
        game = json.stream.game;
        viewers = json.stream.viewers;
        status = json.stream.channel.status;
        html = "<p>Currently streaming.</p><p><b>Game:</b> " + game
        + ";  <b>Status:</b> " + status + ";  <b>Viewers:</b> " + viewers + "</p>"
        $userBox.append(html);
      }
    },
    error: () => {
      $userBox.append("<p>Sorry, something went wrong when we tried to get data about this user.</p>");
    }
  });

}
