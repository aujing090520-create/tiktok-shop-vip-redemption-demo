const root = document.querySelector("#app");

const state = {
  screen: "mail",
  code: "34HSVU-G530-5S72G",
  plan: "HelloTalk VIP 年卡",
  expiry: "2027年8月4日",
  orderLineId: "TT-OL-20260804-001",
  rechargeId: "VIP-RCHG-20260804-8192",
  codeStatus: "可用",
  deliveryStatus: "已送达",
  orderStatus: "售后期中",
  afterSalesStatus: "无",
  rechargeFailed: false,
  toast: "",
  review: false,
  activeRule: "FR-001/3",
  logs: [
    "已按 order_line_id 绑定 VIP 年卡兑换码",
    "邮件交付确认后已更新 TikTok Shop 履约状态为 Delivered",
    "等待售后期结束后更新订单为 Completed",
  ],
};

const qrPattern = [
  "11111110010111111",
  "10000010110100001",
  "10111010010101101",
  "10111010110101101",
  "10111010000101101",
  "10000010101100001",
  "11111110101011111",
  "00000000110100000",
  "11011011101101101",
  "00100100011010010",
  "11110111101111100",
  "01001000110000110",
  "11111110101110111",
  "10000010001000101",
  "10111011111011101",
  "10000010001100001",
  "11111110110111111",
];

const rules = [
  {
    id: "FR-001/3",
    summary: "邮件交付兑换码、链接与二维码",
    screen: "mail",
  },
  {
    id: "FR-001/8",
    summary: "邮件送达即更新 Delivered，兑换不改变履约状态",
    screen: "delivered",
  },
  {
    id: "FR-003/1",
    summary: "链接和二维码进入 App 兑换 H5",
    screen: "redeem",
  },
  {
    id: "FR-003/2",
    summary: "确认弹窗展示 VIP 权益并二次确认",
    screen: "confirm",
  },
  {
    id: "FR-004/2",
    summary: "充值成功后才使用兑换码",
    screen: "success",
  },
  {
    id: "FR-004/3",
    summary: "充值失败不使用兑换码，用户可重试",
    screen: "failure",
  },
  {
    id: "FR-005/1",
    summary: "用户发起售后申请时，兑换码和权益不变",
    screen: "after-sales-request",
  },
  {
    id: "FR-005/2",
    summary: "拒绝售后申请，不改变兑换码和订单状态",
    screen: "after-sales-rejected",
  },
  {
    id: "FR-005/3",
    summary: "补发原兑换码和链接，不生成新码",
    screen: "after-sales-resent",
  },
  {
    id: "FR-005/4",
    summary: "退款成功后，未兑换码立即失效",
    screen: "refund-unredeemed",
  },
  {
    id: "FR-005/6",
    summary: "售后期结束或退款完成后，订单更新为 Completed",
    screen: "completed",
  },
  {
    id: "FR-007/1",
    summary: "履约重试复用同一兑换码",
    screen: "retry",
  },
];

function qrMarkup() {
  return qrPattern
    .join("")
    .split("")
    .map((cell) => `<i class="${cell === "1" ? "" : "is-light"}"></i>`)
    .join("");
}

function codeStatusClass() {
  if (state.codeStatus === "已使用") return "success";
  if (state.codeStatus.includes("失效")) return "danger";
  return "";
}

function marker(label, ruleId, className) {
  if (!state.review) return "";
  return `<button class="marker ${className}" data-action="rule" data-rule="${ruleId}" aria-label="查看 ${ruleId}">${label}</button>`;
}

function appNavigation(title, side = "记录") {
  return `
    <div class="statusbar">
      <span>9:41</span>
      <span class="status-icons">▮▮▮ ◌ ▰</span>
    </div>
    <header class="app-nav">
      <button class="icon-button" data-action="back-to-mail" aria-label="返回">‹</button>
      <h2>${title}</h2>
      <button class="nav-text" data-action="show-toast" data-message="兑换记录按既有逻辑展示" aria-label="${side}">${side}</button>
    </header>
  `;
}

