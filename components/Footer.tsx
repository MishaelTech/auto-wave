import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import { footerSections } from "@/constants";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-b from-blue-900 to-blue-800 text-gray-300 py-16 relative">
            <div className="container mx-auto px-6 lg:px-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start text-center md:text-left">
                    {/* Logo & Branding */}
                    <div id="title" className="flex flex-col items-center md:items-start">
                        <div className='flex items-center gap-2'>
                            <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0072FF] font-bold'>
                                AW
                            </div>
                            <span className='text-lg font-semibold'>Auto Wave</span>
                        </div>
                        <p className="mt-4 text-gray-400 max-w-sm text-sm">
                            Auto Wave is your trusted partner for all automotive needs, from MOTs to repairs and servicing. We ensure your vehicle runs smoothly and safely.
                        </p>
                    </div>

                    <div id="title" className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm font-medium justify-start text-start">
                        {footerSections.map((section, index) => (
                            <div key={index}>
                                <h3 className="text-white font-bold uppercase text-sm mb-4 border-b border-gray-600 pb-2">
                                    {section.title}
                                </h3>
                                <ul className="space-y-3 text-gray-400">
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <Link
                                                href={link.path}
                                                className="hover:text-white transition-colors duration-300"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Social Media & Newsletter */}
                    <div className="flex flex-col items-center md:items-end w-full text-center md:text-right">
                        <h3 id="footer-text" className="text-white font-bold uppercase text-sm mb-4">Follow Us</h3>
                        <div id="icon" className="flex space-x-5 text-xl">
                            <Link href="https://instagram.com/mizspace" aria-label="Instagram">
                                <FaInstagram className="hover:scale-110 hover:drop-shadow-md transition-transform text-gray-400 hover:text-white" />
                            </Link>
                            <Link href="https://facebook.com/mizspace" aria-label="Facebook">
                                <FaFacebook className="hover:scale-110 hover:drop-shadow-md transition-transform text-gray-400 hover:text-white" />
                            </Link>
                            <Link href="https://linkedin.com/in/mizspace" aria-label="LinkedIn">
                                <FaLinkedin className="hover:scale-110 hover:drop-shadow-md transition-transform text-gray-400 hover:text-white" />
                            </Link>
                            <Link href="https://twitter.com/mizspace" aria-label="Twitter">
                                <FaTwitter className="hover:scale-110 hover:drop-shadow-md transition-transform text-gray-400 hover:text-white" />
                            </Link>
                        </div>

                    </div>
                </div>

                {/* Bottom Section */}
                <div id="footer-text" className="mt-12 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
                    <p>© MizSpace Technology {currentYear}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;