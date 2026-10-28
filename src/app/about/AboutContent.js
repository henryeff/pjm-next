'use client';

import styles from './page.module.css';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import Reveal from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';



export default function AboutPage() {
    const { language } = useLanguage();
    const t = translations[language].about;

    return (
        <div className={styles.page}>
            <Reveal as="section" className={styles.hero}>
                <div className={styles.imageWrapper}>
                    <Image
                        src="/images/yamaha-outboard.gif"
                        alt="Yamaha Outboard"
                        width={400}
                        height={300}
                        className={styles.heroImage}
                        style={{ width: 'auto', height: 'auto', maxWidth: '100%' }}
                        priority
                    />
                </div>

                <div className={styles.heroText}>
                    <span className={styles.kicker} aria-hidden="true" />
                    <h1 className={styles.title}>{t.title}</h1>
                    <p className={styles.lead}>{t.p1}</p>
                </div>
            </Reveal>

            <StaggerGroup as="div" className={styles.content} amount={0.1}>
                <StaggerItem as="p" className={styles.paragraph}>{t.p2}</StaggerItem>
                <StaggerItem as="p" className={styles.paragraph}>{t.p3}</StaggerItem>
                <StaggerItem as="p" className={styles.paragraph}>{t.p4}</StaggerItem>
                <StaggerItem as="p" className={styles.paragraph}>{t.p5}</StaggerItem>
                <StaggerItem as="p" className={styles.paragraph}>{t.p6}</StaggerItem>
            </StaggerGroup>

            <Reveal as="div" className={styles.highlight} delay={0.1} amount={0.3}>
                <p>{t.highlight}</p>
            </Reveal>
        </div>
    );
}
