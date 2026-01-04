import { useEffect, useState } from 'react';
import { useLocation } from '../contexts/LocationContext';
import { matchmakerApi } from '../api';

export interface NearbyPlayer {
    id: string;
    name: string;
    // Backend returns [lat, long] or usually API returns JSON.
    // Our updated matchmaker.py returns { coordinates: [lat, long], ... }
    coordinates: [number, number];
    wolfType: string;
    ivp: number;
    distance: number; // in km
    bio?: string;
    role?: string;
}

export function useNearbyPlayers(radiusInKm: number = 50) {
    const { location } = useLocation();
    const [players, setPlayers] = useState<NearbyPlayer[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!location) return;

        const fetchWolves = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('auth_token');
                if (token) {
                    const results = await matchmakerApi.getNearbyWolves(
                        token,
                        location.latitude,
                        location.longitude,
                        radiusInKm
                    );
                    setPlayers(results);
                }
            } catch (err) {
                console.error("Error fetching nearby wolves:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWolves();

    }, [location, radiusInKm]);

    return { players, loading };
}
