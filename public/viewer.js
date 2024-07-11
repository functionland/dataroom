document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const docUrl = urlParams.get('docUrl');
    let email = localStorage.getItem('email');

    if (!email) {
        email = 'anonymous';
        localStorage.setItem('email', email);
    }

    if (docUrl) {
        document.getElementById('viewer-container').innerHTML = `
            <iframe src="${docUrl}" width="100%" height="100%" frameborder="0" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
        `;
        const startTime = Date.now();

        window.addEventListener('beforeunload', () => {
            const endTime = Date.now();
            const timeSpent = endTime - startTime;

            window.db.collection('pageViews').add({
                email: email,
                docUrl: docUrl,
                timeSpent: timeSpent,
                timestamp: new Date()
            });
        });
    } else {
        alert('No document URL provided.');
    }
});
