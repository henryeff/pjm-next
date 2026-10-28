'use client';

import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import HeroSlider from '@/components/home/HeroSlider';
import Reveal from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';
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
          <Reveal as="h1" className={styles.title} delay={0.1}>
            {t.heroTitle}
          </Reveal>
          <Reveal as="p" className={styles.subtitle} delay={0.25}>
            {t.heroSubtitle}
          </Reveal>
          <Reveal
            as="div"
            className={styles.ctaGroup}
            delay={0.4}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link href="/chat" className={styles.primaryButton}>{t.talkToUs}</Link>
          </Reveal>
        </div>
      </section>

      <section className={styles.featured}>
        <Reveal as="h2" className={styles.sectionTitle}>{t.whyChoose}</Reveal>
        <StaggerGroup className={styles.featuresDict} amount={0.2}>
          <StaggerItem className={styles.featureCard} whileHover={{ y: -8 }}>
            <h3>{t.reliabilityTitle}</h3>
            <p>{t.reliabilityDesc}</p>
          </StaggerItem>
          <StaggerItem className={styles.featureCard} whileHover={{ y: -8 }}>
            <h3>{t.performanceTitle}</h3>
            <p>{t.performanceDesc}</p>
          </StaggerItem>
          <StaggerItem className={styles.featureCard} whileHover={{ y: -8 }}>
            <h3>{t.innovationTitle}</h3>
            <p>{t.innovationDesc}</p>
          </StaggerItem>
        </StaggerGroup>
      </section>

      <section className={styles.showcase}>
        <Reveal as="div" className={styles.showcaseContent}>
          <h2 className={styles.showcaseTitle}>{t.showcaseTitle}</h2>
          <p className={styles.showcaseText}>{t.showcaseDesc}</p>
          <Link href="/yamalube" className={styles.showcaseLink}>{t.showcaseLink} &rarr;</Link>
        </Reveal>
        <Reveal as="div" className={styles.showcaseImage} delay={0.15}>
          <Image
            src="/images/home1.jpg"
            alt="Yamaha Outboard Showcase"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className={styles.showcaseImg}
            style={{ objectFit: 'cover' }}
          />
        </Reveal>
      </section>
    </div>
  );
}
