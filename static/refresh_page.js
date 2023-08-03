// Function to fetch the updated status counts from the server
function fetchStatusCounts() {
    fetch('/get_status_counts') // Replace with the actual endpoint for getting status counts
        .then(response => response.json())
        .then(statusCounts => {
            // Update the status counts on the page
            document.getElementById('openCount').textContent = `Open: ${statusCounts['Open']}`;
            document.getElementById('inProgressCount').textContent = `In Progress: ${statusCounts['In Progress']}`;
            document.getElementById('closedCount').textContent = `Closed: ${statusCounts['Closed']}`;
        })
        .catch(error => {
            console.error('Error fetching status counts:', error);
        });
}

// Call fetchStatusCounts() after the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchStatusCounts();
});

// Refresh the page after submitting the forms
function handleFormSubmit(formId) {
    // Call fetchStatusCounts() to update the status counts before the page refreshes
    fetchStatusCounts();

    // Submit the form and refresh the page after a slight delay (e.g., 1 second)
    setTimeout(() => {
        document.getElementById(formId).submit();
        window.location.reload();
    }, 1000); // Adjust the delay time as needed
}


// Add event listeners to the form submit buttons
document.getElementById('addBugPopup').addEventListener('submit', (event) => {
    event.preventDefault();
    handleFormSubmit('addBugPopup');
});

document.getElementById('updateBugPopup').addEventListener('submit', (event) => {
    event.preventDefault();
    handleFormSubmit('updateBugPopup');
});


