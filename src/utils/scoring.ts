import { Task } from '../types';

/**
 * Calculates the IVP (Intrinsic Value Points) for a task based on the user's role and the action type.
 * 
 * GRIND: Routine tasks (e.g., "Commit Code", "Cold Call"). Low IVP, high frequency.
 * KILL: Milestone tasks (e.g., "Launch MVP", "Close Series A"). High IVP, low frequency.
 */
export const calculateIVP = (task: Task, role: string, actionType: 'grind' | 'kill'): number => {
    let baseScore = task.ivp || 10;

    // Role Multipliers
    // Labor gets bonus for "Build" tasks
    // Capital gets bonus for "Fund" tasks
    // Sales gets bonus for "Connect" tasks
    
    // For now, we simulate this by checking keywords in the task title
    const isBuild = /code|dev|prototype|mvp/i.test(task.title);
    const isFund = /finance|invest|pitch|money/i.test(task.title);
    const isConnect = /sales|call|meeting|network/i.test(task.title);

    let multiplier = 1.0;

    if (role === 'labor' && isBuild) multiplier = 1.5;
    if (role === 'finance' && isFund) multiplier = 1.5;
    if (role === 'sales' && isConnect) multiplier = 1.5;

    // Action Type Multipliers
    if (actionType === 'kill') {
        // Kills are worth 5x Grinds
        multiplier *= 5;
    }

    return Math.round(baseScore * multiplier);
};

/**
 * Simulates the "Wolf Math" calculation for the Ghost Bar.
 * Returns the projected score vs actual score.
 */
export const calculateWolfMath = (tasks: Task[]): { actual: number, projected: number } => {
    const completed = tasks.filter(t => t.status === 'done');
    const actual = completed.reduce((acc, t) => acc + (t.ivp || 10), 0);
    
    // Projected includes "doing" tasks
    const doing = tasks.filter(t => t.status === 'doing');
    const projected = actual + doing.reduce((acc, t) => acc + (t.ivp || 10), 0);

    return { actual, projected };
};
