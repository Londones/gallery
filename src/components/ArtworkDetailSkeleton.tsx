
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const ArtworkDetailSkeleton = () => {
  return (
    <motion.div
      className="min-h-screen bg-white overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.header 
        className="absolute top-0 left-0 z-50 p-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link to="/">
          <Button variant="ghost" className="text-gray-400 hover:text-gray-800 hover:bg-gray-50 border-none p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
      </motion.header>

      <div className="flex flex-col lg:flex-row min-h-screen pt-16 lg:pt-0">
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          <Skeleton className="w-full h-[60vh] lg:h-[80vh] rounded-lg" />
        </div>
        
        <div className="w-full lg:w-80 bg-gray-50/30 p-8 lg:p-12 flex flex-col justify-center border-l border-gray-100">
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-200">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ArtworkDetailSkeleton
