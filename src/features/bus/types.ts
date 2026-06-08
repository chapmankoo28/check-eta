// Shared envelope

export interface ApiResponse<T> {
  type: string
  version: string
  generated_timestamp: string
  data: T
}

export interface ApiError {
  code: string
  message: string
}

// Citybus

export interface CtbCompany {
  co: string
  name_tc: string
  name_en: string
  name_sc: string
  url: string
  data_timestamp: string
}

export type CtbCompanyResponse = ApiResponse<CtbCompany>

export interface CtbRoute {
  co: string
  route: string
  orig_en: string
  orig_tc: string
  orig_sc: string
  dest_en: string
  dest_tc: string
  dest_sc: string
  data_timestamp: string
}

export type CtbRouteResponse = ApiResponse<CtbRoute>

export interface CtbStop {
  stop: string
  name_en: string
  name_tc: string
  name_sc: string
  lat: number
  long: number
  data_timestamp: string
}

export type CtbStopResponse = ApiResponse<CtbStop>

export interface CtbRouteStop {
  co: string
  route: string
  dir: 'I' | 'O'
  seq: number
  stop: string
  data_timestamp: string
}

export type CTBRouteStopResponse = ApiResponse<CtbRouteStop[]>

export interface CtbEta {
  co: string
  route: string
  dir: 'I' | 'O'
  seq: number
  stop: string
  dest_tc: string
  dest_sc: string
  dest_en: string
  eta_seq: number
  eta: string
  rmk_tc: string
  rmk_sc: string
  rmk_en: string
  data_timestamp: string
}

export type CTBETAResponse = ApiResponse<CtbEta[]>

// KMB

export interface KmbRoute {
  co: string
  route: string
  bound: 'I' | 'O'
  service_type: string
  orig_en: string
  orig_tc: string
  orig_sc: string
  dest_en: string
  dest_tc: string
  dest_sc: string
  data_timestamp: string
}

export type KmbRouteResponse = ApiResponse<KmbRoute>
export type KmbRouteListResponse = ApiResponse<KmbRoute[]>

export interface KmbStop {
  stop: string
  name_tc: string
  name_en: string
  name_sc: string
  lat: number | string
  long: number | string
  data_timestamp: string
}

export type KmbStopResponse = ApiResponse<KmbStop>
export type KmbStopListResponse = ApiResponse<KmbStop[]>

export interface KmbRouteStop {
  co: string
  route: string
  bound: 'I' | 'O'
  service_type: string
  seq: number
  stop: string
  data_timestamp: string
}

export type KmbRouteStopResponse = ApiResponse<KmbRouteStop[]>
export type KmbRouteStopListResponse = ApiResponse<KmbRouteStop[]>

export interface KmbEta {
  co: string
  route: string
  dir: 'I' | 'O'
  service_type: number
  seq: number
  stop: string
  dest_tc: string
  dest_sc: string
  dest_en: string
  eta_seq: number
  eta: string | null
  rmk_tc: string
  rmk_sc: string
  rmk_en: string
  data_timestamp: string
}

export type KmbETAResponse = ApiResponse<KmbEta[]>
export type KmbStopETAResponse = ApiResponse<KmbEta[]>
export type KmbRouteETAResponse = ApiResponse<KmbEta[]>
