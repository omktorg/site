// keywords.js - Keywords management module

let selectedKeywords = [];

// Keywords data sets
const keywordsDataSets = {
  en: {
    "Travel & Local": ["Ride-hailing Order", "Car Rental/Sharing", "Parking Payment (Contactless)"],
    "Food & Delivery": ["Food Delivery Order", "Grocery/Supermarket Delivery", "Restaurant Vouchers"],
    "Shopping & Logistics": ["E-commerce Purchase", "Second-hand Marketplace Transaction", "Courier Service Order"],
    "Home & On-site Services": ["Home Cleaning Service Payment", "Moving/Local Freight Order", "Appliance Repair Appointment"],
    "Health & Medical": ["Online Consultation Payment", "Medicine Purchase & Delivery", "Health Check-up Package Booking"],
    "Finance & Government": ["Bank Transfer/Bill Payment", "Insurance Policy Purchase/Renewal", "Tax/Fine Online Payment"],
    "Travel & Tourism": ["Flight/Train Ticket Booking", "Hotel/Vacation Rental Reservation", "E-ticket for Attractions"],
    "Office & Collaboration": ["SaaS Subscription (Email/Meeting/Docs)", "Cloud Storage Upgrade", "Team IM Enterprise Plan"],
    "Development & Ops": ["Cloud Server/Database Purchase", "Domain/CDN/SSL Certificate", "Monitoring/SMS/Email API Plan Top-up"],
    "Content & Productivity": ["Design Tool Subscription (Posters/Images)", "Video Editing/Transcoding Subscription", "Form/Survey Premium Plan"]
  },
  zh: {
    "出行与本地": ["网约车叫车下单", "短租自驾/分时租赁", "停车缴费（无感支付）"],
    "餐饮与到家": ["外卖点餐支付", "生鲜/超市到家下单", "到店团购券购买"],
    "购物与物流": ["电商直接购买", "二手商品下单交易", "快递上门寄件下单"],
    "家政与上门": ["家庭保洁下单支付", "搬家/同城货运下单", "家电维修上门预约付款"],
    "健康与医疗": ["在线问诊付费", "买药送药下单", "体检套餐预约支付"],
    "金融与政务": ["银行转账/话费水电煤缴费", "保险投保/续保缴费", "税费/罚款在线缴纳"],
    "差旅与出游": ["机票/火车票在线购票", "酒店/民宿预订支付", "景区门票电子票购买"],
    "办公与协作": ["SaaS订阅（邮箱/会议/文档）", "云盘容量付费", "团队IM企业版订阅"],
    "开发与运维": ["云服务器/数据库实例购买", "域名/CDN/SSL购买", "监控/短信/邮件API套餐充值"],
    "内容与效率": ["设计工具订阅（海报/图片）", "视频剪辑/转码订阅", "表单/问卷高级版付费"]
  }
};

const keywordsData = keywordsDataSets[lang];

// Initialize keywords modal
function initKeywordsModal() {
  const accordion = document.getElementById('keywordsAccordion');
  accordion.innerHTML = '';
  
  Object.entries(keywordsData).forEach(([category, keywords], index) => {
    const itemId = `collapse${index}`;
    const headerId = `heading${index}`;
    const accordionItem = `
      <div class="accordion-item bg-dark text-light">
        <h2 class="accordion-header" id="${headerId}">
          <button class="accordion-button collapsed bg-secondary text-light" type="button" 
                  data-bs-toggle="collapse" data-bs-target="#${itemId}" 
                  aria-expanded="false" aria-controls="${itemId}">
            ${category}
          </button>
        </h2>
        <div id="${itemId}" class="accordion-collapse collapse" aria-labelledby="${headerId}" 
             data-bs-parent="#keywordsAccordion">
          <div class="accordion-body">
            <div class="d-flex flex-wrap gap-2">
              ${keywords.map(kw => `
                <span class="badge rounded-pill text-light keyword-badge" 
                      onclick="toggleKeyword(this, '${kw}')">${kw}</span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    accordion.insertAdjacentHTML('beforeend', accordionItem);
  });

  document.getElementById('saveKeywordsBtn').addEventListener('click', saveKeywords);
}

// Toggle keyword selection
function toggleKeyword(element, keyword) {
  element.classList.toggle('active');
}

// Save selected keywords
function saveKeywords() {
  const customInput = document.getElementById('customKeywords');
  const customKeywords = customInput.value.trim().split(/[\s,]+/).filter(Boolean);

  const selectedBadges = document.querySelectorAll('#keywordsModal .keyword-badge.active');
  const selectedPredefined = Array.from(selectedBadges).map(badge => badge.textContent);

  const allKeywords = [...new Set([...customKeywords, ...selectedPredefined])];
  selectedKeywords = allKeywords;

  renderSelectedKeywords();
  bootstrap.Modal.getInstance(document.getElementById('keywordsModal')).hide();
}

// Render selected keywords display
function renderSelectedKeywords() {
  const displayDiv = document.getElementById('keywordsDisplay');
  if (selectedKeywords.length > 0) {
    displayDiv.innerHTML = selectedKeywords.map(kw => 
      `<span class="badge bg-primary">${kw}</span>`
    ).join('');
  } else {
    displayDiv.innerHTML = `<small class="text-muted">${t('no_keywords_selected')}</small>`;
  }
}