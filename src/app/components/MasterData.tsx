import { MasterDataContent } from "./MasterDataContent";

export function MasterData({ defaultTab = "samsat" }: { defaultTab?: string }) {
  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      <MasterDataContent tab={defaultTab} />
    </div>
  );
}

