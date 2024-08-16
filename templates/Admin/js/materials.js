$(document).ready(function () {
  fetchDataAndPopulateTable();

  $("#add-material-btn").click(function (event) {
    event.preventDefault();
    addMaterial();
  });

  $(document).on("click", ".save-btn", function () {
    var row = $(this).closest("tr");
    var newMaterialName = row.find(".material-input").val();
    var materialName = row.data("material-id");
    updateMaterial(materialName, newMaterialName, row);
  });

  $(document).on("click", function (event) {
    var target = $(event.target);
    if (!target.closest("tr").length) {
      $(".save-btn:visible").each(function () {
        var row = $(this).closest("tr");
        cancelEdit(row);
      });
    }
  });

  $(document).on("keydown", function (event) {
    if (event.key === "Escape") {
      $(".save-btn:visible").each(function () {
        var row = $(this).closest("tr");
        cancelEdit(row);
      });
    }
  });
});

var itemCount = 0;
var originalValue = "";

function fetchDataAndPopulateTable() {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin/product/getMaterials",
  }).done(function (msg) {
    if (msg.data) {
      var tableHTML = "<table>";
      tableHTML += "<tr><th>STT</th><th>Kiểu dáng giày</th><th>Chức năng</th></tr>";
      itemCount = 0;
      msg.data.forEach(function (material) {
        itemCount++;
        tableHTML += "<tr data-material-id='" + material.material_name + "'>";
        tableHTML += "<td>" + itemCount + "</td>";
        tableHTML += "<td><span class='material-display'>" + material.material_name + "</span><input class='material-input' type='text' value='" + material.material_name + "' style='display:none;'/></td>";
        tableHTML += "<td><button class='edit-btn'><i class='fas fa-edit'></i>Sửa</button><button class='save-btn' style='display:none;'><i class='fas fa-save'></i>Lưu</button></td>";
        tableHTML += "</tr>";
      });
      tableHTML += "</table>";
      $("#table-container").html(tableHTML);

      $(".edit-btn").click(function () {
        var row = $(this).closest("tr");
        row.find(".material-display").hide();
        row.find(".material-input").show().focus();
        row.find(".edit-btn").hide();
        row.find(".save-btn").show();
        originalValue = row.find(".material-input").val();
      });
    } else {
      alert("Không có dữ liệu sản phẩm");
    }
  });
}

function addMaterial() {
  var materialName = $("#material-name").val();

  if (!materialName) {
    alert("Vui lòng nhập đầy đủ thông tin sản phẩm");
    return;
  }

  checkMaterialExists(materialName, function (exists) {
    if (exists) {
      alert("Chất liệu giày đã tồn tại!");
    } else {
      var newMaterial = { material_name: materialName };

      $.ajax({
        method: "POST",
        url: "http://127.0.0.1:8080/admin/product/addMaterials",
        data: newMaterial,
      })
      .done(function () {
        fetchDataAndPopulateTable();
      })
      .fail(function (xhr, status, error) {
        console.error("Error:", error);
        alert("Có lỗi xảy ra khi thêm sản phẩm!");
      });
    }
  });
}

function updateMaterial(materialName, newMaterialName, row) {
  checkMaterialExists(newMaterialName, function (exists) {
    if (exists) {
      alert("Chất liệu giày đã tồn tại!");
    } else {
      updateMaterialOnServer(materialName, newMaterialName, row);
    }
  });
}

function updateUI(row, newMaterialName) {
  row.find(".material-display").text(newMaterialName).show();
  row.find(".material-input").hide();
  row.find(".edit-btn").show();
  row.find(".save-btn").hide();
  row.data("material-id", newMaterialName);
}

function updateMaterialOnServer(materialName, newMaterialName, row) {
  $.ajax({
    method: "PUT",
    url: "http://localhost:8080/admin/product/updateMaterialName",
    data: {
      material_name: materialName,
      newMaterialName: newMaterialName,
    },
    success: function () {
      updateUI(row, newMaterialName);
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi cập nhật chất liệu giày!");
    },
  });
}

function checkMaterialExists(materialName, callback) {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin/product/checkMaterialExists",
    data: { material_name: materialName },
  })
  .done(function (msg) {
    callback(msg);
  })
  .fail(function (xhr, status, error) {
    console.error("Error:", error);
    alert("Có lỗi xảy ra khi kiểm tra chất liệu!");
  });
}

function cancelEdit(row) {
  row.find(".material-input").val(originalValue).hide();
  row.find(".material-display").show();
  row.find(".edit-btn").show();
  row.find(".save-btn").hide();
}
