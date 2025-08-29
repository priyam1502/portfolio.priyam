import React from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon } from '@heroicons/react/24/outline';

export const ExperienceSection = () => {
  const experiences = [
    {
      title: "Marketing Specialist",
      company: "SGCA Technologies",
      period: "2023 - Present",
      location: "Remote",
      description: [
        "Implemented SEO strategies resulting in 150% increase in organic traffic",
        "Developed data-driven marketing campaigns with 40% higher conversion rates",
        "Created automated reporting systems reducing manual work by 60%",
        "Collaborated with development team to optimize website performance"
      ],
      skills: ["SEO", "Google Analytics", "Content Marketing", "Data Analysis"]
    }
  ];

  return (
    <section id="experience" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional journey combining technical skills with business impact
          </p>
        </motion.div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{exp.title}</h3>
                  <p className="text-xl text-primary-600 font-semibold">{exp.company}</p>
                </div>
                <div className="mt-4 lg:mt-0 text-right">
                  <p className="text-gray-600 font-medium">{exp.period}</p>
                  <p className="text-gray-500 flex items-center lg:justify-end">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    {exp.location}
                  </p>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {exp.description.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {exp.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};