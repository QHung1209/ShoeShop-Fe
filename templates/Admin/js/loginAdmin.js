$(document).ready(function () {
  $("#btn-signin").click(function () {
    event.preventDefault();
    var username = $("#username").val();
    var password = $("#password").val();
    $.ajax({
      method: "POST",
      url: "http://127.0.0.1:8080/admin/signin",
      data: {
        username: username,
        password: password,
      },
    }).done(function (msg) {
      console.log(msg);
      if (msg.data) {
        window.location.href = "index.html";
      } else {
        alert("Login Failed");
      }
    });
  });
});