function mailScreen() {
  return `
    <div class="mail-screen">
      <header class="mail-nav">
        <button class="icon-button" aria-label="返回">‹</button>
        <span>收件箱</span>
        <button class="mail-more" aria-label="更多操作">•••</button>
      </header>
      <article class="mail-message">
        ${marker("1", "FR-001/3", "marker-mail")}
        <h3>你的 HelloTalk VIP 兑换码已送达</h3>
        <div class="mail-sender">
          <div class="mail-avatar">H</div>
          <div class="mail-sender-copy">
            <strong>HelloTalk VIP 服务</strong>
            <span>noreply@hellotalk.com</span>
            <small>发送给你</small>
          </div>
          <time>今天 09:41</time>
        </div>
        <div class="mail-content">
          <div class="mail-logo">HelloTalk</div>
          <p class="mail-greeting">你好，</p>
          <p>感谢购买 <strong>${state.plan}</strong>。请使用 HelloTalk App 扫码或点击下方兑换链接，进入兑换码页面完成兑换。</p>
          <div class="vip-mail-block">
            <span class="mail-plan-label">${state.plan}</span>
            <div class="vip-redemption-row">
              <div class="vip-code-detail">
                <p class="field-name">兑换码</p>
                <div class="mail-code">${state.code}</div>
                <p class="expiry-copy">有效期至 ${state.expiry}</p>
              </div>
              <div class="qr-priority">
                <div class="qr" aria-label="兑换二维码">${qrMarkup()}</div>
                <strong>使用HelloTalk进行扫码兑换</strong>
              </div>
            </div>
          </div>
          <button class="primary-button" data-action="open-redeem">前往 HelloTalk 兑换</button>
          <div class="mail-alert">
            <strong>请使用 HelloTalk App 扫码或点击兑换链接</strong>
            两种方式都会进入兑换码页面，并自动填写兑换码。
          </div>
          <div class="mail-alert">
            <strong>电脑端或未安装 App？</strong>
            将进入现有下载 App 页面。安装并登录后，请返回这封邮件再次点击链接或扫码。
          </div>
          <p class="mail-signoff">HelloTalk 团队</p>
        </div>
      </article>
    </div>
  `;
}

function redeemScreen() {
  return `
    ${appNavigation("兑换码")}
    <div class="redeem-screen">
      <section class="redeem-form">
        ${marker("2", "FR-003/1", "marker-code")}
        <input class="code-input" value="${state.code}" aria-label="兑换码" readonly>
        <button class="primary-button" data-action="confirm">确认兑换</button>
        ${
          state.rechargeFailed
            ? `
              ${marker("5", "FR-004/3", "marker-failure")}
              <p class="redeem-error">充值未完成，请稍后重试。</p>`
            : ""
        }
        <p class="code-help">说明: 兑换码中没有字母 O，注意区分 8 和 B</p>
      </section>
    </div>
  `;
}

function successScreen() {
  return `
    ${appNavigation("兑换码")}
    <section class="success-screen">
      ${marker("4", "FR-004/2", "marker-success")}
      <div class="success-badge">✓</div>
      <h3>兑换成功</h3>
      <p>VIP 权益已充值完成。</p>
      <div class="result-ticket">
        <strong>${state.plan}</strong>
        <span>充值 ID：${state.rechargeId}</span>
      </div>
      <button class="primary-button" data-action="open-redeem">返回兑换码页</button>
    </section>
  `;
}

