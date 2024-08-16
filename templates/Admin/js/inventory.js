$(document).ready(function () {
  fetchDataAndPopulateTable();
  fetchShoeNames();
  fetchSizeNames();
  fetchColorNames();

  $("#submit-inventory-btn").click(function (event) {
    event.preventDefault();
    addInventory();
  });
});

var itemCount = 0;
function fetchDataAndPopulateTable() {
    $.ajax({
      method: "GET",
      url: "http://127.0.0.1:8080/admin/product/getInventory",
    }).done(function (msg) {
      if (msg.data) {
        console.log(msg.data)
        var tableHTML = "<table>";
        tableHTML += "<tr><th>STT</th><th>Tên sản phẩm</th><th>Size</th><th>Màu sắc</th><th>Số lượng</th><th>Chức năng</th></tr>";
        itemCount = 0;
        msg.data.forEach(function (inventory) {
          itemCount++;
          tableHTML += "<tr data-id='" + inventory.inventoryId + "' data-name-id='" + inventory.shoeName + "' data-size-id='" + inventory.sizeName + "'>";
          tableHTML += "<td>" + itemCount + "</td>";
    
          tableHTML += "<td><span class='name-display'>" + inventory.shoeName + "</span></td>";
          tableHTML += "<td><span class='size-display'>" + inventory.sizeName + "</span></td>";
          tableHTML += "<td><span class='color-display'>" + inventory.colorName + "</span></td>";
          tableHTML += "<td><span class='quantity-display'>" + inventory.quantity + "</span></td>";
          tableHTML += "<td>";
          tableHTML += "<button class='edit-btn'>Sửa</button>";
          tableHTML += "</td>";
          tableHTML += "</tr>";
        });
        tableHTML += "</table>";
        $("#table-container").html(tableHTML);
  
        $(".edit-btn").click(function () {
          var row = $(this).closest("tr");
          var inventoryId = row.data("id");
          console.log("Selected Inventory ID:", inventoryId); // Log the inventory ID for debugging
          var newQuantity = prompt("Enter new quantity:");
          if (newQuantity !== null) {
            updateInventoryQuantity(inventoryId, newQuantity);
          }
        });
      } else {
        alert("Không có dữ liệu sản phẩm");
      }
    });
  }
  
  function updateInventoryQuantity(inventoryId, newQuantity) {
    console.log("Updating Inventory ID:", inventoryId, "with new Quantity:", newQuantity); // Debugging log
    $.ajax({
      method: "PUT",
      url: "http://127.0.0.1:8080/admin/product/updateInventory/" + inventoryId,
      data: JSON.stringify({ quantity: newQuantity }),
      contentType: "application/json",
      success: function (response) {
        alert("Quantity updated successfully!");
        fetchDataAndPopulateTable();
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
        alert("Có lỗi xảy ra khi cập nhật số lượng!");
      }
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

function fetchSizeNames() {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin/product/getSizesNames",
  })
    .done(function (data) {
      var sizeNameSelect = $("#size-name-select");
      sizeNameSelect.empty(); // Clear existing options
      data.forEach(function (sizeName) {
        sizeNameSelect.append(new Option(sizeName, sizeName));
      });
    })
    .fail(function (xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi lấy size giày!");
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
      alert("Có lỗi xảy ra khi lấy tên giày!");
    });
}



function addInventory() {
  var shoeName = $("#shoe-name-select").val();
  var sizeName = $("#size-name-select").val();
  var colorName = $("#color-name-select").val();
  var quantity = $("#quantity").val();

  if (!shoeName || !sizeName || !colorName||!quantity) {
    alert("Vui lòng nhập đầy đủ thông tin sản phẩm");
    return;
  }

  var newInventory = {
    shoeName: shoeName,
    sizeName: sizeName,
    colorName: colorName,
    quantity: parseInt(quantity),
  };

  $.ajax({
    method: "POST",
    url: "http://127.0.0.1:8080/admin/product/addInventory",
    contentType: "application/json",
    data: JSON.stringify(newInventory),
  })
    .done(function (response) {
      fetchDataAndPopulateTable();
      alert("Thêm sản phẩm vào kho thành công!");
    })
    .fail(function (xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi thêm sản phẩm vào kho!");
    });
}

