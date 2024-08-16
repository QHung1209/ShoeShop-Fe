$(document).ready(function () {
  fetchShoeNames();
  fetchColorNames();
  fetchStyleNames();
  fetchCategoryNames();
  fetchMaterialNames();

  fetchDataAndPopulateTable();

  $("#submit-product-btn").click(function (event) {
    event.preventDefault();
    addProduct();
  });

  // Event delegation to ensure attachment after table population
  $("#upload-images-btn").click(function () {
    uploadImages();
  });

  $("#cancel-upload-btn").click(function () {
    $("#upload-image-form").hide();
  });
});

var itemCount = 0;

function fetchDataAndPopulateTable() {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin/product/getProduct",
  }).done(function (msg) {
    if (msg.data) {
      var tableHTML = "<table>";
      tableHTML +=
        "<tr><th>STT</th><th>Tên sản phẩm</th><th>Màu sắc</th><th>Giới tính</th><th>Kiểu dáng</th><th>Chất liệu</th><th>Dòng sản phẩm</th><th>Giảm giá</th><th>Ảnh miêu tả</th><th>Chức năng</th></tr>";
      itemCount = 0;
      msg.data.forEach(function (product) {
        itemCount++;
        tableHTML +=
          "<tr data-id='" +
          product.product_id +
          "' data-name-id='" +
          product.shoe_name +
          "' data-color-id='" +
          product.color_name +
          "' data-gender-id='" +
          product.gender +
          "' data-material-id='" +
          product.material +
          "' data-category-id='" +
          product.category +
          "' data-style-id='" +
          product.style +
          "'>";
        tableHTML += "<td>" + itemCount + "</td>";
        tableHTML +=
          "<td><span class='name-display'>" + product.shoe_name + "</span></td>";
        tableHTML +=
          "<td><span class='color-display'>" + product.color_name + "</span></td>";
        tableHTML +=
          "<td><span class='gender-display'>" + product.gender + "</span></td>";
        tableHTML +=
          "<td><span class='style-display'>" + product.style + "</span></td>";
        tableHTML +=
          "<td><span class='material-display'>" + product.material + "</span></td>";
        tableHTML +=
          "<td><span class='category-display'>" + product.category + "</span></td>";
        tableHTML +=
          "<td><span class='discount-display'>" + product.discount + "</span></td>";
        tableHTML +=
          "<td><img src='" +
          product.image_url +
          "' alt='Product Image' style='width: 100px; height: auto;'/></td>";
        tableHTML += "<td>";
        tableHTML += "<button class='edit-btn'>Sửa</button>";
        tableHTML +=
          "<button class='upload-image-btn' data-product-id='" +
          product.product_id +
          "'>Thêm Ảnh</button>";
        tableHTML += "</td>";
        tableHTML += "</tr>";
      });
      tableHTML += "</table>";
      $("#table-container").html(tableHTML);

      // Attach event handler for the upload image buttons
      $(".upload-image-btn").click(function () {
        var productId = $(this).data("product-id");
        $("#product-id").val(productId);
        $("#current-product-id").text(productId);
        $("#upload-image-form").show();
      });

      $(".edit-btn").click(function () {
        var row = $(this).closest("tr");
        var productId = row.data("id");
        console.log("Selected Product ID:", productId); // Log the product ID for debugging
        var newName = $("#shoe-name-select");
        var newColor = $("#color-name-select");
        var newGender = $("#gender-name-select");
        var newStyle = $("#style-name-select");
        var newMaterial = $("#material-name-select");
        var newCategory = $("#category-name-select");
        var newDiscount = $("#discount");
        var newImage = $("#imageFile");

        if (
          newName.val() &&
          newColor.val() &&
          newGender.val() &&
          newStyle.val() &&
          newMaterial.val() &&
          newCategory.val() &&
          newDiscount.val() &&
          newImage[0].files[0]
        ) {
          updateProduct(
            productId,
            newName.val(),
            newColor.val(),
            newGender.val(),
            newStyle.val(),
            newMaterial.val(),
            newCategory.val(),
            newDiscount.val(),
            newImage[0].files[0]
          );
        }
      });
    } else {
      alert("Không có dữ liệu sản phẩm");
    }
  });
}

