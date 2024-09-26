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

  // If contactId exists, make an API call to get contact details
  if (contactId) {
    $.get(
      'https://apiv2.rapidfunnel.com/v2/contact-details/' + contactId,
      function (response) {
        const contactData = response.data;

        // Populate the form with contact details
        $('#firstName').val(contactData.firstName);
        $('#lastName').val(contactData.lastName);
        $('#email').val(contactData.email);
        $('#phone').val(contactData.phone);
        $('#note').val(contactData.note);
      }
    ).fail(function () {
      console.error('Failed to fetch contact details.');
    });
  } else {
    console.log('No contactId found in the URL.');
  }

  function todayDate() {
    const today = new Date();
    return today.toISOString(); // Adjust the format as needed
  }

  // Handle form submission
  $('#contactForm').on('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    $(':button').attr('disabled', true);

    // Get additional attributes from the form
    const contactForm = $('#contactForm');
    // const labelID = contactForm.getAttribute('labelid');
    // const campaignID = contactForm.getAttribute('campaignid');
    // const redirectUrl = contactForm.getAttribute('redirect');

    // Collect form data for submission
    // const formData = {
    //   firstName: $('#firstName').val(),
    //   lastName: $('#lastName').val(),
    //   email: $('#email').val(),
    //   phone: $('#phone').val(),
    //   note: $('#note').val(),
    //   resourceID: resourceId,
    //   noteTimeStamps: [todayDate()],
    //   contactTag: labelID,
    //   campaign: campaignID || '',
    //   resourceId: resourceId,
    //   senderId: userId,
    //   sentFrom: 'customPage',
    // };

    let formData = contactForm.serialize();

    // Add additional fields not present in the form
    // formData += '&noteTimeStamps[]=' + todayDate() +
    //   '&contactTag=' + labelID +
    //   '&campaign=' + campaignID;

    formData += '&noteTimeStamps[]=' + todayDate();

    

    console.log(formData);

    // Submit the form data to the API
    $.ajax({
      url: 'https://my.rapidfunnel.com/landing/resource/create-custom-contact',
      method: 'POST',
      dataType: "json",
      data: {
        formData: formData, // Send serialized form data
        resourceId: resourceId,
        senderId: userId,
        sentFrom: 'customPage'
      },
      success: function (response) {
        console.log(response);
        if (response.contactId > 0) {
          alert('Form submitted successfully!');
        } else {
          alert('A contact could not be added!');
        }
        // Optionally, redirect or reset the form
        // window.location.href = "https://yourdomain.com/thank-you";  // Redirect after success
      },
      error: function (error) {
        alert('Error submitting the form.');
        console.error(error);
      },
    });
  });
});
