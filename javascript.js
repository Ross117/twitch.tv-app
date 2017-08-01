$(window).on("load", () => {
 "use strict";

    const users = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
    const $userContainer = $(".userContainer");
    const statusBox = "<span class='streamStatus'>Offline</span>"
    let link = "";
    let img = "";
    let html = "";

//  for each item in the users array, make a call to the twitch.tv API to get the link to the user's twitch.tv channel, and their logo
    users.map( (val) => {
      $.ajax({
//      use a proxy server to prevent CORS error
        url: "https://thingproxy.freeboard.io/fetch/https://wind-bow.gomix.me/twitch-api/channels/" + val,
        success: (json) => {
          link = json.url;
          img = json.logo;
          html = "<div class='" + val + " userBox'>" + statusBox + "<p><img src=" + img + " alt='' class='img-responsive'><a href=" + link + ">" + val + "</a></p></div>";
//        link opens in new window?
          $userContainer.append(html);
//      call function to check if user is currently streaming
          checkStreamStatus(val);
        },
        error: () => {
          $userContainer.append("<div><p>Sorry, something went wrong when we tried to get data about " + val + ".</p></div>");
        }
      });
    });

});

// make a call to the twitch.tv API to check whether a given user is currently streaming. If they are streaming, get details about the stream.
function checkStreamStatus (user) {
  "use strict";

  const $userBox = $("." + user);
  const $statusBox = $("." + user + " span");
  let html = "";
  let game = "";
  let status = "";
  let viewers = 0;

  $.ajax({
    // use a proxy server to prevent CORS error
    url: "https://thingproxy.freeboard.io/fetch/https://wind-bow.gomix.me/twitch-api/streams/" + user,
    success: (json) => {
//include visual indicator if channel is on or offline?
      if (json.stream === null) {
        html = "<p>Not currently streaming.</p>";
        $statusBox.html("<em>Offline</em>");
      } else {
        // get details of stream
        game = json.stream.game;
        viewers = json.stream.viewers;
        status = json.stream.channel.status;
        html = "<p>Currently streaming.</p><p><b>Game:</b> " + game + ";  <b>Status:</b> " + status + ";  <b>Viewers:</b> " + viewers + "</p>";
        $statusBox.html("<b><em>Online</em></b>");
      }
      $userBox.append(html);
    },
    error: () => {
      $userBox.append("<p>Sorry, something went wrong when we tried to get streaming data about this user.</p>");
    }
  });

}
