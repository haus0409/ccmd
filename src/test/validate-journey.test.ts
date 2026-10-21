import { describe, expect, it } from "vitest";
import { validateJourney } from "@/components/comic/ComicEditor";
import { sampleJourneys } from "@/data/sampleJourneys";

const base = sampleJourneys[0];

describe("validateJourney", () => {
  it("requires a title even for drafts", () => {
    expect(validateJourney({ ...base, title: " " }, false)).toHaveLength(1);
  });
  it("draft without description is allowed", () => {
    expect(validateJourney({ ...base, description: "" }, false)).toEqual([]);
  });
  it("publishing requires description and at least one chapter", () => {
    expect(validateJourney({ ...base, description: "", chapters: [] }, true)).toHaveLength(2);
  });
});
