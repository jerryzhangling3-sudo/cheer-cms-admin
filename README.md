# Cheer CMS Admin

Cheer Trade CMS 后台的可运行静态原型，包含中英文切换、客户管理、资金、运营、风控、Partner 和 Copytrading 等模块。初始版本对应线上发布 `cms-client-prod-aligned-20261102-2`。

## 本地预览

在仓库根目录运行 `python3 -m http.server 8080`，打开 [后台](http://localhost:8080/admin/)。右上角可切换中文和英文。

项目使用 HTML、CSS 和 JavaScript，支持演示数据。部分编辑结果保存在当前浏览器。

## 一起维护

在 Issues 记录需求、负责人与验收条件。按需求创建分支，完成后提交 Pull Request，并附上变更范围和验证结果。涉及界面文案时，请验证中英文切换、对应页面和弹窗。

[后台结构与维护说明](admin/README.md) · [初始发布文件清单](admin/cms-release.json)
