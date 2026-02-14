'use client';

import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import HeroSlider from '@/components/home/HeroSlider';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';



export default function Home() {
  const { language } = useLanguage();
  const t = translations[language].home;

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <HeroSlider />
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{t.heroTitle}</h1>
          <p className={styles.subtitle}>{t.heroSubtitle}</p>
          <div className={styles.ctaGroup}>
            <Link href="/products/four-strokes" className={styles.primaryButton}>{t.btn4Stroke}</Link>
            <Link href="/products/two-strokes" className={styles.secondaryButton}>{t.btn2Stroke}</Link>
          </div>
        </div>
      </section>

      <section className={styles.featured}>
        <h2 className={styles.sectionTitle}>{t.whyChoose}</h2>
        <div className={styles.featuresDict}>
          <div className={styles.featureCard}>
            <h3>{t.reliabilityTitle}</h3>
            <p>{t.reliabilityDesc}</p>
          </div>
          <div className={styles.featureCard}>
            <h3>{t.performanceTitle}</h3>
            <p>{t.performanceDesc}</p>
          </div>
          <div className={styles.featureCard}>
            <h3>{t.innovationTitle}</h3>
            <p>{t.innovationDesc}</p>
          </div>
        </div>
      </section>

      <section className={styles.showcase}>
        <div className={styles.showcaseContent}>
          <h2 className={styles.showcaseTitle}>{t.showcaseTitle}</h2>
          <p className={styles.showcaseText}>{t.showcaseDesc}</p>
          <Link href="/yamalube" className={styles.showcaseLink}>{t.showcaseLink} &rarr;</Link>
        </div>
        <div className={styles.showcaseImage}>
          <Image
            src="/images/home1.jpg"
            alt="Yamaha Outboard Showcase"
            width={800}
            height={600}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </div>
      </section>
    </div>
  );
}
