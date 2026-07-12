# Repository Instructions

## Commit messages

提交信息使用 emoji 前缀，不使用 `feat:`、`fix:` 等 Conventional Commit 类型前缀。根据变更类型选择：

| 变更类型          | Emoji |
| ----------------- | ----- |
| 新功能 (`feat`)   | ✨    |
| 修复 (`fix`)      | 🐛    |
| 文档 (`docs`)     | 📝    |
| 样式 (`style`)    | 💄    |
| 重构 (`refactor`) | ♻️    |
| 性能 (`perf`)     | ⚡️   |
| 测试 (`test`)     | ✅    |
| 杂务 (`chore`)    | 🔧    |
| 构建 (`build`)    | 📦    |
| CI (`ci`)         | 💚    |
| 回滚 (`revert`)   | ⏪    |

无 scope 时使用 `emoji + 空格 + 描述`，例如：

```text
✨ 添加资源下载页
```

有 scope 时使用 `emoji(scope): 描述`，例如：

```text
🐛(docs): 修复暗色主题对比度
```

提交描述应简洁、使用祈使语气，并准确概括本次变更。
