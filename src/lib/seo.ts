export const SITE_URL = 'https://check-eta.chapman-2cb.workers.dev';
const SITE_NAME = '幾時到';
const DEFAULT_DESCRIPTION = '香港巴士同地鐡實時到站時間。';

type PageHeadOptions = {
  title?: string;
  description?: string;
  path?: string;
};

export const pageHead = ({ title, description, path }: PageHeadOptions = {}) => ({
  meta: [
    { title: title ? `${title} | ${SITE_NAME}` : SITE_NAME },
    { name: 'description', content: description ?? DEFAULT_DESCRIPTION },
  ],
  links: [{ rel: 'canonical', href: `${SITE_URL}${path ?? ''}` }],
});
