import React, { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

interface OnboardingTourProps {
    isActive: boolean;
    onComplete: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ isActive, onComplete }) => {
    useEffect(() => {
        if (!isActive) return;

        const tour = driver({
            showProgress: true,
            animate: true,
            allowClose: true,
            onDestroyed: onComplete,
            steps: [
                {
                    element: 'body',
                    popover: {
                        title: 'WELCOME TO THE WOLFPACK',
                        description: 'This is your Tactical Command Center. Let\'s get you oriented, Wolf.',
                        side: 'left',
                        align: 'start'
                    }
                },
                {
                    element: '#hud-identity',
                    popover: {
                        title: 'YOUR IDENTITY',
                        description: 'This is your Class and Rank. Your neon color (Red/Green/Blue) represents your role.',
                        side: 'bottom'
                    }
                },
                {
                    element: '#hud-resources',
                    popover: {
                        title: 'YOUR RESOURCES',
                        description: 'Track your IVP (Influence Value Points) here. Earn IVP by completing missions.',
                        side: 'bottom'
                    }
                },
                {
                    element: '#kanban-board',
                    popover: {
                        title: 'THE BATTLEFIELD',
                        description: 'This is where you execute. Drag tasks from THE HUNT to THE CHASE to THE FEAST.',
                        side: 'top'
                    }
                },
                {
                    element: '#task-1', // Assuming first task has this ID or similar logic
                    popover: {
                        title: 'YOUR FIRST MISSION',
                        description: 'This is a Mission Card. The icon tells you the phase (Build/Measure/Learn). The Heat Meter shows urgency.',
                        side: 'right'
                    }
                }
            ]
        });

        tour.drive();

        return () => {
            tour.destroy();
        };
    }, [isActive, onComplete]);

    return null; // The driver.js overlay is handled outside the React tree
};
