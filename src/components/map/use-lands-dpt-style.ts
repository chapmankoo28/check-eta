import { useQuery } from '@tanstack/react-query'
import type { StyleSpecification } from 'maplibre-gl'

const BASEMAP_STYLE_URL =
  'https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/basemap/WGS84/resources/styles/root.json'
const LABEL_STYLE_URL =
  'https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/label/hk/tc/WGS84/resources/styles/root.json'

interface FetchedStyle {
  version: number
  sprite: string
  glyphs: string
  sources: Record<string, { type: string; url: string; [key: string]: unknown }>
  layers: Record<string, unknown>[]
}

function resolveGlyphs(glyphs: string, styleUrl: string): string {
  const baseDir = new URL('.', styleUrl).href
  const resourcesDir = new URL('..', baseDir).href
  return resourcesDir + glyphs.replace(/^\.\.\//, '')
}

function processSource(
  source: { type: string; url: string; maxzoom?: number; [key: string]: unknown },
  styleUrl: string
) {
  const { url, maxzoom, ...rest } = source
  const resolved = new URL(url, styleUrl).href
  const tiles = [`${resolved.replace(/\/$/, '')}/tile/{z}/{y}/{x}.pbf`]

  // CSDI's WGS84 tiles cap at 15 despite style JSON reporting 19;
  // forcing 'maxzoom: 15' to avoid 204
  return {
    ...rest,
    tiles,
    type: 'vector' as const,
    maxzoom: 15,
  }
}

function useLandsDStyle() {
  return useQuery({
    queryKey: ['landsd-style'],
    queryFn: async () => {
      const [basemapResp, labelResp] = await Promise.all([
        fetch(BASEMAP_STYLE_URL),
        fetch(LABEL_STYLE_URL),
      ])
      const basemap = (await basemapResp.json()) as FetchedStyle
      const label = (await labelResp.json()) as FetchedStyle

      const basemapSource = processSource(basemap.sources.esri, BASEMAP_STYLE_URL)
      const labelSource = processSource(label.sources.esri, LABEL_STYLE_URL)

      const resolvedGlyphs = resolveGlyphs(label.glyphs, LABEL_STYLE_URL)

      const labelLayers = label.layers.map((layer) => ({
        ...layer,
        source: 'esri-labels',
      }))

      return {
        version: 8,
        sprite: new URL(basemap.sprite, BASEMAP_STYLE_URL).href,
        glyphs: resolvedGlyphs,
        sources: {
          esri: basemapSource,
          'esri-labels': labelSource,
        },
        layers: [...basemap.layers, ...labelLayers],
      } as unknown as StyleSpecification
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
  })
}

export { BASEMAP_STYLE_URL, LABEL_STYLE_URL, useLandsDStyle }
