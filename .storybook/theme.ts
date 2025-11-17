import { create } from '@storybook/theming/create';

export default create({
  base: 'dark',
  brandTitle: 'WorkspaceHQ Storybook',
  brandUrl: 'https://github.com/your-username/workspace-hq',
  brandImage: undefined,
  brandTarget: '_self',
  
  // UI
  appBg: '#0b0f14',
  appContentBg: '#0f1720',
  appPreviewBg: '#111827',
  appBorderColor: 'rgba(255,255,255,0.06)',
  appBorderRadius: 8,
  
  // Text colors
  textColor: '#e6eef8',
  textInverseColor: '#0b0f14',
  textMutedColor: '#9ca3af',
  
  // Toolbar default and active colors
  barTextColor: '#9ca3af',
  barSelectedColor: '#7c3aed',
  barBg: '#111827',
  
  // Form colors
  inputBg: '#1f2937',
  inputBorder: 'rgba(255,255,255,0.06)',
  inputTextColor: '#e6eef8',
  inputBorderRadius: 6,
});
