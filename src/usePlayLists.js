import { useEffect, useState } from "react";

export default function usePlayLists() {
    const [content, setContent] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const doAsync = async () => {
            setContent(null);
            try {
                const res = await fetch(``, { signal });
                const text = await res.text();
                setContent(text);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setContent(null);
                }
            }
        };

        doAsync();
        return () => controller.abort();
    }, []);

    return content;
}