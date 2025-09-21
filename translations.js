// translations.js - Internationalization module

const translations = {
  en: {
    // NAV
    marketplace: "Marketplace",
    post: "Post",
    wallet: "Wallet",
    chat_room: "Chat Room",
    // Marketplace Tab
    search_trades_placeholder: "Search trades...",
    sort_newest: "Newest",
    sort_oldest: "Oldest",
    sort_price_low_high: "Price: Low→High",
    sort_price_high_low: "Price: High→Low",
    // Post Tab
    post_new_trade: "Post New Trade",
    keywords: "Keywords",
    add_edit_keywords: "Add/Edit Keywords",
    trade_title_label: "Trade Title",
    trade_title_placeholder: "Enter trade title...",
    price_label: "Price (OMKT)",
    price_placeholder: "0.0000",
    description_label: "Description",
    description_placeholder: "Describe your item...",
    upload_images_label: "Upload Images (up to 5)",
    publish_trade_btn: "Publish Trade",
    my_trades_heading: "My Trades",
    no_keywords_selected: "No keywords selected",
    // Wallet Tab
    my_wallet_heading: "My Gift Cards",
    balance_label: "Balance:",
    refresh_balance_btn: "Refresh Balance",
    send_tokens_heading: "Transfer Gift Cards",
    recipient_address_label: "Recipient Address",
    recipient_address_placeholder: "0x...",
    amount_label: "Amount (OMKT)",
    gas_fee_label: "Gas Fee",
    confirm_btn: "Confirm",
    transaction_history_heading: "Transaction History",
    // Chat Room Tab
    status_disconnected: "Disconnected",
    status_connected: "Connected",
    room_name_placeholder: "Room name",
    join_btn: "Join",
    leave_btn: "Leave",
    message_placeholder: "Type a message...",
    // Modals
    trade_details_title: "Trade Details",
    edit_trade_title: "Edit Trade",
    trade_title_modal_label: "Trade Title",
    category_modal_label: "Category",
    price_modal_label: "Price (OMKT)",
    description_modal_label: "Detailed Description",
    save_changes_btn: "Save Changes",
    add_keywords_title: "Add Keywords",
    custom_keywords_label: "Custom Keywords (separated by comma or space)",
    custom_keywords_placeholder: "e.g., game items, virtual currency",
    recommended_keywords_label: "Or select from recommended keywords below:",
    cancel_btn: "Cancel",
    save_btn: "Save",
    image_details_title: "Image Details",
    // Dynamic JS Strings
    toast_trade_published: "Trade published successfully!",
    toast_seller_address_copied: "Seller address copied: ",
    toast_insufficient_balance: "Insufficient balance!",
    toast_purchase_successful: "Purchase successful! Transaction recorded.",
    toast_trade_updated: "Trade updated successfully!",
    toast_trade_deleted: "Trade has been deleted.",
    toast_address_copied: "Address copied to clipboard.",
    toast_balance_refreshed: "Balance has been updated.",
    toast_transfer_successful: "Transaction sent successfully!",
    confirm_purchase_title: "Confirm Purchase",
    confirm_purchase_body: (title, price) => `Are you sure you want to buy "${title}"?\nPrice: ${price} OMKT`,
    confirm_delete_body: "Are you sure you want to delete this trade?",
    marketplace_empty_heading: "No Trades Found",
    marketplace_empty_subheading: "There are no relevant trades posted yet.",
    my_trades_empty: "You haven't posted any trades yet.",
    transaction_history_empty: "No transaction history.",
    contact_seller_btn: "Contact Seller",
    purchase_btn: "Purchase",
    status_active: "Active",
    status_delisted: "Delisted",
    views: "Views",
    posted_on: "Posted on",
    status: "Status",
    tx_type_purchase: "Purchase",
    tx_type_transfer: "Transfer",
    tx_item: "Item",
    tx_amount: "Amount",
    tx_time: "Time",
    tx_type: "Type",
    user_placeholder: (id) => `User${id.slice(0, 6)}`,
    // Chat System Messages
    chat_sys_waiting: "Waiting for other users to join...",
    chat_sys_connecting_to_peer: "Connecting to user...",
    chat_sys_connection_successful: "✅ Connection successful",
    chat_sys_peer_disconnected: "User has disconnected.",
    chat_sys_connecting_to_server: "Connecting to server...",
    chat_sys_joining_room: "Joining room...",
    chat_sys_join_success: (room) => `Successfully joined room "${room}"`,
    chat_sys_peer_joined: "A new user has joined.",
    chat_sys_peer_left: "A user has left.",
    chat_sys_server_disconnected: "Disconnected from the server.",
    chat_sys_connection_error: "Connection error. Please check if the server is running.",
    chat_sys_auto_join_url: (room) => `Auto-joining room from URL parameter: ${room}`,
    chat_sys_send_failed_gossip: "Failed to send via Gossipsub, please try again later.",
    chat_sys_send_failed_network: "Network not ready, cannot send message.",
    // Time formatting
    time_just_now: "just now",
    time_minutes_ago: (m) => `${m} minutes ago`,
    time_hours_ago: (h) => `${h} hours ago`,
    time_days_ago: (d) => `${d} days ago`,
    // Sample Data
    sample_trade1_title: "JOWB Escrow Service",
    sample_trade1_category: "Escrow",
    sample_trade1_desc: "Provides escrow services for both parties to ensure transaction security.",
    sample_trade2_title: "JOWB Identity Verification Service",
    sample_trade2_category: "Verification",
    sample_trade2_desc: "Offers identity verification to give buyers more confidence in transactions."
  },
  zh: {
    // NAV
    marketplace: "市场",
    post: "发布",
    wallet: "钱包",
    chat_room: "聊天室",
    // Marketplace Tab
    search_trades_placeholder: "搜索交易…",
    sort_newest: "最新",
    sort_oldest: "最旧",
    sort_price_low_high: "价格: 低→高",
    sort_price_high_low: "价格: 高→低",
    // Post Tab
    post_new_trade: "发布新交易",
    keywords: "关键词",
    add_edit_keywords: "添加/编辑关键词",
    trade_title_label: "交易标题",
    trade_title_placeholder: "输入交易标题...",
    price_label: "价格 (OMKT)",
    price_placeholder: "0.0000",
    description_label: "描述",
    description_placeholder: "描述您的交易物品...",
    upload_images_label: "上传图片 (最多5张)",
    publish_trade_btn: "发布交易",
    my_trades_heading: "我的交易",
    no_keywords_selected: "未选择关键词",
    // Wallet Tab
    my_wallet_heading: "我的礼品卡",
    balance_label: "余额:",
    refresh_balance_btn: "刷新余额",
    send_tokens_heading: "转让礼品卡",
    recipient_address_label: "收款人地址",
    recipient_address_placeholder: "0x...",
    amount_label: "金额 (OMKT)",
    gas_fee_label: "手续费",
    confirm_btn: "确认",
    transaction_history_heading: "交易历史",
    // Chat Room Tab
    status_disconnected: "未连接",
    status_connected: "已连接",
    room_name_placeholder: "房间名",
    join_btn: "加入",
    leave_btn: "离开",
    message_placeholder: "输入消息...",
    // Modals
    trade_details_title: "交易详情",
    edit_trade_title: "编辑交易",
    trade_title_modal_label: "交易标题",
    category_modal_label: "分类",
    price_modal_label: "价格 (OMKT)",
    description_modal_label: "详细描述",
    save_changes_btn: "保存修改",
    add_keywords_title: "添加关键词",
    custom_keywords_label: "自定义关键词 (用逗号或空格分隔)",
    custom_keywords_placeholder: "例如：游戏装备, 虚拟货币",
    recommended_keywords_label: "或从下方选择推荐关键词：",
    cancel_btn: "取消",
    save_btn: "保存",
    image_details_title: "图片详情",
    // Dynamic JS Strings
    toast_trade_published: "交易发布成功！",
    toast_seller_address_copied: "卖家地址已复制: ",
    toast_insufficient_balance: "余额不足，无法完成购买！",
    toast_purchase_successful: "购买成功！交易已记录",
    toast_trade_updated: "交易更新成功！",
    toast_trade_deleted: "交易已删除",
    toast_address_copied: "地址已复制到剪贴板",
    toast_balance_refreshed: "余额已更新",
    toast_transfer_successful: "交易发送成功！",
    confirm_purchase_title: "确认购买",
    confirm_purchase_body: (title, price) => `确认购买 "${title}" 吗？\n价格: ${price} OMKT`,
    confirm_delete_body: "确定要删除这条交易吗？",
    marketplace_empty_heading: "暂无交易信息",
    marketplace_empty_subheading: "还没有相关的交易发布",
    my_trades_empty: "您还没有发布任何交易",
    transaction_history_empty: "暂无交易记录",
    contact_seller_btn: "联系卖家",
    purchase_btn: "立即购买",
    status_active: "活跃",
    status_delisted: "已下架",
    views: "浏览次数",
    posted_on: "发布时间",
    status: "状态",
    tx_type_purchase: "购买",
    tx_type_transfer: "转账",
    tx_item: "物品",
    tx_amount: "金额",
    tx_time: "时间",
    tx_type: "类型",
    user_placeholder: (id) => `用户${id.slice(0, 6)}`,
    // Chat System Messages
    chat_sys_waiting: "等待其他用户加入房间...",
    chat_sys_connecting_to_peer: "正在与用户连接...",
    chat_sys_connection_successful: "✅ 连接成功",
    chat_sys_peer_disconnected: "用户已断开连接",
    chat_sys_connecting_to_server: "连接到服务器...",
    chat_sys_joining_room: "正在加入房间...",
    chat_sys_join_success: (room) => `成功加入房间 "${room}"`,
    chat_sys_peer_joined: "新用户加入",
    chat_sys_peer_left: "用户离开",
    chat_sys_server_disconnected: "与服务器的连接已断开",
    chat_sys_connection_error: "连接错误，请检查服务器是否正常运行",
    chat_sys_auto_join_url: (room) => `从 URL 参数自动加入房间: ${room}`,
    chat_sys_send_failed_gossip: "Gossipsub 发送失败，请稍后重试",
    chat_sys_send_failed_network: "网络未就绪，无法发送消息",
    // Time formatting
    time_just_now: "刚刚",
    time_minutes_ago: (m) => `${m}分钟前`,
    time_hours_ago: (h) => `${h}小时前`,
    time_days_ago: (d) => `${d}天前`,
    // Sample Data
    sample_trade1_title: "JOWB 交易担保服务",
    sample_trade1_category: "交易担保",
    sample_trade1_desc: "为交易双方做交易担保，保障交易安全。",
    sample_trade2_title: "JOWB 实名认证服务",
    sample_trade2_category: "实名认证",
    sample_trade2_desc: "提供实名认证服务，让买家对交易更有信心。"
  }
};

// Language detection and translation function
const userLang = navigator.language || navigator.userLanguage;
const lang = userLang.startsWith('zh') ? 'zh' : 'en';

const t = (key, ...args) => {
  const translation = translations[lang][key] || translations.en[key];
  if (typeof translation === 'function') {
    return translation(...args);
  }
  return translation;
};

// Apply translations to DOM elements
function applyTranslations() {
  document.querySelectorAll('[data-translate-key]').forEach(el => {
    const key = el.getAttribute('data-translate-key');
    if (el.hasAttribute('data-translate-placeholder')) {
      el.placeholder = t(key);
    } else if (el.hasAttribute('data-translate-value')) {
      el.value = t(key);
    } else {
      el.innerHTML = t(key);
    }
  });
}