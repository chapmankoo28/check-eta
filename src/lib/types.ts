export type ApiConfigEntry = {
  co: string;
  baseUrl: string;
  api: {
    eta: string;
    routeStop: string;
    stop: string;
    stopEta?: string;
  };
};

export type MapLocation = {
  lat: number;
  long: number;
};
