import React from 'react';
import { motion } from 'framer-motion';
import { LinkedInIcon, GitHubIcon, TwitterIcon } from './SocialIcons';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              Priyam Jain
            </h3>
            <p className="text-gray-400 mt-2">Frontend Developer & Marketing Specialist</p>
          </div>
          
          <div className="flex space-x-6">
            <motion.a
              href="https://linkedin.com"
              whileHover={{ scale: 1.1 }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <LinkedInIcon className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="https://github.com"
              whileHover={{ scale: 1.1 }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <GitHubIcon className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="https://twitter.com"
              whileHover={{ scale: 1.1 }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <TwitterIcon className="w-6 h-6" />
            </motion.a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Priyam Jain. All rights reserved. Built with React & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
};