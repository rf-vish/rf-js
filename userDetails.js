jQuery(function ($) {
  // Parse the URL to extract userId, resourceID, and contactId
  const parsedUrl = new URL(window.location.href);
  const params = parsedUrl.search.split('/');
  const userId = params[1]; // Extract the userId
  const resourceId = params[2]; // Extract the resourceID
  const contactId = params[3]; // Extract the contactId

  console.log('User ID: ' + userId);
  console.log('Resource ID: ' + resourceId);
  console.log('Contact ID: ' + contactId);

  if (userId) {
    $.get(
      'https://apiv2.rapidfunnel.com/v2/users-details/' + userId,
      function (data) {
        const userData = data.data[0];
        console.log('userdata', userData);
        for (var key of Object.keys(userData)) {
          localStorage.setItem(key, userData[key]);
          console.log(key);
          var userKey = userData[key];
          if (key != 'customBookingLink') {
            $('.custom_' + key.toLowerCase()).text(userKey);
          }
          if (key == 'profileImage') {
            if (userData[key] !== '') {
              $('.custom_' + key.toLowerCase()).attr('src', userData[key]);
            } else {
              $('.custom_' + key.toLowerCase()).attr(
                'src',
                'https://rfres.com/assets/img/icon-user-default.png'
              );
            }
          }
          if (key == 'email') {
            $('.custom_' + key.toLowerCase()).attr(
              'href',
              'mailto:' + userData[key]
            );
          }
          if (key === 'phoneNumber') {
            if (userData[key] !== '') {
              $('.custom_' + key.toLowerCase()).attr(
                'href',
                'tel:' + userData[key]
              );
            } else {
              $('.custom_' + key.toLowerCase())
                .parent()
                .hide();
            }
          }
          if (key == 'customBookingLink') {
            if (userData[key] !== '') {
              $('.custom_' + key.toLowerCase()).attr('href', userKey);
            } else {
              $('.custom_' + key.toLowerCase()).hide();
            }
          }
          $('.footer-social-links a').each(function () {
            var key = $(this).data('social');
            if (userData.hasOwnProperty(key) && userData[key].trim() !== '') {
              $(this).attr('href', userData[key]);
            } else {
              $(this).hide();
            }
          });
        }
      }
    ).fail(function () {
      console.error('Failed to fetch contact details.');
    });
  } else {
    console.log('No contactId found in the URL.');
  }
});
