import { useEffect, useRef } from "react";

export const useInfitineScroll = (
  loadMore: () => void,
  canLoadMore: boolean
) => {
  const loaderRef = useRef(null);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && canLoadMore) {
          loadMore();
        }
      },
      {
        threshold: 0.5,
        rootMargin: "100px",
      }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore, canLoadMore]);

  return loaderRef;
};
