$(function () {
  var loggedInUser;

  $('#loginButton').click(function () {
    // Read values from input boxes
    var email = $('#email').val();
    var password = $('#password').val();

    $.ajax('http://localhost:3000/login', {
      method: 'POST',
      data: {
        email: email,
        password: password,
      },
      success: function (data, status) {
        if (data === 'User not found') {
          console.log("Wrong username");
        } else if (data === 'Not authorised. Incorrect password') {
          console.log("Wrong password");
        } else {
          // Logged in successfully
          loggedInUser = data;

          // Update greeting to have first name
          $('#firstNameGreeting').text(loggedInUser.firstName);

          // Hide logged out nav
          $('#navLoggedOut').addClass('d-none');
          // Show logged in nav
          $('#navLoggedIn').removeClass('d-none');
        }
      },
    })
  });
});