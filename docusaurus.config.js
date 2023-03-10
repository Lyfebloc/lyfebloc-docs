// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Welcome to Lyfebloc',
  tagline: 'The first Automatic Market Maker that generates frictionless crypto liquidity with extremely high returns.',
  url: 'https://docs.lyfebloc.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: '/images/favicon.ico',

  staticDirectories: ['public', 'static'],

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'lyfebloc', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.


  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/lyfebloc/lyfebloc-docs/tree/master',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/lyfebloc/lyfebloc-docs/tree/master',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light'
      },
      navbar: {
        title: `Lyfebloc Docs`,
        items: [
          {
            type: 'localeDropdown',
            position: 'left',
          },
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Docs',
          },
          /* {
            to: '/blog', label: 'Blog', position: 'left'
          }, */
          {
            href: 'https://github.com/lyfebloc/lyfebloc-docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Lyfebloc Dex',
                href: 'https://lyfebloc.com/',
              },
              {
                label: 'Lyfebloc Network',
                href: 'https://lyfeblocnetwork.com/',
              }
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Markets',
                href: 'https://markets.lyfebloc.com/',
              },
              {
                label: 'Analytics',
                href: 'https://info.lyfebloc.com/'
              },
              {
                label: 'Protocols',
                href: 'https://docs.lyfebloc.com/protocols/',
              },
            ],
          },
        ],
        copyright: `Copyright ?? ${new Date().getFullYear()} lyfebloc.com`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['ini', 'ignore', 'batch', 'powershell'],
      },
      algolia: {

        appId: 'RUMGM5QV74',

        apiKey: '30fca7df58f2c20c17a87e227245fa24',

        indexName: 'lyfebloc',

        // ??????????????????
        contextualSearch: true,

        // ???????????????????????????????????? window.location ????????????????????? history.push??? ????????? Algolia ?????????????????????????????????????????????????????? window.location.href ???????????????????????????
        externalUrlRegex: 'docs.lyfebloc\\.com',

        // ?????????Algolia ????????????
        searchParameters: {},

        // ????????????????????????????????????????????????????????? `false` ?????????
        searchPagePath: 'search',
      },
    }),
};

module.exports = config;
