'use client';

import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { motion } from 'framer-motion';
import Reveal from '@/components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';

// Decorative icons only — no translatable meaning.
function PinIcon() {
    return (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

function ContactIcon() {
    return (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
        </svg>
    );
}

function AnchorIcon() {
    return (
        <svg className={styles.storeIconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <circle cx="12" cy="5" r="3" />
            <line x1="12" y1="22" x2="12" y2="8" />
            <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
        </svg>
    );
}

export default function ContactPage() {
    const { language } = useLanguage();
    const t = translations[language].contact;

    return (
        <div className={styles.container}>
            <Reveal as="h1" className={styles.title}>{t.title}</Reveal>
            <Reveal as="div" className={styles.intro} delay={0.08}>
                <p>{t.intro}</p>
            </Reveal>

            <StaggerGroup className={styles.storesGrid}>
                {/* Store 1 */}
                <StaggerItem>
                    <div className={styles.storeCard}>
                        <div className={styles.storeHeader}>
                            <span className={styles.storeIconWrap}>
                                <AnchorIcon />
                            </span>
                            <h2 className={styles.storeName}>TOKO TUNGGAL JAYA</h2>
                        </div>
                        <div className={styles.storeDetails}>
                            <div className={styles.detailItem}>
                                <h3><PinIcon />{t.address}</h3>
                                <p>Jalan M. Yamin SH No 144,<br />Padang, West Sumatera<br />Indonesia</p>
                            </div>
                            <div className={styles.detailItem}>
                                <h3><ContactIcon />{t.contactInfo}</h3>
                                <p>Email: <a href="mailto:harry@pjmcv.com">harry@pjmcv.com</a></p>
                                <p>Phone: +62 751 36628</p>
                                <p>Fax: +62 751 26179</p>
                            </div>
                            <div className={styles.mapContainer}>
                                <iframe
                                    title="Toko Tunggal Jaya"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.2682573356733!2d100.35342067552749!3d-0.951420006059945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b94a495d8d3d%3A0x2b0f9201758b4d0a!2sTunggal%20jaya%20(Mesin%20Tempel%20Yamaha)!5e0!3m2!1sen!2sus!4v1715839884194!5m2!1sen!2sus"
                                    width="100%"
                                    height="250"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </StaggerItem>

                {/* Store 2 */}
                <StaggerItem>
                    <div className={styles.storeCard}>
                        <div className={styles.storeHeader}>
                            <span className={styles.storeIconWrap}>
                                <AnchorIcon />
                            </span>
                            <h2 className={styles.storeName}>PERKASA JAYA MARINE</h2>
                        </div>
                        <div className={styles.storeDetails}>
                            <div className={styles.detailItem}>
                                <h3><PinIcon />{t.address}</h3>
                                <p>Jalan Imam Bonjol No. 27D,<br />Padang, West Sumatera<br />Indonesia</p>
                            </div>
                            <div className={styles.detailItem}>
                                <h3><ContactIcon />{t.contactInfo}</h3>
                                <p>Email: <a href="mailto:harry@pjmcv.com">harry@pjmcv.com</a></p>
                                <p>Phone: +62 751 840010</p>
                                <p>Fax: +62 751 26179</p>
                            </div>
                            <div className={styles.mapContainer}>
                                <iframe
                                    title="Perkasa Jaya Marine"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1994.6318303022213!2d100.36156940017027!3d-0.9553872098235918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b94565e985ed%3A0xf32c9c76b6fb39c1!2sCV.%20PERKASA%20JAYA%20MARINE!5e0!3m2!1sen!2sus!4v1715840042078!5m2!1sen!2sus"
                                    width="100%"
                                    height="250"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </StaggerItem>
            </StaggerGroup>

            <Reveal as="div" className={styles.formSection} delay={0.1}>
                <h2 className={styles.formTitle}>{t.sendMsgTitle}</h2>
                <form
                    className={styles.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const name = formData.get('name');
                        const email = formData.get('email');
                        const message = formData.get('message');

                        // Construct mailto link
                        const subject = `New Message from ${name} (${email})`;
                        const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
                        const mailtoLink = `mailto:harry@pjmcv.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                        window.location.href = mailtoLink;
                    }}
                >
                    <div className={styles.formGroup}>
                        <label htmlFor="name">{t.name}</label>
                        <input type="text" id="name" name="name" className={styles.input} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">{t.email}</label>
                        <input type="email" id="email" name="email" className={styles.input} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="message">{t.message}</label>
                        <textarea id="message" name="message" rows="5" className={styles.textarea} required></textarea>
                    </div>

                    <motion.button
                        type="submit"
                        className={styles.submitBtn}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {t.sendBtn}
                    </motion.button>
                    <p className={styles.mailNote}>{t.mailNote}</p>
                </form>
            </Reveal>
        </div>
    );
}
