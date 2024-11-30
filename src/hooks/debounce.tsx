import { useEffect } from "react";

const useDebounce = (
    callback: () => void,
    delay: number,
    dependencies: any[]
) => {
    useEffect(() => {
        const handler = setTimeout(callback, delay);
        return () => clearTimeout(handler);
    }, [...(dependencies || [])]);
};

export default useDebounce;
