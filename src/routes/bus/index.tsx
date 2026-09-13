import { createFileRoute } from "@tanstack/react-router";
import { BusRouteList } from "@/components/bus/BusRouteList";

export const Route = createFileRoute("/bus/")({
  component: Bus,
});

function Bus() {
  return (
    <>
      <div className="grid place-content-center p-5">
        <h1 className="font-bold text-3xl">巴士幾時到</h1>
      </div>
      <BusRouteList />
    </>
  );
}
