// JavaScript to handle popup functionality
function openPopup(popupId) {
    var popup = document.getElementById(popupId);
    if (popup) {
        popup.classList.add('active');
        document.getElementById('popupContainer').style.display = 'block';
    }
}

function closePopup(popupId) {
    var popup = document.getElementById(popupId);
    if (popup) {
        popup.classList.remove('active');
        document.getElementById('popupContainer').style.display = 'none';
    }
}
