// import { useState, useEffect, useRef } from 'react';

// export function useScrollAnimation() {
//   const [isVisible, setIsVisible] = useState(false);
//   const domRef = useRef();

//   useEffect(() => {
//     const observer = new IntersectionObserver(entries => {
//       entries.forEach(entry => {
//         if(entry.isIntersecting) {
//           setIsVisible(true);
//           observer.unobserve(domRef.current);
//         }
//       });
//     });
//     observer.observe(domRef.current);
//     return () => observer.disconnect();
//   }, []);

//   return [domRef, isVisible];
// }

import { useState, useEffect, useRef } from 'react';

export function useScrollAnimation() {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const currentDomRef = domRef.current;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (currentDomRef) {
                        observer.unobserve(currentDomRef);
                    }
                }
            });
        });

        if (currentDomRef) {
            observer.observe(currentDomRef);
        }

        return () => {
            if (currentDomRef) {
                observer.unobserve(currentDomRef);
            }
            observer.disconnect();
        };
    }, []);

    return [domRef, isVisible];
}