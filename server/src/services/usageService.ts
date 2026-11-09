import type { SubscriptionPlan, UsageLimits } from "@linguatube/shared";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";

interface DailyUsage {
  dateKey: string;
  videoIds: Set<string>;
}

const usageByIdentity = new Map<string, DailyUsage>();

const getDateKey = (date: Date) => date.toISOString().slice(0, 10);

const getResetTime = (date: Date) => {
  const reset = new Date(date);
  reset.setUTCHours(24, 0, 0, 0);
  return reset.toISOString();
};

const getEntry = (identityId: string, now: Date): DailyUsage => {
  const dateKey = getDateKey(now);
  const current = usageByIdentity.get(identityId);

  if (current?.dateKey === dateKey) {
    return current;
  }

  const next = { dateKey, videoIds: new Set<string>() };
  usageByIdentity.set(identityId, next);
  return next;
};

export const getUsageLimits = (
  identityId: string,
  plan: SubscriptionPlan,
  now = new Date(),
): UsageLimits => {
  const entry = getEntry(identityId, now);
  const used = entry.videoIds.size;

  if (plan === "pro") {
    return {
      plan,
      used,
      limit: null,
      remaining: null,
      resetsAt: getResetTime(now),
    };
  }

  return {
    plan,
    used,
    limit: env.FREE_DAILY_VIDEO_LIMIT,
    remaining: Math.max(0, env.FREE_DAILY_VIDEO_LIMIT - used),
    resetsAt: getResetTime(now),
  };
};

export const consumeVideoLoad = (
  identityId: string,
  plan: SubscriptionPlan,
  videoId: string,
  now = new Date(),
): UsageLimits => {
  const entry = getEntry(identityId, now);

  if (entry.videoIds.has(videoId)) {
    return getUsageLimits(identityId, plan, now);
  }

  if (plan === "free" && entry.videoIds.size >= env.FREE_DAILY_VIDEO_LIMIT) {
    throw new AppError(
      429,
      "DAILY_LIMIT_REACHED",
      `Free accounts can load ${env.FREE_DAILY_VIDEO_LIMIT} videos per day. Upgrade to Pro for unlimited video loads.`,
      getUsageLimits(identityId, plan, now),
    );
  }

  entry.videoIds.add(videoId);
  return getUsageLimits(identityId, plan, now);
};

export const resetUsageForTests = () => usageByIdentity.clear();
