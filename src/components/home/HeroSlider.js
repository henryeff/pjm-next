'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './HeroSlider.module.css';

const images = [
    '/images/home3.png',
    '/images/home2.jpg',
    '/images/home1.jpg'
];

export default function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.sliderContainer}>
            {images.map((src, index) => (
                <div
                    key={src}
                    className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
                >
                    <Image
                        src={src}
                        alt={`Hero Slide ${index + 1}`}
                        fill
                        priority={index === 0}
                        style={{ objectFit: 'cover' }}
                        className={styles.image}
                    />
                    <div className={styles.overlay}></div>
                </div>
            ))}
        </div>
    );
}
