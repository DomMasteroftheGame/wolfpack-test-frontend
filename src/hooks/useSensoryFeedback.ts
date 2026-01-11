import { useCallback } from 'react';
import useSound from 'use-sound';

// Placeholder sound URLs - Replace with actual assets
const SOUNDS = {
    click: '/sounds/click.mp3',
    success: '/sounds/success.mp3',
    alert: '/sounds/alert.mp3',
    drop: '/sounds/drop.mp3',
};

export const useSensoryFeedback = () => {
    const [playClick] = useSound(SOUNDS.click, { volume: 0.5 });
    const [playSuccess] = useSound(SOUNDS.success, { volume: 0.7 });
    const [playAlert] = useSound(SOUNDS.alert, { volume: 0.6 });
    const [playDrop] = useSound(SOUNDS.drop, { volume: 0.4 });

    const triggerHaptic = useCallback((pattern: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'light') => {
        if (!navigator.vibrate) return;

        switch (pattern) {
            case 'light':
                navigator.vibrate(10);
                break;
            case 'medium':
                navigator.vibrate(20);
                break;
            case 'heavy':
                navigator.vibrate(40);
                break;
            case 'success':
                navigator.vibrate([50, 50, 50]);
                break;
            case 'warning':
                navigator.vibrate([100, 50, 100]);
                break;
        }
    }, []);

    const triggerFeedback = useCallback((type: 'click' | 'success' | 'alert' | 'drop') => {
        switch (type) {
            case 'click':
                playClick();
                triggerHaptic('light');
                break;
            case 'success':
                playSuccess();
                triggerHaptic('success');
                break;
            case 'alert':
                playAlert();
                triggerHaptic('warning');
                break;
            case 'drop':
                playDrop();
                triggerHaptic('medium');
                break;
        }
    }, [playClick, playSuccess, playAlert, playDrop, triggerHaptic]);

    return { triggerFeedback, triggerHaptic };
};
