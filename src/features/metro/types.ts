import type { mtrDirection, mtrLine } from '@/features/metro/utils'

export type MtrDirection = keyof typeof mtrDirection

export type MtrLine = keyof typeof mtrLine

export type MtrStationCode =
  | 'ADM'
  | 'AIR'
  | 'AUS'
  | 'AWE'
  | 'CAB'
  | 'CEN'
  | 'CHH'
  | 'CHW'
  | 'CIO'
  | 'CKT'
  | 'CSW'
  | 'DIH'
  | 'DIS'
  | 'ETS'
  | 'EXC'
  | 'FAN'
  | 'FOH'
  | 'FOT'
  | 'HAH'
  | 'HEO'
  | 'HFC'
  | 'HIK'
  | 'HKU'
  | 'HOK'
  | 'HOM'
  | 'HUH'
  | 'JOR'
  | 'KAT'
  | 'KET'
  | 'KOB'
  | 'KOT'
  | 'KOW'
  | 'KSR'
  | 'KWF'
  | 'KWH'
  | 'KWT'
  | 'LAK'
  | 'LAT'
  | 'LCK'
  | 'LET'
  | 'LHP'
  | 'LMC'
  | 'LOF'
  | 'LOP'
  | 'LOW'
  | 'MEF'
  | 'MKK'
  | 'MOK'
  | 'MOS'
  | 'NAC'
  | 'NOP'
  | 'NTK'
  | 'OCP'
  | 'OLY'
  | 'POA'
  | 'PRE'
  | 'QUB'
  | 'RAC'
  | 'SHM'
  | 'SHS'
  | 'SHT'
  | 'SHW'
  | 'SIH'
  | 'SKM'
  | 'SKW'
  | 'SOH'
  | 'SSP'
  | 'STW'
  | 'SUN'
  | 'SUW'
  | 'SWH'
  | 'SYP'
  | 'TAK'
  | 'TAP'
  | 'TAW'
  | 'TIH'
  | 'TIK'
  | 'TIS'
  | 'TKO'
  | 'TKW'
  | 'TSH'
  | 'TST'
  | 'TSW'
  | 'TSY'
  | 'TUC'
  | 'TUM'
  | 'TWH'
  | 'TWO'
  | 'UNI'
  | 'WAC'
  | 'WCH'
  | 'WHA'
  | 'WKS'
  | 'WTS'
  | 'YAT'
  | 'YMT'
  | 'YUL'

export interface MtrStation {
  code: MtrStationCode
  name_tc: string
  seq: number
}

export interface MtrLineData {
  DT: MtrStation[]
  UT: MtrStation[]
  'LMC-DT'?: MtrStation[]
  'LMC-UT'?: MtrStation[]
  'TKS-DT'?: MtrStation[]
  'TKS-UT'?: MtrStation[]
}

export type MtrLinesAndStations = Record<MtrLine, MtrLineData>

export interface TrainSchedule {
  ttnt: string
  valid: string
  plat: string
  time: string
  source: string
  dest: string
  seq: string
  timetype?: 'A' | 'D'
  route?: '' | 'RAC'
}

export interface StationData {
  curr_time: string
  sys_time: string
  UP?: TrainSchedule[]
  DOWN?: TrainSchedule[]
}

export interface MtrSuccessResponse {
  status: 1
  message: string
  sys_time: string
  curr_time: string
  data: Record<string, StationData>
  isdelay?: string
}

export interface MtrAlertResponse {
  status: 0
  message: string
  url?: string
  cur_time?: string
}

export type MtrResponse = MtrSuccessResponse | MtrAlertResponse
