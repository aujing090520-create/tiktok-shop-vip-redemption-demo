import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const outputPath = resolve(
  process.argv[2] || "/tmp/tiktok-shop-vip-redemption-prd-20260804.json",
);

const ordered = (text, children = []) => ({
  type: "ordered",
  text,
  ...(children.length
    ? { children: children.map((child) => ({ type: "bullet", text: child })) }
    : {}),
});

const rules = (...items) => ({
  blocks: items.map((item) =>
    typeof item === "string" ? ordered(item) : ordered(item.text, item.children),
  ),
});

const spec = {
  title: "商业化-TikTok Shop HelloTalk VIP 商品卡售卖与核销",
  documentId: "LiRPdM1P3o8VfxxSY08ceGEfnhb",
  replaceExistingContent: true,
  sections: [
    {
      heading: "版本管理",
      table: {
        headers: ["编号", "日期", "动作", "内容", "操作人", "平台"],
        columnWidths: [70, 110, 150, 500, 100, 160],
        rows: [
          [
            "1",
            "2026.08.04",
            "修订稿",
            "复用既有兑换码链路，新增 TikTok Shop VIP 商品卡履约及售后接入。",
            "林凡",
            "TikTok Shop、客户端、服务端、后台",
          ],
          [
            "1.1",
            "2026.08.04",
            "交付与售后边界补充",
            "明确邮件交付对应 Delivered、兑换与履约解耦、售后申请处理、退款回收及 Completed 状态。",
            "林凡",
            "TikTok Shop、服务端、后台",
          ],
        ],
      },
    },
    {
      heading: "需求相关资源",
      table: {
        headers: ["资源", "链接", "负责人"],
        columnWidths: [190, 560, 180],
        rows: [
          [
            "TikTok Shop 虚拟类目指引",
            "https://seller-us.tiktok.com/university/essay?knowledge_id=7563407075510030",
            "商业化",
          ],
          [
            "TikTok Shop 订单状态",
            "https://partner.tiktokshop.com/docv2/page/650b1b4bbace3e02b76d1011",
            "商业化",
          ],
          [
            "既有兑换码能力",
            "https://hellotalk.feishu.cn/wiki/Y1fUwbETpipdESkKloJcgbRznUg",
            "商业化",
          ],
          [
            "兑换码链接点击链路",
            "https://hellotalk.feishu.cn/wiki/N2NNw17kqi5Ts1kL0yPchvUYnrg",
            "商业化",
          ],
          [
            "兑换码二维码能力",
            "https://hellotalk.feishu.cn/wiki/RHeVwaisZiEe2nkyH9gcVLpdnKe",
            "商业化",
          ],
        ],
      },
    },
    {
      heading: "需求背景",
      paragraphs: [
        "在 TikTok Shop 销售 HelloTalk VIP 商品卡。用户支付后，平台向下单邮箱交付兑换码、兑换链接和二维码；用户使用 HelloTalk App 扫码或打开链接后，在 App 内打开兑换 H5 并确认兑换。",
        "本需求只接入 TikTok Shop 的订单履约与售后，不新建兑换码体系，不改变既有手输兑换、兑换记录、会员叠加、异常提示或权益回收规则。",
      ],
    },
    {
      heading: "产品目标",
      paragraphs: [
        "支持月卡、年卡、终身卡在 TikTok Shop 售卖并稳定完成邮件交付；将平台 Delivered、Completed 与 HelloTalk 兑换码使用状态解耦；在退款成功后按兑换状态准确作废兑换码或回收权益。",
      ],
    },
    {
      heading: "业务流程",
      paragraphs: [
        "用户付款 -> 服务端按订单商品项绑定既有 VIP 兑换码 -> TikTok Shop 邮件成功交付兑换码、链接和二维码 -> HelloTalk 更新平台履约为 Delivered -> 用户在 App 内确认兑换 -> 售后期结束后平台订单更新为 Completed。",
        "用户发起售后申请 -> 客服按平台当期规则处理同意、拒绝或补发 -> 拒绝时状态不变，补发时重发原兑换码和链接 -> 退款成功时未兑换码失效、已兑换码按充值 ID 回收权益 -> 订单更新为 Completed。",
      ],
    },
    {
      heading: "需求概览",
      table: {
        headers: ["需求名称", "概述", "优先级", "平台"],
        columnWidths: [220, 540, 100, 200],
        rows: [
          [
            "TikTok Shop VIP 商品卡履约",
            "按订单商品项交付既有 VIP 兑换码，并在邮件送达确认后更新 Delivered。",
            "高",
            "TikTok Shop、服务端",
          ],
          [
            "App 内兑换 H5",
            "链接或二维码在 HelloTalk App 内打开 H5；用户在确认弹窗确认权益后兑换。",
            "高",
            "iOS、Android、H5、服务端",
          ],
          [
            "TikTok Shop 售后处理",
            "处理售后申请、拒绝、补发、退款回收和订单 Completed 状态。",
            "高",
            "TikTok Shop、服务端、后台",
          ],
        ],
      },
    },
    {
      heading: "需求详情",
      table: {
        headers: ["功能", "UI/layout", "描述", "备注"],
        columnWidths: [190, 220, 550, 250],
        rows: [
          [
            "FR-001 TikTok Shop VIP 商品卡售卖与邮件交付",
            {
              blocks: [
                {
                  type: "text",
                  text: "TikTok Shop 邮件：二维码与兑换码在首屏优先展示",
                },
                {
                  type: "image",
                  path: resolve(
                    "output/playwright/desktop-mail-qr-priority-final.png",
                  ),
                  label: "图1-邮件交付预览",
                  width: 180,
                  height: 390,
                  align: 2,
                },
                {
                  type: "image",
                  path: resolve(
                    "output/playwright/mobile-phone-mail-qr-priority-390x844-final.png",
                  ),
                  label: "图2-移动端邮件交付预览",
                  width: 180,
                  height: 389,
                  align: 2,
                },
              ],
            },
            rules(
              "仅销售 HelloTalk VIP 月卡、年卡、终身卡。",
              "每个订单商品项对应一张独立兑换码；同一订单购买多件商品时，按商品项分别交付。",
              {
                text: "TikTok Shop 邮件包含兑换码、兑换链接和兑换二维码。",
                children: [
                  "邮件主题：多语言“你的 HelloTalk VIP 兑换码已送达”",
                  "预览文案：多语言“请使用 HelloTalk App 扫码或点击链接，进入兑换码页面完成兑换。”",
                  "二维码标题：多语言“使用HelloTalk进行扫码兑换”",
                  "二维码说明：多语言“打开已登录的 HelloTalk App 扫描二维码，即可进入兑换码页面。”",
                ],
              },
              "邮件首屏和二维码下方均提示使用 HelloTalk App 扫码或点击兑换链接；两种方式都会进入兑换码页面，并自动填写兑换码。",
              "电脑端打开链接或本机未安装 HelloTalk App 时，进入现有下载 App 页面；安装并登录后，用户返回原邮件再次点击链接或扫码。",
              "邮件收件地址仅用于 TikTok Shop 交付，不与 HelloTalk 账号绑定。",
              "平台邮件送达确认后，HelloTalk 更新该订单商品项履约状态为 Delivered；用户后续是否登录或兑换均不改变该 Delivered 状态。",
              "TikTok Shop 商品上下架只影响后续销售，不影响已交付兑换码的既有有效性规则。",
            ),
            "TikTok 商品、价格、上下架均在 TikTok Shop 配置；HelloTalk 不新增商品售卖开关。",
          ],
          [
            "FR-002 TikTok Shop 订单行发码",
            "服务端履约",
            rules(
              "收到 TikTok Shop 履约订单行后，按 order_line_id 生成并绑定一张既有 VIP 兑换码。",
              "根据 TikTok Shop 商品 SKU 匹配月卡、年卡或终身卡对应的 VIP 兑换码规则；兑换码有效期由后台按 VIP 商品规则配置。",
              "同一订单行重复通知或重试时，必须复用已绑定的同一兑换码，不得重复发码。",
              "兑换码交付不与 HelloTalk 账号绑定，不创建账号，也不直接充值账号。",
            ),
            "兑换码生成、码值格式、使用状态及有效期变更均复用原有兑换码逻辑。",
          ],
          [
            "FR-003 兑换链接、二维码与 App 内 H5",
            {
              blocks: [
                {
                  type: "text",
                  text: "兑换 H5 确认弹窗与非 App 环境下载页",
                },
                {
                  type: "image",
                  path: resolve(
                    "output/playwright/mobile-phone-confirm-modal-390x844-final.png",
                  ),
                  label: "图1-App 内确认兑换弹窗",
                  width: 180,
                  height: 389,
                  align: 2,
                },
                {
                  type: "image",
                  path: resolve(
                    "output/playwright/mobile-phone-download-landing-390x844-final.png",
                  ),
                  label: "图2-PC 或未安装 App 时的下载落地页",
                  width: 180,
                  height: 389,
                  align: 2,
                },
              ],
            },
            rules(
              "邮件兑换链接和二维码均在 HelloTalk App 内打开兑换 H5，并自动带入兑换码。",
              "H5 主页面只展示兑换码输入框和确认兑换按钮，不展示账号信息或本次 VIP 权益。",
              "用户点击确认兑换后，使用既有确认弹窗展示本次 VIP 权益，并询问是否兑换。",
              "确认弹窗同意兑换后，按既有兑换码逻辑向当前 App 登录账号发放权益。",
              "兑换 H5 可在所有现有 App 版本打开；H5 支持 HelloTalk 已支持的全部语言，本期中文 Demo 使用中文文案。",
            ),
            "既有手动输入兑换码入口、账号切换和重新进入流程保持不变。",
          ],
          [
            "FR-004 VIP 兑换结果",
            {
              blocks: [
                {
                  type: "text",
                  text: "兑换成功与失败重试状态",
                },
                {
                  type: "image",
                  path: resolve("output/playwright/desktop-success.png"),
                  label: "图1-实际充值成功后的兑换结果",
                  width: 200,
                  height: 150,
                  align: 2,
                },
                {
                  type: "image",
                  path: resolve("output/playwright/desktop-failure-retry.png"),
                  label: "图2-充值失败后保留兑换码并支持重试",
                  width: 200,
                  height: 150,
                  align: 2,
                },
              ],
            },
            rules(
              "用户确认兑换后，按原有兑换码逻辑校验兑换码状态和 VIP 兑换条件。",
              "仅在 VIP 实际充值成功后，将兑换码标记为已使用并展示多语言“兑换成功”。",
              "充值失败或超时不使用兑换码，用户可自行重试。",
              "已使用、已失效、已过期、重复兑换及其他失败提示，全部复用原有兑换码逻辑和文案。",
              "手动输入兑换、兑换记录、既有会员兑换处理和同账号多次兑换，全部复用原有兑换码逻辑。",
            ),
            "用户兑换结果不回写或改变 TikTok Shop 的 Delivered、Completed 状态。",
          ],
          [
            "FR-005 TikTok Shop 售后、退款与订单完成",
            {
              blocks: [
                {
                  type: "text",
                  text: "退款后按兑换码使用状态处理",
                },
                {
                  type: "image",
                  path: resolve(
                    "output/playwright/desktop-refund-unredeemed.png",
                  ),
                  label: "图1-未兑换码退款后直接失效",
                  width: 200,
                  height: 150,
                  align: 2,
                },
                {
                  type: "image",
                  path: resolve(
                    "output/playwright/desktop-refund-redeemed.png",
                  ),
                  label: "图2-已兑换码退款后按充值 ID 回收权益",
                  width: 200,
                  height: 150,
                  align: 2,
                },
              ],
            },
            rules(
              "用户发起售后申请时，只记录售后请求；兑换码状态和已发放权益不变。",
              "客服按 TikTok Shop 当期售后规则处理售后请求。拒绝时，兑换码、权益和平台订单状态不变。",
              "补发时，仅向原下单邮箱重发同一张兑换码及原兑换链接；不生成新码、不退款、不改变既有履约结果。",
              "退款实际成功后，仅处理对应 order_line_id 绑定的兑换码。",
              "退款实际成功且兑换码未使用时，立即将兑换码作废。",
              "退款实际成功且兑换码已使用时，查询兑换码对应的具体 VIP 充值 ID，并按既有权益回收逻辑撤回本次充值权益。",
              "平台售后期结束后，订单从 Delivered 更新为 Completed；退款完成时，订单也更新为 Completed。订单完成不依赖用户是否兑换。",
              "不为虚拟商品固定写死售后期时长；以 TikTok Shop 返回的售后和订单完成事件为准。",
            ),
            "售后处理只更新既有兑换码及权益记录；不新增 App 弹窗、站内信或邮件通知。",
          ],
        ],
      },
    },
    {
      heading: "后台",
      table: {
        headers: ["功能", "UI/layout", "描述", "备注"],
        columnWidths: [190, 220, 550, 250],
        rows: [
          [
            "FR-006 TikTok Shop SKU 映射与订单关联",
            "服务端配置、既有兑换码后台",
            rules(
              "维护 TikTok Shop 商品 SKU 与既有 VIP 兑换码规则的映射，用于识别月卡、年卡、终身卡及其有效期。",
              "映射只用于订单履约，不提供 HelloTalk 商品售卖开关或 TikTok 商品上下架控制。",
              "保存 TikTok Shop 订单号、order_line_id、商品 SKU、兑换码、兑换状态、关联 VIP 充值 ID、履约状态、平台订单状态及售后处理结果。",
            ),
            "后台的兑换码查看、导出、状态和记录展示复用原有逻辑。",
          ],
          [
            "FR-007 履约与售后异常",
            "服务端监控",
            rules(
              "兑换信息回传失败时，在 TikTok Shop 履约时效内重试，且始终复用原订单行已绑定的兑换码。",
              "未匹配 SKU、发码失败、回传失败、退款处理失败时记录异常，供运营与客服排查。",
              "售后申请、拒绝、补发、退款及订单完成事件必须按订单商品项幂等处理。",
              "不得因重试创建新兑换码、重复发放 VIP 或重复回收权益。",
            ),
            "平台字段、售后时效和状态值以 TikTok Shop 当期接口及政策为准。",
          ],
        ],
      },
    },
    {
      heading: "数据需求",
      paragraphs: [
        "TikTok Shop 订单行履约：订单接收、兑换码绑定、兑换信息回传、邮件送达确认及 Delivered 更新。",
        "兑换链路：链接打开、二维码扫码进入、H5 兑换成功或失败及失败原因。",
        "售后链路：售后申请、处理结果、补发、退款订单行、兑换码作废、权益回收及 Completed 更新。",
        "数据维度：TikTok Shop 商品 SKU、订单号、order_line_id、VIP 类型、兑换码状态、履约状态、平台订单状态及售后状态。",
      ],
    },
  ],
};

await writeFile(outputPath, `${JSON.stringify(spec, null, 2)}\n`);
console.log(outputPath);
