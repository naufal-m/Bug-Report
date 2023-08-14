// JavaScript to handle popup functionality
function openPopup(popupId) {
    var popup = document.getElementById(popupId);
    if (popup) {
        popup.classList.add('active');
        document.getElementById('popupContainer').style.display = 'block';
    }
}

function closePopup(popupId) {
    console.log('button pressed');
    var popup = document.getElementById(popupId);
    if (popup) {
        // Clear the form fields
        var form = popup.querySelector('form');
        if (form) {
            form.reset();
        }
        popup.classList.remove('active');
        document.getElementById('popupContainer').style.display = 'none';
    }
}
