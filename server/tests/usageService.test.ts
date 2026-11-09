import { beforeEach, describe, expect, it } from "vitest";
import { AppError } from "../src/lib/errors.js";
import {
  consumeVideoLoad,
  resetUsageForTests,
} from "../src/services/usageService.js";

describe("daily usage limits", () => {
  beforeEach(() => resetUsageForTests());

  it("allows three unique videos and rejects the fourth for Free", () => {
    const identity = "usage-test";
    consumeVideoLoad(identity, "free", "M7lc1UVf-VE");
    consumeVideoLoad(identity, "free", "Ks-_Mh1QhMc");
    const third = consumeVideoLoad(identity, "free", "jNQXAC9IVRw");

    expect(third.remaining).toBe(0);
    expect(() =>
      consumeVideoLoad(identity, "free", "dQw4w9WgXcQ"),
    ).toThrowError(AppError);
  });

  it("does not charge duplicate video loads", () => {
    const first = consumeVideoLoad("duplicate-test", "free", "M7lc1UVf-VE");
    const duplicate = consumeVideoLoad(
      "duplicate-test",
      "free",
      "M7lc1UVf-VE",
    );
    expect(first.used).toBe(1);
    expect(duplicate.used).toBe(1);
  });

  it("resets on a new UTC day and keeps Pro unlimited", () => {
    const dayOne = new Date("2026-01-01T12:00:00.000Z");
    const dayTwo = new Date("2026-01-02T01:00:00.000Z");
    consumeVideoLoad("reset-test", "free", "M7lc1UVf-VE", dayOne);
    const reset = consumeVideoLoad("reset-test", "free", "Ks-_Mh1QhMc", dayTwo);
    const pro = consumeVideoLoad("pro-test", "pro", "M7lc1UVf-VE", dayOne);

    expect(reset.used).toBe(1);
    expect(pro.limit).toBeNull();
    expect(pro.remaining).toBeNull();
  });
});
