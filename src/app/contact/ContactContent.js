'use client';

import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';



export default function ContactPage() {
    const { language } = useLanguage();
    const t = translations[language].contact;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t.title}</h1>
            <div className={styles.intro}>
                <p>{t.intro}</p>
            </div>

            <div className={styles.storesGrid}>
                {/* Store 1 */}
                <div className={styles.storeCard}>
                    <h2 className={styles.storeName}>TOKO TUNGGAL JAYA</h2>
                    <div className={styles.storeDetails}>
                        <div className={styles.detailItem}>
                            <h3>{t.address}</h3>
                            <p>Jalan M. Yamin SH No 144,<br />Padang, West Sumatera<br />Indonesia</p>
                        </div>
                        <div className={styles.detailItem}>
                            <h3>{t.contactInfo}</h3>
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

                {/* Store 2 */}
                <div className={styles.storeCard}>
                    <h2 className={styles.storeName}>PERKASA JAYA MARINE</h2>
                    <div className={styles.storeDetails}>
                        <div className={styles.detailItem}>
                            <h3>{t.address}</h3>
                            <p>Jalan Imam Bonjol No. 27D,<br />Padang, West Sumatera<br />Indonesia</p>
                        </div>
                        <div className={styles.detailItem}>
                            <h3>{t.contactInfo}</h3>
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
            </div>

            <div className={styles.formSection}>
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

                    <button type="submit" className={styles.submitBtn}>{t.sendBtn}</button>
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
                        {t.mailNote}
                    </p>
                </form>
            </div>
        </div>
    );
}
