# 运营数据工作台

面向内部运营团队的 Amazon 多店铺商品周表现工作台。当前版本提供登录入口和可交互的界面预览；预览中的指标是演示内容，不代表企业真实业务数据。

## 本地运行

需要 Node.js 22 LTS 和 pnpm 11。

```sh
pnpm install
pnpm dev
```

进入登录页后选择“打开界面预览”即可查看界面。

## Supabase 登录配置

复制 `.env.example` 为 `.env.local` 可在本地启用 Supabase Auth。项目的 Publishable Key 是公开客户端标识，会随前端构建发布；不要使用或提交 Supabase Secret Key。GitHub Pages 工作流已经带有本项目 URL 和 Publishable Key 的默认值，也可在仓库 Settings → Secrets and variables → Actions → Variables 中配置同名变量覆盖。

Supabase Auth 登录和注册接入已经预留。首次投入运营前，还需在 Supabase 配置登录方式、用户邀请/注册策略和账户权限。业务数据读取、RLS 策略和导入流程需在业务字段及访问规则确认后另行实现。

## GitHub Pages

仓库的 Pages 来源需设为 GitHub Actions。工作流会从 `GITHUB_REPOSITORY` 自动推导项目路径，并在 `main` 分支推送后构建与发布。Hash 路由适用于 GitHub Pages 的静态托管路径。
