import { FormValues } from "@/types";
import { supabaseClient } from "./supabaseClient";

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