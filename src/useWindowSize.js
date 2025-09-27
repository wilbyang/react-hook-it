import { useState, useEffect } from 'react';
const getSize = () => {
    return window.innerWidth > 1000 ? "large" : "small";
}
const useWindowSize = () => {
    const [size, setSize] = useState(getSize());
    useEffect(() => {
        const handler = () => {
            setSize(getSize())
        };
        window.addEventListener('resize', handler);
        return () => {
            window.removeEventListener('resize', handler);
        };
    }, []);

    return size;
};

export default useWindowSize;
