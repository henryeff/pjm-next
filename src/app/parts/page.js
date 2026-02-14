'use client';

import styles from './page.module.css';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

const partsImages = [
    { src: '/images/parts1.jpg', alt: 'Genuine Spare Parts' },
    { src: '/images/parts2.jpg', alt: 'Yamaha Components' },
];

export default function PartsPage() {
    const { language } = useLanguage();
    const t = translations[language].parts;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t.title}</h1>
            <p className={styles.description}>
                {t.description}
            </p>

            <div className={styles.gallery}>
                {partsImages.map((img, idx) => (
                    <div key={idx} className={styles.card}>
                        <Image
                            src={img.src}
                            alt={img.alt}
                            width={500}
                            height={400}
                            className={styles.image}
                        />
                        <div className={styles.caption}>{img.alt}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
