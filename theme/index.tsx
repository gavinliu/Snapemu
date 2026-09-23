import { useFrontmatter } from '@rspress/core/runtime';
import { Layout as OriginalLayout } from '@rspress/core/theme-original';
import LandingPage from './LandingPage';

export * from '@rspress/core/theme-original';

export function Layout() {
  const { frontmatter } = useFrontmatter();
  return frontmatter.pageType === 'home' ? <LandingPage /> : <OriginalLayout />;
}
