// src/utils/calculateDistance.ts
export const calculateDistance = (
    coords: { latitude: number; longitude: number }[]
): number => {
    const toRad = (val: number) => (val * Math.PI) / 180;
    const R = 6371;

    let dist = 0;
    for (let i = 1; i < coords.length; i++) {
        const prev = coords[i - 1];
        const curr = coords[i];

        const dLat = toRad(curr.latitude - prev.latitude);
        const dLon = toRad(curr.longitude - prev.longitude);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(prev.latitude)) *
            Math.cos(toRad(curr.latitude)) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        dist += R * c;
    }

    return dist;
};
