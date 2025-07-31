import apiConfig from '@/res/json/api_config.json';

export const getEta = async (co, route, service, stop) => {
  try {
    const api = apiConfig.data.find((item) => item.co.toLowerCase() === co.toLowerCase());

    const url =
      api['base_url'] + api['api']['eta'] + stop.toUpperCase() + '/' + route.toUpperCase() + '/';
    const s = co.toLowerCase() === 'kmb' ? service : '';

    const response = await fetch(url + s);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('ERROR: fetching stop data. Info:', error);
  }
};

export const getStopList = async (co, route, bound, service, abortSignal) => {
  // if (Object.keys(get_route_info(co, route, bound, service) ?? {}).length === 0) return [];
  try {
    if (abortSignal) {
      const api = apiConfig.data.find((item) => item.co.toLowerCase() === co.toLowerCase());

      const b = bound.toLowerCase() === 'o' ? 'outbound' : 'inbound';
      const url = api['base_url'] + api['api']['route-stop'] + route.toUpperCase() + `/${b}/`;
      const s = co.toLowerCase() === 'kmb' ? service : '';

      const response = await fetch(url + s);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data;
    }
  } catch (error) {
    console.error('ERROR: fetching stop data. Info:', error);
  }
  return [];
};

export const getStopData = async (co, stopID, abortSignal) => {
  if (!co || !stopID) return '';
  try {
    if (abortSignal) {
      const api = apiConfig.data.find((item) => item.co.toUpperCase() === co.toUpperCase()) ?? {};
      const url = api.base_url + api['api']['stop'] + stopID.toUpperCase();
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data;
    }
  } catch (error) {
    console.error('ERROR: fetching stop name. Info:', error);
  }
  return '';
};
