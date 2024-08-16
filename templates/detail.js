function checkSelects() {
    var select1 = document.getElementById('size');
    var select2 = document.getElementById('quantity');

    if (select1.value !== "" && select2.value !== "") {
        $.ajax({
            method: "GET",
            url: "http://localhost:8080/inventory/getQuantity",
            data: {
                product_id: $('span.product_id').attr('id'),
                size_id: $('#size').val()
            }
        })
            .done(function (msg) {
                if (msg) {
                    console.log(msg.data)
                    if (msg.data == 0) {
                        alert(`Sản phẩm đã hết size này`)
                        select1.value = "";
                        select2.value = "";
                    }
                }
            });
    }
}
$(document).ready(function () {


    let searchParams = new URLSearchParams(window.location.search)
    var url_temp = window.location.href
    $.ajax({
        method: "GET",
        url: `http://localhost:8080/product/detail?id=${searchParams.get("id")}`

    })
        .done(function (msg) {
            if (msg) {
                value = msg.data;
                console.log(value);
                var priceHtml = "";
                if (value.discount != 0) {
                    var discountedPrice = value.price * (100 - value.discount) / 100;
                    priceHtml = `<span class="vnd">${discountedPrice.toLocaleString('vi-VN')} VND   <s style="text-decoration: line-through; font-size: 14px; margin-left:5%">${value.price.toLocaleString('vi-VN')} VND</s></span>`;
                } else
                    priceHtml = `<span class="vnd">${value.price.toLocaleString('vi-VN')} VND</span>`;
                var html = `<ol class="breadcrumb">
                    <li><a href="#">Giày</a></li>
                    <li>|</li>
                    <li><a href="#">${value.category}</a></li>
                    <li>|</li>
                    <li class="active"><a href="#">${value.shoe_name}</a></li>
                    </ol>
                    `
                $(".path-to-product").append(html)
                $(".main-image").append(`<img src="${value.image_url}" alt="">`)

                var html2 = `<h4>${value.shoe_name} - ${value.color_name}</h4>
                    <h6>
                    
                      <span class="product_id" id="${value.product_id}" >Mã sản phẩm: <strong>${value.product_id}</strong></span>
                     
                    </h6>
                    <h5>
                      ${priceHtml}
                    </h5>`
                $(".name_id_price").append(html2)

                if (msg.data.related_products) {
                    $.each(msg.data.related_products, function (index, value) {
                        console.log(value);
                        var color = ` <li class="color2" ><a href="productdetail.html?id=${value.product_id}"><i class='bx bxs-square' style="color: ${value.color_code}; "></i></a></li>`

                        $(".related_color").append(color)
                    })
                }

                if (msg.data.inventoryDTOs) {
                    $.each(msg.data.inventoryDTOs, function (index, value) {
                        console.log(value);
                        var size = `<option value="${value.size_id}" id=${value.size_id}>${value.size_name}</option>`

                        $(".size_option").append(size)
                    })
                }
                var i = 0;
                $.each(value.related_products, function (index, product) {
                    if (index >= 4) {
                        return false;
                    }
                    var related_html = `<div class="box">
                                            <a href = "./productdetail.html?id=${product.product_id}">
                                            <img src="${product.image_url}" alt="">
                                            </a>
                                            <a href="productdetail.html?id=${product.product_id}" class="ten-giay">${product.shoe_name}</a>
                                            <span class="color">${product.color_name}</span>
                                            <span class="price">${product.price.toLocaleString('vi-VN')} <span>VND</span></span>
                                        </div>`
                    $(".big-box").append(related_html);
                })

                $.each(value.imageDTOs, function (index, image) {
                    var image_html = `<div class="swiper-slide"><img src="${image.image_url}" alt=""></div>`
                    $(".sub-images").append(image_html);

                })

                var info_html = `<p style="text-transform: capitalize;">Gender: ${value.gender}</p>
                                <p>Material: ${value.material}</p>
                                <p>Style: ${value.style}</p>
                                <img src="../static/images/image1.png" alt="">`
                $(".info-gender").append(info_html)
            }

        });




    document.getElementById("add").addEventListener("click", function () {
        var token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "./signin.html";
        }
        else {
            if ($('#size').val() == null || $('#quantity').val() == null) {
                $(".warning").empty()
                $(".warning").append(`<p style="color: red;">Chọn size/ số lượng phù hợp</p>`)
            }
            else {
                console.log($('span.product_id').attr('id'))
                console.log($('#size').val())
                console.log($('#quantity').val())
                $.ajax({
                    method: "GET",
                    url: "http://localhost:8080/user/Detail",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                })
                    .done(function (msg) {
                        if (msg) {
                            $.ajax({
                                method: "POST",
                                url: "http://localhost:8080/cart/insertCart",
                                data: {
                                    user_id: msg.data.user.user_id,
                                    product_id: $('span.product_id').attr('id'),
                                    size_id: $('#size').val(),
                                    quantity: $('#quantity').val()
                                },

                            })
                                .done(function (msg2) {
                                    if (msg2) {
                                        alert("Thêm thành công");
                                        $(".warning").empty();
                                    }
                                })
                        }
                    });
            }
        }

    });


    document.getElementById("pay").addEventListener("click", function () {
        var token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "./signin.html";
        }
        else {
            if ($('#size').val() == null || $('#quantity').val() == null) {
                $(".warning").empty()
                $(".warning").append(`<p style="color: red;">Chọn size/ số lượng phù hợp</p>`)
            }
            else {
                console.log($('span.product_id').attr('id'))
                console.log($('#size').val())
                console.log($('#quantity').val())
                $.ajax({
                    method: "GET",
                    url: "http://localhost:8080/user/Detail",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                })
                    .done(function (msg) {
                        if (msg) {
                            $.ajax({
                                method: "POST",
                                url: "http://localhost:8080/cart/insertCart",
                                data: {
                                    user_id: msg.data.user.user_id,
                                    product_id: $('span.product_id').attr('id'),
                                    size_id: $('#size').val(),
                                    quantity: $('#quantity').val()
                                },

                            })
                                .done(function (msg2) {
                                    if (msg2) {
                                        window.location.href = "./pay.html";
                                    }
                                })
                        }
                    });
            }
        }

    });

    document.getElementById("cart").addEventListener("click", function () {
        var token = localStorage.getItem("token");
        localStorage.setItem("url_temp", url_temp)
        if (!token) {
            window.location.href = "./signin.html"; // Redirect to login page if token is not present
        }
        else {
            window.location.href = "./cart.html";
        }
    });
    document.getElementById("account").addEventListener("click", function () {
        var token = localStorage.getItem("token");
        localStorage.setItem("url_temp", url_temp)
        if (!token) {
            window.location.href = "./signin.html"; // Redirect to login page if token is not present
        }

    });
    document.getElementById("logout").addEventListener("click", function () {
        localStorage.removeItem("token")
        window.location.href = "./homepage.html"; // Redirect to login page if token is not present

    });

    document.getElementById('size').addEventListener('change', checkSelects);
    document.getElementById('quantity').addEventListener('change', checkSelects);

})  