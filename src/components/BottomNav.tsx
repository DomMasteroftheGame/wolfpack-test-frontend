import { Link, useLocation } from 'react-router-dom';
import { Home, Crosshair, Users, Terminal } from 'lucide-react';

const BottomNav = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Missions', path: '/gameboard', icon: Crosshair },
        { name: 'Pack', path: '/radar', icon: Users },
        { name: 'Command', path: '/dashboard', icon: Terminal },
    ];

    return (
        <div className="fixed left-0 right-0 bg-gray-950 border-t border-yellow-900/30 pb-safe z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]" style={{ bottom: 0 }}>
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${active ? 'text-yellow-500 bg-yellow-900/10' : 'text-gray-500 hover:text-yellow-600 hover:bg-gray-900'}`}
                        >
                            <Icon className={`w-5 h-5 mb-1 ${active ? 'filter drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]' : ''}`} />
                            <span className="text-[10px] font-mono uppercase tracking-widest">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
