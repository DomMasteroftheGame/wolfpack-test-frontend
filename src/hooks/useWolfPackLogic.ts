import { useProject } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';
import { Task } from '../types';

// Mock Firebase functions for the "Handshake"
const mockUpdateDoc = async (collection: string, id: string, data: any) => {
    console.log(`[ANTIGRAVITY] Updating ${collection}/${id}:`, data);
    return Promise.resolve();
};

export const useWolfPackLogic = () => {
    const { updateTask, projectTasks } = useProject();
    const { currentUser, updateProfile } = useAuth();

    // Triggered when Manus detects a "Drop" event
    const moveWolf = async (taskId: string, newStatus: string) => {
        if (!currentUser) return;

        try {
            // 1. Update the Task Status (Local State + Mock DB)
            const task = projectTasks.find(t => t.id === taskId);
            if (task) {
                const updatedTask = { ...task, status: newStatus as any };
                await updateTask(taskId, updatedTask);
                await mockUpdateDoc('tasks', taskId, { status: newStatus, lastMoved: new Date() });
            }

            // 2. WOLF MATH: If moved to "Feast" (Done), award "Kill" points
            if (newStatus === 'feast' || newStatus === 'done') {
                // Calculate new stats
                const currentKills = (currentUser.stats?.kill || 0) + 1;
                const currentIVP = (currentUser.ivp || 0) + 100;

                // Update User Profile
                if (updateProfile) {
                    await updateProfile({
                        ...currentUser,
                        ivp: currentIVP,
                        stats: {
                            ...currentUser.stats,
                            kill: currentKills
                        }
                    });
                }
                
                await mockUpdateDoc('users', currentUser.id, {
                    'stats.kill': currentKills,
                    'wallet.ivp': currentIVP
                });

                console.log("🎯 Kill Confirmed. Loot awarded: +100 IVP");
            }

        } catch (error) {
            console.error("Signal Jammed:", error);
        }
    };

    return { moveWolf };
};
