import { supabaseClient } from "@/utils/supabaseClient";

export const getUserType = async (
  userId: string,
  token: string
): Promise<"mechanic" | null> => {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("users")
    .select("type")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user type:", error.message);
    return null;
  }

  return (data?.type as "mechanic" | null) ?? null;
};
