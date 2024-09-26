jQuery(function ($) {
  // Parse the URL to extract userId, resourceID, and contactId
  const parsedUrl = new URL(window.location.href);
  const params = parsedUrl.search.split('/');
  const userId = params[2]; // Extract the userId
  const resourceID = params[3]; // Extract the resourceID
  const contactId = params[4]; // Extract the contactId
  alert(userId);

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

  // Handle form submission
  $('#contactForm').on('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Collect form data for submission
    const formData = {
      firstName: $('#firstName').val(),
      lastName: $('#lastName').val(),
      email: $('#email').val(),
      phone: $('#phone').val(),
      note: $('#note').val(),
      userId: userId, // Include userId from the URL
      resourceID: resourceID, // Include resourceID from the URL
      contactId: contactId, // Include contactId from the URL
    };

    // Submit the form data to the API
    $.ajax({
      url: 'https://apiv2.rapidfunnel.com/v2/submit-contact-form', // Replace with your submission API endpoint
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(formData), // Convert form data to JSON
      success: function (response) {
        alert('Form submitted successfully!');
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
