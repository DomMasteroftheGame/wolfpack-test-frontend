import { useState, useEffect } from 'react';
import { useLocation } from '../contexts/LocationContext';
import { placesApi } from '../api';

export interface CoffeeShop {
    name: string;
    formattedAddress: string;
    rating?: number;
    userRatingCount?: number;
    location: {
        latitude: number;
        longitude: number;
    };
    openNow?: boolean;
}

export function useCoffeeIntel() {
    const { location } = useLocation();
    const [coffeeShops, setCoffeeShops] = useState<CoffeeShop[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!location) return;

        const fetchCoffee = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('auth_token');
                // Even without a token, we might want to allow this if it was public, 
                // but our API is currently protected or open? 
                // Let's assume we send 'token' if we have it, or valid apiRequest handles it.
                // Our apiRequest helper might not require token for GETs if not strictly enforced,
                // but to be safe let's ensure we are logged in or handle it.
                // For this app, let's just pass the token we have.

                const results = await placesApi.getNearbyPlaces(
                    token || '',
                    location.latitude,
                    location.longitude
                );
                setCoffeeShops(results);

            } catch (err: any) {
                setError(err.message || 'Failed to fetch intel');
                setCoffeeShops([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCoffee();
    }, [location]);

    return { coffeeShops, loading, error };
}
