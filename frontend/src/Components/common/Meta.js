import React from 'react';
import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome To Luxe Cosmetics',
  description: 'Premium beauty products for your skincare routine',
  keywords: 'cosmetics, beauty, skincare, makeup, luxury',
};

export default Meta;