function downloadScreen() {
  return `
    <div class="statusbar">
      <span>9:41</span>
      <span class="status-icons">▮▮▮ ◌ ▰</span>
    </div>
    <section class="download-screen">
      <header class="download-browser-nav">
        <button class="download-back" data-action="back-to-mail" aria-label="返回">‹</button>
        <span class="download-more" aria-label="更多选项"><i></i><i></i><i></i><b></b></span>
      </header>
      <div class="download-hero" aria-label="HelloTalk App 功能预览">
        <div class="preview-device preview-device-back">
          <div class="preview-notch"></div>
          <div class="preview-feed-header">⌕ Search</div>
          <div class="preview-tabs"><b>All</b><span>Learn</span><span>Help</span></div>
          <div class="preview-user">
            <span class="preview-avatar avatar-maggie"></span>
            <strong>Maggie <em>♛</em></strong>
            <small>EN　🇺🇸　JP　CN</small>
          </div>
          <p class="preview-post">I've just finished a week of adventures with my best friend.</p>
          <div class="preview-photos"><i></i><i></i></div>
        </div>
        <div class="preview-device preview-device-front">
          <div class="preview-notch"></div>
          <div class="preview-chat-title">Miku <small>● online</small></div>
          <div class="preview-chat-nav">‹ <span>⌕　⌾</span></div>
          <div class="chat-line incoming">Hi, nice meet you!</div>
          <div class="chat-line outgoing">Hi, nice <s>meet</s> you.<br>Hi, nice <b>to meet</b> you.</div>
          <div class="chat-line incoming multi">ありがとう！あなたの<br>趣味は何ですか？<small>Thanks! What are your hobbies?</small></div>
          <div class="chat-line outgoing">I like photography, movies,<br>and traveling ✈</div>
          <div class="chat-audio">▶ <span>32″</span></div>
        </div>
      </div>
      <div class="download-copy">
        <strong class="download-brand">HELLOTALK</strong>
        <h3>Chat with Locals</h3>
        <p>Learn a language for free by chatting with millions of native speakers around the world!</p>
        <span class="download-caption">See this content immediately after install</span>
        <button class="get-app-button" data-action="download-complete">
          <span class="get-app-thumbnails" aria-hidden="true"><i></i><i></i></span>
          <span>Get The App</span>
        </button>
      </div>
      <footer class="download-browser-toolbar" aria-hidden="true">
        <span>↻</span><span>⇧</span><span>⠿</span>
      </footer>
    </section>
  `;
}

function modal() {
  if (state.screen !== "confirm") return "";
  const invalidCode = state.codeStatus === "已失效";
  const title = invalidCode ? "兑换码已失效" : state.plan;
  const description = invalidCode
    ? "该兑换码已失效，无法兑换。"
    : "确认使用此兑换码兑换以上 VIP 权益？";
  const action = invalidCode ? "我知道了" : "同意并兑换";
  const actionName = invalidCode ? "dismiss-modal" : "redeem";

  return `
    <div class="modal-scrim">
      <section class="confirm-modal" role="dialog" aria-modal="true" aria-label="${title}">
        ${marker("3", "FR-003/2", "marker-confirm")}
        <h3>${title}</h3>
        <p>${description}</p>
        <button class="primary-button" data-action="${actionName}">${action}</button>
      </section>
    </div>
  `;
}

function phoneMarkup() {
  let content = "";
  if (state.screen === "mail") content = mailScreen();
  if (state.screen === "redeem" || state.screen === "confirm") content = redeemScreen();
  if (state.screen === "success") content = successScreen();
  if (state.screen === "download") content = downloadScreen();

  return `
    <section class="phone-wrap" aria-label="HelloTalk VIP 商品卡 Demo">
      <div class="phone">
        ${content}
        ${modal()}
        ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
      </div>
    </section>
  `;
}

function controlPanel() {
  const options = [
    ["mail", "邮件交付预览", "兑换码 / 链接 / 二维码"],
    ["redeem", "App 内兑换 H5", "自动带入兑换码"],
    ["download", "PC 或未安装 App", "下载页降级"],
  ];

  return `
    <aside class="side-panel">
      <header class="panel-header">
        <p class="panel-label">DEMO FLOW</p>
        <h2>演示入口</h2>
      </header>
      <div class="panel-body">
        ${options
          .map(
            ([key, title, description]) => `
              <button class="mode-button ${state.screen === key ? "is-active" : ""}" data-action="screen" data-screen="${key}">
                <span>${title}</span><span>${description}</span>
              </button>`,
          )
          .join("")}
      </div>
    </aside>
  `;
}

