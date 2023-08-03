function handleFormSubmit(formId) {
    // Submit the form and refresh the page after a slight delay (e.g., 1 second)
    setTimeout(() => {
        document.getElementById(formId).submit();
        window.location.reload();
    }, 1000); // Adjust the delay time as needed
}

document.getElementById('updateBugPopup').addEventListener('submit', (event) => {
    event.preventDefault();
    handleFormSubmit('updateBugPopup');
});


