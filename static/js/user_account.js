

function account_controller_click(){
    var account_panel = document.getElementById('account_main_panel');
    var order_history_panel = document.getElementById('order_history_panel');
    var profile_setting_panel = document.getElementById('profile_setting_panel');
    account_panel.style.display = "block";
    order_history_panel.style.display = "none";
    profile_setting_panel.style.display = "none";

}


function order_history_controller_click(){
    var account_panel = document.getElementById('account_main_panel');
    var order_history_panel = document.getElementById('order_history_panel');
    var profile_setting_panel = document.getElementById('profile_setting_panel');
    order_history_panel.style.display = "block";
    account_panel.style.display = "none";
    profile_setting_panel.style.display = "none";
}

function profile_setting_controller_click(){
    var account_panel = document.getElementById('account_main_panel');
    var order_history_panel = document.getElementById('order_history_panel');
    var profile_setting_panel = document.getElementById('profile_setting_panel');

    profile_setting_panel.style.display = "block";
    account_panel.style.display = "none";
    order_history_panel.style.display = "none";

}
