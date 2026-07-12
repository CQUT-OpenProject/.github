import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const site = process.env.SITE_URL || 'http://localhost:4321';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  integrations: [
    starlight({
      title: 'CQUT-OSP Design',
      description: '为校园开源项目建立一致、可信、可访问的视觉语言',
      favicon: '/favicon.svg',
      logo: {
        alt: 'OpenProject',
        replacesTitle: true,
        light: './src/assets/brand-logo-light.svg',
        dark: './src/assets/brand-logo-dark.svg',
      },
      lastUpdated: true,
      customCss: ['./src/styles/custom.css'],
      social: [
        {
          icon: 'github',
          label: 'GitHub 组织',
          href: 'https://github.com/CQUT-OpenProject',
        },
      ],
      sidebar: [
        { label: '概览', link: '/' },
        {
          label: '开始使用',
          items: [
            { label: '设计原则', link: '/start/principles/' },
            { label: '品牌身份与命名', link: '/start/identity/' },
          ],
        },
        {
          label: '品牌',
          items: [
            { label: '标志', link: '/brand/logo/' },
            { label: '颜色', link: '/brand/color/' },
            { label: '排版与图像', link: '/brand/typography-imagery/' },
            { label: '禁止用法', link: '/brand/misuse/' },
          ],
        },
        {
          label: '基础',
          items: [
            { label: '界面基础系统', link: '/foundations/system/' },
            { label: '可访问性', link: '/foundations/accessibility/' },
          ],
        },
        {
          label: '模式',
          items: [
            { label: '导航、表单与数据', link: '/patterns/interface/' },
            { label: '状态与反馈', link: '/patterns/states/' },
          ],
        },
        {
          label: '内容',
          items: [
            { label: '语言与项目命名', link: '/content/writing/' },
            { label: '来源与非官方声明', link: '/content/disclaimer/' },
          ],
        },
        {
          label: '资源',
          items: [
            { label: '下载', link: '/resources/downloads/' },
            { label: '贡献与变更', link: '/resources/contributing/' },
          ],
        },
      ],
    }),
  ],
});
