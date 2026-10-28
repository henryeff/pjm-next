'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './Navbar.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

const PRODUCT_PATHS = ['/products', '/yamalube', '/parts'];

const mobileMenuVariants = {
    hidden: { x: '100%' },
    visible: {
        x: 0,
        transition: { type: 'spring', stiffness: 320, damping: 34, staggerChildren: 0.05, delayChildren: 0.08 },
    },
    exit: { x: '100%', transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
};

const mobileItemVariants = {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { language, toggleLanguage } = useLanguage();
    const t = translations[language].navbar;
    const pathname = usePathname();

    const toggleMenu = () => setIsOpen((prev) => !prev);
    const closeMenu = () => setIsOpen(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Lock body scroll while the mobile menu is open.
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
    const isProductsActive = PRODUCT_PATHS.some((p) => pathname.startsWith(p));

    return (
        <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo} onClick={closeMenu}>
                    <Image src="/images/logo.png" alt="PJM Logo" width={50} height={50} className={styles.logoImg} />
                    <span className={styles.brandName}>Perkasa Jaya Marine</span>
                </Link>

                {/* Hamburger Menu Button */}
                <div
                    className={styles.hamburger}
                    onClick={toggleMenu}
                    role="button"
                    tabIndex={0}
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isOpen}
                >
                    <div className={`${styles.bar} ${isOpen ? styles.active : ''}`}></div>
                    <div className={`${styles.bar} ${isOpen ? styles.active : ''}`}></div>
                    <div className={`${styles.bar} ${isOpen ? styles.active : ''}`}></div>
                </div>

                {/* Desktop Links */}
                <div className={styles.links}>
                    <Link href="/" className={`${styles.link} ${isActive('/') ? styles.linkActive : ''}`}>{t.home}</Link>
                    <div className={styles.dropdown}>
                        <span className={`${styles.link} ${isProductsActive ? styles.linkActive : ''}`}>{t.products}</span>
                        <div className={styles.dropdownContent}>
                            <Link href="/products/two-strokes" className={styles.dropdownItem}>{t.twoStrokes}</Link>
                            <Link href="/products/four-strokes" className={styles.dropdownItem}>{t.fourStrokes}</Link>
                            <Link href="/yamalube" className={styles.dropdownItem}>{t.yamalube}</Link>
                            <Link href="/parts" className={styles.dropdownItem}>{t.parts}</Link>
                        </div>
                    </div>
                    <Link href="/news" className={`${styles.link} ${isActive('/news') ? styles.linkActive : ''}`}>{t.news}</Link>
                    <Link href="/about" className={`${styles.link} ${isActive('/about') ? styles.linkActive : ''}`}>{t.about}</Link>
                    <Link href="/chat" className={`${styles.link} ${isActive('/chat') ? styles.linkActive : ''}`}>{t.chat}</Link>
                    <Link href="/contact" className={`${styles.link} ${isActive('/contact') ? styles.linkActive : ''}`}>{t.contact}</Link>

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
                <AnimatePresence>
                    {isOpen && (
                        <>
                            <motion.div
                                className={styles.backdrop}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                onClick={closeMenu}
                            />
                            <motion.div
                                className={styles.mobileMenu}
                                variants={mobileMenuVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <motion.div variants={mobileItemVariants}>
                                    <Link href="/" className={styles.mobileLink} onClick={closeMenu}>{t.home}</Link>
                                </motion.div>
                                <motion.div className={styles.mobileGroup} variants={mobileItemVariants}>
                                    <span className={styles.mobileGroupTitle}>{t.products}</span>
                                    <Link href="/products/two-strokes" className={styles.mobileSubLink} onClick={closeMenu}>{t.twoStrokes}</Link>
                                    <Link href="/products/four-strokes" className={styles.mobileSubLink} onClick={closeMenu}>{t.fourStrokes}</Link>
                                    <Link href="/yamalube" className={styles.mobileSubLink} onClick={closeMenu}>{t.yamalube}</Link>
                                    <Link href="/parts" className={styles.mobileSubLink} onClick={closeMenu}>{t.parts}</Link>
                                </motion.div>
                                <motion.div variants={mobileItemVariants}>
                                    <Link href="/news" className={styles.mobileLink} onClick={closeMenu}>{t.news}</Link>
                                </motion.div>
                                <motion.div variants={mobileItemVariants}>
                                    <Link href="/about" className={styles.mobileLink} onClick={closeMenu}>{t.about}</Link>
                                </motion.div>
                                <motion.div variants={mobileItemVariants}>
                                    <Link href="/chat" className={styles.mobileLink} onClick={closeMenu}>{t.chat}</Link>
                                </motion.div>
                                <motion.div variants={mobileItemVariants}>
                                    <Link href="/contact" className={styles.mobileLink} onClick={closeMenu}>{t.contact}</Link>
                                </motion.div>
                                <motion.button
                                    variants={mobileItemVariants}
                                    onClick={() => { toggleLanguage(); closeMenu(); }}
                                    className={styles.mobileLangBtn}
                                >
                                    Switch to {language === 'en' ? 'Bahasa Indonesia' : 'English'}
                                </motion.button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;
