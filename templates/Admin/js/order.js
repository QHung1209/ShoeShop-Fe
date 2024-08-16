$(document).ready(function () {
  fetchDataAndPopulateTable();
});

var itemCount = 0;

function fetchDataAndPopulateTable() {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin/product/getOrders",
  }).done(function (msg) {
    if (msg.data) {
      var tableHTML = "<table class='table'>";
      tableHTML +=
        "<tr><th>STT</th><th>Tên khách hàng</th><th>Địa chỉ</th><th>SĐT</th><th>Hóa đơn</th><th>Ngày giao dịch</th><th>Trạng thái</th><th>Hành động</th><th>Chi tiết</th></tr>";
      itemCount = 0;
      msg.data.forEach(function (order) {
        itemCount++;
        var statusText =
          order.order_status === 1 ? "Đã xác nhận" : "Chưa xác nhận";
        tableHTML += "<tr data-id='" + order.order_id + "'>";
        tableHTML += "<td>" + itemCount + "</td>";
        tableHTML += "<td>" + order.name + "</td>";
        tableHTML += "<td>" + order.address + "</td>";
        tableHTML += "<td>" + order.telephone + "</td>";
        tableHTML += "<td>" + order.total_amount + "</td>";
        tableHTML +=
          "<td>" + new Date(order.date_order).toLocaleString() + "</td>";
        tableHTML += "<td>" + statusText + "</td>";
        tableHTML += "<td>";
        if (order.order_status === 0) {
          tableHTML += "<button class='edit-btn'>Xác nhận</button>";
        } else {
          tableHTML += "<button class='edit-btn' disabled>Xác nhận</button>";
        }
        tableHTML += "</td>";
        tableHTML +=
          "<td><button class='detail-btn btn btn-primary' data-toggle='modal' data-target='#orderDetailModal'>Xem</button></td>";
        tableHTML += "</tr>";
      });
      tableHTML += "</table>";
      $("#table-container").html(tableHTML);

      $(".edit-btn").click(function () {
        var row = $(this).closest("tr");
        var orderId = row.data("id");
        updateOrder(orderId);
      });

      $(".detail-btn").click(function () {
        var row = $(this).closest("tr");
        var orderId = row.data("id");
        viewOrderDetails(orderId);
      });
    } else {
      alert("Không có hóa đơn nào chưa được thanh toán.");
    }
  });
}

function updateOrder(orderId) {
  $.ajax({
    method: "PUT",
    url: "http://127.0.0.1:8080/admin/product/updateOrders/" + orderId,
    contentType: "application/json",
    success: function (response) {
      alert("Xác nhận đã thanh toán thành công!");
      fetchDataAndPopulateTable();
    },
    error: function (xhr, status, error) {
      alert("Có lỗi xảy ra khi xác nhận thanh toán hóa đơn");
    },
  });
}

function viewOrderDetails(orderId) {
  $.ajax({
    method: "GET",
    url: "http://127.0.0.1:8080/admin/product/getOrderDetail/" + orderId,
    success: function (response) {
      displayOrderDetails(response);
    },
    error: function (xhr, status, error) {
      alert("Có lỗi xảy ra khi lấy thông tin chi tiết hóa đơn");
    },
  });
}

function displayOrderDetails(details) {
  var detailHTML = "<h3>Chi tiết hóa đơn</h3><ul>";
  details.forEach(function (detail) {
    detailHTML +=
      "<li>Mã chi tiết: " +
      detail.orderDetailId +
      ", Tên sản phẩm: " +
      detail.shoeName +
      ", Kích cỡ: " +
      detail.sizeName +
      ", Màu sắc: " +
      detail.colorName +
      ", Số lượng: " +
      detail.quantity +
      ", Giá: " +
      detail.price +
      "</li>";
  });
  detailHTML += "</ul>";
  $("#orderDetail-table-container").html(detailHTML);
}
