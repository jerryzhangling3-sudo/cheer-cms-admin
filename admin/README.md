# Cheer Trade CMS · 统一后台

此目录保存 2026-11-02 已部署的完整静态后台，入口为 [index.html](index.html)。仓库根目录的原型、Copytrading APP/Web、Partner APP 和文档继续保留；本后台不包含这些前端应用。

## 预览与部署

从仓库根目录运行 `python3 -m http.server 8000`，打开 `http://localhost:8000/admin/`。无需安装依赖或运行构建工具；也可将本目录整体作为静态站点部署到 `/admin/`。保留 `assets/`、提示音及 `cms-assets/`、`cheercms/` 的相对路径。

## 内容与来源

| 路径 | 内容 |
|---|---|
| `index.html` | 服务器原有客户、客服工单、交易信息、热门推荐、广告、文章、消息、汇率、负余额保护、伊斯兰费用与风控页面，以及统一后台入口 |
| `cms-assets/cms-navigation.js` | 统一后台的 35 项路由、菜单层级、展开高亮、模块加载和客户 UID 跳转 |
| `cms-assets/cms-shell.css` | 用户确认的 prod 风格白色侧栏、顶部账号栏和页面布局 |
| `cms-assets/cms-embed.*` | 业务页面接入统一后台的适配，隐藏重复导航并保留原有交互 |
| `cheercms/` | Copytrading、Partner、出入金与资金业务页面；原型本体基于 `e0e43ff`，附加统一后台适配引用 |
| `cheercms/account-dormant.html`、`cobo.html`、`reconciliation-reports.html` | 休眠账户、Cobo、对账报表演示页面；交互由 `cms-assets/funding-demo.js` 提供 |
| `assets/`、`quote-delay-alert.wav` | 原后台图片、消息图标及报价提示音 |
| `cms-release.json` | 此次已部署代码的版本和文件校验记录，不包含业务数据 |

## 菜单

- Workbench → Customer Tickets。
- Customers → Client、Black List、White List。
- Trade → Trading Information。
- Funding → Cash Mgmt（Deposits、Withdrawals、FX Rates、Gateways）、Balances（Loss Compensation、Ledger、Islamic Account Fee、Account Dormant Mgmt、Funding Adjustment）、Providers（Cobo、Reconciliation Reports）。
- Operations → Notification / Notification Scenes、Display Settings / Hot Trading、Ad Mgmt、Article Management。
- Risk Mgmt → Risk Rules、Risk Limits、Risk Exposure Dashboard、Quote Monitoring。
- Partner → Applications、Affiliates、Transfer Approval、Rebate Ledger、Tier Mgmt、Rebate Settings。
- Copytrading → Level Configuration、Master Management、Copy Trading、Profit Share Ledger、System Logs。

Funding 和 Partner 的名称与层级参照正式环境。当前生产账号的菜单中未列出 Copytrading，此处按用户要求保留为独立一级模块。广告和文章沿用原服务器实现，没有重复引入根目录的运营原型。

## 演示边界与维护

此项目仍是静态原型，不连接生产资金、交易、邮件或权限接口。新增资金页面的数据为人工构造的演示数据，规则和通知设置保存在当前浏览器 localStorage；不是生产数据副本，也不会发送通知。部分原有文案、字段和业务分支仍与 prod 不同。

本目录保持上线版本的页面副本，以便直接预览及恢复。修改根目录单页原型时，不会自动更新本目录的副本：维护者须核对对应 `cheercms/` 页面，并保留 `cms-embed` 引用；不要只修改一端。不要为此引入 React、Vite 或其他构建依赖。

此次同步不修改底层业务算法或 PRD。根目录原有页面和其他维护者提交保持原样，仅在原型总览增加本后台入口。

## 核验记录

已检查 32 个基础路由和 3 个增补页面；已检查模块高亮、重复导航隐藏、筛选重置、Partner 审核抽屉、客户 UID 跳转、休眠规则保存与历史、Cobo 标签以及对账设置弹窗。已部署的 43 项清单文件与服务器 SHA256 一致。CSV 下载验证未完成，不作为已通过检查。

后续发布应重新生成或核对版本记录，不把备份压缩包、临时上传文件、凭据、服务器终端日志或本地浏览器数据加入仓库。Git 协作与安全凭据要求继续遵循根目录 `AGENTS.md`。

## 后台中英文切换（2026-11-02）

统一后台右上角提供「中文 / EN」，覆盖 35 个路由的菜单、面包屑、字段、筛选、按钮和动态弹窗。`cms-assets/cms-i18n-data.js` 保存双语词库（每条为中文、英文），`cms-i18n.js` 在原有 DOM 上更新界面文本，保留事件监听、表单值及选项的内部值；新增 UI 文案需同步补充词库。菜单中文名称集中在 `cms-navigation.js` 的 `zhLabels`。

语言保存在 `cheer-cms-language`，同时兼容原型的 `cfd-lang`；嵌入页面与父页同步，无需刷新 iframe。客户姓名、文章正文、通知内容、广告素材名称和用户输入保持原内容。管理界面的语言与文章/广告的 English / العربية 内容编辑语言独立。

新增模块须在 `cms-embed.js` 之后各引入一次双语词库与运行脚本，并核验两种语言、动态弹窗、刷新语言记忆，以及切换时筛选和未提交表单不丢失。本次仅修改 `admin/` 部署副本，不改变根目录独立原型与底层业务算法。

## Client 对齐 prod（2026-11-02）

`cms-assets/cms-client.js` 与 `cms-client.css` 为统一后台提供独立、受作用域限制的客户界面，在 `cms-navigation.js` 初始化前加载；只覆盖 Client 入口，保留原黑白名单和其他模块。参照正式环境只读核对列表的9项筛选、13列表头以及客户详情9个页签（Information、Trading Accounts、Trading Information、Financial、Funding、Rebate、KYC、Tracking Records、Risk Alert Records）。

界面包含注册时间排序、分页、账号搜索、UID复制、资料编辑、账户创建及名称编辑、资金与返佣筛选、KYC附件演示、跟进记录创建/查看和风控详情。资料、账户与跟进记录使用专用浏览器存储 `cheer-cms-client-demo-v1`；不连接正式环境接口或电话服务。数据为本地构造，未复制prod客户记录。客户姓名编辑不改变KYC法定姓名。客户详情支持 `#/customers/client-list?uid=10938472&tab=funding`，兼容 `#/customers/client-list/10938472?tab=funding`。

本模块使用显式双语标签，语言变更只更新文本和提示，不重新渲染表单；原生模态弹窗内也提供语言按钮。根目录独立 `clients.html` 是不同上下文的原型，本次按服务器部署范围保持不变，不应直接覆盖本模块。
