// DOM Elements
const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const detectBtn = document.getElementById('detectBtn');
const resultContainer = document.getElementById('resultContainer');
const resultTitle = document.getElementById('resultTitle');
const resultConfidence = document.getElementById('resultConfidence');
const resultDescription = document.getElementById('resultDescription');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
});
['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
});

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);
fileInput.addEventListener('change', handleFiles, false);
detectBtn.addEventListener('click', detectTumor, false);

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        // Set dropped file to file input (fixes fetch issue)
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(files[0]);
        fileInput.files = dataTransfer.files;

        handleFiles({ target: { files } });
    }
}

function handleFiles(e) {
    const files = e.target.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            displayPreview(file);
        } else {
            alert('Please upload an image file.');
        }
    }
}

function displayPreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        previewContainer.style.display = 'block';
        dropArea.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

async function detectTumor() {
    detectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting...';
    detectBtn.disabled = true;

    try {
        const file = fileInput.files[0];
        if (!file) throw new Error('No file selected.');

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/detect', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Detection failed');

        const data = await response.json();
        resultTitle.textContent = data.result;
        resultConfidence.textContent = `Confidence: ${data.confidence}`;
        resultDescription.textContent = data.result === 'No Tumor'
            ? 'Your scan shows no signs of brain tumors.'
            : `The scan indicates the presence of a ${data.result.split(': ')[1]} tumor. Please consult with a medical professional.`;

        resultContainer.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        alert('An error occurred during detection. Please try again.');
        console.error('Detection error:', error);
    } finally {
        detectBtn.innerHTML = 'Detect Tumor';
        detectBtn.disabled = false;
    }
}

function resetDetection() {
    previewContainer.style.display = 'none';
    dropArea.style.display = 'block';
    resultContainer.style.display = 'none';
    fileInput.value = '';
}

// Add reset button to preview container
const resetBtn = document.createElement('button');
resetBtn.className = 'reset-btn';
resetBtn.innerHTML = '<i class="fas fa-redo"></i> Reset';
resetBtn.onclick = resetDetection;
previewContainer.appendChild(resetBtn);

// Add styles
const style = document.createElement('style');
style.textContent = `
    .reset-btn {
        background: var(--light-text);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        cursor: pointer;
        margin-top: 1rem;
        transition: var(--transition);
    }
    .reset-btn:hover {
        background: var(--text-color);
    }
    .highlight {
        background: rgba(37, 99, 235, 0.1);
        border-color: var(--secondary-color);
    }
`;
document.head.appendChild(style);
