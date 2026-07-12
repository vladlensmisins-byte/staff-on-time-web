import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type StoredPushSubscription = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export async function savePushSubscription(
  subscription: StoredPushSubscription,
  userAgent?: string,
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      endpoint: subscription.endpoint,
      p256dh: subscription.p256dh,
      auth: subscription.auth,
      user_agent: userAgent ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "endpoint" },
  );

  if (error) throw new Error(error.message);
}

export async function getAllPushSubscriptions(): Promise<StoredPushSubscription[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint,p256dh,auth")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    endpoint: String(row.endpoint),
    p256dh: String(row.p256dh),
    auth: String(row.auth),
  }));
}

export async function removePushSubscription(endpoint: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
  if (error) throw new Error(error.message);
}

export async function countPushSubscriptions(): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { count, error } = await supabase
    .from("push_subscriptions")
    .select("*", { count: "exact", head: true });

  if (error) throw new Error(error.message);
  return count ?? 0;
}
