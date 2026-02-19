'use client';

import { useState } from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { language, toggleLanguage } = useLanguage();
    const t = translations[language].navbar;

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo} onClick={closeMenu}>
                    <Image src="/images/logo.png" alt="PJM Logo" width={50} height={50} className={styles.logoImg} />
                    <span className={styles.brandName}>Perkasa Jaya Marine</span>
                </Link>

                {/* Hamburger Menu Button */}
                <div className={styles.hamburger} onClick={toggleMenu}>
                    <div className={`${styles.bar} ${isOpen ? styles.active : ''}`}></div>
                    <div className={`${styles.bar} ${isOpen ? styles.active : ''}`}></div>
                    <div className={`${styles.bar} ${isOpen ? styles.active : ''}`}></div>
                </div>

                {/* Desktop Links */}
                <div className={styles.links}>
                    <Link href="/" className={styles.link}>{t.home}</Link>
                    <div className={styles.dropdown}>
                        <span className={styles.link}>{t.products}</span>
                        <div className={styles.dropdownContent}>
                            <Link href="/products/two-strokes" className={styles.dropdownItem}>{t.twoStrokes}</Link>
                            <Link href="/products/four-strokes" className={styles.dropdownItem}>{t.fourStrokes}</Link>
                            <Link href="/yamalube" className={styles.dropdownItem}>{t.yamalube}</Link>
                            <Link href="/parts" className={styles.dropdownItem}>{t.parts}</Link>
                        </div>
                    </div>
                    <Link href="/news" className={styles.link}>{t.news}</Link>
                    <Link href="/about" className={styles.link}>{t.about}</Link>
                    <Link href="/chat" className={styles.link}>{t.chat}</Link>
                    <Link href="/contact" className={styles.link}>{t.contact}</Link>

                    <div className={styles.langSwitcher}>
                        <button
                            onClick={() => language !== 'en' && toggleLanguage()}
                            className={`${styles.langOption} ${language === 'en' ? styles.activeLang : ''}`}
                            aria-label="Switch to English"
                        >
                            EN
                        </button>
                        <span className={styles.langDivider}>|</span>
                        <button
                            onClick={() => language !== 'id' && toggleLanguage()}
                            className={`${styles.langOption} ${language === 'id' ? styles.activeLang : ''}`}
                            aria-label="Switch to Bahasa Indonesia"
                        >
                            ID
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
                    <Link href="/" className={styles.mobileLink} onClick={closeMenu}>{t.home}</Link>
                    <div className={styles.mobileGroup}>
                        <span className={styles.mobileGroupTitle}>{t.products}</span>
                        <Link href="/products/two-strokes" className={styles.mobileSubLink} onClick={closeMenu}>{t.twoStrokes}</Link>
                        <Link href="/products/four-strokes" className={styles.mobileSubLink} onClick={closeMenu}>{t.fourStrokes}</Link>
                        <Link href="/yamalube" className={styles.mobileSubLink} onClick={closeMenu}>{t.yamalube}</Link>
                        <Link href="/parts" className={styles.mobileSubLink} onClick={closeMenu}>{t.parts}</Link>
                    </div>
                    <Link href="/news" className={styles.mobileLink} onClick={closeMenu}>{t.news}</Link>
                    <Link href="/about" className={styles.mobileLink} onClick={closeMenu}>{t.about}</Link>
                    <Link href="/chat" className={styles.mobileLink} onClick={closeMenu}>{t.chat}</Link>
                    <Link href="/contact" className={styles.mobileLink} onClick={closeMenu}>{t.contact}</Link>
                    <button onClick={() => { toggleLanguage(); closeMenu(); }} className={styles.mobileLangBtn}>
                        Switch to {language === 'en' ? 'Bahasa Indonesia' : 'English'}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
