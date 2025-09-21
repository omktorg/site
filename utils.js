// utils.js - Utility functions module

// Generate Ethereum-style wallet address
function generateWalletAddress() {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

// Generate transaction hash
function generateTxHash() {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// Check if trade is new (within 24 hours)
function isNewTrade(timestamp) {
  const dayInMs = 24 * 60 * 60 * 1000;
  return Date.now() - timestamp < dayInMs;
}

// Format timestamp to relative time
function formatTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return t('time_just_now');
  if (minutes < 60) return t('time_minutes_ago', minutes);
  if (hours < 24) return t('time_hours_ago', hours);
  if (days < 7) return t('time_days_ago', days);

  return new Date(timestamp).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US');
}

// Copy text to clipboard
function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

// Toast notification system
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toastContainer') || createToastContainer();

  const toastId = 'toast-' + Date.now();
  const toastHtml = `
    <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;

  toastContainer.insertAdjacentHTML('beforeend', toastHtml);
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement);
  toast.show();

  toastElement.addEventListener('hidden.bs.toast', () => {
    toastElement.remove();
  });
}

// Create toast container if it doesn't exist
function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toastContainer';
  container.className = 'toast-container position-fixed top-0 end-0 p-3';
  container.style.zIndex = '11';
  document.body.appendChild(container);
  return container;
}

// Image upload handling
function handleImageUpload(files, selectedImages, maxImages = 5) {
  const newImages = [];
  
  files.forEach(file => {
    if (selectedImages.length + newImages.length >= maxImages) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
      if (selectedImages.length + newImages.length < maxImages) {
        newImages.push(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  });
  
  return newImages;
}

// Update image preview grid
function updateImagePreview(selectedImages, previewContainerId) {
  const preview = document.getElementById(previewContainerId);
  preview.innerHTML = '';

  selectedImages.forEach((img, index) => {
    const slot = document.createElement('div');
    slot.className = 'image-slot';
    slot.innerHTML = `
      <img src="${img}" alt="Image ${index + 1}">
      <button class="btn btn-danger btn-sm rounded-circle btn-remove" onclick="removeImage(${index})">
        <i class="bi bi-x"></i>
      </button>
    `;
    preview.appendChild(slot);
  });

  if (selectedImages.length < 5) {
    const addSlot = document.createElement('div');
    addSlot.className = 'image-slot';
    addSlot.onclick = () => document.getElementById('imageInput').click();
    addSlot.innerHTML = '<i class="bi bi-plus-lg fs-3 text-secondary"></i>';
    preview.appendChild(addSlot);
  }
}

// Get current time string for chat
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}