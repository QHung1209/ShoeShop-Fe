$(document).ready(function () {
    $(".btn-login").click(function () {
        var user = $("#username").val();
        var pass = $("#password").val();
        console.log(user);
        $.ajax({
            method: "POST",
            url: "http://localhost:8080/auth/login",
            contentType: "application/json",
            data: JSON.stringify({
                "username": user,
                "password": pass
            }),
            xhrFields: {
                withCredentials: true // Gửi cookie cùng với yêu cầu
            },
        })
            .done(function (msg) {
                console.log(msg);
                if (msg && msg.accessToken) {
                    // Lưu trữ token
                    localStorage.setItem("access_token", msg.accessToken);

                    // Chuyển hướng người dùng sau khi đăng nhập thành công
                    var redirectUrl = localStorage.getItem("url_temp") || "./homepage.html";
                    window.location.href = redirectUrl;
                } else {
                    // Hiển thị thông báo cảnh báo
                    $(".warning").empty().append("Kiểm tra lại tài khoản và mật khẩu");
                }
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.error("Login failed: ", textStatus, errorThrown);
                $(".warning").empty().append("Có lỗi xảy ra trong quá trình đăng nhập.");
            });
    });

})
