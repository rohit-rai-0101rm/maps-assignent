
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useWalks = () => {
    const [walks, setWalks] = useState([]);

    useEffect(() => {
        const loadWalks = async () => {
            try {
                const data = await AsyncStorage.getItem('walks');
                if (data) {
                    setWalks(JSON.parse(data));
                }
            } catch (error) {
                console.error("Failed to load walks from AsyncStorage", error);
            }
        };

        loadWalks();
    }, []);

    return walks;
};

export default useWalks;
