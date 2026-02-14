'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

const heroImages = [
    '/images/yamalube.jpg',
    '/images/yamalube2.jpg',
    '/images/yamalube3.jpg',
];



export default function YamalubePage() {
    const { language } = useLanguage();
    const t = translations[language].yamalube;
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.container}>
            {/* Hero Section with Slider */}
            <div className={styles.heroSection}>
                <div className={styles.sliderContainer}>
                    {heroImages.map((src, index) => (
                        <div
                            key={src}
                            className={`${styles.slide} ${index === currentIndex ? styles.activeSlide : ''}`}
                        >
                            <Image
                                src={src}
                                alt={`Yamalube Slide ${index + 1}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                priority={index === 0}
                            />
                            <div className={styles.overlay}></div>
                        </div>
                    ))}
                </div>
                <div className={styles.heroContent}>
                    <h1 className={styles.pageTitle}>{t.heroTitle}</h1>
                    <p className={styles.pageSubtitle}>{t.heroSubtitle}</p>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.introText}>
                    <p>{t.intro1}</p>
                </div>

                <div className={styles.videoWrapper}>
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/Bs7bmI6WlI0"
                        title="Yamalube Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className={styles.iframe}
                    ></iframe>
                </div>

                <div className={styles.introText}>
                    <p>{t.intro2}</p>
                </div>

                {/* Product Sections */}
                <div className={styles.productSection}>
                    <div className={styles.productInfo}>
                        <h2 className={styles.productTitle}>{t.product2TTitle}</h2>
                        <ul className={styles.featureList}>
                            {t.product2TList.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.productImageWrapper}>
                        <Image src="/images/yamalube-2tak-info.jpg" alt="Yamalube 2 Tak" width={300} height={300} style={{ width: '100%', height: 'auto' }} />
                    </div>
                </div>

                <div className={styles.productSectionReverse}>
                    <div className={styles.productInfo}>
                        <h2 className={styles.productTitle}>{t.product4TTitle}</h2>
                        <ul className={styles.featureList}>
                            {t.product4TList.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.productImageWrapper}>
                        <Image src="/images/yamalube-4tak-info.jpg" alt="Yamalube 4 Tak" width={300} height={300} style={{ width: '100%', height: 'auto' }} />
                    </div>
                </div>

                <div className={styles.productSection}>
                    <div className={styles.productInfo}>
                        <h2 className={styles.productTitle}>{t.productGL4Title}</h2>
                        <ul className={styles.featureList}>
                            {t.productGL4List.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.productImageWrapper}>
                        <Image src="/images/yamalube-SAE90-GL-4.jpg" alt="Yamalube GL-4" width={300} height={300} style={{ width: '100%', height: 'auto' }} />
                    </div>
                </div>

                <div className={styles.productSectionReverse}>
                    <div className={styles.productInfo}>
                        <h2 className={styles.productTitle}>{t.productGL5Title}</h2>
                        <ul className={styles.featureList}>
                            {t.productGL5List.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.productImageWrapper}>
                        <Image src="/images/yamalube-SAE90-GL-5.jpg" alt="Yamalube GL-5" width={300} height={300} style={{ width: '100%', height: 'auto' }} />
                    </div>
                </div>

            </div>
        </div>
    );
}
