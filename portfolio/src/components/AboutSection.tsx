import React from 'react';
import { motion } from 'framer-motion';

export const AboutSection = () => {
  const skills = [
    { name: 'React/Next.js', level: 90 },
    { name: 'TypeScript', level: 85 },
    { name: 'SEO & Analytics', level: 95 },
    { name: 'Tailwind CSS', level: 90 },
    { name: 'Data Science', level: 80 },
    { name: 'Digital Marketing', level: 90 }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Me
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Passionate about creating meaningful digital experiences through code and strategic thinking
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              I'm a B.Tech CSE student at Jaypee University with a unique passion for blending 
              technology with marketing strategy. My journey spans frontend development, SEO optimization, 
              and data-driven marketing approaches.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Currently working as a Marketing Specialist at SGCA Technologies, I've discovered 
              the powerful intersection between technical skills and business growth. I believe 
              in creating digital solutions that not only function beautifully but also drive 
              meaningful results.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              {['Frontend Development', 'SEO Strategy', 'Data Analytics', 'Digital Marketing', 'UI/UX Design'].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Skills & Expertise</h3>
            
            {skills.map((skill, index) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between text-sm font-medium text-gray-700">
                  <span>{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};