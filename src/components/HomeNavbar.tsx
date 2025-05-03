'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const sections = ['hero', 'why', 'testimonials'];

export default function HomeNavbar() {
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            let currentSection = '';

            sections.forEach(section => {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetHeight = element.offsetHeight;

                    if (scrollY >= offsetTop - offsetHeight / 3) {
                        currentSection = section;
                    }
                }
            });

            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const linkClass = (section: string) =>
        `transition ${activeSection === section ? 'text-blue-600 font-semibold' : 'text-gray-700'
        } hover:text-blue-600`;

    return (
        <nav className={`fixed top-0 w-full z-50 transition items-center ${activeSection ? 'bg-white shadow-md' : 'bg-transparent'} py-4`}>
            <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
                <div className="text-2xl font-bold text-blue-600">
                    <Image src="/textLogo.png" alt='' width={124} height={124} />
                </div>
                <div className="space-x-8 hidden md:flex items-center">
                    {sections.map((section) => (
                        <a
                            key={section}
                            href={`#${section}`}
                            className={linkClass(section)}
                        >
                            {section === 'hero' ? 'Home' : section.charAt(0).toUpperCase() + section.slice(1)}
                        </a>
                    ))}

                    {/* Login Button */}
                    <a
                        href="/auth/login"
                        className="ml-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition hidden md:inline-block"
                    >
                        Login
                    </a>
                </div>
            </div>
        </nav>
    );
}
