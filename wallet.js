// wallet.js - Wallet management module

let walletAddress = '';
let balance = Math.random() * 10;
let transactions = [];

// Initialize wallet
function initWallet() {
  walletAddress = generateWalletAddress();
  document.getElementById('walletAddress').textContent = walletAddress;
  document.getElementById('balance').textContent = balance.toFixed(4);

  // Save wallet info to database
  if (db) {
    dbOperations.put('wallet', { 
      id: 'primary', 
      address: walletAddress, 
      balance: balance 
    });
  }
}

// Copy wallet address to clipboard
function copyAddress() {
  copyToClipboard(walletAddress).then(() => {
    showToast(t('toast_address_copied'), 'success');
  });
}

// Refresh balance (simulated)
function refreshBalance() {
  balance += (Math.random() - 0.3) * 0.1;
  balance = Math.max(0, balance);
  document.getElementById('balance').textContent = balance.toFixed(4);

  if (db) {
    dbOperations.put('wallet', { 
      id: 'primary', 
      address: walletAddress, 
      balance: balance 
    });
  }

  showToast(t('toast_balance_refreshed'), 'success');
}

// Process token transfer
function processTransfer(recipient, amount, gasFee) {
  const total = amount + gasFee;
  
  if (total > balance) {
    showToast(t('toast_insufficient_balance'), 'danger');
    return false;
  }

  const tx = {
    from: walletAddress,
    to: recipient,
    amount: amount,
    gasFee: gasFee,
    type: 'transfer',
    timestamp: Date.now(),
    hash: generateTxHash()
  };

  // Save transaction to database
  dbOperations.add('transactions', tx).then(() => {
    balance -= total;
    document.getElementById('balance').textContent = balance.toFixed(4);

    // Update wallet balance in database
    dbOperations.put('wallet', { 
      id: 'primary', 
      address: walletAddress, 
      balance: balance 
    });

    transactions.unshift(tx);
    renderTransactionHistory();
    showToast(t('toast_transfer_successful'), 'success');
  });

  return true;
}

// Process purchase
function processPurchase(trade) {
  if (balance < trade.price) {
    showToast(t('toast_insufficient_balance'), 'danger');
    return false;
  }

  if (confirm(t('confirm_purchase_body', trade.title, trade.price))) {
    balance -= trade.price;
    document.getElementById('balance').textContent = balance.toFixed(4);

    const tx = {
      from: walletAddress,
      to: trade.seller,
      amount: trade.price,
      type: 'purchase',
      itemId: trade.id,
      itemTitle: trade.title,
      timestamp: Date.now(),
      hash: generateTxHash()
    };

    dbOperations.add('transactions', tx).then(() => {
      transactions.unshift(tx);
      renderTransactionHistory();
      showToast(t('toast_purchase_successful'), 'success');
    });

    return true;
  }
  
  return false;
}

// Render transaction history
function renderTransactionHistory() {
  const container = document.getElementById('historyContainer');

  if (transactions.length === 0) {
    container.innerHTML = `<p class="text-center text-muted">${t('transaction_history_empty')}</p>`;
    return;
  }

  container.innerHTML = transactions.map(tx => `
    <div class="card mb-2">
      <div class="card-body">
        <p class="text-primary font-monospace small mb-2">${tx.hash}</p>
        <div class="row small">
          <div class="col-4 text-muted">${t('tx_type')}</div>
          <div class="col-8">${tx.type === 'purchase' ? t('tx_type_purchase') : t('tx_type_transfer')}</div>
        </div>
        ${tx.type === 'purchase' ? `
          <div class="row small">
            <div class="col-4 text-muted">${t('tx_item')}</div>
            <div class="col-8">${tx.itemTitle}</div>
          </div>
        ` : ''}
        <div class="row small">
          <div class="col-4 text-muted">${t('tx_amount')}</div>
          <div class="col-8 text-warning">${tx.amount} OMKT</div>
        </div>
        <div class="row small">
          <div class="col-4 text-muted">${t('tx_time')}</div>
          <div class="col-8">${new Date(tx.timestamp).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// Initialize send form
function initSendForm() {
  document.getElementById('sendForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const recipient = document.getElementById('recipientAddress').value;
    const amount = parseFloat(document.getElementById('sendAmount').value);
    const gasFee = parseFloat(document.getElementById('gasFee').value);

    if (processTransfer(recipient, amount, gasFee)) {
      document.getElementById('sendForm').reset();
    }
  });
}