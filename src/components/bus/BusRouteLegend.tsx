import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function BusRouteLegend() {
  return (
    <div className="my-5 flex w-full flex-col items-center">
      <Card className="w-full border border-border shadow-none ring-0">
        <CardHeader>
          <CardTitle className="text-center">路線顏色說明</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-1.5">
            <div className="h-9 w-3 bg-kmb"></div>
            <span className="text-xl font-medium">九巴路線</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-9 w-3 bg-lwb"></div>
            <span className="text-xl font-medium">龍運路線</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-9 w-3 bg-ctb"></div>
            <span className="text-xl font-medium">城巴路線</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
