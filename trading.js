// trading.js - Trading functionality module

let trades = [];
let selectedImages = [];
let currentEditId = null;

// Load trades from database
async function loadTrades() {
  try {
    const dbTrades = await dbOperations.getAll('trades');
    const sortedTrades = dbTrades.sort((a, b) => b.timestamp - a.timestamp);
    const samples = addSampleTrades();
    trades = [...samples, ...sortedTrades];
    renderMarketplace();
    renderMyTrades();
  } catch (error) {
    console.error('Error loading trades:', error);
  }
}

// Add sample trades for demo
function addSampleTrades() {
  const sampleTrades = [
    {
      title: t('sample_trade1_title'),
      category: t('sample_trade1_category'),
      price: 1,
      description: t('sample_trade1_desc'),
      images: [],
      timestamp: Date.now() - 3600000,
      seller: generateWalletAddress(),
      views: 45,
      status: 'active',
      keywords: [t('sample_trade1_category')]
    },
    {
      title: t('sample_trade2_title'),
      category: t('sample_trade2_category'),
      price: 1.8,
      description: t('sample_trade2_desc'),
      images: [],
      timestamp: Date.now() - 7200000,
      seller: generateWalletAddress(),
      views: 128,
      status: 'active',
      keywords: [t('sample_trade2_category')]
    }
  ];

  return sampleTrades.map((t, i) => ({
    ...t,
    id: -(i + 1),
    isSample: true
  }));
}

