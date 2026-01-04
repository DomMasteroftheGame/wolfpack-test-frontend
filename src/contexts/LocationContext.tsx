import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { matchmakerApi } from '../api';

interface LocationContextType {
    location: GeolocationCoordinates | null;
    error: string | null;
    permissionStatus: PermissionState | 'unknown';
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function useLocation() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
}

interface LocationProviderProps {
    children: ReactNode;
}

export function LocationProvider({ children }: LocationProviderProps) {
    const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [permissionStatus, setPermissionStatus] = useState<PermissionState | 'unknown'>('unknown');
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        // Check permission status
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            setPermissionStatus(result.state);
            result.onchange = () => {
                setPermissionStatus(result.state);
            };
        });

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setLocation(position.coords);
                setError(null);

                // Sync to Firestore if user is logged in
                if (currentUser && currentUser.firebase_uid) {
                    updateUserLocation(currentUser.firebase_uid, position.coords);
                }
            },
            (err) => {
                setError(`Location error: ${err.message}`);
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [currentUser]);

    const updateUserLocation = async (uid: string, coords: GeolocationCoordinates) => {
        try {
            // Send to Backend (MongoDB)
            const token = localStorage.getItem('auth_token');
            if (token) {
                await matchmakerApi.updateLocation(token, {
                    lat: coords.latitude,
                    long: coords.longitude
                });
            }
        } catch (err) {
            console.error("Error updating location in Backend:", err);
        }
    };

    const value = {
        location,
        error,
        permissionStatus
    };

    return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}
