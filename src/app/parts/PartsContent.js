'use client';

import styles from './page.module.css';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import Reveal from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';

const partsImages = [
    { src: '/images/parts1.jpg', alt: 'Genuine Spare Parts' },
    { src: '/images/parts2.jpg', alt: 'Yamaha Components' },
];



export default function PartsPage() {
    const { language } = useLanguage();
    const t = translations[language].parts;

    return (
        <div className={styles.container}>
            <Reveal as="header" className={styles.header}>
                <h1 className={styles.title}>{t.title}</h1>
                <span className={styles.divider} aria-hidden="true" />
                <p className={styles.description}>
                    {t.description}
                </p>
            </Reveal>

            <StaggerGroup className={styles.gallery} stagger={0.15} amount={0.1}>
                {partsImages.map((img, idx) => (
                    <StaggerItem key={idx} className={styles.card}>
                        <div className={styles.imageWrap}>
                            <Image
                                src={img.src}
                                alt={img.alt}
                                width={500}
                                height={400}
                                className={styles.image}
                            />
                        </div>
                        <div className={styles.caption}>{img.alt}</div>
                    </StaggerItem>
                ))}
            </StaggerGroup>
        </div>
    );
}
