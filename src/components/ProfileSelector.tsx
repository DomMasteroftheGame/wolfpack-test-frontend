import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '../api';
import { User } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ProfileSelectorProps {
    user: User;
    token: string;
}

const ProfileSelector: React.FC<ProfileSelectorProps> = ({ user, token }) => {
    const { updateUser } = useAuth();
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [lookingFor, setLookingFor] = useState<string | null>(null);
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mentor Bubble Animation
    const mentorVariant = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { delay: 0.5 } }
    };

    const handleSelectRole = (type: string) => {
        setSelectedType(type);
        setStep(2);
    };

    const handleSelectLookingFor = (type: string) => {
        setLookingFor(type);
        setStep(3);
    };

    const handleSubmit = async () => {
        if (!selectedType || !lookingFor) return;
        setIsSubmitting(true);

        const safetyTimeout = setTimeout(() => {
            console.warn("API timeout, enabling force continue...");
            setIsSubmitting(false);
        }, 5000);

        try {
            const response = await authApi.updateProfile(token, {
                userId: user.id,
                wolfType: selectedType,
                // @ts-ignore
                lookingFor,
                bio,
                location,
                coffeeShop: location
            });
            clearTimeout(safetyTimeout);

            if (response.success || response) {
                const updatedUser = { ...user, wolfType: selectedType, bio, location };
                updateUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            clearTimeout(safetyTimeout);
            // Fallback for demo/offline
            const updatedUser = { ...user, wolfType: selectedType, bio, location };
            updateUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForceContinue = () => {
        const updatedUser = { ...user, wolfType: selectedType || 'labor' };
        updateUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const renderCard = (type: string, icon: string, title: string, description: string, colorClass: string, bgImage: string) => {
        const isSelected = selectedType === type;

        return (
            <motion.div
                whileHover={{ scale: 1.05, borderColor: colorClass === 'labor' ? '#EF4444' : colorClass === 'finance' ? '#22C55E' : '#3B82F6' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectRole(type)}
                className={`relative cursor-pointer h-80 rounded-xl border-2 ${isSelected ? `border-${colorClass} shadow-neon-${colorClass === 'labor' ? 'red' : 'gold'}` : 'border-gray-800'} overflow-hidden bg-bunker group transition-colors duration-300`}
            >
                {/* Background Image/Gradient */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity"
                    style={{ backgroundImage: `url(${bgImage})` }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-bunker/80 to-transparent" />

                <div className="absolute bottom-0 p-6 w-full">
                    <div className="text-4xl mb-4">{icon}</div>
                    <h3 className={`text-2xl font-bold uppercase tracking-widest mb-2 ${isSelected ? `text-${colorClass}` : 'text-gray-200'}`}>{title}</h3>
                    <div className={`h-1 w-12 bg-${colorClass} mb-3`}></div>
                    <p className="text-sm text-gray-400 font-mono">{description}</p>
                </div>

                {isSelected && (
                    <div className="absolute top-4 right-4">
                        <div className={`w-3 h-3 rounded-full bg-${colorClass} animate-pulse shadow-neon-${colorClass === 'labor' ? 'red' : 'gold'}`}></div>
                    </div>
                )}
            </motion.div>
        );
    };

    const assets = window.pwaThemeVariables?.gameAssets || {};

    return (
        <div className="fixed inset-0 bg-void/95 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans">
            <div className="w-full max-w-6xl flex gap-8">

                {/* Mentor / Strategy Panel */}
                <motion.div
                    variants={mentorVariant}
                    initial="hidden"
                    animate="visible"
                    className="hidden lg:block w-1/4"
                >
                    <div className="bg-bunker border border-gold/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50"></div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full border-2 border-gold bg-gray-800 overflow-hidden">
                                {/* Simulated Avatar */}
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${assets.advisorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dom'})` }}></div>
                            </div>
                            <div>
                                <h4 className="text-gold font-bold uppercase tracking-widest text-sm">Advisor Dom</h4>
                                <p className="text-xs text-gray-400">War Room Strategist</p>
                            </div>
                        </div>
                        <div className="space-y-4 text-sm text-gray-300 font-mono leading-relaxed">
                            {step === 1 && <p>"Identity is the first step of strategy. Are you a Builder (Labor), a Capital Allocator (Finance), or a Networker (Sales)? This choice defines your path."</p>}
                            {step === 2 && <p>"No wolf hunts alone. Who do you need to complete your pack? A builder needs funding, money needs a product."</p>}
                            {step === 3 && <p>"Establish your base. Location matters. The algorithm connects you with local wolves first."</p>}
                        </div>
                    </div>
                </motion.div>

                {/* Main Interaction Area */}
                <div className="flex-1 bg-bunker/50 border border-gray-800 rounded-2xl p-8 shadow-glass backdrop-blur-sm relative overflow-hidden">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-extrabold uppercase tracking-widest text-white mb-2">
                            <span className="text-gold">Phase 1:</span> Identification
                        </h2>
                        <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"></div>
                    </div>

                    <AnimatePresence mode='wait'>
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                {renderCard('labor', '🛠️', 'Labor', 'The Builder. High Grind capacity. Needs Capital.', 'labor', assets.cardLabor)}
                                {renderCard('finance', '💰', 'Finance', 'The Capital. High Fund stat. Needs Product.', 'finance', assets.cardFinance)}
                                {renderCard('sales', '🤝', 'Sales', 'The Connector. High Network. Needs Leverage.', 'sales', assets.cardSales)}
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-center text-gray-400 mb-8 font-mono">TARGET ACQUISITION: Who are you hunting for?</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div onClick={() => handleSelectLookingFor('labor')} className="cursor-pointer p-8 rounded-xl border border-gray-700 bg-black hover:border-labor hover:shadow-neon-red transition-all text-center group">
                                        <div className="text-5xl mb-4 grayscale group-hover:grayscale-0 transition-all">🛠️</div>
                                        <h3 className="text-xl font-bold text-gray-300 group-hover:text-labor uppercase tracking-widest">Find Builders</h3>
                                    </div>
                                    <div onClick={() => handleSelectLookingFor('finance')} className="cursor-pointer p-8 rounded-xl border border-gray-700 bg-black hover:border-finance hover:shadow-neon-green transition-all text-center group">
                                        <div className="text-5xl mb-4 grayscale group-hover:grayscale-0 transition-all">💰</div>
                                        <h3 className="text-xl font-bold text-gray-300 group-hover:text-finance uppercase tracking-widest">Find Capital</h3>
                                    </div>
                                    <div onClick={() => handleSelectLookingFor('sales')} className="cursor-pointer p-8 rounded-xl border border-gray-700 bg-black hover:border-sales hover:shadow-neon-blue transition-all text-center group">
                                        <div className="text-5xl mb-4 grayscale group-hover:grayscale-0 transition-all">🤝</div>
                                        <h3 className="text-xl font-bold text-gray-300 group-hover:text-sales uppercase tracking-widest">Find Sales</h3>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white uppercase tracking-widest text-xs">← Abort Step</button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-md mx-auto space-y-6"
                            >
                                <div>
                                    <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">Mission Parameters (Bio)</label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Briefly describe your current objective..."
                                        className="w-full bg-black border border-gray-700 text-white rounded-lg p-4 focus:ring-1 focus:ring-gold focus:border-gold outline-none resize-none h-32 font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gold uppercase tracking-widest mb-2">Base of Operations (City)</label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. New York, NY"
                                        className="w-full bg-black border border-gray-700 text-white rounded-lg p-4 focus:ring-1 focus:ring-gold focus:border-gold outline-none font-mono text-sm"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`w-full py-4 px-6 rounded-lg font-bold text-lg uppercase tracking-widest transition-all shadow-neon-gold ${isSubmitting
                                        ? 'bg-gray-800 text-gray-500 cursor-wait'
                                        : 'bg-gold text-black hover:bg-yellow-400'
                                        }`}
                                >
                                    {isSubmitting ? 'Encrypting Identity...' : 'Initialize Wolf ID'}
                                </motion.button>

                                <div className="text-center space-y-4 mt-6">
                                    <button onClick={() => setStep(2)} className="text-gray-500 hover:text-white uppercase tracking-widest text-xs">← Back</button>
                                    <div>
                                        <button
                                            onClick={handleForceContinue}
                                            className="text-[10px] text-gray-600 hover:text-red-500 uppercase tracking-widest font-mono"
                                        >
                                            System Overide: Force Entry
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ProfileSelector;
