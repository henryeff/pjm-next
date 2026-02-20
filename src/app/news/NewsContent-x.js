'use client';

import { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import newsData from '@/data/news.json';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';



export default function NewsPage() {
    const [selectedNews, setSelectedNews] = useState(null);
    const { language } = useLanguage();
    const t = translations[language].news;

    const openModal = (news) => {
        setSelectedNews(news);
        // Prevent background scrolling when modal is open
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedNews(null);
        // Restore background scrolling
        document.body.style.overflow = 'unset';
    };

    // Function to truncate text for the preview
    const getHighlight = (text, maxLength = 150) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength).trim() + '...';
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>{t.title}</h1>

            <div className={styles.newsList}>
                {newsData.map((item) => (
                    <article
                        key={item.id}
                        className={styles.newsItem}
                        onClick={() => openModal(item)}
                    >
                        <div className={styles.imageContainer}>
                            <Image
                                src={item.image}
                                alt={item.header}
                                width={400}
                                height={300}
                                className={styles.image}
                            />
                        </div>
                        <div className={styles.content}>
                            <span className={styles.date}>{item.date}</span>
                            <h2 className={styles.header}>{item.header}</h2>
                            <p className={styles.summary}>
                                {getHighlight(item.details)}
                            </p>
                            <span className={styles.readMore}>
                                {t.readMore} &rarr;
                            </span>
                        </div>
                    </article>
                ))}
            </div>

            {/* Modal */}
            {selectedNews && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeModal}>&times;</button>

                        <div className={styles.modalHeader}>
                            <span className={styles.date}>{selectedNews.date}</span>
                            <h2 className={styles.modalTitle}>{selectedNews.header}</h2>
                        </div>

                        <div className={styles.modalImageWrapper}>
                            <Image
                                src={selectedNews.image}
                                alt={selectedNews.header}
                                width={800}
                                height={500}
                                className={styles.modalImage}
                            />
                        </div>

                        <div className={styles.modalBody}>
                            {selectedNews.details.split('\n').map((line, idx) => (
                                line ? <p key={idx} className={styles.paragraph}>{line}</p> : <br key={idx} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
