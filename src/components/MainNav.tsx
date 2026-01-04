import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MainNav: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: 'Play', path: '/dashboard' },
        { name: 'Shop', path: '/shop' },
        { name: 'Watch', path: '/watch' },
        { name: 'About', path: '/about' },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-[100] bg-black border-b border-gray-800 h-20 flex items-center justify-between px-6 w-full">
                {/* Logo Area */}
                <div className="flex items-center gap-4 flex-shrink-0 cursor-pointer z-[101] max-w-[40vw] overflow-hidden" onClick={() => navigate('/dashboard')}>
                    <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center flex-shrink-0">
                        <span className="font-black italic text-black text-sm">WP</span>
                    </div>
                    <span className="font-black text-white text-xl tracking-tighter hidden md:block whitespace-nowrap">WOLFPACK</span>
                </div>

                {/* Desktop Links - CENTERED and HIGH CONTRAST */}
                <div className="hidden lg:flex items-center gap-12 absolute left-1/2 transform -translate-x-1/2">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => navigate(link.path)}
                            className="text-sm font-black font-sans text-white hover:text-yellow-500 hover:scale-105 uppercase tracking-[0.2em] transition-all px-4 py-2"
                        >
                            {link.name}
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6 z-[101]">
                    <button onClick={() => navigate('/shop/cart')} className="relative group p-2">
                        <ShoppingBag className="w-6 h-6 text-white group-hover:text-yellow-500 transition-colors" />
                    </button>
                    <button onClick={() => navigate('/dashboard')} className="lg:hidden p-2">
                        <User className="w-6 h-6 text-white hover:text-yellow-500 transition-colors" />
                    </button>
                    <button onClick={toggleMenu} className="lg:hidden p-2">
                        {isOpen ? <X className="w-7 h-7 text-yellow-500" /> : <Menu className="w-7 h-7 text-white" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-black pt-20 px-4 md:hidden"
                    >
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => {
                                        navigate(link.path);
                                        setIsOpen(false);
                                    }}
                                    className="text-2xl font-black italic text-white uppercase tracking-tighter hover:text-yellow-500 text-left border-b border-gray-800 pb-4"
                                >
                                    {link.name}
                                </button>
                            ))}
                            <div className="mt-8 p-4 border border-yellow-600/30 rounded bg-yellow-900/10">
                                <h4 className="text-yellow-500 font-bold uppercase mb-2">Alpha Status</h4>
                                <p className="text-gray-400 text-xs font-mono mb-4">Log in to track your rank.</p>
                                <button onClick={() => navigate('/dashboard')} className="w-full bg-yellow-600 text-black font-bold py-3 rounded uppercase">
                                    Access Terminal
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MainNav;
