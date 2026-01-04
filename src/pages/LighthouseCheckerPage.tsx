import React from 'react';
import LighthouseScoreChecker from '../components/LighthouseScoreChecker';

const LighthouseCheckerPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Lighthouse PWA Score Checker</h1>
      <p className="mb-6 text-gray-700">
        This page allows you to check the Lighthouse PWA score of your application.
        You can run a simulated audit to see how well your PWA meets the standards and get suggestions for improvement.
      </p>
      
      <LighthouseScoreChecker />
    </div>
  );
};

export default LighthouseCheckerPage;
