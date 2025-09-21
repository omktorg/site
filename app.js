// app.js — Application bootstrap & wiring

(async function bootstrap() {
  try {
    // 1) 多语言渲染（先做，确保占位符与文本正确）
    if (typeof applyTranslations === 'function') {
      applyTranslations(); // from translations.js
    }

    // 2) 打开数据库
    if (typeof initDB === 'function') {
      await initDB(); // from database.js
    }

    // 3) 恢复钱包与交易历史（如有），否则初始化新钱包
    await restoreWalletAndHistory();

    // 4) 初始化交易板块（列表 + 表单）
    initTradingUIModules();

    // 5) 初始化关键字弹窗（首次或每次打开时重绘）
    setupKeywordsModal();

    // 6) 绑定图片全屏查看（交易详情轮播图点开大图）
    setupFullscreenImageViewer();

    // 7) 自动根据 URL 参数联动（例如 ?room=xxx 进入聊天室）
    //    具体聊天室连接逻辑已在 chat.js 内实现，app.js 只需确保 DOM Ready。
    document.addEventListener('DOMContentLoaded', () => {
      // 其他需要 DOM Ready 的一次性工作可以放这里
    });

  } catch (err) {
    console.error('[app] bootstrap failed:', err);
  }
})();

/** 恢复钱包与交易历史（如存在），否则初始化新钱包 */
async function restoreWalletAndHistory() {
  try {
    // 恢复钱包
    let restored = false;
    if (window.dbOperations) {
      const existing = await dbOperations.get('wallet', 'primary'); // may be undefined
      if (existing && typeof existing.address === 'string') {
        // 覆盖全局钱包变量并刷新 UI
        if (typeof walletAddress !== 'undefined') window.walletAddress = existing.address;
        if (typeof balance !== 'undefined') window.balance = Number(existing.balance) || 0;

        const addrEl = document.getElementById('walletAddress');
        const balEl  = document.getElementById('balance');
        if (addrEl) addrEl.textContent = window.walletAddress;
        if (balEl)  balEl.textContent  = window.balance.toFixed(4);
        restored = true;
      }
    }
    // 新钱包初始化
    if (!restored && typeof initWallet === 'function') {
      initWallet(); // from wallet.js
    }

    // 恢复交易历史
    if (window.dbOperations) {
      const list = await dbOperations.getAll('transactions');
      if (Array.isArray(list)) {
        // 覆盖全局 transactions 并排序（新→旧）
        if (typeof transactions !== 'undefined') {
          window.transactions = list.sort((a, b) => b.timestamp - a.timestamp);
        }
      }
    }
    // 渲染交易历史
    if (typeof renderTransactionHistory === 'function') {
      renderTransactionHistory(); // from wallet.js
    }
  } catch (e) {
    console.warn('[app] restoreWalletAndHistory warn:', e);
    // 兜底：至少调用一次初始化
    if (typeof initWallet === 'function') initWallet();
    if (typeof renderTransactionHistory === 'function') renderTransactionHistory();
  }

  // 初始化转账表单监听（依赖钱包已就绪）
  if (typeof initSendForm === 'function') {
    initSendForm(); // from wallet.js
  }
}

/** 初始化交易板块（加载交易、表单与图片上传预览等） */
function initTradingUIModules() {
  // 交易表单（发布/编辑/上传图片）事件绑定
  if (typeof initTradeForms === 'function') {
    initTradeForms(); // from trading.js
  }

  // 加载交易（包含示例 + 本地库）
  if (typeof loadTrades === 'function') {
    loadTrades(); // from trading.js
  }

  // 搜索与排序在 index.html 中通过 onkeyup/onchange 直连函数（filterTrades/sortTrades）
  // 这里无需重复绑定
}

/** 关键字弹窗初始化：首次进入或每次打开弹窗时构建推荐关键字列表 */
function setupKeywordsModal() {
  const modalEl = document.getElementById('keywordsModal');
  if (!modalEl) return;

  // 首次构建一次
  if (typeof initKeywordsModal === 'function') {
    try { initKeywordsModal(); } catch (e) { console.warn('[app] initKeywordsModal:', e); }
  }

  // 每次弹窗显示时重建（避免语言切换或数据变更后内容不刷新）
  modalEl.addEventListener('shown.bs.modal', () => {
    if (typeof initKeywordsModal === 'function') {
      try { initKeywordsModal(); } catch (e) { console.warn('[app] re-initKeywordsModal:', e); }
    }
  });
}

/** 全屏大图查看：把 trading.js 里 data-image-src 写到全屏 Modal 的 <img> */
function setupFullscreenImageViewer() {
  const imageModalEl = document.getElementById('imageDetailModal');
  if (!imageModalEl) return;

  imageModalEl.addEventListener('show.bs.modal', (ev) => {
    // Bootstrap 5: relatedTarget 是触发 modal 的元素（即被点击的 <img>）
    const trigger = ev.relatedTarget;
    const src = trigger?.getAttribute('data-image-src');
    if (!src) return;

    const img = imageModalEl.querySelector('#fullscreenImage');
    if (img) img.setAttribute('src', src);
  });

  // 关闭时清空 src，避免上次大图占用内存
  imageModalEl.addEventListener('hidden.bs.modal', () => {
    const img = imageModalEl.querySelector('#fullscreenImage');
    if (img) img.setAttribute('src', '');
  });
}

// ------------------------------
// 轻量小辅助（可选）
// ------------------------------

/** 可选：当语言环境可能变化时重新应用翻译 */
function reapplyI18n() {
  if (typeof applyTranslations === 'function') {
    applyTranslations(); // from translations.js
  }
}
