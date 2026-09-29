import * as path from 'node:path';
import { defineConfig } from '@rspress/core';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Snapemu',
  description:
    '用 Snapemu 整理自己的复古游戏收藏，体验多平台游戏库、个性化画面与操控、存档备份和游玩记录。',
  lang: 'zh',
  icon: '/brand/snapemu-app-icon.svg',
  logo: {
    light: '/brand/snapemu-logo.svg',
    dark: '/brand/snapemu-logo-dark.svg',
  },
  themeConfig: {
    darkMode: 'dark',
  },
  locales: [
    {
      lang: 'zh',
      label: '简体中文',
      title: 'Snapemu',
      description:
        '用 Snapemu 整理自己的复古游戏收藏，体验多平台游戏库、个性化画面与操控、存档备份和游玩记录。',
    },
    {
      lang: 'en',
      label: 'English',
      title: 'Snapemu',
      description:
        'Organize your own retro game collection with Snapemu. Explore classic systems, personalized controls and visuals, save backups, and playing history.',
    },
  ],
});
