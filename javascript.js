$(window).on("load", () => {
 "use strict";

    let users = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
    let $userContainer = $(".userContainer");
    let link = "";

//  create a loading screen for when page is loading?

//  for each item in the users array, make a call to the twitch.tv API to get the link to the user's twitch.tv channel
    users.map( (val) => {

      $.ajax({
//      use a proxy server to prevent CORS error
        url: "https://thingproxy.freeboard.io/fetch/https://wind-bow.gomix.me/twitch-api/channels/" + val,
        success: (json) => {
          link = json.url;
          $userContainer.append("<div class=" + val + "><p><a href=" + link + ">" + val + "</a></p></div>");
//        call function to check if user is currently streaming
          checkStreamStatus(val);
        },
        error: () => {
          $userContainer.append("<div><p>Sorry, something went wrong when we tried to get data about " + val + ".</p></div>");
        }
      });

    });

});

// make a call to the twitch.tv API to check whether a given user is currently streaming
function checkStreamStatus (user) {
  "use strict";

  let $userDiv = $("." + user);

  $.ajax({
    // use a proxy server to prevent CORS error
    url: "https://thingproxy.freeboard.io/fetch/https://wind-bow.gomix.me/twitch-api/streams/" + user,
    success: (json) => {
      if (json.stream === null) {
        $userDiv.append("<p>Not currently streaming.</p>");
      } else {
        $userDiv.append("<p>Currently streaming.</p>");
      }
    },
    error: () => {
      $userDiv.append("<p>Sorry, something went wrong when we tried to get data about this user.</p>");
    }
  });

}
