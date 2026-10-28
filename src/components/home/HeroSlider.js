'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './HeroSlider.module.css';

const images = [
    '/images/home3.png',
    '/images/home2.jpg',
    '/images/home1.jpg'
];

const SLIDE_INTERVAL = 5000; // Change image every 5 seconds
const FADE_DURATION = 1.4; // seconds, crossfade length

export default function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, SLIDE_INTERVAL);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.sliderContainer}>
            {images.map((src, index) => {
                const isActive = index === currentIndex;

                return (
                    <motion.div
                        key={src}
                        className={styles.slide}
                        initial={false}
                        animate={{ opacity: isActive ? 1 : 0 }}
                        transition={{ duration: FADE_DURATION, ease: 'easeInOut' }}
                        style={{ zIndex: isActive ? 1 : 0 }}
                    >
                        {/* Slow continuous Ken Burns zoom while a slide is active */}
                        <motion.div
                            className={styles.imageWrap}
                            initial={false}
                            animate={{ scale: isActive ? 1.08 : 1 }}
                            transition={
                                isActive
                                    ? { duration: SLIDE_INTERVAL / 1000 + FADE_DURATION, ease: 'linear' }
                                    : { duration: 0.8, ease: 'easeOut' }
                            }
                        >
                            <Image
                                src={src}
                                alt={`Hero Slide ${index + 1}`}
                                fill
                                priority={index === 0}
                                sizes="100vw"
                                style={{ objectFit: 'cover' }}
                                className={styles.image}
                            />
                        </motion.div>
                        <div className={styles.overlay}></div>
                    </motion.div>
                );
            })}
        </div>
    );
}
