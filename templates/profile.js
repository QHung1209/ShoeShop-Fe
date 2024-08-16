async function getUserDetail() {
    try {
        const response = await $.ajax({
            method: "GET",
            url: "http://localhost:8080/user/Detail",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });
        // Xử lý dữ liệu ở đây nếu cần
        return response.data.user;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        throw error;
    }
}

async function getAllOrders(user_id) {
    const response = await $.ajax({
        method: "GET",
        url: "http://localhost:8080/order/getAllOrder",
        data: { user_id: user_id }
    });
    return response.data;
}

$(document).ready(async function () {

    const userDetails = await getUserDetail()
    console.log(userDetails)
    const allOrders = await getAllOrders(userDetails.user_id)
    console.log(allOrders)
    var account_html = `<div class="row1">
                            <div class="info">
                            <p class="name">${userDetails.username}</p>
                            <div class="contact">
                                <i class='bx bx-envelope' ></i>
                                <p>Họ tên: ${userDetails.name} </p>
                                <i class='bx bx-phone' ></i>
                                <p>Số điện thoại: ${userDetails.telephone}</p>
                               
                            </div>
                            </div>
                        </div>

                        <p class="devider"></p>

                        <div class="row2">
                            <i class='bx bx-location-plus' ></i>
                            <p>${userDetails.address}</p>
                        </div>`
    $(".account-main").append(account_html)


    var options = { year: 'numeric', month: 'long', day: 'numeric' };

    if (allOrders) {
        $.each(allOrders.reverse(), function (index, value) {
            var date = new Date(value.date_order)
            var statusText = value.order_status == 0 ? "Chờ xác nhận" : "Đã xác nhận";
            var cancel = value.order_status == 0 ? '<a href=# class="cancel" id="cancel">Huỷ đơn hàng</a>' : "";
            var order_html = `<div class="box-order">
                                    <div class="row1">
                                    <ul>
                                        <li class="id" id="${value.order_id}">Order ID: ${value.order_id} <span class="status">${statusText}</span></li>
                                        <li class="date">${date.toLocaleDateString('en-US', options)}</li>
                                    </ul>
                                    <div class="option">
                                       ${cancel}
                                    </div>
                                    </div>
                        
                                    <div class="devider"></div>
                        
                                    <div class="row2">
                                    <div class="info">
                                        <div class="contact">
                                        <ul>
                                            <li class="main-li">Liên hệ</li>
                                            <li>${value.userDTO.name}</li>
                                            <li>Số điện thoại: ${value.userDTO.telephone}</li>
                                            <li>Địa chỉ: ${value.userDTO.address}</li>
                                        </ul>
                                        </div>
                                    </div>
                                    <div class="devider"></div>
                                    <div class="products">
                                    
                                    </div>
                                </div>`
            var $orderElement = $(order_html).appendTo(".orders-history");
            $.each(value.listOrderDetailDTOs, function (index, orderDetail) {
                var product_html = `<div class="box">
                                        <img src="${orderDetail.productDTO.image_url}" alt="">
                                        <div class="info">
                                            <ul>
                                            <li>${orderDetail.productDTO.shoe_name + " " + orderDetail.productDTO.color_name}</li>
                                            <li>Size: ${orderDetail.size_name}</li>
                                            <li><span>${orderDetail.quantity} x = ${(orderDetail.productDTO.price * orderDetail.quantity * (100 - orderDetail.productDTO.discount) / 100).toLocaleString('vi-VN')} VND</span></li>
                                            </ul>
                                        </div>
                                        </div>

                                    </div>`
                $orderElement.find(".products").append(product_html);
            })

        })
    }


    document.getElementById('name').value = userDetails.name;
    document.getElementById('telephone').value = userDetails.telephone;
    document.getElementById('address').value = userDetails.address;
    document.getElementById('password').value = userDetails.password;

    $(document).on("click", ".cancel", function () {
        alert("hello")
        var detailElement = $(this).closest('.box-order')
        var order_id = detailElement.find(".id").attr('id')
        $.ajax({
            method: "DELETE",
            url: "http://localhost:8080/order/deleteOrder",
            data: { order_id: order_id }
        })
            .done(function (msg2) {
                if (msg2)
                    location.reload();
            })
    })

    $(document).on("click", ".change", function () {
        $.ajax({
            method: "POST",
            url: "http://localhost:8080/user/update",
            data: {
                name: document.getElementById('name').value,
                telephone: document.getElementById('telephone').value,
                password: document.getElementById('password').value,
                address: document.getElementById('address').value,
                user_id: userDetails.user_id
            }
        })
            .done(function (msg2) {
                if (msg2) {
                    alert("update thanh cong");
                    $.ajax({
                        method: "POST",
                        url: "http://localhost:8080/login/signin",
                        data: {
                            username: userDetails.username,
                            password: document.getElementById('password').value
                        }
                    })
                        .done(function (msg) {
                            console.log(msg)
                            if (msg.success) {
                                localStorage.setItem("token", msg.data)
                                location.reload();

                            }

                        });
                }
            })
    })

    document.getElementById("log_out_controller").addEventListener("click", function () {
        localStorage.removeItem("token")
        window.location.href = "./homepage.html"; // Redirect to login page if token is not present
      });
})