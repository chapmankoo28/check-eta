import { useNavigate, useParams } from "@tanstack/react-router";
import { SwapBoundButton } from "@/components/SwapBoundButton";
import type { BusCo, RouteListEntry } from "@/features/bus/types";
import { busCoBg, getBusCompanyCode } from "@/features/bus/utils";
import { cn } from "@/lib/utils";

export default function BusRouteInfo({ co, nowRoute }: { co: BusCo; nowRoute: RouteListEntry }) {
  const params = useParams({ from: "/bus/$co/$route/$bound/$service" });
  const navigate = useNavigate({ from: "/bus/$co/$route/$bound/$service" });

  const coCode = getBusCompanyCode(co, nowRoute.route);

  return (
    <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-1 py-1">
      <div className="mr-1 flex items-center gap-1.5">
        <div className={cn("h-9 w-3", busCoBg[coCode])}></div>
        <span className="font-medium text-4xl sm:text-5xl">{nowRoute.route}</span>
      </div>
      <div className="flex flex-1 items-baseline justify-center text-center">
        <span className="text-3xl sm:text-4xl">
          <span className="mr-0.5 text-lg sm:text-2xl">往</span>
          {nowRoute.dest_tc}
        </span>
      </div>
      <SwapBoundButton
        className="shrink-0"
        handleSwapBound={() =>
          navigate({
            params: { ...params, bound: params.bound === "O" ? "I" : "O" },
            resetScroll: false,
            replace: true,
          })
        }
      />
    </div>
  );
}
