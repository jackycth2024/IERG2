document.addEventListener('DOMContentLoaded', function() {
    const username = "admin";
    const password = "password";

    const loginForm = document.getElementById('loginForm');
    const categoryForm = document.getElementById('categoryForm');
    const productForm = document.getElementById('productForm');
    const productImageInput = document.getElementById('productImage');
    const dropZone = document.getElementById('dropZone');
    const thumbnailPreview = document.getElementById('thumbnailPreview');

    hideForms();

    loginForm.addEventListener('submit', handleLogin);

    fetchCategories();

    productImageInput.addEventListener('change', handleFileSelection);
    dropZone.addEventListener('drop', handleDrop);
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults);
    });

    categoryForm.addEventListener('submit', addCategory);
    productForm.addEventListener('submit', addProduct);

    function hideForms() {
        categoryForm.style.display = 'none';
        productForm.style.display = 'none';
    }

    function showForms() {
        categoryForm.style.display = 'block';
        productForm.style.display = 'block';
    }

    function handleLogin(event) {
        event.preventDefault();
        const enteredUsername = document.getElementById('username').value;
        const enteredPassword = document.getElementById('password').value;

        if (enteredUsername === username && enteredPassword === password) {
            loginForm.style.display = 'none';
            showForms();
        } else {
            alert('Invalid username or password. Please try again.');
        }
    }

    function fetchCategories() {
        fetch('/')
            .then(response => response.json())
            .then(populateCategories)
            .catch(error => console.error('Error fetching categories:', error));
    }

    function populateCategories(categories) {
        const categorySelect = document.getElementById('categoryId');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.catid;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }

    function handleFileSelection(event) {
        const file = event.target.files[0];
        handleFileUpload(file);
    }

    function handleDrop(event) {
        const file = event.dataTransfer.files[0];
        handleFileUpload(file);
    }

    function preventDefaults(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    function handleFileUpload(file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function() {
                const thumbnail = document.createElement('img');
                thumbnail.src = reader.result;
                thumbnail.classList.add('thumbnail');
                thumbnailPreview.innerHTML = '';
                thumbnailPreview.appendChild(thumbnail);
            };
            reader.readAsDataURL(file);
        } else {
            thumbnailPreview.innerHTML = 'Invalid file format';
        }
    }

    function addCategory(event) {
        event.preventDefault();
        const categoryName = document.getElementById('categoryName').value;
    }

    function addProduct(event) {
        event.preventDefault();
        const categoryId = document.getElementById('categoryId').value;
        const productName = document.getElementById('productName').value;
        const productPrice = document.getElementById('productPrice').value;
        const productDescription = document.getElementById('productDescription').value;
        const productImage = document.getElementById('productImage').files[0];
    }
});


