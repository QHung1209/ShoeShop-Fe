$(document).ready(function () {
  // Gọi hàm lấy dữ liệu và thêm bảng vào khi trang web được tải
  fetchDataAndPopulateTable();
  $("#add-size-btn").click(function () {
    event.preventDefault();
    addSize();
  });

  // Gán sự kiện click cho nút "Lưu"
  $(document).on("click", ".save-btn", function () {
    var row = $(this).closest("tr");
    var newSizeName = row.find(".size-input").val();
    var sizeName = row.data("size-id");
    updateSize(sizeName, newSizeName, row);
  });
});
var itemCount = 0; // Biến đếm số lượng sản phẩm
function fetchDataAndPopulateTable() {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin/product/getSizes",
  }).done(function (msg) {
    if (msg.data) {
      existingSizes = msg.data.map((size) => size.size_name);
      var tableHTML = "<table>";
      tableHTML += "<tr><th>STT</th><th>Size giày</th><th>Chức năng</th></tr>";
      itemCount = 0;
      msg.data.forEach(function (size) {
        itemCount++;
        tableHTML += "<tr data-size-id='" + size.size_name + "'>";
        tableHTML += "<td>" + itemCount + "</td>";
        tableHTML +=
          "<td><span class='size-display'>" +
          size.size_name +
          "</span><input class='size-input' type='text' value='" +
          size.size_name +
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
        row.find(".size-display").hide();
        row.find(".size-input").show();
        row.find(".edit-btn").hide();
        row.find(".save-btn").show();
      });
    } else {
      alert("Không có dữ liệu sản phẩm");
    }
  });
}

function addSize() {
  // Lấy giá trị từ ô input
  var sizeName = $("#size-name").val();

  // Kiểm tra xem người dùng đã nhập đủ thông tin chưa
  if (!sizeName) {
    alert("Vui lòng nhập đầy đủ thông tin sản phẩm");
    return;
  }

  // Kiểm tra xem size đã tồn tại chưa
  checkSizeExists(sizeName, function (exists) {
    if (exists) {
      alert("Size giày đã tồn tại!");
    } else {
      // Nếu size chưa tồn tại, tạo đối tượng newSize từ dữ liệu người dùng nhập
      var newSize = {
        size_name: parseFloat(sizeName), // Chuyển đổi giá trị nhập thành số
      };

      // Gửi yêu cầu POST để thêm sản phẩm mới
      $.ajax({
        method: "POST",
        url: "http://127.0.0.1:8080/admin/product/sizes",
        data: newSize,
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

function updateSize(sizeName, newSizeName, row) {
  if (
    checkSizeExists(newSizeName, function (exists) {
      if (exists) {
        alert("Size giày đã tồn tại!");
      } else {
        updateSizeOnServer(sizeName, newSizeName, row);
      }
    })
  );
}

// Hàm cập nhật dữ liệu trên giao diện
function updateUI(row, newSizeName) {
  row.find(".size-display").text(newSizeName); // Cập nhật giá trị mới
  row.find(".size-display").show();
  row.find(".size-input").hide();
  row.find(".edit-btn").show();
  row.find(".save-btn").hide();
  row.data("size-id", newSizeName);
}

function updateSizeOnServer(sizeName, newSizeName, row) {
  $.ajax({
    method: "PUT",
    url: "http://localhost:8080/admin/product/updateSizeName",
    data: {
      size_name: sizeName,
      newSizeName: newSizeName,
    },
    success: function (response) {
      // Sau khi cập nhật thành công, cập nhật dữ liệu trên giao diện

      updateUI(row, newSizeName);
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi cập nhật size giày!");
    },
  });
}

function checkSizeExists(sizeName, callback) {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin/product/checkSizeExists",
    data: { size_name: sizeName },
  })
    .done(function (msg) {
      // Gọi callback với kết quả kiểm tra (true nếu size đã tồn tại, false nếu chưa)
      callback(msg);
    })
    .fail(function (xhr, status, error) {
      // Xử lý lỗi nếu có
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi kiểm tra size!");
    });
}