function operationsPanel() {
  return `
    <aside class="ops-panel">
      <header class="panel-header">
        <p class="panel-label">SERVICE VIEW</p>
        <h2>订单履约与售后</h2>
      </header>
      <section class="ops-section">
        <dl class="kv">
          <dt>订单商品项</dt><dd>${state.orderLineId}</dd>
          <dt>VIP 商品</dt><dd>${state.plan}</dd>
          <dt>兑换码</dt><dd>${state.code}</dd>
          <dt>兑换码状态</dt><dd><span class="status-chip ${codeStatusClass()}">${state.codeStatus}</span></dd>
          <dt>VIP 充值 ID</dt><dd>${state.codeStatus === "已使用" ? state.rechargeId : "未生成"}</dd>
          <dt>TikTok 履约</dt><dd><span class="status-chip success">${state.deliveryStatus}</span></dd>
          <dt>平台订单</dt><dd><span class="status-chip ${state.orderStatus === "已完成" ? "success" : ""}">${state.orderStatus}</span></dd>
          <dt>售后处理</dt><dd>${state.afterSalesStatus}</dd>
        </dl>
      </section>
      <section class="ops-section">
        <p class="control-title">处理记录</p>
        <ul class="log-list">${state.logs.map((log) => `<li>${log}</li>`).join("")}</ul>
      </section>
      ${
        state.review
          ? `
            <section class="ops-section review-rail">
              <div class="review-connectors" aria-hidden="true">
                <i class="review-line one"></i><i class="review-line two"></i><i class="review-line three"></i>
              </div>
              <div class="rule-panel">
                <h2>PRD 规则映射</h2>
                ${rules
                  .map(
                    (rule) => `
                      <button class="rule-card ${state.activeRule === rule.id ? "is-active" : ""}" data-action="rule" data-rule="${rule.id}">
                        <b>${rule.id}</b>${rule.summary}
                      </button>`,
                  )
                  .join("")}
              </div>
            </section>`
          : ""
      }
    </aside>
  `;
}

function render() {
  root.innerHTML = `
    <div class="workbench">
      <header class="workbench-header">
        <div>
          <p class="eyebrow">TIKTOK SHOP / HELLOTALK VIP</p>
          <h1>VIP 商品卡售卖与核销</h1>
          <p>中文演示：邮件交付、App 内兑换、平台售后、退款失效与订单完成。</p>
        </div>
        <div class="review-switch">
          <input id="review-toggle" type="checkbox" ${state.review ? "checked" : ""}>
          <label for="review-toggle">Review</label>
        </div>
      </header>
      <div class="demo-grid ${state.review ? "is-reviewing" : "is-previewing"}">
        ${controlPanel()}
        ${phoneMarkup()}
        ${state.review ? operationsPanel() : ""}
      </div>
    </div>
  `;
}

function setToast(message) {
  state.toast = message;
  render();
  window.clearTimeout(setToast.timeout);
  setToast.timeout = window.setTimeout(() => {
    state.toast = "";
    render();
  }, 2200);
}

function redeem() {
  state.screen = "success";
  state.codeStatus = "已使用";
  state.rechargeFailed = false;
  state.activeRule = "FR-004/2";
  state.logs.unshift(`VIP 实际充值成功，已写入充值 ID ${state.rechargeId}`);
  state.logs.unshift("兑换码状态已更新为已使用");
  state.logs.unshift("用户兑换不影响 TikTok Shop 已送达状态");
  render();
}

