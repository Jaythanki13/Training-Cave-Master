import { useEffect } from 'react';

const BASE_URL = 'https://training-cave-master.vercel.app';
const DEFAULT_DESC = 'A secure platform where expert trainers share knowledge and learners access premium training materials. Browse 7+ categories, download, rate, and bookmark — free for everyone.';

const SEO = ({ title, description, path = '' }) => {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | Training Cave`
      : 'Training Cave — Your Central Hub for Training Excellence';
    const fullDesc = description || DEFAULT_DESC;
    const fullUrl = `${BASE_URL}${path}`;

    document.title = fullTitle;

    const setMeta = (selector, content, attr = 'content') => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, content);
    };

    setMeta('meta[name="description"]', fullDesc);
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', fullDesc);
    setMeta('meta[property="og:url"]', fullUrl);
    setMeta('meta[name="twitter:title"]', fullTitle);
    setMeta('meta[name="twitter:description"]', fullDesc);
    setMeta('link[rel="canonical"]', fullUrl, 'href');
  }, [title, description, path]);

  return null;
};

export default SEO;
