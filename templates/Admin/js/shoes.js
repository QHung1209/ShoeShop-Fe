$(document).ready(function () {
  fetchDataAndPopulateTable();
  $("#add-shoes-btn").click(function (event) {
    event.preventDefault();
    addShoes();
  });

  $(document).on("click", ".save-name-btn", function () {
    var row = $(this).closest("tr");
    var newName = row.find(".name-input").val();
    var name = row.data("name-id");
    checkShoesNameExists(newName, function (exists) {
      if (exists) {
        alert("Tên giày đã tồn tại!");
      } else {
        updateShoesName(name, newName, row);
      }
    });
  });

  $(document).on("click", ".save-price-btn", function () {
    var row = $(this).closest("tr");
    var newPrice = row.find(".price-input").val();
    var name = row.data("name-id"); // Lấy tên giày từ data attribute
    updateShoesPrice(name, newPrice, row);
  });
});

var itemCount = 0; // Biến đếm số lượng sản phẩm
function fetchDataAndPopulateTable() {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin/product/getShoes",
  }).done(function (msg) {
    if (msg.data) {
      existingShoesName = msg.data.map((shoes) => shoes.name);
      var tableHTML = "<table>";
      tableHTML +=
        "<tr><th>STT</th><th>Tên giày</th><th>Giá cả</th><th>Chức năng</th></tr>";
      itemCount = 0;
      msg.data.forEach(function (shoes) {
        itemCount++;
        tableHTML += "<tr data-name-id='" + shoes.name + "' data-price-id='" + shoes.price + "'>";
        tableHTML += "<td>" + itemCount + "</td>";
        tableHTML +=
          "<td><span class='name-display'>" +
          shoes.name +
          "</span><input class='name-input' type='text' value='" +
          shoes.name +
          "' style='display:none;'/></td>";
        tableHTML +=
          "<td><span class='price-display'>" +
          shoes.price +
          "</span><input class='price-input' type='number' value='" +
          shoes.price +
          "' style='display:none;'/></td>";
        tableHTML += "<td>";
        tableHTML +=
          "<button class='edit-name-btn'><i class='fas fa-edit'></i>Sửa Tên</button>";
        tableHTML +=
          "<button class='save-name-btn' style='display:none;'><i class='fas fa-save'></i>Lưu Tên</button>";
        tableHTML +=
          "<button class='edit-price-btn'><i class='fas fa-edit'></i>Sửa Giá</button>";
        tableHTML +=
          "<button class='save-price-btn' style='display:none;'><i class='fas fa-save'></i>Lưu Giá</button>";
        tableHTML += "</td>";
        tableHTML += "</tr>";
      });
      tableHTML += "</table>";
      $("#table-container").html(tableHTML);

      $(".edit-name-btn").click(function () {
        var row = $(this).closest("tr");
        row.find(".name-display").hide();
        row.find(".name-input").show();
        row.find(".edit-name-btn").hide();
        row.find(".save-name-btn").show();
      });

      $(".edit-price-btn").click(function () {
        var row = $(this).closest("tr");
        row.find(".price-display").hide();
        row.find(".price-input").show();
        row.find(".edit-price-btn").hide();
        row.find(".save-price-btn").show();
      });
    } else {
      alert("Không có dữ liệu sản phẩm");
    }
  });
}

function addShoes() {
  var name = $("#name").val();
  var price = $("#price").val();

  if (!name || !price) {
    alert("Vui lòng nhập đầy đủ thông tin sản phẩm");
    return;
  }

  checkShoesNameExists(name, function (exists) {
    if (exists) {
      alert("Tên giày đã tồn tại!");
    } else {
      var newShoes = {
        name: name,
        price: parseFloat(price),
      };

      $.ajax({
        method: "POST",
        url: "http://127.0.0.1:8080/admin/product/addShoes",
        data: newShoes,
      })
        .done(function (response) {
          fetchDataAndPopulateTable();
        })
        .fail(function (xhr, status, error) {
          console.error("Error:", error);
          alert("Có lỗi xảy ra khi thêm sản phẩm!");
        });
    }
  });
}

function updateShoesName(name, newName, row) {
  $.ajax({
    method: "PUT",
    url: "http://127.0.0.1:8080/admin/product/updateShoesName",
    data: {
      name: name,
      new_name: newName,
    },
    success: function (response) {
      row.find(".name-display").text(newName);
      row.find(".name-display").show();
      row.find(".name-input").hide();
      row.find(".edit-name-btn").show();
      row.find(".save-name-btn").hide();
      row.data("name-id", newName);
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi cập nhật tên giày!");
    },
  });
}

function updateShoesPrice(name, newPrice, row) {
  $.ajax({
    method: "PUT",
    url: "http://127.0.0.1:8080/admin/product/updateShoesPrice",
    data: {
      name: name, // Use name to identify the shoe
      new_price: parseFloat(newPrice),
    },
    success: function (response) {
      row.find(".price-display").text(newPrice);
      row.find(".price-display").show();
      row.find(".price-input").hide();
      row.find(".edit-price-btn").show();
      row.find(".save-price-btn").hide();
      row.data("price-id", newPrice);
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi cập nhật giá giày!");
    },
  });
}

function checkShoesNameExists(name, callback) {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin/product/checkShoesNameExists",
    data: { name: name },
  })
    .done(function (msg) {
      callback(msg);
    })
    .fail(function (xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi kiểm tra tên giày!");
    });
}
