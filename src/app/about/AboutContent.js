'use client';

import styles from './page.module.css';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';



export default function AboutPage() {
    const { language } = useLanguage();
    const t = translations[language].about;

    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                <Image
                    src="/images/yamaha-outboard.gif"
                    alt="Yamaha Outboard"
                    width={400}
                    height={300}
                    style={{ width: 'auto', height: 'auto', maxWidth: '100%' }}
                    priority
                />
            </div>

            <h1 className={styles.title}>{t.title}</h1>

            <div className={styles.content}>
                <p>{t.p1}</p>
                <p>{t.p2}</p>
                <p>{t.p3}</p>
                <p>{t.p4}</p>
                <p>{t.p5}</p>
                <p>{t.p6}</p>

                <div className={styles.highlight}>
                    {t.highlight}
                </div>
            </div>
        </div>
    );
}
