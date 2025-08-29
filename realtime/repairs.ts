import { supabaseClient } from "@/utils/supabaseClient";

export const subscribeToRepairs = async (
  token: string,
  callback: (payload: any) => void
) => {
  const supabase = await supabaseClient(token);

  // Subscribe to INSERT + UPDATE + DELETE on repairs
  const channel = supabase
    .channel("repairs-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "repairs" },
      (payload) => {
        console.log("Realtime update:", payload);
        callback(payload);
      }
    )
    .subscribe();

  return channel;
};


// export const subscribeToRepairs = async (
//   token: string,
//   userId: string,
//   onChange: (payload: any) => void
// ) => {
//   const supabase = await supabaseClient(token);

//   const channel = supabase
//     .channel(`repairs-changes-${userId}`)
//     .on(
//       "postgres_changes",
//       {
//         event: "*",
//         schema: "public",
//         table: "repairs",
//         filter: `mechanic_id=eq.${userId}`, // mechanic-specific
//       },
//       onChange
//     )
//     .on(
//       "postgres_changes",
//       {
//         event: "*",
//         schema: "public",
//         table: "repairs",
//         filter: "mechanic_id=is.null", // unassigned jobs
//       },
//       onChange
//     )
//     .subscribe();

//   return channel;
// };
