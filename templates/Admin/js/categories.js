$(document).ready(function () {
  // Gọi hàm lấy dữ liệu và thêm bảng vào khi trang web được tải
  fetchDataAndPopulateTable();
  $("#add-category-btn").click(function () {
    event.preventDefault();
    addCategory();
  });

  // Gán sự kiện click cho nút "Lưu"
  $(document).on("click", ".save-btn", function () {
    var row = $(this).closest("tr");
    var newCategoryName = row.find(".category-input").val();
    var categoryName = row.data("category-id");
    updateCategory(categoryName, newCategoryName, row);
  });
});
var itemCount = 0; // Biến đếm số lượng sản phẩm
function fetchDataAndPopulateTable() {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin/product/getCategories",
  }).done(function (msg) {
    if (msg.data) {
      existingCategories = msg.data.map((category) => category.category_name);
      var tableHTML = "<table>";
      tableHTML +=
        "<tr><th>STT</th><th>Dòng dáng giày</th><th>Chức năng</th></tr>";
      itemCount = 0;
      msg.data.forEach(function (category) {
        itemCount++;
        tableHTML += "<tr data-category-id='" + category.category_name + "'>";
        tableHTML += "<td>" + itemCount + "</td>";
        tableHTML +=
          "<td><span class='category-display'>" +
            category.category_name +
          "</span><input class='category-input' type='text' value='" +
          category.category_name +
          "' style='display:none;'/></td>";
        tableHTML += "<td>";
        tableHTML +=
          "<button class='edit-btn'><i class='fas fa-edit'></i>Sửa</button>";
        tableHTML +=
          "<button class='save-btn' style='display:none;'><i class='fas fa-save'></i>Lưu</button>";
        tableHTML += "</td>";
        tableHTML += "</tr>";
      });
      tableHTML += "</table>";
      $("#table-container").html(tableHTML);

      $(".edit-btn").click(function () {
        var row = $(this).closest("tr");
        row.find(".category-display").hide();
        row.find(".category-input").show();
        row.find(".edit-btn").hide();
        row.find(".save-btn").show();
      });
    } else {
      alert("Không có dữ liệu sản phẩm");
    }
  });
}

function addCategory() {
  // Lấy giá trị từ ô input
  var categoryName = $("#category-name").val();

  // Kiểm tra xem người dùng đã nhập đủ thông tin chưa
  if (!categoryName) {
    alert("Vui lòng nhập đầy đủ thông tin sản phẩm");
    return;
  }

  // Kiểm tra xem category đã tồn tại chưa
  checkCategoryExists(categoryName, function (exists) {
    if (exists) {
      alert("Category giày đã tồn tại!");
    } else {
      // Nếu style chưa tồn tại, tạo đối tượng newStyle từ dữ liệu người dùng nhập
      var newCategory = {
        category_name: categoryName,
      };

      // Gửi yêu cầu POST để thêm sản phẩm mới
      $.ajax({
        method: "POST",
        url: "http://127.0.0.1:8080/admin/product/addCategories",
        data: newCategory,
      })
        .done(function (response) {
          // Sau khi thêm sản phẩm, cập nhật lại bảng dữ liệu
          fetchDataAndPopulateTable();
        })
        .fail(function (xhr, status, error) {
          // Xử lý lỗi nếu có
          console.error("Error:", error);
          alert("Có lỗi xảy ra khi thêm sản phẩm!");
        });
    }
  });
}

function updateCategory(categoryName, newCategoryName, row) {
  if (
    checkCategoryExists(newCategoryName, function (exists) {
      if (exists) {
        alert("category giày đã tồn tại!");
      } else {
        updateCategoryOnServer(categoryName, newCategoryName, row);
      }
    })
  );
}

// Hàm cập nhật dữ liệu trên giao diện
function updateUI(row, newCategoryName) {
  row.find(".category-display").text(newCategoryName); // Cập nhật giá trị mới
  row.find(".category-display").show();
  row.find(".category-input").hide();
  row.find(".edit-btn").show();
  row.find(".save-btn").hide();
  row.data("category-id", newCategoryName);
}

function updateCategoryOnServer(categoryName, newCategoryName, row) {
  $.ajax({
    method: "PUT",
    url: "http://localhost:8080/admin/product/updateCategoryName",
    data: {
      category_name: categoryName,
      newCategoryName: newCategoryName,
    },
    success: function (response) {
      // Sau khi cập nhật thành công, cập nhật dữ liệu trên giao diện

      updateUI(row, newCategoryName);
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi cập nhật category giày!");
    },
  });
}

function checkCategoryExists(categoryName, callback) {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin/product/checkCategoryExists",
    data: { category_name: categoryName },
  })
    .done(function (msg) {
      // Gọi callback với kết quả kiểm tra (true nếu style đã tồn tại, false nếu chưa)
      callback(msg);
    })
    .fail(function (xhr, status, error) {
      // Xử lý lỗi nếu có
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi kiểm tra style!");
    });
}
