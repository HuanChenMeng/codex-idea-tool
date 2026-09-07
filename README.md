# Codex Idea Tool

> 非官方的 JetBrains IDE Codex ACP 配置管理工具。

Codex Idea Tool 用于为 JetBrains IDE 创建相互隔离的 Codex 配置：管理兼容 OpenAI API 的第三方 Provider、模型及推理等级，也可保存多个独立的 OpenAI 登录账号，并从指定配置启动 IDEA。

## 功能

- 多个第三方 Provider，支持保存、获取模型、连接测试与每模型推理等级；
- 多个独立 OpenAI 账号，支持普通 OAuth 登录和导入已有 `auth.json`；
- 仅在从本工具启动 IDEA 时注入隔离配置，不修改系统环境变量；
- 实时脱敏日志、配置备份与恢复；
- 单实例运行与独立配置目录。

## 使用方式

1. 在“第三方 Provider”页填写接口地址、API Key 和模型，保存后获取模型并配置推理等级。
2. 或在“OpenAI 账号”页新增账号，完成普通 OAuth 登录，或导入已有认证文件。
3. 回到“启动配置”选择 Provider 或账号，完全退出 IDEA 后点击“启动隔离 IDEA”。

程序数据保存在本机 `%LOCALAPPDATA%\\JetBrains` 下的专用目录；不会写入系统环境变量，也不会影响 Codex 桌面客户端或普通方式启动的 IDEA。

详细说明参见 [使用说明](./使用说明.md)。

## 开发

技术栈：React + TypeScript + Tauri 2 + Rust。

```powershell
npm install
npm run tauri dev
```

构建 Windows 程序：

```powershell
npm run tauri build
```

需要 Node.js、Rust 与 Windows 开发环境。

## 免责声明

本项目为社区非官方工具，与 OpenAI、JetBrains 均无隶属或官方合作关系。请自行确保所使用的第三方服务、账号和 API Key 符合相应服务条款。
