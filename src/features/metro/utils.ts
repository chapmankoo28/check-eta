import type { MtrDirection, MtrLine, MtrLineData, MtrStationCode } from '@/features/metro/types'
import allMtrData from '@/res/json/mtr_lines_and_stations.json'

export const mtrLineName = {
  en: {
    AEL: 'Airport Express',
    DRL: 'Disneyland Resort Line',
    EAL: 'East Rail Line',
    ISL: 'Island Line',
    KTL: 'Kwun Tong Line',
    SIL: 'South Island Line',
    TCL: 'Tung Chung Line',
    TKL: 'Tseung Kwan O Line',
    TML: 'Tuen Ma Line',
    TWL: 'Tsuen Wan Line',
  },
  'zh-hant': {
    AEL: '機場快綫',
    DRL: '迪士尼綫',
    EAL: '東鐵綫',
    ISL: '港島綫',
    KTL: '觀塘綫',
    SIL: '南港島綫',
    TCL: '東涌綫',
    TKL: '將軍澳綫',
    TML: '屯馬綫',
    TWL: '荃灣綫',
  },
} as const

export const mtrLineBg = {
  AEL: 'bg-ael text-white',
  DRL: 'bg-drl text-white',
  EAL: 'bg-eal text-black',
  ISL: 'bg-isl text-white',
  KTL: 'bg-ktl text-white',
  SIL: 'bg-sil text-black',
  TCL: 'bg-tcl text-black',
  TKL: 'bg-tkl text-white',
  TML: 'bg-tml text-white',
  TWL: 'bg-twl text-white',
} as const

export const mtrLineBorder = {
  AEL: 'border-ael',
  DRL: 'border-drl',
  EAL: 'border-eal',
  ISL: 'border-isl',
  KTL: 'border-ktl',
  SIL: 'border-sil',
  TCL: 'border-tcl',
  TKL: 'border-tkl',
  TML: 'border-tml',
  TWL: 'border-twl',
} as const

export const mtrDirection = {
  DT: 'DOWN',
  UT: 'UP',
  'LMC-DT': 'DOWN',
  'LMC-UT': 'UP',
  'TKS-DT': 'DOWN',
  'TKS-UT': 'UP',
} as const

export const mtrLine = {
  AEL: 'AEL',
  TCL: 'TCL',
  TML: 'TML',
  TKL: 'TKL',
  EAL: 'EAL',
  SIL: 'SIL',
  TWL: 'TWL',
  ISL: 'ISL',
  KTL: 'KTL',
  DRL: 'DRL',
} as const

export function getStationName({
  line,
  dir,
  station,
}: {
  line: MtrLine
  dir: MtrDirection
  station: MtrStationCode
}) {
  const stations = getStations({ line, dir })
  const name = stations.find((i) => i.code === station)?.name_tc
  return name ?? 'NOT FOUND'
}

export function getStations({ line, dir }: { line: MtrLine; dir: MtrDirection }) {
  const found = allMtrData.data[line] as MtrLineData | undefined
  if (!found) {
    return []
  }
  const dirData = found[dir as MtrDirection] ?? []

  if (line === 'EAL') {
    if (dir === 'DT') {
      const lmcStation = found['LMC-DT']?.find((s) => s.code === 'LMC')
      return lmcStation ? [lmcStation, ...dirData] : dirData
    } else if (dir === 'UT') {
      const lmcStation = found['LMC-UT']?.find((s) => s.code === 'LMC')
      return lmcStation ? [...dirData, lmcStation] : dirData
    }
  }

  return dirData
}
