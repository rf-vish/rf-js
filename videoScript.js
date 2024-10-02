jQuery(function ($) {
  // Parse the URL to extract userId, resourceID, and contactId
  const parsedUrl = new URL(window.location.href);
  const params = parsedUrl.search.split('/');
  const userId = params[1]; // Extract the userId
  const resourceId = params[2]; // Extract the resourceID
  const contactId = params[3]; // Extract the contactId
  
  document.addEventListener('DOMContentLoaded', function() {
      // Adding Wistia analytics tracking class to iframes
      $("iframe").each(function() {
          var str = $(this).attr('src');
          if (str.indexOf("wistia") >= 0) {
              $(this).addClass('wistia_embed').attr('name', 'wistia_embed');
          }
      });
      videoAnalytics();
  });
  
  // Wistia video analytics tracking setup
  function videoAnalytics() {
      window._wq = window._wq || [];
      _wq.push({
          "_all": function(video) {
              var contactId,
                  userId,
                  resourceId,
                  url = window.location.href,
                  webinar = $('#webinar').val(),
                  args;
              // const parsedUrl = new URL(url);
              // const params = parsedUrl.search.split('/');
              // resourceId = params[1];
              // userId = params[2];
              // contactId = params[3];
              if ('' !== contactId &&
                  $.isNumeric(resourceId) && $.isNumeric(userId)) {
                  var analyticObject = {
                      resourceId: resourceId,
                      contactId: contactId,
                      userId: userId,
                      percentWatched: 0,
                      mediaHash: '',
                      duration: '',
                      visitorKey: '',
                      eventKey: '',
                      asyncStats: true,
                      delayProcess: 0,
                      webinar: webinar
                  };
                  var percentWatched = 0;
                  video.bind('play', function() {
                      analyticObject.percentWatched = video.percentWatched();
                      analyticObject.mediaHash = video.hashedId();
                      analyticObject.duration = video.duration();
                      analyticObject.visitorKey = video.visitorKey();
                      analyticObject.eventKey = video.eventKey();
                      analyticObject.asyncStats = true;
                      analyticObject.delayProcess = 1;
                      sqsPushAnalytics(analyticObject);
                      analyticObject.delayProcess = 0;
                  });
                  video.email($('#contactEmail').val());
              }
          }
      });
  }
  
  // Function to push video analytics to a remote server
  function sqsPushAnalytics(analyticObject) {
      var postUrl = "https://my.rapidfunnel.com/landing/resource/push-to-sqs";
      $.ajax({
          type: "POST",
          url: postUrl,
          dataType: "json",
          async: analyticObject.asyncStats,
          data: {
              resourceId: analyticObject.resourceId,
              contactId: analyticObject.contactId,
              userId: analyticObject.userId,
              percentageWatched: analyticObject.percentWatched,
              mediaHash: analyticObject.mediaHash,
              duration: analyticObject.duration,
              visitorKey: analyticObject.visitorKey,
              eventKey: analyticObject.eventKey,
              delayProcess: analyticObject.delayProcess,
              webinar: analyticObject.webinar
          },
          success: function(response) {
              if (!response) {
                  bootbox.confirm('Some error occurred. Please reload your video once.', function(result) {
                      if (result) {
                          location.reload();
                      }
                  });
              }
          },
          error: function() {
              bootbox.confirm('Some error occurred. Please reload your video once.', function(result) {
                  if (result) {
                      location.reload();
                  }
              });
          }
      })
  }
)};