function retryDelivery() {
  state.activeRule = "FR-007/1";
  state.logs.unshift(`履约重试：复用原兑换码 ${state.code}，未重复发码`);
  setToast("履约重试完成：已复用原兑换码");
}

function selectRule(ruleId) {
  const rule = rules.find((item) => item.id === ruleId);
  if (!rule) return;
  state.activeRule = ruleId;
  state.rechargeFailed = false;
  state.deliveryStatus = "已送达";
  state.orderStatus = "售后期中";
  state.afterSalesStatus = "无";

  if (rule.screen === "mail") state.screen = "mail";
  if (rule.screen === "delivered") {
    state.codeStatus = "可用";
    state.screen = "mail";
    state.logs.unshift("邮件送达确认：TikTok Shop 履约已更新为 Delivered");
  }
  if (rule.screen === "redeem") state.screen = "redeem";
  if (rule.screen === "confirm") {
    state.codeStatus = "可用";
    state.screen = "confirm";
  }
  if (rule.screen === "success") {
    state.codeStatus = "已使用";
    state.screen = "success";
  }
  if (rule.screen === "failure") {
    state.codeStatus = "可用";
    state.rechargeFailed = true;
    state.screen = "redeem";
  }
  if (rule.screen === "refund-unredeemed") {
    state.codeStatus = "已失效";
    state.screen = "redeem";
    state.afterSalesStatus = "退款成功";
    state.orderStatus = "已完成";
    state.logs.unshift("TikTok Shop 退款成功：未兑换码已立即失效");
  }
  if (rule.screen === "after-sales-request") {
    state.codeStatus = "可用";
    state.screen = "mail";
    state.afterSalesStatus = "待处理";
    state.logs.unshift("用户已发起售后申请：兑换码和权益保持不变");
  }
  if (rule.screen === "after-sales-rejected") {
    state.codeStatus = "可用";
    state.screen = "mail";
    state.afterSalesStatus = "已拒绝";
    state.logs.unshift("售后申请已拒绝：兑换码、权益和平台订单状态不变");
  }
  if (rule.screen === "after-sales-resent") {
    state.codeStatus = "可用";
    state.screen = "mail";
    state.afterSalesStatus = "已补发";
    state.logs.unshift(`已补发原兑换码 ${state.code} 和兑换链接，未生成新码`);
  }
  if (rule.screen === "completed") {
    state.codeStatus = "可用";
    state.screen = "mail";
    state.orderStatus = "已完成";
    state.logs.unshift("售后期结束：TikTok Shop 订单已更新为 Completed");
  }
  if (rule.screen === "retry") retryDelivery();
  render();
}

root.addEventListener("change", (event) => {
  if (event.target.id === "review-toggle") {
    state.review = event.target.checked;
    render();
  }
});

root.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;

  if (action === "screen") {
    state.screen = button.dataset.screen;
    state.rechargeFailed = false;
    state.activeRule = button.dataset.screen === "mail" ? "FR-001/3" : "FR-003/1";
    render();
  }
  if (action === "open-redeem") {
    state.screen = "redeem";
    state.rechargeFailed = false;
    state.activeRule = "FR-003/1";
    render();
  }
  if (action === "back-to-mail") {
    state.screen = "mail";
    state.rechargeFailed = false;
    state.activeRule = "FR-001/3";
    render();
  }
  if (action === "confirm") {
    state.screen = "confirm";
    state.rechargeFailed = false;
    state.activeRule = state.codeStatus === "已失效" ? "FR-005/4" : "FR-003/2";
    render();
  }
  if (action === "dismiss-modal") {
    state.screen = "redeem";
    render();
  }
  if (action === "redeem") redeem();
  if (action === "show-toast") setToast(button.dataset.message);
  if (action === "download-complete") {
    state.screen = "mail";
    setToast("请返回邮件再次点击链接或扫码");
  }
  if (action === "retry-delivery") retryDelivery();
  if (action === "rule") selectRule(button.dataset.rule);
});

render();
