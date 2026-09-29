import { useEffect, useId, useRef, useState } from 'react';
import {
  useFrontmatter,
  useHead,
  useLang,
  useSite,
  withBase,
} from '@rspress/core/runtime';
import './landing.css';

type IconName =
  | 'arrow'
  | 'chevron'
  | 'gamepad'
  | 'folder'
  | 'sparkles'
  | 'save'
  | 'check'
  | 'mail'
  | 'close'
  | 'menu'
  | 'globe'
  | 'diamond'
  | 'clock';

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    chevron: <path d="m9 5 7 7-7 7" />,
    gamepad: (
      <>
        <path d="M7 7h10c3 0 5 10 3 11-2 1-4-3-4-3H8s-2 4-4 3C2 17 4 7 7 7Z" />
        <path d="M8 9v5M5.5 11.5h5M16 10h.01M18 13h.01" />
      </>
    ),
    folder: <path d="M3 7V5h6l2 2h10v12H3V7Zm0 3h18" />,
    sparkles: (
      <>
        <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" />
        <path d="M20 2v4M18 4h4" />
      </>
    ),
    save: (
      <>
        <path d="M4 3h13l3 3v15H4V3Z" />
        <path d="M8 3v6h8V3M8 21v-8h8v8" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </>
    ),
    diamond: (
      <>
        <path d="m3 8 4-5h10l4 5-9 13L3 8Zm0 0h18M7 3l5 18 5-18" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function LanguageMenu({ onNavigate }: { onNavigate?: () => void }) {
  const { site } = useSite();
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const currentLabel = site.locales.find(
    (locale) => locale.lang === lang,
  )?.label;

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open, menuRef]);

  return (
    <div
      className="language-menu"
      ref={menuRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation();
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className="language-trigger"
        aria-label={`${lang === 'zh' ? '选择语言' : 'Select language'}: ${currentLabel}`}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
      >
        <Icon name="globe" size={17} />
        <span>{currentLabel}</span>
        <Icon name="chevron" size={14} />
      </button>
      <ul className="language-options" id={menuId} hidden={!open}>
        {site.locales.map((locale) => (
          <li key={locale.lang}>
            <a
              href={withBase(
                locale.lang === site.lang ? '/' : `/${locale.lang}/`,
              )}
              lang={locale.lang}
              hrefLang={locale.lang}
              rel="alternate"
              aria-current={locale.lang === lang ? 'page' : undefined}
              onClick={(event) => {
                setOpen(false);
                if (locale.lang === lang) {
                  event.preventDefault();
                  buttonRef.current?.focus();
                } else {
                  onNavigate?.();
                }
              }}
            >
              {locale.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const platforms = [
  { id: 'nes', name: 'NES', type: 'console' },
  { id: 'snes', name: 'SNES', type: 'console' },
  { id: 'gb', name: 'Game Boy', type: 'handheld' },
  { id: 'gbc', name: 'Game Boy Color', type: 'handheld' },
  { id: 'gba', name: 'Game Boy Advance', type: 'handheld' },
  { id: 'arcade', name: 'Arcade', type: 'arcade' },
];

const faqs = [
  {
    zh: [
      'Snapemu 会提供游戏吗？',
      '不会。Snapemu 不提供游戏文件。请使用从自己拥有的正版游戏中合法导出的 ROM，或获得合法授权的自制游戏和免费游戏，并遵守所在地区的法律与版权要求。',
    ],
    en: [
      'Does Snapemu include games?',
      'No. Snapemu does not provide game files. Use ROMs legally extracted from games you own, or authorized homebrew and free games. Always follow the laws and copyright requirements in your region.',
    ],
  },
  {
    zh: [
      '如何导入我的游戏？',
      '将游戏文件放入游戏目录下的 roms 文件夹，并按系统分类，例如 roms/nes、roms/snes 或 roms/gba。然后在 App 中选择该目录并开始扫描。也支持直接导入 ROM 文件，或仅包含一个游戏文件的 ZIP 压缩包。',
    ],
    en: [
      'How do I import my games?',
      'Place your files in the roms folder of your game directory, grouped by system, such as roms/nes, roms/snes, or roms/gba. Select that directory in the app and scan it. You can also import a ROM directly, or a ZIP containing a single game file.',
    ],
  },
  {
    zh: [
      '目前支持哪些游戏系统？',
      '当前支持 NES、SNES、GB、GBC、GBA，以及 CPS1、CPS2、CPS3、NEOGEO 和 IGS 街机平台。具体游戏兼容性会受到模拟核心、游戏文件和设备环境影响。',
    ],
    en: [
      'Which game systems are supported?',
      'Snapemu currently supports NES, SNES, GB, GBC, GBA, and CPS1, CPS2, CPS3, NEOGEO, and IGS arcade systems. Compatibility varies by emulation core, game file, and device.',
    ],
  },
  {
    zh: [
      '可以使用外部手柄吗？',
      'Snapemu 提供键盘和外部手柄的启用与按键映射设置，让操作更符合你的习惯。具体设备与平台的支持范围，以正式发布版本的说明为准。',
    ],
    en: [
      'Can I use an external controller?',
      'Keyboard and external controller settings include custom button mapping. Device and platform support will be detailed with the released version.',
    ],
  },
  {
    zh: [
      '存档可以备份和恢复吗？',
      '可以。你可以将本机存档导出为备份文件，并在恢复前预览内容。遇到手动存档冲突时，可以保留较新的存档、保留当前存档，或使用备份存档。这是文件备份与恢复，并非云同步。',
    ],
    en: [
      'Can I back up and restore my saves?',
      'Yes. Export local saves to a backup file, preview its contents, and restore it. For conflicting manual saves, keep the newer save, the current save, or the backup. This is file-based backup and restore, not cloud sync.',
    ],
  },
  {
    zh: [
      '如何把游戏添加到桌面？',
      '此功能仅适用于 Android。你可以在游戏详情页请求添加桌面快捷方式，并按系统提示完成。如果未成功，请检查系统设置中 Snapemu 的快捷方式权限。具体权益以 App 内专业版页面为准。',
    ],
    en: [
      'How do I add a game to my home screen?',
      'This feature is Android-only. Request a shortcut from the game details page and follow the system prompts. If it fails, check Snapemu’s shortcut permission in system settings. Availability is subject to the in-app Premium offering.',
    ],
  },
];

function PixelLandscape() {
  return (
    <svg
      viewBox="0 0 560 260"
      fill="none"
      aria-hidden="true"
      className="pixel-landscape"
      shapeRendering="crispEdges"
    >
      <rect width="560" height="260" fill="#171c39" />
      <path d="M0 0h560v70H0z" fill="#202443" />
      <path d="M0 70h560v60H0z" fill="#303052" />
      <path d="M0 130h560v65H0z" fill="#544064" />
      <path d="M0 195h560v65H0z" fill="#9a5974" />
      <path
        d="M367 52h56v8h12v12h8v36h-8v12h-12v8h-56v-8h-12v-12h-8V72h8V60h12z"
        fill="#ffbb9e"
      />
      <path
        d="M0 170h24v-20h25v-23h27v-24h30V80h27v23h30v24h27v24h24v20h30v89H0z"
        fill="#343355"
      />
      <path
        d="M197 260v-69h28v-25h27v-27h28v-27h30V86h27v26h26v27h28v27h26v25h30v69z"
        fill="#252944"
      />
      <path
        d="M0 221h33v-24h36v-18h35v-19h26v19h30v21h30v22h40v38H0zM378 260v-45h30v-30h30v-24h27v-25h26v25h25v24h20v30h24v45z"
        fill="#141d32"
      />
      <path
        d="M270 192h60v12h-30v14h34v12h40v12h40v18H216v-18h65v-12h23v-12h-36v-14h-24v-12z"
        fill="#86c7d0"
      />
      <path
        d="M268 204h32v7h-32zM304 230h41v6h-41zM252 247h74v7h-74z"
        fill="#ccdde2"
      />
      <path
        d="M42 38h4v4h-4zM151 29h4v4h-4zM247 52h4v4h-4zM308 27h4v4h-4zM482 35h4v4h-4zM514 84h4v4h-4zM200 81h4v4h-4z"
        fill="#d8d1e6"
      />
      <path
        d="M40 239v-32h8v-16h8v16h8v32zM470 250v-39h8v-16h8v16h8v39z"
        fill="#0f1729"
      />
    </svg>
  );
}

export default function LandingPage() {
  const { frontmatter } = useFrontmatter();
  const isZh = useLang() === 'zh';
  const t = (zh: string, en: string) => (isZh ? zh : en);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('original');
  const [dialog, setDialog] = useState<'premium' | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useHead({
    htmlAttrs: { lang: isZh ? 'zh-CN' : 'en' },
    title: t(
      'Snapemu 复古游戏模拟器与个人游戏库',
      'Snapemu — Retro Game Emulator & Personal Game Library',
    ),
    meta: [
      { name: 'description', content: frontmatter.description },
      {
        property: 'og:title',
        content: t(
          'Snapemu 让经典随时开玩',
          'Snapemu — Your classics. Ready to play.',
        ),
      },
      {
        property: 'og:description',
        content: t(
          '整理你的复古游戏库，按自己的方式继续熟悉的冒险。',
          'Organize your retro game library and continue a familiar adventure, your way.',
        ),
      },
      { property: 'og:type', content: 'website' },
    ],
  });

  useEffect(() => {
    if (!dialog) return;
    const element = dialogRef.current;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [dialog, dialogRef]);

  const guideHref = withBase(isZh ? '/guide/' : '/en/guide/');
  const nav = [
    ['#platforms', t('支持平台', 'Systems')],
    ['#features', t('功能', 'Features')],
    ['#premium', t('专业版', 'Premium')],
    ['#faq', t('常见问题', 'FAQ')],
  ];

  return (
    <div
      className={`snapemu-site ${isZh ? 'locale-zh' : 'locale-en'}`}
      lang={isZh ? 'zh-CN' : 'en'}
    >
      <a className="skip-link" href="#main">
        {t('跳至主要内容', 'Skip to content')}
      </a>
      <header className="site-header">
        <div className="nav-shell">
          <a
            className="brand-link"
            href={withBase(isZh ? '/' : '/en/')}
            aria-label={t('Snapemu 首页', 'Snapemu home')}
          >
            <img
              src={withBase('/brand/snapemu-logo-dark.svg')}
              alt="Snapemu"
              width="160"
              height="36"
            />
          </a>
          <nav
            className="desktop-nav"
            aria-label={t('主导航', 'Main navigation')}
          >
            {nav.map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <div className="desktop-language">
              <LanguageMenu />
            </div>
            <button
              ref={menuButtonRef}
              className="menu-toggle icon-button"
              aria-label={
                menuOpen
                  ? t('关闭菜单', 'Close menu')
                  : t('打开菜单', 'Open menu')
              }
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label={t('移动导航', 'Mobile navigation')}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setMenuOpen(false);
                menuButtonRef.current?.focus();
              }
            }}
          >
            {nav.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
                <Icon name="arrow" size={16} />
              </a>
            ))}
            <LanguageMenu onNavigate={() => setMenuOpen(false)} />
          </nav>
        )}
      </header>

      <main id="main">
        <section className="hero section-shell" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow">
              <span className="status-dot" />
              {t('你的经典游戏库，随身带走', 'YOUR CLASSICS. ALWAYS WITH YOU.')}
            </div>
            <h1 id="hero-heading">
              {t('让经典，', 'Your classics.')}
              <br />
              <span>{t('随时开玩', 'Ready to play.')}</span>
              <i aria-hidden="true" />
            </h1>
            <p className="hero-description">
              {t(
                '你的跨平台复古游戏模拟器。整理自己的游戏收藏，在手机和平板上，继续那段熟悉的冒险。',
                'Your cross-platform retro game emulator. Organize your own collection and pick up a familiar adventure on your phone or tablet.',
              )}
            </p>
            <div className="store-badges hero-store-badges">
              <a
                href="https://snapemu.gavinliu.cn/"
                aria-label={t(
                  '在 App Store 下载 Snapemu',
                  'Download Snapemu on the App Store',
                )}
              >
                <img
                  src={withBase('/store/app-store-badge.svg')}
                  alt=""
                  width="135"
                  height="40"
                />
              </a>
              <a
                href="https://snapemu.gavinliu.cn/"
                aria-label={t(
                  '在 Google Play 下载 Snapemu',
                  'Get Snapemu on Google Play',
                )}
              >
                <img
                  src={withBase('/store/google-play-badge.svg')}
                  alt=""
                  width="135"
                  height="40"
                />
              </a>
            </div>
            <p className="hero-note">
              <span className="note-mark">i</span>
              {t(
                '不提供游戏文件，请使用自有或合法授权的内容。',
                'No games included. Bring your own legally authorized content.',
              )}
            </p>
          </div>
          <div
            className="hero-art"
            role="img"
            aria-label={t(
              '电光粉 Snapemu 品牌标志与经典游戏平台图标',
              'Electric-magenta Snapemu brand mark surrounded by classic system icons',
            )}
          >
            <div className="art-grid" />
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <span className="art-cross cross-one">+</span>
            <span className="art-cross cross-two">+</span>
            <span className="art-coordinate coordinate-top">
              01 / PIXEL IN MOTION
            </span>
            <div className="app-emblem">
              <img
                src={withBase('/brand/snapemu-app-icon.svg')}
                alt=""
                width="256"
                height="256"
              />
              <span className="emblem-edge" />
            </div>
            <div className="floating-system system-gba">
              <img
                src={withBase('/platforms/gba.png')}
                alt=""
                width="32"
                height="32"
              />
              <span>GAME BOY ADVANCE</span>
            </div>
            <div className="floating-system system-nes">
              <img
                src={withBase('/platforms/nes.png')}
                alt=""
                width="32"
                height="32"
              />
              <span>NES</span>
            </div>
            <div className="floating-tag">
              <span className="status-dot" />
              {t('经典，从未离开', 'CLASSICS NEVER GET OLD')}
            </div>
            <span className="art-coordinate coordinate-bottom">
              PRESS PLAY. REWIND TIME.
            </span>
            <div className="art-pixels" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="hero-highlights">
            <span>
              <Icon name="folder" size={18} />
              {t(
                '一个游戏库，收藏所有热爱',
                'One library. All your favorites.',
              )}
            </span>
            <span>
              <Icon name="gamepad" size={18} />
              {t('你的画面，你的操作方式', 'Your look. Your way to play.')}
            </span>
            <span>
              <Icon name="save" size={18} />
              {t('保存进度，随时继续', 'Save the moment. Pick it up later.')}
            </span>
          </div>
        </section>

        <section
          className="platform-section section-shell"
          id="platforms"
          aria-labelledby="platform-heading"
        >
          <div className="section-topline">
            <span className="eyebrow">THE CLASSICS, CONNECTED</span>
            <span className="small-label">
              {t('家用主机 / 掌机 / 街机', 'CONSOLES / HANDHELDS / ARCADE')}
            </span>
          </div>
          <h2 id="platform-heading">
            {t('从掌机到街机，', 'From pocket-sized adventures')}
            <span className="muted-title">
              {t('熟悉的世界都在这里。', ' to arcade favorites.')}
            </span>
          </h2>
          <div className="platform-grid">
            {platforms.map((platform) => (
              <div
                className={`platform-item platform-${platform.id}`}
                key={platform.id}
              >
                <img
                  src={withBase(`/platforms/${platform.id}.png`)}
                  alt=""
                  width="40"
                  height="40"
                  loading="lazy"
                />
                <strong>{platform.name}</strong>
              </div>
            ))}
          </div>
          <p className="section-footnote">
            {t(
              '具体游戏兼容性可能因模拟核心、游戏文件与设备而异。',
              'Game compatibility may vary by emulation core, game file, and device.',
            )}
          </p>
        </section>

        <section
          className="features-section section-shell"
          id="features"
          aria-labelledby="features-heading"
        >
          <div className="section-heading">
            <div className="eyebrow">
              <span className="tiny-square" />
              BUILT AROUND YOUR PLAY
            </div>
            <h2 id="features-heading">
              {t('不止重温，', 'More than nostalgia.')}
              <br />
              {t('是按你的方式，再玩一次。', 'Make it your own.')}
            </h2>
            <p>
              {t(
                '从整理收藏到按下开始，每一个细节，都为下一次「再玩一会儿」。',
                'From organizing your collection to pressing start. Every detail, made for just one more game.',
              )}
            </p>
          </div>
          <div className="feature-grid">
            <article className="feature-card library-card">
              <div className="feature-copy">
                <div className="feature-label">
                  <Icon name="folder" />
                  {t('个人游戏库', 'YOUR GAME LIBRARY')}
                  <span>01</span>
                </div>
                <h3>
                  {t('收藏有序，', 'A home for every game.')}
                  <br />
                  {t('热爱随时就绪。', 'Ready when you are.')}
                </h3>
                <p>
                  {t(
                    '选择游戏目录，自动扫描并按平台整理。搜索、最近游玩与星选收藏，让下一场冒险不用翻找。',
                    'Scan your game directory and organize by system. Search, recently played, and favorites bring your next adventure closer.',
                  )}
                </p>
                <div className="feature-chips">
                  <span>{t('目录扫描', 'Directory scan')}</span>
                  <span>{t('星选收藏', 'Favorites')}</span>
                  <span>{t('游戏详情与预览', 'Details & previews')}</span>
                </div>
              </div>
              <div
                className="library-visual"
                aria-label={t(
                  '按平台分类的游戏目录结构示意',
                  'Illustration of a game directory organized by system',
                )}
              >
                <div className="directory-title">
                  <Icon name="folder" size={18} />
                  <span>roms</span>
                  <span className="directory-caption">
                    {t('你的收藏，从这里开始', 'Your collection starts here')}
                  </span>
                </div>
                {['nes', 'snes', 'gba'].map((platform, index) => (
                  <div className="directory-row" key={platform}>
                    <span className="directory-branch" />
                    <img
                      src={withBase(`/platforms/${platform}.png`)}
                      alt=""
                      width="28"
                      height="28"
                      loading="lazy"
                    />
                    <span>{platform.toUpperCase()}</span>
                    <span className="directory-format">
                      {['.nes', '.sfc', '.gba'][index]}
                    </span>
                    <Icon name="check" size={15} />
                  </div>
                ))}
                <span className="visual-caption">
                  {t('游戏目录结构示意', 'Game directory illustration')}
                </span>
              </div>
            </article>

            <article className="feature-card filter-card">
              <div className="feature-copy">
                <div className="feature-label">
                  <Icon name="sparkles" />
                  {t('画面与滤镜', 'LOOK & FEEL')}
                  <span>02</span>
                </div>
                <h3>
                  {t('熟悉的像素，', 'Same pixels.')}
                  <br />
                  {t('不止一种味道。', 'A different feeling.')}
                </h3>
                <p>
                  {t(
                    '保留原生像素，或重温 LCD 与 CRT 的质感。还有锐利、xBRZ 等画面选择。',
                    'Keep the original pixels, or revisit the feel of LCD and CRT. Explore sharp rendering and xBRZ, too.',
                  )}
                </p>
              </div>
              <div className="filter-demo">
                <div className={`landscape-frame filter-${filter}`}>
                  <PixelLandscape />
                  <span className="landscape-filter" />
                </div>
                <fieldset className="filter-selector">
                  <legend className="sr-only">
                    {t(
                      '选择画面风格示意',
                      'Choose an illustrative display style',
                    )}
                  </legend>
                  {[
                    ['original', t('原生像素', 'Original')],
                    ['lcd', 'LCD'],
                    ['crt', 'CRT'],
                  ].map(([value, label]) => (
                    <label
                      key={value}
                      className={filter === value ? 'selected' : ''}
                    >
                      <input
                        type="radio"
                        name="display-filter"
                        value={value}
                        checked={filter === value}
                        onChange={() => setFilter(value)}
                      />
                      {label}
                    </label>
                  ))}
                </fieldset>
                <span className="visual-caption">
                  {t(
                    '原创画面 · 仅作滤镜风格示意，非实机截图',
                    'Original artwork · style illustration, not an app screenshot',
                  )}
                </span>
              </div>
            </article>

            <article className="feature-card controls-card">
              <div className="feature-copy">
                <div className="feature-label">
                  <Icon name="gamepad" />
                  {t('操控个性化', 'MADE TO FIT YOU')}
                  <span>03</span>
                </div>
                <h3>
                  {t('每一次按键，', 'Every button.')}
                  <br />
                  {t('都刚好顺手。', 'Just where you want it.')}
                </h3>
                <p>
                  {t(
                    '调整虚拟手柄皮肤、横竖屏布局与振动强度。斜键、连发，以及键盘与外部手柄映射，都听你的。',
                    'Customize controller skins, portrait and landscape layouts, and vibration. Make diagonal input, turbo, keyboard, and controller mapping your own.',
                  )}
                </p>
              </div>
              <div className="controller-visual" aria-hidden="true">
                <div className="controller-outline">
                  <div className="dpad">
                    <span />
                    <span />
                    <i />
                  </div>
                  <div className="controller-middle">
                    <i />
                    <i />
                  </div>
                  <div className="controller-buttons">
                    <span>B</span>
                    <span>A</span>
                  </div>
                </div>
                <span className="controller-annotation">
                  {t('你的手感，你来定义', 'YOUR CONTROLS. YOUR RULES.')}
                </span>
              </div>
            </article>

            <article className="feature-card saves-card">
              <div className="feature-copy">
                <div className="feature-label">
                  <Icon name="save" />
                  {t('存档与备份', 'PICK UP WHERE YOU LEFT OFF')}
                  <span>04</span>
                </div>
                <h3>
                  {t('暂停冒险，', 'Pause the adventure.')}
                  <br />
                  {t('不丢掉进度。', 'Keep the progress.')}
                </h3>
                <p>
                  {t(
                    '自动存档与多个手动档位，留住关键时刻。将本机存档导出备份，或从备份中预览恢复。',
                    'Auto-saves and multiple manual slots keep your milestones safe. Export local saves and preview a backup before restoring it.',
                  )}
                </p>
              </div>
              <div className="save-flow">
                <div>
                  <Icon name="save" />
                  <strong>{t('保存', 'Save')}</strong>
                  <span>{t('自动 / 手动', 'Auto / manual')}</span>
                </div>
                <Icon name="arrow" size={16} />
                <div>
                  <Icon name="folder" />
                  <strong>{t('备份', 'Back up')}</strong>
                  <span>{t('导出文件', 'Export a file')}</span>
                </div>
                <Icon name="arrow" size={16} />
                <div>
                  <Icon name="check" />
                  <strong>{t('继续', 'Continue')}</strong>
                  <span>{t('恢复进度', 'Restore progress')}</span>
                </div>
              </div>
              <p className="visual-caption">
                {t(
                  '文件备份与恢复，不是云同步。',
                  'File-based backup and restore. Not cloud sync.',
                )}
              </p>
            </article>

            <article className="journey-card feature-card">
              <div className="journey-copy">
                <div className="feature-label">
                  <Icon name="clock" />
                  {t('游玩记录', 'YOUR PLAYING HISTORY')}
                </div>
                <h3>
                  {t(
                    '每一次回归，都有迹可循。',
                    'Every return becomes part of your story.',
                  )}
                </h3>
                <p>
                  {t(
                    '累计时长、连续天数、常玩游戏。看见你和经典一起走过的旅程。',
                    'Total play time, playing streaks, and your most-played games. A little history of your time with the classics.',
                  )}
                </p>
                <div className="journey-tags">
                  <span>{t('累计时长', 'Play time')}</span>
                  <span>{t('连续天数', 'Playing streaks')}</span>
                  <span>{t('常玩游戏', 'Your favorites')}</span>
                </div>
              </div>
              <div className="journey-visual" aria-hidden="true">
                <div className="heatmap">
                  {Array.from({ length: 126 }, (_, i) => (
                    <i
                      key={i}
                      className={`heat-${(i * 7 + Math.floor(i / 9) * 3) % 5}`}
                    />
                  ))}
                </div>
                <span>EVERY PIXEL TELLS A STORY.</span>
              </div>
            </article>
          </div>
          <div className="personalization-note">
            <span className="theme-dots" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
            <span>
              {t(
                '七种主题配色，深浅两种心情。',
                'Seven theme colors. Light and dark moods.',
              )}
              <span className="muted">
                {t(
                  ' 简体中文 / English / 跟随系统',
                  ' English / 简体中文 / System preferences',
                )}
              </span>
            </span>
          </div>
        </section>

        <section
          className="showcase-section section-shell"
          aria-labelledby="showcase-heading"
        >
          <div className="section-topline">
            <span className="eyebrow">SNAPEMU ON YOUR PHONE</span>
          </div>
          <h2 id="showcase-heading">
            {t('熟悉的世界，', 'The classics,')}
            <span className="muted-title">
              {t('装进你的口袋。', 'now in your pocket.')}
            </span>
          </h2>
          <div className="showcase-grid">
            <figure>
              <img
                src={withBase('/screenshots/library.webp')}
                alt={t(
                  'Snapemu 游戏库界面截图：按平台分类展示游戏收藏',
                  'Snapemu library screen: a collection organized by system',
                )}
                width="700"
                height="1318"
                loading="lazy"
              />
              <figcaption>{t('游戏库', 'Game library')}</figcaption>
            </figure>
            <figure>
              <img
                src={withBase('/screenshots/game-detail.webp')}
                alt={t(
                  'Snapemu 游戏详情界面截图：封面、介绍与版本选择',
                  'Snapemu game details screen: cover art, description, and versions',
                )}
                width="700"
                height="1318"
                loading="lazy"
              />
              <figcaption>{t('游戏详情', 'Game details')}</figcaption>
            </figure>
          </div>
        </section>

        <section
          className="premium-section section-shell"
          id="premium"
          aria-labelledby="premium-heading"
        >
          <div className="premium-panel">
            <div className="premium-symbol" aria-hidden="true">
              <Icon name="diamond" size={48} />
            </div>
            <div className="premium-copy">
              <div className="eyebrow">SNAPEMU PREMIUM</div>
              <h2 id="premium-heading">
                {t('为热爱，多一点选择。', 'A little more for what you love.')}
              </h2>
              <p>
                {t(
                  '探索控制器换肤、更多封面展示与 Android 桌面快捷方式等专业版计划。',
                  'Explore planned Premium options, from controller skins to more cover displays and Android home screen shortcuts.',
                )}
              </p>
              <span className="premium-disclaimer">
                {t(
                  '部分权益仍在准备中，具体权益与方案以 App 内为准。',
                  'Some benefits are still in preparation. Final features and plans are subject to the in-app offering.',
                )}
              </span>
            </div>
            <button
              className="button button-secondary"
              onClick={() => setDialog('premium')}
            >
              {t('了解专业版', 'Explore Premium')}
              <Icon name="arrow" size={18} />
            </button>
          </div>
        </section>

        <section
          className="faq-section section-shell"
          id="faq"
          aria-labelledby="faq-heading"
        >
          <div className="faq-intro">
            <div className="eyebrow">GOOD TO KNOW</div>
            <h2 id="faq-heading">
              {t('开玩之前，', 'Before you')}
              <br />
              {t('你可能想知道。', 'press play.')}
            </h2>
            <p>
              {t(
                '关于游戏、设备和那些重要的小事。',
                'Games, devices, and the little things that matter.',
              )}
            </p>
            <a className="text-link" href={guideHref}>
              {t('查看完整使用指南', 'Explore the user guide')}
              <Icon name="arrow" size={16} />
            </a>
          </div>
          <div className="faq-list">
            {faqs.map((item, index) => {
              const [question, answer] = isZh ? item.zh : item.en;
              return (
                <details key={question} className="faq-item">
                  <summary>
                    <span className="faq-number">0{index + 1}</span>
                    <h3>{question}</h3>
                    <span className="faq-plus" aria-hidden="true" />
                  </summary>
                  <p>{answer}</p>
                </details>
              );
            })}
          </div>
        </section>

        <section
          className="closing-section section-shell"
          aria-labelledby="closing-heading"
        >
          <div className="closing-panel">
            <img
              className="closing-mark"
              src={withBase('/brand/snapemu-mark.svg')}
              alt=""
              width="88"
              height="88"
              loading="lazy"
            />
            <div className="eyebrow">YOUR NEXT ADVENTURE IS WAITING</div>
            <h2 id="closing-heading">
              {t('下一场经典冒险，', 'Your next adventure')}
              <br />
              {t('从你的游戏库开始。', 'starts in your library.')}
            </h2>
            <p>
              {t(
                '整理收藏，调整手感，保存进度。然后，继续。',
                'Organize your collection. Find your feel. Save your progress. Then, play on.',
              )}
            </p>
            <div className="store-badges">
              <a
                href="https://snapemu.gavinliu.cn/"
                aria-label={t(
                  '在 App Store 下载 Snapemu',
                  'Download Snapemu on the App Store',
                )}
              >
                <img
                  src={withBase('/store/app-store-badge.svg')}
                  alt=""
                  width="135"
                  height="40"
                  loading="lazy"
                />
              </a>
              <a
                href="https://snapemu.gavinliu.cn/"
                aria-label={t(
                  '在 Google Play 下载 Snapemu',
                  'Get Snapemu on Google Play',
                )}
              >
                <img
                  src={withBase('/store/google-play-badge.svg')}
                  alt=""
                  width="135"
                  height="40"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <div className="footer-top">
          <a
            href={withBase(isZh ? '/' : '/en/')}
            aria-label={t('Snapemu 首页', 'Snapemu home')}
          >
            <img
              src={withBase('/brand/snapemu-logo-dark.svg')}
              width="160"
              height="36"
              alt="Snapemu"
              loading="lazy"
            />
          </a>
          <span>PRESS PLAY. REWIND TIME.</span>
          <nav aria-label={t('页脚导航', 'Footer navigation')}>
            <a href={guideHref}>{t('使用指南', 'User Guide')}</a>
            <a href={withBase(isZh ? '/legal/privacy' : '/en/legal/privacy')}>
              {t('隐私政策', 'Privacy Policy')}
            </a>
            <a href={withBase(isZh ? '/legal/terms' : '/en/legal/terms')}>
              {t('使用条款', 'Terms of Use')}
            </a>
            <a href="mailto:snapemu@gavinliu.cn">{t('意见反馈', 'Feedback')}</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Snapemu</span>
          <a href="#main">
            {t('回到顶部', 'Back to top')}
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </footer>

      {dialog && (
        <dialog
          ref={dialogRef}
          className="info-dialog"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          onCancel={() => setDialog(null)}
          onClose={() => setDialog(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              const rect = event.currentTarget.getBoundingClientRect();
              if (
                event.clientX < rect.left ||
                event.clientX > rect.right ||
                event.clientY < rect.top ||
                event.clientY > rect.bottom
              )
                setDialog(null);
            }
          }}
        >
          <button
            className="dialog-close icon-button"
            aria-label={t('关闭', 'Close')}
            onClick={() => setDialog(null)}
          >
            <Icon name="close" />
          </button>
          <div className="dialog-icon">
            <Icon name="diamond" size={28} />
          </div>
          <div className="eyebrow">SNAPEMU PREMIUM</div>
          <h2 id="dialog-title">
            {t('更多选择，正在准备。', 'More ways to make it yours.')}
          </h2>
          <p id="dialog-description">
            {t(
              '专业版计划包含控制器换肤、更多封面展示，以及仅限 Android 的游戏桌面快捷方式。部分权益尚未上线，价格、可用平台与最终方案以 App 内页面为准。',
              'Premium plans include controller skins, more cover display options, and Android-only game shortcuts. Some benefits are not yet available. Prices, platforms, and final plans will be confirmed in the app.',
            )}
          </p>
          <a
            className="button button-primary"
            href="mailto:snapemu@gavinliu.cn"
          >
            <Icon name="mail" size={18} />
            {t('邮件联系开发者', 'Email the developer')}
            <Icon name="arrow" size={18} />
          </a>
          <span className="dialog-footnote">
            {t(
              '将打开你的邮件应用；本页不会提交或保存订阅信息。',
              'Opens your email app. This page does not submit or store subscriptions.',
            )}
          </span>
        </dialog>
      )}
    </div>
  );
}
