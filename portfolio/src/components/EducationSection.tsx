import React from 'react';
import { motion } from 'framer-motion';

export const EducationSection = () => {
  return (
    <section id="education" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Education & Certifications
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Continuous learning and skill development in technology and business
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-8"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Bachelor of Technology</h3>
              <p className="text-xl text-primary-600 font-semibold">Computer Science & Engineering</p>
              <p className="text-gray-600 mt-2">Jaypee University of Information Technology</p>
              <p className="text-gray-500 mt-1">2021 - 2025 (Expected)</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Relevant Coursework:</h4>
              <div className="flex flex-wrap gap-2">
                {['Data Structures', 'Web Development', 'Database Systems', 'Software Engineering', 'Machine Learning'].map((course) => (
                  <span
                    key={course}
                    className="px-3 py-1 bg-white/70 text-gray-700 rounded-full text-sm"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Data Science Certificate</h3>
              <p className="text-xl text-purple-600 font-semibold">Cisco Networking Academy</p>
              <p className="text-gray-600 mt-2">Professional Certification</p>
              <p className="text-gray-500 mt-1">2023</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Skills Acquired:</h4>
              <div className="flex flex-wrap gap-2">
                {['Python', 'Data Analysis', 'Statistical Modeling', 'Data Visualization', 'Machine Learning'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-white/70 text-gray-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <h4 className="text-xl font-semibold text-gray-900 mb-6">Additional Learning</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Google Analytics Certified',
              'React Development',
              'SEO Fundamentals',
              'Digital Marketing',
              'TypeScript',
              'Node.js'
            ].map((cert) => (
              <span
                key={cert}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium"
              >
                {cert}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};