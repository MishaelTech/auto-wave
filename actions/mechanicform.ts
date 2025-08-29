import { FormValues } from "@/types";
import { supabaseClient } from "@/utils/supabaseClient";

export const getMechanicDetails = async ({userId, token}: {userId: string; token: string}) => {
    const supabase = await supabaseClient(token);
    const { data, error } = await supabase
      .from("apply_to_be_a_mechanic")
      .select("*")
      .eq("user_id", userId)
  
    if (error) {
      console.error("Error fetching mechanics:", error);
      throw error;
    }
  
    return data;
};

// INSERT REPAIRS
export const addMechanics = async (userId: string, token: string, formData: FormValues) => {
  
    const supabase = await supabaseClient(token);
     // Upload police report PDF
    const file = formData.policeReport[0];
    const filePath = `${userId}/reports/${formData.firstName}/${Date.now()}-${file.name}`;

    const { data:page, error: uploadError } = await supabase.storage
    .from("police-reports")
    .upload(filePath, file);

    if (uploadError) throw uploadError;
  
    const { data, error } = await supabase
      .from("apply_to_be_a_mechanic")
      .insert([
         {
      user_id: userId, // Clerk ID
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      postcode: formData.postcode,
      police_report: filePath, // store path
      address: formData.address,
    },
      ])
      .select();
  
    if (error) {
      console.error("Error inserting a mechanic:", error);
      console.log("inserting a mechanic:", error);
      throw error;
    }
  
    return data;
}

export const getRepairsForMechanic = async (token: string) => {
    const supabase = await supabaseClient(token);
    const { data, error } = await supabase
      .from("repairs")
      .select("*")
      .order("created_at", { ascending: false });
  
    if (error) {
      console.error("Error fetching repairs:", error);
      throw error;
    }
  
    return data;
};

export const updateRepairStatus = async (
  token: string,
  repairId: string,
  status: "pending" | "accepted" | "completed"
) => {
  const supabase = await supabaseClient(token);

  const { error } = await supabase
    .from("repairs")
    .update({ status })
    .eq("id", repairId);

  if (error) {
    console.error("Error updating repair:", error);
    throw error;
  }

  return true;
};

export const getMechanicByMechanicId = async (mechanicId: string, token: string) => {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("apply_to_be_a_mechanic")
    .select(`
      postcode,
      phone,
      police_report,
      address,
      user: users!fk_user (
        id,
        first_name,
        last_name,
        email,
        avatar_url
      )
    `)
    .eq("user_id", mechanicId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching mechanic:", error);
    throw error;
  }

  if (!data) return null;

  return {
    ...data.user,
    postcode: data.postcode,
    phone: data.phone,
    police_report: data.police_report,
    address: data.address,
  };
};




// export const getMechanicByMechanicId = async (mechanicId: string, token: string) => {
//   const supabase = await supabaseClient(token);

//   const { data, error } = await supabase
//     .from("repairs")
//     .select(`
//       *,
//       mechanic_id (
//         id,
//         first_name,
//         last_name,
//         email,
//         avatar_url,
//         mechanic_application (
//           postcode,
//           phone,
//           police_report
//         )
//       )
//     `)
//     .eq("mechanic_id", mechanicId)
//     .single();

//   if (error) {
//     console.error("Error fetching mechanic by ID:", error);
//     throw error;
//   }

//   // `mechanic_id` now contains user info and nested application info
//   return data?.mechanic_id;
// };



export const getRepairsById = async (bookingId: string, token: string) => {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("repairs")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (error) {
    console.error("Error fetching booking by ID:", error);
    throw error;
  }

  return data;
}

