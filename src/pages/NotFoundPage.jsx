import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function NotFoundPage() {
  return (
    <div className="container-custom py-20 min-h-[70vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-6">
          <span className="inline-block text-8xl font-bold text-primary-500">404</span>
        </div>
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link to="/" className="btn btn-outline">
            Explore Countries
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;