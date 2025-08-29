import { useEffect } from "react";
import { subscribeToRepairs } from "@/realtime/repairs";

// export const useRepairsRealtime = (
//   token: string,
//   userId: string,
//   setBookings: React.Dispatch<React.SetStateAction<any[]>>
// ) => {
//   useEffect(() => {
//     if (!token || !userId) return;

//     let channel: any;

//     const init = async () => {
//       channel = await subscribeToRepairs(token, userId, (payload) => {
//         if (payload.eventType === "INSERT") {
//           setBookings((prev) => [payload.new, ...prev]);
//         } else if (payload.eventType === "UPDATE") {
//           setBookings((prev) =>
//             prev.map((r) => (r.id === payload.new.id ? payload.new : r))
//           );
//         } else if (payload.eventType === "DELETE") {
//           setBookings((prev) => prev.filter((r) => r.id !== payload.old.id));
//         }
//       });
//     };

//     init();

//     return () => {
//       channel?.unsubscribe();
//     };
//   }, [token, userId, setBookings]);
// };
