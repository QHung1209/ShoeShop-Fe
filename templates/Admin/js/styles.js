$(document).ready(function () {
  // Gọi hàm lấy dữ liệu và thêm bảng vào khi trang web được tải
  fetchDataAndPopulateTable();
  $("#add-style-btn").click(function () {
    event.preventDefault();
    addStyle();
  });

  // Gán sự kiện click cho nút "Lưu"
  $(document).on("click", ".save-btn", function () {
    var row = $(this).closest("tr");
    var newStyleName = row.find(".style-input").val();
    var styleName = row.data("style-id");
    updateStyle(styleName, newStyleName, row);
  });
});
var itemCount = 0; // Biến đếm số lượng sản phẩm
function fetchDataAndPopulateTable() {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin/product/getStyles",
  }).done(function (msg) {
    if (msg.data) {
      existingStyles = msg.data.map((style) => style.style_name);
      var tableHTML = "<table>";
      tableHTML +=
        "<tr><th>STT</th><th>Kiểu dáng giày</th><th>Chức năng</th></tr>";
      itemCount = 0;
      msg.data.forEach(function (style) {
        itemCount++;
        tableHTML += "<tr data-style-id='" + style.style_name + "'>";
        tableHTML += "<td>" + itemCount + "</td>";
        tableHTML +=
          "<td><span class='style-display'>" +
          style.style_name +
          "</span><input class='style-input' type='text' value='" +
          style.style_name +
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
        row.find(".style-display").hide();
        row.find(".style-input").show();
        row.find(".edit-btn").hide();
        row.find(".save-btn").show();
      });
    } else {
      alert("Không có dữ liệu sản phẩm");
    }
  });
}

function addStyle() {
  // Lấy giá trị từ ô input
  var styleName = $("#style-name").val();

  // Kiểm tra xem người dùng đã nhập đủ thông tin chưa
  if (!styleName) {
    alert("Vui lòng nhập đầy đủ thông tin sản phẩm");
    return;
  }

  // Kiểm tra xem style đã tồn tại chưa
  checkStyleExists(styleName, function (exists) {
    if (exists) {
      alert("Style giày đã tồn tại!");
    } else {
      // Nếu style chưa tồn tại, tạo đối tượng newStyle từ dữ liệu người dùng nhập
      var newStyle = {
        style_name: styleName,
      };

      // Gửi yêu cầu POST để thêm sản phẩm mới
      $.ajax({
        method: "POST",
        url: "http://127.0.0.1:8080/admin/product/addStyles",
        data: newStyle,
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

function updateStyle(styleName, newStyleName, row) {
  if (
    checkStyleExists(newStyleName, function (exists) {
      if (exists) {
        alert("Style giày đã tồn tại!");
      } else {
        updateStyleOnServer(styleName, newStyleName, row);
      }
    })
  );
}

// Hàm cập nhật dữ liệu trên giao diện
function updateUI(row, newStyleName) {
  row.find(".style-display").text(newStyleName); // Cập nhật giá trị mới
  row.find(".style-display").show();
  row.find(".style-input").hide();
  row.find(".edit-btn").show();
  row.find(".save-btn").hide();
  row.data("style-id", newStyleName);
}

function updateStyleOnServer(styleName, newStyleName, row) {
  $.ajax({
    method: "PUT",
    url: "http://localhost:8080/admin/product/updateStyleName",
    data: {
      style_name: styleName,
      newStyleName: newStyleName,
    },
    success: function (response) {
      // Sau khi cập nhật thành công, cập nhật dữ liệu trên giao diện

      updateUI(row, newStyleName);
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi cập nhật style giày!");
    },
  });
}

function checkStyleExists(styleName, callback) {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin/product/checkStyleExists",
    data: { style_name: styleName },
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
