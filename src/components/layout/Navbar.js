'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './Navbar.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { EASE_OUT } from '@/components/motion/Reveal';
import LangSwitch from '@/components/ui/LangSwitch';
import { ArrowRight, ChevronDown, Chat, Close, Phone, WhatsApp } from '@/components/ui/Icons';
import { STORES } from '@/components/ui/stores';
import { waLink, WA_TEXT, WHATSAPP } from '@/lib/site';

const COPY = {
    en: {
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        outboards: 'Outboards',
        partsOil: 'Parts & Oil',
        chatCta: 'Chat with Pevita',
        mainNav: 'Main',
        skip: 'Skip to content',
        whatsapp: 'WhatsApp',
    },
    id: {
        openMenu: 'Buka menu',
        closeMenu: 'Tutup menu',
        outboards: 'Mesin Tempel',
        partsOil: 'Suku Cadang & Oli',
        chatCta: 'Chat dengan Pevita',
        mainNav: 'Utama',
        skip: 'Langsung ke konten',
        whatsapp: 'WhatsApp',
    },
};

const PRODUCT_PATHS = ['/products', '/yamalube', '/parts'];
const CLOSE_DELAY = 150;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
    visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE_OUT } },
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [productsOpen, setProductsOpen] = useState(false);
    const { language } = useLanguage();
    const t = translations[language].navbar;
    const c = COPY[language] || COPY.en;
    const pathname = usePathname() || '/';

    const productsWrapRef = useRef(null);
    const productsBtnRef = useRef(null);
    const closeTimer = useRef(null);
    const openedByHover = useRef(false);
    const hamburgerRef = useRef(null);
    const sheetRef = useRef(null);

    // Close everything on route change (state reset during render — no effect needed).
    const [prevPath, setPrevPath] = useState(pathname);
    if (prevPath !== pathname) {
        setPrevPath(pathname);
        setIsOpen(false);
        setProductsOpen(false);
    }

    const productGroups = [
        {
            title: c.outboards,
            items: [
                { href: '/products/four-strokes', label: t.fourStrokes },
                { href: '/products/two-strokes', label: t.twoStrokes },
            ],
        },
        {
            title: c.partsOil,
            items: [
                { href: '/parts', label: t.parts },
                { href: '/yamalube', label: t.yamalube },
            ],
        },
    ];

    // Desktop: Home, [Products ▾], then the rest. Mobile: all of these, with products listed below.
    const mainLinks = [
        { href: '/', label: t.home },
        { href: '/servis', label: t.service },
        { href: '/news', label: t.news },
        { href: '/about', label: t.about },
        { href: '/contact', label: t.contact },
    ];

    const isActive = (href) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/'));
    const isProductsActive = PRODUCT_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));

    // Transparent over the home hero until the visitor scrolls (or opens the menu).
    const transparent = pathname === '/' && !isScrolled && !isOpen;

    /* ---------- Scroll state ---------- */
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 12);
        const raf = requestAnimationFrame(onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    /* ---------- Products disclosure ---------- */
    const clearCloseTimer = () => {
        if (closeTimer.current) {
            clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
    };

    const handleMouseEnter = () => {
        clearCloseTimer();
        if (!productsOpen) openedByHover.current = true;
        setProductsOpen(true);
    };

    const handleMouseLeave = () => {
        clearCloseTimer();
        closeTimer.current = setTimeout(() => {
            openedByHover.current = false;
            setProductsOpen(false);
        }, CLOSE_DELAY);
    };

    const handleProductsClick = () => {
        clearCloseTimer();
        // A mouse that just hovered it open "pins" it on click instead of immediately closing it.
        if (productsOpen && openedByHover.current) {
            openedByHover.current = false;
            return;
        }
        openedByHover.current = false;
        setProductsOpen((open) => !open);
    };

    const handleProductsBlur = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            openedByHover.current = false;
            setProductsOpen(false);
        }
    };

    const closeProducts = () => {
        clearCloseTimer();
        openedByHover.current = false;
        setProductsOpen(false);
    };

    useEffect(() => {
        if (!productsOpen) return undefined;

        const onPointerDown = (e) => {
            if (productsWrapRef.current && !productsWrapRef.current.contains(e.target)) {
                openedByHover.current = false;
                setProductsOpen(false);
            }
        };
        const onKeyDown = (e) => {
            if (e.key !== 'Escape') return;
            const hadFocus = productsWrapRef.current?.contains(document.activeElement);
            openedByHover.current = false;
            setProductsOpen(false);
            if (hadFocus) productsBtnRef.current?.focus();
        };

        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [productsOpen]);

    useEffect(() => () => clearTimeout(closeTimer.current), []);

    /* ---------- Mobile sheet ---------- */
    const toggleMenu = () => setIsOpen((prev) => !prev);
    const closeMenu = () => setIsOpen(false);
    const closeMenuAndRestoreFocus = () => {
        setIsOpen(false);
        hamburgerRef.current?.focus();
    };

    // Lock body scroll while the mobile menu is open.
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Focus the first link, trap Tab inside the sheet, Escape closes.
    useEffect(() => {
        if (!isOpen) return undefined;
        const sheet = sheetRef.current;
        const first = sheet?.querySelector('[data-autofocus]');
        first?.focus({ preventScroll: true });

        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                setIsOpen(false);
                hamburgerRef.current?.focus();
                return;
            }
            if (e.key !== 'Tab' || !sheet) return;
            const items = Array.from(sheet.querySelectorAll(FOCUSABLE));
            if (items.length === 0) return;
            const firstEl = items[0];
            const lastEl = items[items.length - 1];
            const active = document.activeElement;
            if (e.shiftKey && (active === firstEl || !sheet.contains(active))) {
                e.preventDefault();
                lastEl.focus();
            } else if (!e.shiftKey && (active === lastEl || !sheet.contains(active))) {
                e.preventDefault();
                firstEl.focus();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isOpen]);

    // If the viewport grows to desktop while the sheet is open, close it.
    useEffect(() => {
        if (!isOpen) return undefined;
        const mql = window.matchMedia('(min-width: 1024px)');
        const onChange = (e) => {
            if (e.matches) setIsOpen(false);
        };
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    }, [isOpen]);

    const navClass = [styles.navbar, isScrolled ? styles.scrolled : ''].filter(Boolean).join(' ');

    return (
        <>
            {/* First focusable element on every page. */}
            <a href="#main" className="skip-link">
                {c.skip}
            </a>
            <nav className={'on-dark ' + navClass} data-transparent={transparent} aria-label={c.mainNav}>
                <div className={styles.container}>
                    <Link href="/" className={styles.logo} onClick={closeMenu}>
                        <span className={styles.logoPlate}>
                            <Image src="/images/logo.png" alt="PJM Logo" width={34} height={34} className={styles.logoImg} />
                        </span>
                        <span className={styles.brandName}>Perkasa Jaya Marine</span>
                    </Link>

                    {/* ---------- Desktop ---------- */}
                    <div className={styles.desktop}>
                        <ul className={styles.links}>
                            <li>
                                <Link
                                    href="/"
                                    className={`${styles.link} ${isActive('/') ? styles.linkActive : ''}`}
                                    aria-current={isActive('/') ? 'page' : undefined}
                                >
                                    {t.home}
                                </Link>
                            </li>
                            <li
                                ref={productsWrapRef}
                                className={styles.dropdown}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onBlur={handleProductsBlur}
                            >
                                <button
                                    ref={productsBtnRef}
                                    type="button"
                                    className={`${styles.link} ${styles.dropdownBtn} ${isProductsActive ? styles.linkActive : ''}`}
                                    aria-expanded={productsOpen}
                                    aria-controls="products-panel"
                                    onClick={handleProductsClick}
                                >
                                    {t.products}
                                    <ChevronDown size={16} className={`${styles.chevron} ${productsOpen ? styles.chevronOpen : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {productsOpen && (
                                        <motion.div
                                            key="products-panel"
                                            id="products-panel"
                                            className={styles.panelPos}
                                            style={{ x: '-50%' }}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 8 }}
                                            transition={{ duration: 0.2, ease: EASE_OUT }}
                                        >
                                            <div className={styles.panel}>
                                                {productGroups.map((group) => (
                                                    <div key={group.title} className={styles.panelCol}>
                                                        <p className={`eyebrow eyebrow-plain ${styles.panelHeading}`}>{group.title}</p>
                                                        <ul>
                                                            {group.items.map((item) => {
                                                                const active = isActive(item.href);
                                                                return (
                                                                    <li key={item.href}>
                                                                        <Link
                                                                            href={item.href}
                                                                            className={`${styles.panelItem} ${active ? styles.panelItemActive : ''}`}
                                                                            aria-current={active ? 'page' : undefined}
                                                                            onClick={closeProducts}
                                                                        >
                                                                            <span>{item.label}</span>
                                                                            <ArrowRight size={16} className={styles.panelArrow} />
                                                                        </Link>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </li>
                            {mainLinks.slice(1).map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={`${styles.link} ${isActive(link.href) ? styles.linkActive : ''}`}
                                        aria-current={isActive(link.href) ? 'page' : undefined}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className={styles.actions}>
                            <Link
                                href="/chat"
                                prefetch={false}
                                className="btn btn-primary btn-sm"
                                aria-current={isActive('/chat') ? 'page' : undefined}
                            >
                                <Chat />
                                {t.chat}
                            </Link>
                            <LangSwitch variant="pill" />
                        </div>
                    </div>

                    {/* ---------- Mobile trigger ---------- */}
                    <button
                        ref={hamburgerRef}
                        type="button"
                        className={styles.hamburger}
                        onClick={toggleMenu}
                        aria-label={isOpen ? c.closeMenu : c.openMenu}
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                    >
                        <span className={`${styles.bar} ${isOpen ? styles.active : ''}`} />
                        <span className={`${styles.bar} ${isOpen ? styles.active : ''}`} />
                        <span className={`${styles.bar} ${isOpen ? styles.active : ''}`} />
                    </button>
                </div>
            </nav>

            {/* ---------- Mobile sheet ----------
                Rendered outside <nav>, so no filter or transform on the bar can ever become the containing
                block for these position: fixed layers. */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            key="backdrop"
                            className={styles.backdrop}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={closeMenu}
                            aria-hidden="true"
                        />
                        <motion.div
                            key="sheet"
                            ref={sheetRef}
                            id="mobile-menu"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Menu"
                            className={'on-dark ' + styles.mobileMenu}
                            variants={mobileMenuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <div className={styles.sheetTop}>
                                <span className={styles.sheetBrand}>
                                    <span className={styles.logoPlate}>
                                        <Image src="/images/logo.png" alt="" width={34} height={34} className={styles.logoImg} />
                                    </span>
                                    <span className={styles.brandName}>Perkasa Jaya Marine</span>
                                </span>
                                <button
                                    type="button"
                                    className={styles.sheetClose}
                                    onClick={closeMenuAndRestoreFocus}
                                    aria-label={c.closeMenu}
                                >
                                    <Close size={24} />
                                </button>
                            </div>

                            <ul className={styles.mobileList}>
                                {mainLinks.map((link, i) => {
                                    const active = isActive(link.href);
                                    return (
                                        <motion.li key={link.href} variants={mobileItemVariants}>
                                            <Link
                                                href={link.href}
                                                className={`${styles.mobileLink} ${active ? styles.mobileLinkActive : ''}`}
                                                aria-current={active ? 'page' : undefined}
                                                onClick={closeMenu}
                                                data-autofocus={i === 0 ? '' : undefined}
                                            >
                                                {link.label}
                                            </Link>
                                        </motion.li>
                                    );
                                })}
                            </ul>

                            <motion.div className={styles.mobileGroup} variants={mobileItemVariants}>
                                <p className={`eyebrow ${styles.mobileGroupTitle}`}>{t.products}</p>
                                <ul>
                                    {productGroups.flatMap((g) => g.items).map((item) => {
                                        const active = isActive(item.href);
                                        return (
                                            <li key={item.href}>
                                                <Link
                                                    href={item.href}
                                                    className={`${styles.mobileSubLink} ${active ? styles.mobileLinkActive : ''}`}
                                                    aria-current={active ? 'page' : undefined}
                                                    onClick={closeMenu}
                                                >
                                                    {item.label}
                                                    <ArrowRight size={18} className={styles.mobileSubArrow} />
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </motion.div>

                            <motion.div variants={mobileItemVariants}>
                                <Link
                                    href="/chat"
                                    prefetch={false}
                                    className={`btn btn-primary btn-lg ${styles.mobileChat}`}
                                    onClick={closeMenu}
                                >
                                    <Chat />
                                    {c.chatCta}
                                </Link>
                            </motion.div>

                            <motion.div className={styles.mobileBottom} variants={mobileItemVariants}>
                                <LangSwitch variant="segmented" />
                                <ul className={styles.mobileTels}>
                                    <li>
                                        <a
                                            href={waLink(WA_TEXT.general[language])}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <WhatsApp size={16} />
                                            {c.whatsapp} · {WHATSAPP.display}
                                        </a>
                                    </li>
                                    {STORES.map((store) => (
                                        <li key={store.id}>
                                            <a href={store.tel}>
                                                <Phone size={16} />
                                                {store.name} · {store.phone}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
