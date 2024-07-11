document.addEventListener('DOMContentLoaded', () => {
    const emailModal = document.getElementById('emailModal');
    const emailInput = document.getElementById('emailInput');
    const submitEmailButton = document.getElementById('submitEmail');
    const cancelEmailButton = document.getElementById('cancelEmail');
    const loadingMessage = document.getElementById('loadingMessage');

    const documentsContainer = {
        'overview-documents': document.getElementById('overview-documents-list'),
        'detailed-documents': document.getElementById('detailed-documents-list'),
        'technical-documents': document.getElementById('technical-documents-list')
    };

    let email = localStorage.getItem('email');
    if (!email) {
        emailModal.classList.add('active');
    }

    submitEmailButton.addEventListener('click', () => {
        email = emailInput.value;
        if (email && window.db) {
            localStorage.setItem('email', email);
            window.db.collection('emails').add({
                email,
                page: window.location.href,
                timestamp: new Date()
            }).then(() => {
                emailModal.classList.remove('active');
            });
        }
    });

    cancelEmailButton.addEventListener('click', () => {
        emailModal.classList.remove('active');
    });

    // Retry mechanism to ensure db is available
    const checkDbInterval = setInterval(() => {
        if (window.db) {
            clearInterval(checkDbInterval);

            // Handle document ID in URL path
            const pathSegments = window.location.pathname.split('/').filter(Boolean);
            const docId = pathSegments[0];
            if (docId) {
                if (!email) {
                    emailModal.classList.add('active');
                } else {
                    loadingMessage.classList.add('active');
                    window.db.collection('documents').where('ID', '==', docId).get().then(snapshot => {
                        if (!snapshot.empty) {
                            snapshot.forEach(doc => {
                                const data = doc.data();
                                
                                // Log page view
                                window.db.collection('pageViews').add({
                                    email,
                                    docUrl: docId,
                                    timestamp: new Date()
                                });
                                if (data.type === 'iframe') {
                                    window.location.href = `viewer.html?docUrl=${encodeURIComponent(data.url)}`;
                                } else {
                                    window.location.href = data.url;
                                }
                            });
                        } else {
                            alert('Failed to find the requested document.');
                            window.location.href = 'index.html';
                        }
                    }).catch(error => {
                        console.error('Error getting document:', error);
                        alert('Failed to find the requested document.');
                        window.location.href = 'index.html';
                    }).finally(() => {
                        loadingMessage.classList.remove('active');
                    });
                }
            } else {
                loadingMessage.classList.remove('active');
            }

            // Get documents from Firebase
            window.db.collection('documents').get().then(snapshot => {
                const docsBySection = {
                    'overview-documents': [],
                    'detailed-documents': [],
                    'technical-documents': []
                };

                snapshot.forEach(doc => {
                    const data = doc.data();
                    if (docsBySection[data.section]) {
                        docsBySection[data.section].push(data);
                    }
                });

                Object.keys(docsBySection).forEach(section => {
                    docsBySection[section].sort((a, b) => a.order - b.order);
                    docsBySection[section].forEach(data => {
                        const documentElement = document.createElement('div');
                        documentElement.classList.add('document');
                        documentElement.innerHTML = `
                            <a href="#" onclick="openDoc('${data.url}', '${data.type}', '${data.ID}')">
                                <img src="${data.thumbnail}" alt="${data.title}">
                                <div class="content">
                                    <div class="title">${data.title}</div>
                                    <div class="description">${data.description}</div>
                                </div>
                            </a>
                        `;
                        if (documentsContainer[section]) {
                            documentsContainer[section].appendChild(documentElement);
                        }
                    });
                });
            }).catch(error => {
                console.error('Error getting documents:', error);
            });
        } else {
            console.error('No db object found, retrying...');
        }
    }, 1000);

    // Open document in new tab
    window.openDoc = function (url, type, id) {
        
        // Log page view
        if (window.db && email) {
            window.db.collection('pageViews').add({
                email: email,
                docUrl: id,
                timestamp: new Date()
            });
        }
        if (type === 'iframe') {
            window.open(`viewer.html?docUrl=${encodeURIComponent(url)}`, '_blank');
        } else {
            window.open(url, '_blank');
        }
    };
});
