export async function isCommunityAdmin(supabaseClient, userId) {
  if (!userId) return false;
  const { data, error } = await supabaseClient
    .from("app_admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("[community-admin] check", error);
    return false;
  }
  return Boolean(data?.user_id);
}
