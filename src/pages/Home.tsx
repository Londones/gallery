import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Palette, Users, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Palette className="w-8 h-8 text-gray-900" />
          <span className="text-xl font-light text-gray-900">Gallery</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/auth" className="text-gray-600 hover:text-gray-900">
            Sign In
          </Link>
          <Link to="/auth">
            <Button className="bg-gray-900 hover:bg-gray-800 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            className="text-5xl md:text-6xl font-light text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Showcase Your Art to the World
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Create your own personalized gallery with a custom subdomain. 
            Share your artwork beautifully and professionally.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/auth">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
                Create Your Gallery
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500">
              Get your custom subdomain: <span className="font-mono">yourname.gallery.com</span>
            </p>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mt-24"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Custom Domain</h3>
            <p className="text-gray-600">Get your own subdomain to share your gallery professionally</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Beautiful Design</h3>
            <p className="text-gray-600">Showcase your artwork with a clean, modern gallery layout</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Easy Sharing</h3>
            <p className="text-gray-600">Share your gallery link and let people discover your art</p>
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Home;