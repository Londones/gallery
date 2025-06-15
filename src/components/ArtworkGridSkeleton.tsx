
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const ArtworkGridSkeleton = () => {
    const skeletonCount = 8;
    return (
        <motion.div
            className="masonry-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {Array.from({ length: skeletonCount }).map((_, index) => (
                <div key={index} className="masonry-item mb-4 break-inside-avoid">
                    <Skeleton style={{ height: `${200 + Math.random() * 150}px` }} className="w-full rounded-lg" />
                </div>
            ))}
        </motion.div>
    );
};

export default ArtworkGridSkeleton;
