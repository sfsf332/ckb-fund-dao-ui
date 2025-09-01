# CKB Fund DAO UI

这是一个基于Next.js 15的现代化Web应用，集成了完整的国际化支持。

## 功能特性

- 🌍 支持中文和英文双语切换
- 🔄 自动检测浏览器语言
- 💾 本地存储语言偏好
- 📱 响应式设计
- 🎯 基于react-intl的翻译系统
- 🚀 Next.js 15 + App Router
- 🎨 Tailwind CSS 4

## 国际化 (i18n) 支持

本项目已集成完整的国际化支持，支持中文和英文两种语言。

### 使用方法

#### 1. 在组件中使用翻译

```tsx
import { useIntl } from 'react-intl';

export default function MyComponent() {
  const intl = useIntl();
  
  return (
    <div>
      <h1>{intl.formatMessage({ id: 'common.title' })}</h1>
      <p>{intl.formatMessage({ id: 'common.description' })}</p>
    </div>
  );
}
```

#### 2. 使用便捷的翻译Hook

```tsx
import { useTranslation } from '../utils/i18n';

export default function MyComponent() {
  const { t, locale } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.title')}</h1>
      <p>{t('common.description')}</p>
      <span>当前语言: {locale}</span>
    </div>
  );
}
```

#### 3. 添加语言切换器

```tsx
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Layout() {
  return (
    <div>
      <header>
        <LanguageSwitcher />
      </header>
      {/* 其他内容 */}
    </div>
  );
}
```

### 添加新的翻译

#### 1. 在语言文件中添加新的键值对

**英文 (src/locales/en.json):**
```json
{
  "common": {
    "welcome": "Welcome to our app",
    "login": "Login"
  }
}
```

**中文 (src/locales/zh.json):**
```json
{
  "common": {
    "welcome": "欢迎使用我们的应用",
    "login": "登录"
  }
}
```

#### 2. 在组件中使用

```tsx
const { t } = useTranslation();

return (
  <div>
    <h1>{t('common.welcome')}</h1>
    <button>{t('common.login')}</button>
  </div>
);
```

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # 国际化路由
│   │   ├── layout.tsx     # 国际化布局
│   │   └── page.tsx       # 主页面
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 根页面（重定向）
├── components/             # React组件
│   └── LanguageSwitcher.tsx
├── contexts/               # React上下文
│   └── I18nContext.tsx
├── locales/                # 语言文件
│   ├── en.json            # 英文翻译
│   └── zh.json            # 中文翻译
├── types/                  # TypeScript类型
│   └── i18n.d.ts
└── utils/                  # 工具函数
    └── i18n.ts
```

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **国际化**: react-intl
- **构建工具**: Turbopack

## 路由结构

- `/` → 重定向到 `/en`
- `/en` → 英文版本
- `/zh` → 中文版本

## 语言切换器组件

`LanguageSwitcher` 组件提供了：
- 中英文切换按钮
- 当前语言高亮显示
- 响应式设计
- 深色模式支持

## 自动语言检测

系统会自动：
1. 检查URL路径中的语言代码
2. 检查localStorage中保存的语言偏好
3. 如果没有保存偏好，检测浏览器语言设置
4. 根据检测结果设置默认语言

## 注意事项

1. 所有需要国际化的文本都应该使用翻译键
2. 保持中英文翻译文件的结构一致
3. 翻译键应该具有描述性和层次性
4. 使用嵌套结构组织翻译内容

## 扩展支持

如需添加更多语言支持：
1. 在 `src/middleware.ts` 的 `locales` 数组中添加新语言代码
2. 创建对应的语言文件 (如 `fr.json`)
3. 在 `I18nContext.tsx` 中导入新语言文件
4. 在 `LanguageSwitcher` 中添加新语言按钮

## 许可证

MIT
