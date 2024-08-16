$(document).ready(function () {
    fetchDataAndPopulateTable();
  });
  
  var itemCount = 0;
  function fetchDataAndPopulateTable() {
    $.ajax({
      method: "GET",
      url: "http://127.0.0.1:8080/admin/product/getOrders" + orderId,
    }).done(function (msg) {
      console.log(msg); // In ra dữ liệu nhận được để kiểm tra
      if (msg.data) {
        var tableHTML = "<table>";
        tableHTML +=
          "<tr><th>STT</th><th>Tên khách hàng</th><th>Địa chỉ</th><th>SĐT</th><th>Hóa đơn</th><th>Ngày giao dịch</th><th>Trạng thái</th><th>Hành động</th><th>Chi tiết</th></tr>";
        itemCount = 0;
        msg.data.forEach(function (order) {
          console.log(order); // In từng đối tượng order để kiểm tra
          itemCount++;
          
          // Chuyển đổi giá trị order_status
          var statusText = order.order_status === 1 ? "Đã xác nhận" : "Chưa xác nhận";
          
          tableHTML +=
            "<tr data-id='" +
            order.order_id +
            "' data-name-id='" +
            order.name +
            "' data-address-id='" +
            order.address +
            "' data-telephone-id='" +
            order.telephone +
            "' data-price-id='" +
            order.total_amount +
            "' data-date-id='" +
            order.date_order +
            "' data-status-id='" +
            order.order_status +
            "'>";
          tableHTML += "<td>" + itemCount + "</td>";
          tableHTML +=
            "<td><span class='name-display'>" +
            order.name +
            "</span></td>";
          tableHTML +=
            "<td><span class='address-display'>" +
            order.address +
            "</span></td>";
          tableHTML +=
            "<td><span class='telephone-display'>" +
            order.telephone +
            "</span></td>";
          tableHTML +=
            "<td><span class='price-display'>" +
            order.total_amount +
            "</span></td>";
          tableHTML +=
            "<td><span class='date-display'>" +
            new Date(order.date_order).toLocaleString() +
            "</span></td>";
          tableHTML +=
            "<td><span class='status-display'>" +
            statusText +
            "</span></td>";
          
          tableHTML += "<td>";
          if (order.order_status === 0) {
            tableHTML += "<button class='edit-btn'>Xác nhận</button>";
          }
          tableHTML += "</td>";
  
          tableHTML += "<td>";
          tableHTML += "<button class='detail-btn'>Xem</button>";
          tableHTML += "</td>";
  
          tableHTML += "</tr>";
        });
        tableHTML += "</table>";
        $("#table-container").html(tableHTML);
  
        $(".edit-btn").click(function () {
          var row = $(this).closest("tr");
          var orderId = row.data("id");
          console.log("Selected Order ID:", orderId); // Log the order ID for debugging
          updateOrder(orderId);
        });
  
        $(".detail-btn").click(function () {
          var row = $(this).closest("tr");
          var orderId = row.data("id");
          console.log("Selected Order ID for details:", orderId); // Log the order ID for debugging
          viewOrderDetails(orderId);
        });
      } else {
        alert("Không có hóa đơn nào chưa được thanh toán.");
      }
    });
  }
  
  function updateOrder(orderId) {
    console.log("Updating Order ID:", orderId); // Debugging log
    $.ajax({
      method: "PUT",
      url: "http://127.0.0.1:8080/admin/product/updateOrders/" + orderId,
      contentType: "application/json",
      success: function (response) {
        alert("Xác nhận đã thanh toán thành công!");
        fetchDataAndPopulateTable();
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
        alert("Có lỗi xảy ra khi xác nhận thanh toán hóa đơn");
      },
    });
  }
  
  function viewOrderDetails(orderId) {
    console.log("Fetching details for Order ID:", orderId); // Debugging log
    $.ajax({
      method: "GET",
      url: "http://127.0.0.1:8080/admin/product/getOrderDetail/" + orderId,
      success: function (response) {
        console.log("Order Details:", response); // Log the details for debugging
        displayOrderDetails(response);
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
        alert("Có lỗi xảy ra khi lấy thông tin chi tiết hóa đơn");
      },
    });
  }
  
  function displayOrderDetails(details) {
    var detailHTML = "<h3>Chi tiết hóa đơn</h3><ul>";
    details.forEach(function (detail) {
      detailHTML +=
        "<li>Mã chi tiết: " + detail.orderDetailId +
        ", Tên sản phẩm: " + detail.shoeName +
        ", Kích cỡ: " + detail.sizeName +
        ", Số lượng: " + detail.quantity +
        ", Giá: " + detail.price +
        "</li>";
    });
    detailHTML += "</ul>";
    $("#detail-container").html(detailHTML);
  }
  