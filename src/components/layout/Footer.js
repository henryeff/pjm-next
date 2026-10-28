import styles from './Footer.module.css';
import Link from 'next/link';
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <StaggerGroup className={styles.container} as="div" amount={0.1}>
                <StaggerItem className={styles.column}>
                    <h3>Perkasa Jaya Marine</h3>
                    <p>Your trusted Yamaha Marine dealer in Padang. Providing sales, service, and spare parts.</p>
                </StaggerItem>

                <StaggerItem className={styles.column}>
                    <h3>Toko Tunggal Jaya</h3>
                    <p>Jalan M. Yamin SH No 144</p>
                    <p>Padang, West Sumatera</p>
                    <p>Phone: +62 751 36628</p>
                </StaggerItem>

                <StaggerItem className={styles.column}>
                    <h3>Perkasa Jaya Marine</h3>
                    <p>Jalan Imam Bonjol No. 27D</p>
                    <p>Padang, West Sumatera</p>
                    <p>Phone: +62 751 840010</p>
                </StaggerItem>

                <StaggerItem className={styles.column}>
                    <h3>Quick Links</h3>
                    <Link href="/">Home</Link>
                    <Link href="/products/four-strokes">4 Strokes</Link>
                    <Link href="/products/two-strokes">2 Strokes</Link>
                    <Link href="/news">News</Link>
                    <Link href="/contact">Contact</Link>
                </StaggerItem>
            </StaggerGroup>
            <div className={styles.copyright}>
                <p>&copy; {new Date().getFullYear()} Perkasa Jaya Marine. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
