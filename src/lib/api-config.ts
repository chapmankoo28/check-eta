import type { ApiConfig, ApiConfigEntry } from '@/lib/types';
import apiConfigJson from '@/res/json/apiConfig.json';

const apiConfig: ApiConfig = apiConfigJson;

export function getApiConfig(co: string): ApiConfigEntry | undefined {
  return apiConfig.data[co.toUpperCase()];
}
