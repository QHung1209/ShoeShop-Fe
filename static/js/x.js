function toggleDropdown(event) {
  event.preventDefault();
  var dropdown = document.getElementById("myDropdown");
  dropdown.classList.toggle("show");
}

// Đóng dropdown khi click ra ngoài dropdown
window.onclick = function (event) {
  if (!event.target.matches('.account')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

async function getUserDetail() {
  try {
    const response = await $.ajax({
      method: "GET",
      url: "http://localhost:8080/user/Detail",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    });
    // Xử lý dữ liệu ở đây nếu cần
    return response.data.user;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    throw error;
  }
}

$(document).ready(async function () {

  document.getElementById("search-form").addEventListener("submit", function (event) {
    event.preventDefault();
    search_key = document.getElementById('search-input').value;
    localStorage.setItem('search', search_key)
    window.location.href = "./productlist.html"
  });
  $(document).on("click", ".male", function (e) {
    localStorage.setItem('maleCheckboxState', true);
    window.location.href = "./productlist.html?gender=male";
  })

  $(document).on("click", ".female", function (e) {
    localStorage.setItem('femaleCheckboxState', true);
    window.location.href = "./productlist.html?gender=female";
  })
  $(document).on("click", ".sale", function (e) {
    localStorage.setItem('saleoff', true);
    window.location.href = "./productlist.html";
  })

  var token = localStorage.getItem("token");
  var userDetail;
  if (token != null) {
    userDetail = await getUserDetail();
    $(".user_account").append(userDetail.name)
  }
  var url_temp = window.location.href
  document.getElementById("cart").addEventListener("click", function () {
    var token = localStorage.getItem("token");
    localStorage.setItem("url_temp", url_temp)
    if (!token) {
      window.location.href = "./signin.html"; // Redirect to login page if token is not present
    }
    else {
      window.location.href = "./cart.html";
    }
  });


  document.getElementById("account").addEventListener("click", function () {
    var token = localStorage.getItem("token");
    localStorage.setItem("url_temp", url_temp)
    if (!token) {
      window.location.href = "./signin.html"; // Redirect to login page if token is not present
    }

  });
  document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("token")
    window.location.href = "./homepage.html"; // Redirect to login page if token is not present

  });
})