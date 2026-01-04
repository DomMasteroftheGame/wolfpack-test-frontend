export interface Coordinate {
    lat: number;
    lng: number;
}

/**
 * Calculates the geographic centroid (midpoint) for a group of coordinates.
 * Useful for finding a central meeting point for a "Pack".
 */
export const calculateCentroid = (coordinates: Coordinate[]): Coordinate | null => {
    if (coordinates.length === 0) return null;

    let x = 0;
    let y = 0;
    let z = 0;

    for (const coord of coordinates) {
        const latRad = (coord.lat * Math.PI) / 180;
        const lngRad = (coord.lng * Math.PI) / 180;

        x += Math.cos(latRad) * Math.cos(lngRad);
        y += Math.cos(latRad) * Math.sin(lngRad);
        z += Math.sin(latRad);
    }

    const total = coordinates.length;
    x = x / total;
    y = y / total;
    z = z / total;

    const centralLng = Math.atan2(y, x);
    const centralSquareRoot = Math.sqrt(x * x + y * y);
    const centralLat = Math.atan2(z, centralSquareRoot);

    return {
        lat: (centralLat * 180) / Math.PI,
        lng: (centralLng * 180) / Math.PI
    };
};

/**
 * Calculates the distance between two points in miles using the Haversine formula.
 */
export const calculateDistance = (coord1: Coordinate, coord2: Coordinate): number => {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((coord1.lat * Math.PI) / 180) *
        Math.cos((coord2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
