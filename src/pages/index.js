import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import styles from './index.module.css'

export default function Home() {
  const { siteConfig, i18n } = useDocusaurusContext();
  let localePathRoot = '';
  if (i18n.currentLocale != i18n.defaultLocale) localePathRoot = '/' + i18n.currentLocale;
  return (
    <Layout title={`Lyfebloc Docs - The worlds first Automatic Market Maker`}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="landing_page/css/fonts.css" />
        <link rel="stylesheet" href="landing_page/css/style.css" />
        <script src="landing_page/js/preset.js"></script>
      </Head>
      <main class="landing-page">
        <section class="hero">
          <div class="container">
            <div class="hero-inner">
              <div class="hero-copy">
                <h1 class="hero-title mt-0">{siteConfig.title}</h1>
                <p class="hero-paragraph">{siteConfig.tagline}</p>
                <div class="hero-cta">
                  <a class="button button-primary" href={`${localePathRoot}/docs/intro`}>Getting Start</a>
                  <a class="button" href="https://lyfebloc.com/">Launch App</a></div>
              </div>
              <div class="hero-figure anime-element">
                <svg class="placeholder" width="528" height="396" viewBox="0 0 528 396">
                  <rect width="528" height="396" style={{ fill: 'transparent' }} />
                </svg>
                <div class="hero-figure-box hero-figure-box-01" data-rotation="45deg"></div>
                <div class="hero-figure-box hero-figure-box-02" data-rotation="-45deg"></div>
                <div class="hero-figure-box hero-figure-box-03" data-rotation="0deg"></div>
                <div class="hero-figure-box hero-figure-box-04" data-rotation="-135deg"></div>
                <div class="hero-figure-box hero-figure-box-05"></div>
                <div class="hero-figure-box hero-figure-box-06"></div>
                <div class="hero-figure-box hero-figure-box-07"></div>
                <div class="hero-figure-box hero-figure-box-08" data-rotation="-22deg"></div>
                <div class="hero-figure-box hero-figure-box-09" data-rotation="-52deg"></div>
                <div class="hero-figure-box hero-figure-box-10" data-rotation="-50deg"></div>
              </div>
            </div>
          </div>
        </section>
        <section class="features section">
          <div class="container">
            <div class="features-inner section-inner has-bottom-divider">
              <div class="features-wrap">
                <div class="feature text-center is-revealing">
                  <div class="feature-inner">
                    <div class="feature-icon">
                      <img src="landing_page/images/feature-icon-01.svg" alt="Feature 01" />
                    </div>
                    <h4 class="feature-title mt-24">What is Lyfebloc</h4>
                    <p class="text-sm mb-0">Discover the core concepts of the Lyfebloc Network, our company, and next generation products.</p>
                  </div>
                </div>
                <div class="feature text-center is-revealing">
                  <div class="feature-inner">
                    <div class="feature-icon">
                      <img src="landing_page/images/feature-icon-02.svg" alt="Feature 02" />
                    </div>
                    <h4 class="feature-title mt-24">Lyfebloc Protocols</h4>
                    <p class="text-sm mb-0">Expore Lyfebloc high capital efficient DeFi protocols offering access to the most liquidity in the defi industry.</p>
                  </div>
                </div>
                <div class="feature text-center is-revealing">
                  <div class="feature-inner">
                    <div class="feature-icon">
                      <img src="landing_page/images/feature-icon-03.svg" alt="Feature 03" />
                    </div>
                    <h4 class="feature-title mt-24">Getting Started</h4>
                    <p class="text-sm mb-0">Take advantage of this quick-start user guide today and start using all of Lyfebloc products and services.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
