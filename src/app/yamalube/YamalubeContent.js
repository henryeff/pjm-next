'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import Reveal from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';

const heroImages = [
    '/images/yamalube.jpg',
    '/images/yamalube2.jpg',
    '/images/yamalube3.jpg',
];

const productSections = [
    {
        titleKey: 'product2TTitle',
        listKey: 'product2TList',
        image: '/images/yamalube-2tak-info.jpg',
        alt: 'Yamalube 2 Tak',
        reverse: false,
    },
    {
        titleKey: 'product4TTitle',
        listKey: 'product4TList',
        image: '/images/yamalube-4tak-info.jpg',
        alt: 'Yamalube 4 Tak',
        reverse: true,
    },
    {
        titleKey: 'productGL4Title',
        listKey: 'productGL4List',
        image: '/images/yamalube-SAE90-GL-4.jpg',
        alt: 'Yamalube GL-4',
        reverse: false,
    },
    {
        titleKey: 'productGL5Title',
        listKey: 'productGL5List',
        image: '/images/yamalube-SAE90-GL-5.jpg',
        alt: 'Yamalube GL-5',
        reverse: true,
    },
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
                    <Reveal as="h1" className={styles.pageTitle} delay={0.1}>
                        {t.heroTitle}
                    </Reveal>
                    <span className={styles.heroDivider} aria-hidden="true" />
                    <Reveal as="p" className={styles.pageSubtitle} delay={0.25}>
                        {t.heroSubtitle}
                    </Reveal>
                </div>
            </div>

            <div className={styles.content}>
                <Reveal as="div" className={styles.introText}>
                    <p>{t.intro1}</p>
                </Reveal>

                <Reveal as="div" className={styles.videoWrapper} delay={0.1}>
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/Bs7bmI6WlI0"
                        title="Yamalube Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className={styles.iframe}
                    ></iframe>
                </Reveal>

                <Reveal as="div" className={styles.introText}>
                    <p>{t.intro2}</p>
                </Reveal>

                {/* Product Sections */}
                {productSections.map(({ titleKey, listKey, image, alt, reverse }) => (
                    <Reveal
                        key={listKey}
                        as="section"
                        className={reverse ? styles.productSectionReverse : styles.productSection}
                        amount={0.15}
                    >
                        <div className={styles.productInfo}>
                            <h2 className={styles.productTitle}>{t[titleKey]}</h2>
                            <StaggerGroup as="ul" className={styles.featureList} amount={0.3}>
                                {t[listKey].map((item, index) => (
                                    <StaggerItem as="li" key={index}>
                                        {item}
                                    </StaggerItem>
                                ))}
                            </StaggerGroup>
                        </div>
                        <div className={styles.productImageWrapper}>
                            <div className={styles.imageInner}>
                                <Image
                                    src={image}
                                    alt={alt}
                                    width={300}
                                    height={300}
                                    className={styles.productImage}
                                />
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}
