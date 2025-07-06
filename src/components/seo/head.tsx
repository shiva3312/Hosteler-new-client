//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Helmet, HelmetData } from 'react-helmet-async';

type HeadProps = {
  title?: string;
  description?: string;
};

const helmetData = new HelmetData({});

export const Head = ({ title = '', description = '' }: HeadProps = {}) => {
  return (
    <Helmet
      helmetData={helmetData}
      title={title ? `${title} | Starter React` : undefined}
      defaultTitle="Starter React"
    >
      <meta name="description" content={description} />
    </Helmet>
  );
};
