import z from "zod";

/* ------------------------ Validation Schema ------------------------ */
export const WorkTypeEnum = z.enum(["Repair", "Diagnostics", "Servicing", "MOT"]);

export const RepairSchema = z.object({
    // Step 1: Car
    regNumber: z
        .string()
        .regex(/^[A-Z]{3}-\d{3}[A-Z]{2}$/, "Invalid Nigerian plate (e.g., ABC-123DE)"),
    postcode: z.string().regex(/^\d{6}$/, "Must be a 6-digit Nigerian postal code"),
    make: z.string().min(1, "Car make is required"),
    model: z.string().min(1, "Car model is required"),
    year: z
        .string()
        .regex(/^\d{4}$/, "Year must be 4 digits")
        .refine(
            (y) => {
                const yr = Number(y);
                const current = new Date().getFullYear();
                return yr >= 1990 && yr <= current;
            },
            { message: "Enter a valid year (1990 - current)" }
        ),
    transmission: z.enum(["Manual", "Automatic", "CVT", "Other"], {
        message: "Select transmission",
    }),
    fuelType: z.enum(["Petrol", "Diesel", "Hybrid", "Electric", "Other"], {
        message: "Select fuel type",
    }),
    mileage: z
        .string()
        .regex(/^\d+$/, "Mileage must be numeric (km)")
        .optional(),

    // Step 2: Select work
    workTypes: z.array(WorkTypeEnum).min(1, "Select at least one work type"),

    // Step 3: Details
    fullName: z.string().min(2, "Name is required"),
    phone: z.string().regex(/^\d{11}$/, "Phone must be 11 digits"),
    email: z.string().email("Enter a valid email"),
    address1: z.string().min(3, "Address line 1 is required"),
    address2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    country: z.string().min(2, "Country is required"),
    problemDescription: z.string().min(10, "Please describe the problem"),
    // 🔹 NEW: availability with time ranges
    availability: z
        .array(
            z.object({
                date: z.date(),
                start: z.string().regex(/^\d{2}:\d{2}$/, "Start time is required"),
                end: z.string().regex(/^\d{2}:\d{2}$/, "End time is required"),
            })
                .refine(
                    (slot) => slot.start < slot.end,
                    { message: "End time must be after start time" }
                )
        )
        .min(1, "Select at least one availability slot"),
});

export type RepairForm = z.infer<typeof RepairSchema>;

/* ------------------------ Step Config ------------------------ */

export const CAR_FIELDS = [
    "regNumber",
    "postcode",
    "make",
    "model",
    "year",
    "transmission",
    "fuelType",
    "mileage",
] as const;

export const WORK_FIELDS = ["workTypes"] as const;

export const DETAILS_FIELDS = [
    "fullName",
    "phone",
    "email",
    "address1",
    "address2",
    "city",
    "state",
    "country",
    "problemDescription",
    "availability",
] as const;


// Mechanic Form Schema
// ✅ Zod schema for validation
export const mechanicFormSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(8, "Phone number is required"),
    postcode: z.string().min(3, "Postcode is required"),
    policeReport: z
        .any()
        .refine((file) => file && file.length > 0, "Police report is required")
        .refine(
            (file) => file && file[0]?.type === "application/pdf",
            "Only PDF files are allowed"
        ),
});

export type FormValues = z.infer<typeof mechanicFormSchema>;


export type Booking = {
    status: string;
    id: string;
    reg_number: string;
    make: string;
    model: string;
    year: number;
    work_types: string[];
    full_name: string;
    phone: string;
    problem_description: string;
    created_at: string;
    availability: string;
    address1:string;
    city:string;
    state: string;
    country:string;
    transmission:string;
    fuelType:string;
    mileage:string;
    mechanic_id: string;
};
