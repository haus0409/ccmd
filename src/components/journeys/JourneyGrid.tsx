import type { Journey } from "@/types/journey";
import { JourneyCard } from "./JourneyCard";

export function JourneyGrid({ journeys, empty = "Chưa có hành trình nào." }: { journeys: Journey[]; empty?: string }) {
  if (journeys.length === 0)
    return <div className="rounded-xl border border-dashed bg-card p-10 text-center text-muted-foreground">{empty}</div>;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {journeys.map((j) => (
        <JourneyCard key={j.id} journey={j} />
      ))}
    </div>
  );
}
