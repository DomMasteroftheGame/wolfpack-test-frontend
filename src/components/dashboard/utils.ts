export const getRoleConfig = (role: string | null | undefined) => {
    switch (role) {
        case 'labor': return {
            label: 'The Builder',
            icon: '🛠️',
            grindAction: 'Commit Code',
            colors: { text: 'text-red-500', bg: 'bg-red-500', bgActive: 'bg-red-900/40', border: 'border-red-600', hoverBorder: 'group-hover:border-red-500', shadow: 'shadow-red-500/20' }
        };
        case 'finance': return {
            label: 'The Capital',
            icon: '💰',
            grindAction: 'Review P&L',
            colors: { text: 'text-green-500', bg: 'bg-green-500', bgActive: 'bg-green-900/40', border: 'border-green-600', hoverBorder: 'group-hover:border-green-500', shadow: 'shadow-green-500/20' }
        };
        case 'sales': return {
            label: 'The Connector',
            icon: '🤝',
            grindAction: 'Cold Call',
            colors: { text: 'text-blue-500', bg: 'bg-blue-500', bgActive: 'bg-blue-900/40', border: 'border-blue-600', hoverBorder: 'group-hover:border-blue-500', shadow: 'shadow-blue-500/20' }
        };
        default: return {
            label: 'Unassigned',
            icon: '❓',
            grindAction: 'Grind',
            colors: { text: 'text-gray-500', bg: 'bg-gray-500', bgActive: 'bg-gray-900/40', border: 'border-gray-600', hoverBorder: 'group-hover:border-gray-500', shadow: 'shadow-gray-500/20' }
        };
    }
};
