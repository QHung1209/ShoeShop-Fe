$(document).ready(function () {

    document.getElementById('signup').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default action of the link
        var fullname = document.getElementById('fullName').value.trim();
        var telephone = document.getElementById('phoneNumber').value.trim();
        var username = document.getElementById('username').value.trim();
        var password = document.getElementById('password').value.trim();
        var confirmpass = document.getElementById('confirmPassword').value.trim();
        var address = document.getElementById('address').value.trim();
        var district = document.getElementById('ls_district');
        var ward = document.getElementById('ls_ward');
        var province = document.getElementById('ls_province');
        console.log(fullname);
        console.log(telephone);
        console.log(username);
        console.log(password);
        console.log(confirmpass);
        console.log(address);
        console.log(district.options[district.selectedIndex].text)
        console.log(province.options[province.selectedIndex].text)
        if (!fullname || !telephone || !username || !password || !confirmpass ||
            district.options[district.selectedIndex].text == "Chọn quận / huyện" ||
            ward.options[ward.selectedIndex].text == "Chọn phường / xã" ||
            province.options[province.selectedIndex].text == "Chọn tỉnh / thành phố") {
            $(".warning").empty();  // Clear previous warnings
            $(".warning").append('Nhập đầy đủ thông tin');  // Show the general warning
        } else if (password != confirmpass) {
            $(".warning").empty();  // Clear previous warnings
            $(".warning").append('Kiểm tra lại mật khẩu');  // Show the password mismatch warning
        }
        else {
            $(".warning").empty();
            $.ajax({
                method: "POST",
                url: "http://localhost:8080/signup/",
                data: {
                    username: username,
                    password: password,
                    name: username,
                    address: address + ", " + ward.options[ward.selectedIndex].text + ", " + district.options[district.selectedIndex].text + ", " + province.options[province.selectedIndex].text ,
                    telephone: telephone
                }
            })
                .done(function (msg) {
                    if (msg.data == false) {
                        $(".warning").empty(); 
                        $(".warning").append('Tên đăng nhập đã tồn tại');
                    }
                    else{
                        alert("Tạo tài khoản thành công")
                        window.location.href = "./signin.html"
                    }
                })
        }

    });

})