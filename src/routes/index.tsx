import { createFileRoute } from "@tanstack/react-router";
import { TrafficWidget } from "@/components/TrafficWidget";
import { MapWidget } from "@/components/MapWidget";
import { GearPanel } from "@/components/GearPanel";
import { MediaCard } from "@/components/MediaCard";
import { ClimateCard } from "@/components/ClimateCard";
import { BrightnessCard } from "@/components/BrightnessCard";
import { StatusCard } from "@/components/StatusCard";
import { CockpitLayout } from "@/components/CockpitLayout";
import { useApp } from "@/lib/app-context";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const { musicExpanded, setMusicExpanded } = useApp();
  const toggleMusic = () => setMusicExpanded(!musicExpanded);

  return (
    <CockpitLayout
      leftTop={musicExpanded ? <MediaCard expanded onToggleExpand={toggleMusic} /> : <TrafficWidget className="h-full w-full" />}
      leftTopLarge={musicExpanded}
      leftMiddle={musicExpanded ? undefined : <MediaCard onToggleExpand={toggleMusic} />}
      leftBottom={musicExpanded ? undefined : <ClimateCard />}
      centerTop={<MapWidget className="h-full w-full" />}
      centerBottom={<BrightnessCard />}
      rightTop={<GearPanel />}
      rightBottom={<StatusCard />}
    />
  );
}

