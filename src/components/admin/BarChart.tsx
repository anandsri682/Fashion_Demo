export function BarChart({
  data,
  valueKey,
  labelKey,
  formatValue,
}: {
  data: Record<string, string | number>[];
  valueKey: string;
  labelKey: string;
  formatValue?: (v: number) => string;
}) {
  const max = Math.max(...data.map((d) => Number(d[valueKey])), 1);
  return (
    <div className="flex h-48 items-end gap-3">
      {data.map((d, i) => {
        const value = Number(d[valueKey]);
        const heightPct = Math.max((value / max) * 100, 4);
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-[10px] text-ash">{formatValue ? formatValue(value) : value}</span>
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full bg-ink transition-all"
                style={{ height: `${heightPct}%` }}
              />
            </div>
            <span className="text-[10px] uppercase text-ash">{d[labelKey]}</span>
          </div>
        );
      })}
    </div>
  );
}
