$(document).ready(function () {
  fetchDataAndPopulateTable();

  $("#add-user-btn").click(function (event) {
    event.preventDefault();
    addUser();
  });

  $(document).on("click", ".save-btn", function () {
    var row = $(this).closest("tr");
    var userName = row.find(".username-input").val();
    var password = row.find(".password-input").val();
    var name = row.find(".name-input").val();
    var address = row.find(".address-input").val();
    var telephone = row.find(".telephone-input").val();
    var userId = row.data("user-id");
    updateUser(userId, userName, password, name, address, telephone, row);
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

  $(document).on("click", ".delete-btn", function () {
    var userId = $(this).data("id");
    deleteUser(userId);
  });
});

var itemCount = 0;
var originalValue = "";

function fetchDataAndPopulateTable() {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin",
    dataType: "json",
  })
    .done(function (msg) {
      console.log("Response from server:", msg); // Log dữ liệu trả về để kiểm tra

      if (msg && Object.keys(msg).length > 0) {
        var tableHTML = "<table>";
        tableHTML +=
          "<tr><th>STT</th><th>Tên tài khoản</th><th>Mật khẩu</th><th>Tên người dùng</th><th>Địa chỉ</th><th>Số điện thoại</th><th>Chức năng</th></tr>";
        itemCount = 0;

        Object.values(msg).forEach(function (user) {
          itemCount++;
          tableHTML += "<tr data-user-id='" + user.user_id + "'>";
          tableHTML += "<td>" + itemCount + "</td>";
          tableHTML +=
            "<td><span class='username-display'>" +
            user.username +
            "</span><input class='username-input' type='text' value='" +
            user.username +
            "' style='display:none;'/></td>";
          tableHTML +=
            "<td><span class='password-display'>" +
            user.password +
            "</span><input class='password-input' type='text' value='" +
            user.password +
            "' style='display:none;'/></td>";
          tableHTML +=
            "<td><span class='name-display'>" +
            user.name +
            "</span><input class='name-input' type='text' value='" +
            user.name +
            "' style='display:none;'/></td>";
          tableHTML +=
            "<td><span class='address-display'>" +
            user.address +
            "</span><input class='address-input' type='text' value='" +
            user.address +
            "' style='display:none;'/></td>";
          tableHTML +=
            "<td><span class='telephone-display'>" +
            user.telephone +
            "</span><input class='telephone-input' type='text' value='" +
            user.telephone +
            "' style='display:none;'/></td>";
          tableHTML +=
            "<td><button class='edit-btn'><i class='fas fa-edit'></i> Sửa</button><button class='save-btn' style='display:none;'><i class='fas fa-save'></i> Lưu</button><button class='delete-btn' data-id='" + user.user_id + "'><i class='fas fa-trash'></i> Xóa</button></td>";
          tableHTML += "</tr>";
        });

        tableHTML += "</table>";
        $("#table-container").html(tableHTML);

        $(".edit-btn").click(function () {
          var row = $(this).closest("tr");
          row.find(".username-display").hide();
          row.find(".password-display").hide();
          row.find(".name-display").hide();
          row.find(".address-display").hide();
          row.find(".telephone-display").hide();
          row.find(".username-input").show().focus();
          row.find(".password-input").show().focus();
          row.find(".name-input").show().focus();
          row.find(".address-input").show().focus();
          row.find(".telephone-input").show().focus();
          row.find(".edit-btn").hide();
          row.find(".save-btn").show();
          originalValue = row.find(".username-input").val();
        });
      } else {
        alert("Không có dữ liệu tài khoản");
      }
    })
    .fail(function (xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi lấy dữ liệu!");
    });
}

function addUser() {
  var username = $("#username").val();
  var password = $("#password").val();
  var name = $("#name").val();
  var address = $("#address").val();
  var telephone = $("#telephone").val();

  if (!username || !password || !name || !address || !telephone) {
    alert("Vui lòng nhập đầy đủ thông tin tài khoản");
    return;
  }

  var newUser = {
    username: username,
    password: password,
    name: name,
    address: address,
    telephone: telephone,
  };

  $.ajax({
    method: "POST",
    url: "http://127.0.0.1:8080/admin/addAdmin",
    data: $.param(newUser),
    contentType: "application/x-www-form-urlencoded", // Change to application/x-www-form-urlencoded
    dataType: "json",
  })
    .done(function () {
      fetchDataAndPopulateTable();
    })
    .fail(function (xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi thêm tài khoản!");
    });
}

function updateUser(userId, userName, password, name, address, telephone, row) {
  var updatedUser = {
    username: userName,
    password: password,
    name: name,
    address: address,
    telephone: telephone,
  };

  $.ajax({
    method: "PUT",
    url: "http://127.0.0.1:8080/admin/updateAdmin/" + userId,
    data: updatedUser,
    dataType: "json",
    success: function () {
      updateUI(row, updatedUser);
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi cập nhật tài khoản!");
    },
  });
}

function updateUI(row, updatedUser) {
  row.find(".username-display").text(updatedUser.username).show();
  row.find(".password-display").text(updatedUser.password).show();
  row.find(".name-display").text(updatedUser.name).show();
  row.find(".address-display").text(updatedUser.address).show();
  row.find(".telephone-display").text(updatedUser.telephone).show();
  row.find(".username-input").hide();
  row.find(".password-input").hide();
  row.find(".name-input").hide();
  row.find(".address-input").hide();
  row.find(".telephone-input").hide();
  row.find(".edit-btn").show();
  row.find(".save-btn").hide();
}

function cancelEdit(row) {
  row.find(".username-input").val(originalValue).hide();
  row.find(".username-display").show();
  row.find(".edit-btn").show();
  row.find(".save-btn").hide();
}

function deleteUser(userId) {
  $.ajax({
    url: "http://127.0.0.1:8080/admin/deleteAdmin/" + userId,
    type: 'DELETE',
    success: function(result) {
      alert("User deleted successfully");
      fetchDataAndPopulateTable(); // Reload the table data
    },
    error: function(xhr, status, error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra khi xóa dữ liệu!");
    }
  });
}
