$(document).ready(function () {

    $.ajax({
        method: "GET",
        url: "http://localhost:8080/product/mostsell",
    })



        .done(function (msg) {
            if (msg) {
                $.each(msg.data, function (index, value) {
                    $("#most-sell").append(`<div class="products">
                    <a href="./productdetail.html?id=${value.product_id}"><img src="${value.image_url}" alt="" style="width:200px; height:200px"></a>
                    <a href="productdetail.html?id=${value.product_id}" class="ten-giay">${value.shoe_name}</a>
                    <span class ="color_name" >
                      ${value.color_name} 
                      </div>`)
                })
            }

        });
    document.getElementById("allblack").addEventListener("click", function (event) {
        localStorage.setItem('search', 'black')
        window.location.href = "./productlist.html"
    })

    document.getElementById("saleoff").addEventListener("click", function (event) {
        localStorage.setItem('saleoff', true);
        window.location.href = "./productlist.html";
    })
})
