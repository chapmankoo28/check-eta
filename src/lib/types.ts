export type ApiConfig = {
  timestamp: string;
  data: Record<string, ApiConfigEntry>;
};

export type ApiConfigEntry = {
  co: string;
  baseUrl: string;
  api: {
    company?: string;
    route?: string;
    stop?: string;
    routeStop?: string;
    eta?: string;
    stopEta?: string;
    line?: string;
    sta?: string;
    lang?: string;
  };
};

export type MapLocation = {
  lat: number;
  long: number;
};
