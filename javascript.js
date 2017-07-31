$(window).on("load", () => {
 "use strict";

  let $fccStatus = $(".fccStatus");

//call to twitchtv API
  $.ajax({
    // use a proxy server to prevent CORS error
    url: "https://thingproxy.freeboard.io/fetch/https://wind-bow.gomix.me/twitch-api/streams/freecodecamp",
    success: (json) => {
      if (json.stream === null) {
        $fccStatus.html("is not currently streaming.");
      } else {
        $fccStatus.html("is currently streaming.");
      }
      getFCCChannelLink();
    },
    error: () => {
      $fccStatus.text("Sorry, something went wrong.");
    }
  });

});

// get link to FCC twitch channel
function getFCCChannelLink () {
  "use strict";

  $.getJSON("https://thingproxy.freeboard.io/fetch/https://wind-bow.gomix.me/twitch-api/channels/freecodecamp", (json) => {
    $(".fccStatus").html("<a href=" + json.url + ">Free Code Camp</a> " + $(".fccStatus").text());
  });

};
