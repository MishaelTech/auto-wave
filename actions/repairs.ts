import { Booking, RepairForm } from "@/types";
import { supabaseClient } from "@/utils/supabaseClient";

export const getRepairs = async (userId: string, token: string, ) => {
    const supabase = await supabaseClient(token);
    const { data, error } = await supabase
      .from("repairs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  
    if (error) {
      console.error("Error fetching repairs:", error);
      throw error;
    }
  
    return data;
};

// INSERT REPAIRS
export const insertRepair = async (userId: string, token: string, formData: RepairForm) => {
    const supabase = await supabaseClient(token);
    const { data, error } = await supabase
      .from("repairs")
      .insert([
         {
      user_id: userId, 
      reg_number: formData.regNumber,
      postcode: formData.postcode,
      make: formData.make,
      model: formData.model,
      year: Number(formData.year),
      transmission: formData.transmission,
      fuel_type: formData.fuelType,
      mileage: formData.mileage ? Number(formData.mileage) : null,
      work_types: formData.workTypes,
      full_name: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      address1: formData.address1,
      address2: formData.address2,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      problem_description: formData.problemDescription,
      availability: formData.availability.map(a => ({
        ...a,
        date: typeof a.date === "string" ? a.date : a.date.toISOString(),
      })),
    },
      ])
      .select();
  
    if (error) {
      console.error("Error inserting repair:", error);
      throw error;
    }
  
    return data;
};

// Update repair
export const updateRepair = async (
  userId: string,
  token: string,
  id: string,
  formData: Partial<Booking>
) => {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("repairs")
    .update({
      full_name: formData.full_name,
      phone: formData.phone,
      problem_description: formData.problem_description,
      year: formData.year ? Number(formData.year) : null, // ✅ fix typing mismatch
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select();

  if (error) {
    console.error("Error updating repair:", error);
    throw error;
  }

  return data;
};

//  Delete repair
export const deleteRepair = async (id: string, userId: string, token: string) => {
  const supabase = await supabaseClient(token);
  const { error } = await supabase.from("repairs").delete().eq("id", id).eq("user_id", userId);

  if (error) {
    console.error("Error deleting repair:", error);
    throw error;
  }

  return true;
};

export const addMechanicToRepair = async (repairId: string, mechanicId: string, token: string) => {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("repairs")
    .update({ status: "accepted", mechanic_id: mechanicId, mechanic_application: mechanicId })
    .eq("id", repairId)
    .select();

  if (error) {
    console.error("Error assigning mechanic to repair:", error);
    throw error;
  }

  return data;
}