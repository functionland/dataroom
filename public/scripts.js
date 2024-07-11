document.addEventListener('DOMContentLoaded', () => {
    const emailModal = document.getElementById('emailModal');
    const emailInput = document.getElementById('emailInput');
    const submitEmailButton = document.getElementById('submitEmail');
    const cancelEmailButton = document.getElementById('cancelEmail');

    const documentsContainer = {
        'Overview Documents': document.getElementById('overview-documents-list'),
        'Detailed Documents': document.getElementById('detailed-documents-list'),
        'Technical Documents': document.getElementById('technical-documents-list')
    };

    if (!localStorage.getItem('email')) {
        emailModal.classList.add('active');
    }

    submitEmailButton.addEventListener('click', () => {
        const email = emailInput.value;
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

    // Get documents from Firebase
    if (window.db) {
        window.db.collection('documents').get().then(snapshot => {
            const docsBySection = {
                'Overview Documents': [],
                'Detailed Documents': [],
                'Technical Documents': []
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
                        <a href="#" onclick="openDoc('${data.url}', '${data.type}')">
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
        });
    }

    // Open document in new tab
    window.openDoc = function (url, type) {
        if (type === 'iframe') {
            window.open(`viewer.html?docUrl=${encodeURIComponent(url)}`, '_blank');
        } else {
            window.open(url, '_blank');
        }
    };
});
