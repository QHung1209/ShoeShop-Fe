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
async function getCartDetails(user_id) {
    const response = await $.ajax({
        method: "GET",
        url: "http://localhost:8080/cart/getAllCarts",
        data: { user_id: user_id }
    });
    return response.data;
}

$(document).ready(async function () {


    const userDetails = await getUserDetail()
    console.log(userDetails)
    const cartDetails = await getCartDetails(userDetails.user_id)
    console.log(cartDetails)

    if (cartDetails) {
        var total = 0;
        var totalSale = 0;
        $.each(cartDetails, function (index, value) {
            total += value.productDTO.price * value.quantity;
            totalSale += value.productDTO.price * value.quantity * value.productDTO.discount / 100;
            var product = `<div class="row2">
                                        <p class="name" value="${value.productDTO.product_id}">${value.productDTO.shoe_name} - Insignia Blue</p>
                                        <p class="price">${(value.productDTO.price * value.quantity).toLocaleString('vi-VN')}</p>
                                    </div>
                        
                                    <div class="row3">
                                        <p class="size" id="${value.size_id}" value ="${value.size_name}">Size: ${value.size_name}</p>
                                        <p class="quantity" value="${value.quantity}">x ${value.quantity}</p>
                                    </div>`;

            $(".list_product").append(product);
        });
        var price = `<div class="row4">
                                <p class="order">Đơn hàng</p>
                                <p class="price">${total.toLocaleString('vi-VN')} VND</p>
                            </div>
                
                            <div class="row5">
                                <p class="promo">Giảm</p>
                                <p class="price">-${totalSale.toLocaleString('vi-VN')} VND</p>
                            </div>
                
                            <div class="row6">
                                <p class="ship-fee">Phí vận chuyển</p>
                                <p class="price">0 VND</p>
                            </div>`;
        $(".price_detail").append(price);

        const parts = userDetails.address;
        const cleanedParts = parts.split(',').map(part => part.trim());
        console.log(cleanedParts);
        document.getElementById('cusNam').value = userDetails.name;
        document.getElementById('cusNumber').value = userDetails.telephone;
        document.getElementById('cusAddress').value = cleanedParts.slice(0, cleanedParts.length - 3).join(', ');
        document.getElementById('total_price').value = total;
        $(".ls_ward").append(`<option value="${cleanedParts[cleanedParts.length - 3]}" id="${cleanedParts[cleanedParts.length - 3]}" hidden selected>${cleanedParts[cleanedParts.length - 3]}</option>`);
        $(".ls_district").append(`<option value="${cleanedParts[cleanedParts.length - 2]}" id="${cleanedParts[cleanedParts.length - 2]}" hidden selected>${cleanedParts[cleanedParts.length - 2]}</option>`);
        $(".ls_province").append(`<option value="${cleanedParts[cleanedParts.length - 1]}" id="${cleanedParts[cleanedParts.length - 1]}" hidden selected>${cleanedParts[cleanedParts.length - 1]}</option>`);

        $(".total_price").append(`${(total - totalSale).toLocaleString('vi-VN')} VND`);
    }

    document.getElementById("complete-payment").addEventListener("click", function () {

        name_user = document.getElementById('cusNam').value.trim();
        telephone_user = document.getElementById('cusNumber').value.trim();
        address_user = document.getElementById('cusAddress').value.trim();

        var district = document.getElementById('ls_district');

        var ward = document.getElementById('ls_ward');
        var province = document.getElementById('ls_province');

        total_price = document.getElementById('total_price').value;
        var date = new Date();
        var timestamp = date.getTime();

        if (cartDetails.length == 0) {
            $(".warning").empty()
            $(".warning").append("Không có sản phẩm để thanh toán")
        }
        else if (!name_user || !telephone_user || !address_user || province.options[province.selectedIndex].text == "undefined" ||
            ward.options[ward.selectedIndex].text == "undefined" || district.options[district.selectedIndex].text == "undefined"
        ) {
            $(".warning").empty()
            $(".warning").append("Điền đầy đủ thông tin")
        }
        else {
            $.ajax({
                method: "POST",
                url: "http://localhost:8080/order/insertOrder",
                data: {
                    user_id: userDetails.user_id,
                    address: address_user + ", " + ward.options[ward.selectedIndex].text + ", " + district.options[district.selectedIndex].text + ", " + province.options[province.selectedIndex].text,
                    name: name_user,
                    telephone: telephone_user,
                    total_amount: total_price - totalSale,
                    date_order: timestamp
                }
            })
                .done(function (msg2) {
                    $.each(cartDetails, function (index, value) {
                        $.ajax({
                            method: "POST",
                            url: "http://localhost:8080/orderDetail/insertOrderDetail",
                            data: {
                                user_id: userDetails.user_id,
                                product_id: value.productDTO.product_id,
                                size_id: document.querySelector('.size').id,
                                quantity: value.quantity,
                                price: value.quantity * value.productDTO.price * (100 - value.productDTO.discount) / 100
                            }
                        })
                            .done(function (msg4) {

                            })
                    })
                    location.reload();
                    alert("Đặt hàng thành công")
                })
        }
    })
});
