import React from 'react';
import ShopifyEnvironmentTester from '../components/ShopifyEnvironmentTester';

const ShopifyEnvironmentTesterPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopify Environment Testing</h1>
      <p className="mb-6 text-gray-700">
        This page allows you to test how the PWA behaves within a Shopify environment.
        You can simulate various Shopify-specific conditions and run tests to ensure compatibility.
      </p>
      
      <ShopifyEnvironmentTester />
    </div>
  );
};

export default ShopifyEnvironmentTesterPage;
