import { formatFileSize } from "@/helpers/format";

type DiskUsageProps = {
  usage?: DiskUsage;
};
export default function DiskUsage({ usage }: DiskUsageProps) {
  const sum = Object.values(usage ?? {}).reduce((sum, value) => sum + value, 0);
  return (
    <>
      {usage && (
        <div className="text-center">
          <div className="flex h-2 bg-el1">
            <Usage label="Roms" percentage={usage.roms / sum} className="bg-el2Accent" />
            <Usage label="States" percentage={usage.states / sum} className="bg-redColor" />
          </div>

          <span className="text-sm text-whiteColorAccent">{formatFileSize(sum)}</span>
        </div>
      )}
    </>
  );
}

type UsageProps = {
  label: string;
  percentage: number;
  className: string;
};
function Usage({ label, percentage, className }: UsageProps) {
  return (
    <div
      style={{ width: percentage * 100 + "%" }}
      className={"group rounded-md relative h-2 " + className}
    >
      <div className="absolute top-0 right-1/2 translate-y-[-100%] translate-x-[50%] pb-2 group-hover:scale-100 scale-0 z-[15]">
        <div className="absolute bottom-1 left-1/2 h-2 w-2 translate-x-[-50%] rounded-sm rotate-45 bg-el1Accent" />
        <div className="rounded text-sm px-1.5 whitespace-pre bg-el1Accent">{label}</div>
      </div>
    </div>
  );
}