function updateProduct(
  productId,
  newName,
  newColor,
  newGender,
  newStyle,
  newMaterial,
  newCategory,
  newDiscount,
  newImage
) {
  var formData = new FormData();
  formData.append("shoeName", newName);
  formData.append("colorName", newColor);
  formData.append("genderName", newGender);
  formData.append("styleName", newStyle);
  formData.append("materialName", newMaterial);
  formData.append("categoryName", newCategory);
  formData.append("discount", newDiscount);
  formData.append("imageFile", newImage);

  $.ajax({
    method: "PUT",
    url: "http://127.0.0.1:8080/admin/product/updateProduct/" + productId,
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      alert("Product updated successfully!");
      fetchDataAndPopulateTable();
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi cập nhật sản phẩm!");
    },
  });
}


function fetchShoeNames() {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin/product/getShoesNames",
  })
    .done(function (data) {
      var shoeNameSelect = $("#shoe-name-select");
      shoeNameSelect.empty(); // Clear existing options
      data.forEach(function (shoeName) {
        shoeNameSelect.append(new Option(shoeName, shoeName));
      });
    })
    .fail(function (xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi lấy tên giày!");
    });
}

function fetchColorNames() {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin/product/getColorsNames",
  })
    .done(function (data) {
      var colorNameSelect = $("#color-name-select");
      colorNameSelect.empty(); // Clear existing options
      data.forEach(function (colorName) {
        colorNameSelect.append(new Option(colorName, colorName));
      });
    })
    .fail(function (xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi lấy tên màu!");
    });
}

function fetchMaterialNames() {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin/product/getMaterialsNames",
  })
    .done(function (data) {
      var materialNameSelect = $("#material-name-select");
      materialNameSelect.empty(); // Clear existing options
      data.forEach(function (materialName) {
        materialNameSelect.append(new Option(materialName, materialName));
      });
    })
    .fail(function (xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi lấy tên chất liệu!");
    });
}

function fetchCategoryNames() {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin/product/getCategoriesNames",
  })
    .done(function (data) {
      var categoryNameSelect = $("#category-name-select");
      categoryNameSelect.empty(); // Clear existing options
      data.forEach(function (categoryName) {
        categoryNameSelect.append(new Option(categoryName, categoryName));
      });
    })
    .fail(function (xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi lấy tên dòng!");
    });
}

function fetchStyleNames() {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin/product/getStylesNames",
  })
    .done(function (data) {
      var styleNameSelect = $("#style-name-select");
      styleNameSelect.empty(); // Clear existing options
      data.forEach(function (styleName) {
        styleNameSelect.append(new Option(styleName, styleName));
      });
    })
    .fail(function (xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi lấy tên kiểu dáng!");
    });
}

function addProduct() {
  var formData = new FormData();
  formData.append("shoeName", $("#shoe-name-select").val());
  formData.append("colorName", $("#color-name-select").val());
  formData.append("genderName", $("#gender-name-select").val());
  formData.append("styleName", $("#style-name-select").val());
  formData.append("materialName", $("#material-name-select").val());
  formData.append("categoryName", $("#category-name-select").val());
  formData.append("discount", $("#discount").val());
  formData.append("imageFile", $("#imageFile")[0].files[0]);

  $.ajax({
    url: "http://127.0.0.1:8080/admin/product/addProduct",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      // Handle success response
      console.log("Product added successfully:", response);
      fetchDataAndPopulateTable(); // Refresh table
    },
    error: function (xhr, status, error) {
      // Handle error response
      console.error("Error adding product:", error);
    },
  });
}

function uploadImages() {
  var productId = $("#product-id").val();
  var formData = new FormData();
  formData.append("product-id", productId);
  formData.append("image-file1", $("#image-file-1")[0].files[0]);
  formData.append("image-file2", $("#image-file-2")[0].files[0]);
  formData.append("image-file3", $("#image-file-3")[0].files[0]);
  formData.append("image-file4", $("#image-file-4")[0].files[0]);

  $.ajax({
    method: "POST",
    url: "http://127.0.0.1:8080/admin/product/uploadImage",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      alert("Images uploaded successfully!");
      fetchDataAndPopulateTable();
      $("#upload-image-form").hide();
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi tải lên hình ảnh!");
    },
  });
}