// Render marketplace grid
function renderMarketplace() {
  const container = document.getElementById('marketGrid');
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();

  let filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.title.toLowerCase().includes(searchTerm) ||
      trade.description.toLowerCase().includes(searchTerm);
    return matchesSearch && trade.status === 'active';
  });

  if (filteredTrades.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-inbox fs-1 text-secondary"></i>
        <h5 class="mt-3 text-secondary">${t('marketplace_empty_heading')}</h5>
        <p class="text-muted">${t('marketplace_empty_subheading')}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredTrades.map(trade => `
    <div class="col-lg-3 col-md-4 col-sm-6">
      <div class="card market-card" onclick="showTradeDetail(${trade.id})">
        <div class="market-card-image">
          ${trade.images && trade.images.length > 0 ?
            `<img src="${trade.images[0]}" alt="${trade.title}">` :
            `<i class="bi bi-box-seam fs-1 text-secondary"></i>`
          }
        </div>
        <div class="card-body">
          <h6 class="card-title text-primary">
            ${trade.title}
            ${isNewTrade(trade.timestamp) ? '<span class="badge bg-success ms-2">NEW</span>' : ''}
          </h6>
          <p class="price-tag mb-2">${trade.price} OMKT</p>
          <p class="card-text text-secondary small">${trade.description || ''}</p>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <small class="text-muted">${trade.category}</small>
            <small class="text-muted">${formatTime(trade.timestamp)}</small>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Render user's trades
function renderMyTrades() {
  const container = document.getElementById('myTradesContainer');
  const myTrades = trades.filter(trade => trade.seller === walletAddress);

  if (myTrades.length === 0) {
    container.innerHTML = `<p class="text-center text-muted">${t('my_trades_empty')}</p>`;
    return;
  }

  container.innerHTML = myTrades.map(trade => `
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title text-primary">${trade.title}</h5>
        <span class="badge bg-primary mb-2">${trade.category}</span>
        <p class="price-tag">${trade.price} OMKT</p>
        <p class="text-secondary">${trade.description}</p>
        ${trade.keywords && trade.keywords.length > 0 ? `
          <div class="d-flex flex-wrap gap-1 mb-2">
            ${trade.keywords.map(kw => `<span class="badge bg-secondary">${kw}</span>`).join('')}
          </div>
        ` : ''}
        ${trade.images && trade.images.length > 0 ? `
          <div class="d-flex gap-2 mb-3 overflow-auto">
            ${trade.images.map(img => `<img src="${img}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">`).join('')}
          </div>
        ` : ''}
        <p class="text-muted small mb-2">
          ${t('status')}: ${trade.status === 'active' ? t('status_active') : t('status_delisted')} | 
          ${t('views')}: ${trade.views || 0} | 
          ${t('posted_on')}: ${new Date(trade.timestamp).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}
        </p>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-secondary" onclick="editTrade(${trade.id})">
            <i class="bi bi-pencil me-1"></i>${t('edit_trade_title')}
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteTrade(${trade.id})">
            <i class="bi bi-trash me-1"></i>${t('leave_btn')}
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Show trade detail modal
function showTradeDetail(id) {
  const trade = trades.find(t => t.id === id);
  if (!trade) return;

  trade.views = (trade.views || 0) + 1;

  if (!trade.isSample) {
    dbOperations.put('trades', trade);
  }

  const carouselId = `carousel-trade-${trade.id}`;
  const imageCarousel = trade.images && trade.images.length > 0 ? `
    <div id="${carouselId}" class="carousel slide mb-3" data-bs-ride="carousel">
      <div class="carousel-indicators">
        ${trade.images.map((img, index) => `
          <button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${index}" 
                  class="${index === 0 ? 'active' : ''}" aria-current="${index === 0 ? 'true' : 'false'}"></button>
        `).join('')}
      </div>
      <div class="carousel-inner rounded">
        ${trade.images.map((img, index) => `
          <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${img}" class="d-block w-100" alt="Trade image ${index + 1}" 
                 style="cursor: zoom-in; aspect-ratio: 16/9; object-fit: cover;" 
                 data-bs-toggle="modal" data-bs-target="#imageDetailModal" data-image-src="${img}">
          </div>
        `).join('')}
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>
  ` : '';

  const content = document.getElementById('detailContent');
  content.innerHTML = `
    <h5 class="text-primary mb-3">${trade.title}</h5>
    ${imageCarousel}
    <div class="mb-3">
      <div class="row mb-2">
        <div class="col-3 text-muted">${t('price_label')}</div>
        <div class="col-9 price-tag">${trade.price} OMKT</div>
      </div>
      <div class="row mb-2">
        <div class="col-3 text-muted">${t('category_modal_label')}</div>
        <div class="col-9">${trade.category}</div>
      </div>
      <div class="row mb-2">
        <div class="col-3 text-muted">${t('recipient_address_label')}</div>
        <div class="col-9"><small class="font-monospace">${trade.seller}</small></div>
      </div>
      <div class="row mb-2">
        <div class="col-3 text-muted">${t('posted_on')}</div>
        <div class="col-9">${new Date(trade.timestamp).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}</div>
      </div>
      <div class="row mb-2">
        <div class="col-3 text-muted">${t('views')}</div>
        <div class="col-9">${trade.views}</div>
      </div>
    </div>
    <div class="mb-3">
      <h6 class="text-muted mb-2">${t('description_modal_label')}</h6>
      <p>${trade.description || 'N/A'}</p>
    </div>
  `;

  const footer = document.getElementById('detailFooter');
  footer.innerHTML = `
    <button type="button" class="btn btn-secondary" onclick="contactSeller('${trade.seller}')">
      <i class="bi bi-person me-2"></i>${t('contact_seller_btn')}
    </button>
    <button type="button" class="btn btn-primary" onclick="purchaseTrade(${trade.id})">
      <i class="bi bi-cart me-2"></i>${t('purchase_btn')}
    </button>
  `;

  new bootstrap.Modal(document.getElementById('detailModal')).show();
}

// Contact seller
function contactSeller(seller) {
  showToast(`${t('toast_seller_address_copied')}${seller}`, 'success');
  copyToClipboard(seller);
}

// Purchase trade
function purchaseTrade(id) {
  const trade = trades.find(t => t.id === id);
  if (!trade) return;

  if (processPurchase(trade)) {
    bootstrap.Modal.getInstance(document.getElementById('detailModal')).hide();
  }
}

// Edit trade
function editTrade(id) {
  const trade = trades.find(t => t.id === id);
  if (!trade) return;

  currentEditId = id;
  document.getElementById('editTitle').value = trade.title;
  document.getElementById('editCategory').value = trade.category;
  document.getElementById('editPrice').value = trade.price;
  document.getElementById('editDescription').value = trade.description;

  new bootstrap.Modal(document.getElementById('editModal')).show();
}

// Delete trade
function deleteTrade(id) {
  if (!confirm(t('confirm_delete_body'))) return;
  const trade = trades.find(t => t.id === id);

  const deleteOperation = trade.isSample ? 
    Promise.resolve() : 
    dbOperations.delete('trades', id);

  deleteOperation.then(() => {
    trades = trades.filter(t => t.id !== id);
    renderMyTrades();
    renderMarketplace();
    showToast(t('toast_trade_deleted'), 'success');
  });
}

// Filter trades
function filterTrades() {
  renderMarketplace();
}

// Sort trades
function sortTrades() {
  const sortBy = document.getElementById('sortSelect').value;

  switch (sortBy) {
    case 'newest':
      trades.sort((a, b) => b.timestamp - a.timestamp);
      break;
    case 'oldest':
      trades.sort((a, b) => a.timestamp - b.timestamp);
      break;
    case 'price-low':
      trades.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      trades.sort((a, b) => b.price - a.price);
      break;
  }

  renderMarketplace();
}

// Remove image from selection
function removeImage(index) {
  selectedImages.splice(index, 1);
  updateImagePreview(selectedImages, 'imagePreview');
}

// Initialize trade forms
function initTradeForms() {
  // Trade submission form
  document.getElementById('tradeForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const categoryString = selectedKeywords.length > 0 ? selectedKeywords.join(', ') : 'Other';
    
    const trade = {
      title: document.getElementById('tradeTitle').value,
      category: categoryString,
      price: parseFloat(document.getElementById('tradePrice').value),
      description: document.getElementById('tradeDescription').value,
      keywords: [...selectedKeywords],
      images: [...selectedImages],
      timestamp: Date.now(),
      seller: walletAddress,
      views: 0,
      status: 'active'
    };

    dbOperations.add('trades', trade).then((id) => {
      trade.id = id;
      trades.unshift(trade);
      renderMyTrades();
      renderMarketplace();

      document.getElementById('tradeForm').reset();
      selectedImages = [];
      selectedKeywords = [];
      updateImagePreview(selectedImages, 'imagePreview');
      renderSelectedKeywords();

      showToast(t('toast_trade_published'), 'success');
    });
  });

  // Edit form
  document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const trade = trades.find(t => t.id === currentEditId);
    if (!trade) return;

    trade.title = document.getElementById('editTitle').value;
    trade.category = document.getElementById('editCategory').value;
    trade.price = parseFloat(document.getElementById('editPrice').value);
    trade.description = document.getElementById('editDescription').value;

    const updateOperation = trade.isSample ? 
      Promise.resolve() : 
      dbOperations.put('trades', trade);

    updateOperation.then(() => {
      renderMyTrades();
      renderMarketplace();
      bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
      showToast(t('toast_trade_updated'), 'success');
    });
  });

  // Image upload
  document.getElementById('imageInput').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (selectedImages.length >= 5) return;

      const reader = new FileReader();
      reader.onload = function(event) {
        if (selectedImages.length < 5) {
          selectedImages.push(event.target.result);
          updateImagePreview(selectedImages, 'imagePreview');
        }
      };
      reader.readAsDataURL(file);
    });
  });
}