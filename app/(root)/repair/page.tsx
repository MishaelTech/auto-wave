"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CAR_FIELDS, DETAILS_FIELDS, RepairForm, RepairSchema, WORK_FIELDS } from "@/types";
import Link from "next/link";
import { insertRepair } from "@/actions/repairs";
import { toast } from "sonner";
import { useAuth, useUser } from "@clerk/nextjs";

const steps = ["Car", "Select work", "Details", "Booking"] as const;

const Repairs = ({
    searchParams,
}: {
    searchParams: Record<string, string | string[] | undefined>;
}) => {
    const { userId, getToken } = useAuth();
    const { isSignedIn } = useUser();
    // const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
    const [step, setStep] = useState(0);

    // const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
    // const prevStep = () => setStep((s) => Math.max(s - 1, 0));

    const form = useForm<RepairForm>({
        resolver: zodResolver(RepairSchema),
        defaultValues: {
            // Prefill from /repair?reg=...&postcode=...
            regNumber: (searchParams.reg?.toString() ?? "").toUpperCase(),
            postcode: searchParams.postcode?.toString() ?? "",
            make: "",
            model: "",
            year: "",
            transmission: undefined as any,
            fuelType: undefined as any,
            mileage: "",
            workTypes: [],
            fullName: "",
            phone: "",
            email: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            country: "Nigeria",
            problemDescription: "",
            availability: [],
        },
        mode: "onBlur",
    });

    // Per-step validation before advancing
    async function nextStep() {
        const toValidate =
            step === 0 ? CAR_FIELDS :
                step === 1 ? WORK_FIELDS :
                    step === 2 ? DETAILS_FIELDS : [];

        const valid = await form.trigger(toValidate as any, { shouldFocus: true });
        if (!valid) return;
        setStep((s) => Math.min(3, s + 1) as 0 | 1 | 2 | 3);
    }
    function prevStep() {
        setStep((s) => Math.max(0, s - 1) as 0 | 1 | 2 | 3);
    }

    // Simple price evaluation (illustrative only)
    const priceEstimate = useMemo(() => {
        const values = form.getValues();
        const base = 0;
        const parts = values.workTypes?.reduce(
            (acc, t) => {
                switch (t) {
                    case "Repair":
                        return { lo: acc.lo + 40000, hi: acc.hi + 120000 };
                    case "Diagnostics":
                        return { lo: acc.lo + 10000, hi: acc.hi + 30000 };
                    case "Servicing":
                        return { lo: acc.lo + 30000, hi: acc.hi + 80000 };
                    case "MOT":
                        return { lo: acc.lo + 15000, hi: acc.hi + 40000 };
                    default:
                        return acc;
                }
            },
            { lo: base, hi: base }
        );
        return parts;
    }, [form.watch("workTypes")]);

    const onSubmit = async (values: RepairForm) => {
        const token = await getToken({ template: "supabase" });
        if (!userId || !token) {
            toast.error("User authentication failed. Please sign in again.");
            return;
        }

        try {
            const repairs = await insertRepair(userId, token, values);
            console.log("Inserted repairs:", repairs);

            // Save booking
            toast.success("Booking saved successfully!", {
                description:
                    `✅ Booking submitted!\n\n` +
                    `Plate: ${values.regNumber}\n` +
                    `Postcode: ${values.postcode}\n` +
                    `Car: ${values.make} ${values.model} ${values.year} (${values.fuelType}, ${values.transmission})\n` +
                    `Work: ${values.workTypes.join(", ")}\n` +
                    `Name: ${values.fullName}\n` +
                    `Phone: ${values.phone}\n` +
                    `Email: ${values.email}\n` +
                    `Address: ${values.address1} ${values.address2 ?? ""}, ${values.city}, ${values.state}, ${values.country}\n` +
                    `Date and Time: ${values.availability.map((slot) => `${format(slot.date, "PP")} (${slot.start} - ${slot.end})`)}\n` +
                    `Description: ${values.problemDescription}\n\n` +
                    `Estimated Price Range: ₦${priceEstimate?.lo?.toLocaleString()} - ₦${priceEstimate?.hi?.toLocaleString()}`,
                duration: 5000,
                // action: {
                //     label: "View Booking",
                //     onClick: () => {
                //         // Redirect to booking details page
                //         window.location.href = `/repair/booking/${values.regNumber}`;
                //     },
                // },
            });
            // Reset form after successful submission
            form.reset();
            setStep(0);

        } catch (error) {
            console.error("Error saving booking:", error);
            toast.error("Failed to save booking. Please try again.");

        }

    }

    return (
        <section className="px-6 md:px-8 lg:px-12 py-10">
            <div className="max-w-3xl mx-auto">
                {/* Warning */}
                <div className="rounded-xl bg-yellow-50 p-4 text-sm text-zinc-700 border border-yellow-200 shadow mb-3">
                    Please make sure to fill out all required fields marked with <span className="text-red-500">*</span> before proceeding.
                    <br /> All fields are mandatory to ensure we can assist you effectively. Any missing information may delay your booking or may result to additional charges.
                    For more information, please refer to our <Link href="/terms-and-conditions" className="text-blue-600 hover:underline">Terms and Conditions</Link>.
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                    <div className="mt-2 text-sm text-gray-600 text-center">
                        Step {step + 1} of {steps.length}: <span className="font-medium">{steps[step]}</span>
                    </div>
                </div>

                {/* Stepper */}
                <ol className="mb-8 flex items-center justify-between text-xs sm:text-sm">
                    {steps.map((label, i) => (
                        <li key={label} className="flex-1 flex items-center">
                            <div
                                className={cn(
                                    "flex items-center gap-2",
                                    i <= step ? "text-blue-600" : "text-gray-400"
                                )}
                            >
                                <span
                                    className={cn(
                                        "h-7 w-7 rounded-full text-xs flex items-center justify-center border font-medium",
                                        i <= step
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-white border-gray-300"
                                    )}
                                >
                                    {i + 1}
                                </span>
                                <span className="hidden sm:inline font-medium">{label}</span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className="mx-1 sm:mx-3 flex-1 h-px bg-gray-200" />
                            )}
                        </li>
                    ))}
                </ol>


                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* ---------------- Step 1: Car ---------------- */}
                        {step === 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="regNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Plate Number <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="ABC-123DE" {...field} className="uppercase" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="postcode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Postal Code <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="100001" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="make"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Make <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Toyota" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="model"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Model <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Corolla" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="year"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Year <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="2018" inputMode="numeric" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="transmission"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Transmission <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select transmission" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Manual">Manual</SelectItem>
                                                    <SelectItem value="Automatic">Automatic</SelectItem>
                                                    <SelectItem value="CVT">CVT</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="fuelType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fuel Type <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select fuel type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Petrol">Petrol</SelectItem>
                                                    <SelectItem value="Diesel">Diesel</SelectItem>
                                                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                                                    <SelectItem value="Electric">Electric</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="mileage"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Mileage (km) <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="120000" inputMode="numeric" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {/* ---------------- Step 2: Select work ---------------- */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="workTypes"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>What do you need? <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                                {(["Repair", "Diagnostics", "Servicing", "MOT"] as const).map(
                                                    (opt) => (
                                                        <FormField
                                                            key={opt}
                                                            control={form.control}
                                                            name="workTypes"
                                                            render={({ field }) => {
                                                                const checked = field.value?.includes(opt);
                                                                return (
                                                                    <FormItem
                                                                        key={opt}
                                                                        className="flex items-center space-x-3 space-y-0 rounded-md border p-3"
                                                                    >
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={checked}
                                                                                onCheckedChange={(c) => {
                                                                                    const isChecked = Boolean(c);
                                                                                    if (isChecked) {
                                                                                        field.onChange([...(field.value ?? []), opt]);
                                                                                    } else {
                                                                                        field.onChange(
                                                                                            (field.value ?? []).filter((v) => v !== opt)
                                                                                        );
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel className="font-normal">{opt}
                                                                        </FormLabel>
                                                                    </FormItem>
                                                                );
                                                            }}
                                                        />
                                                    )
                                                )}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {/* ---------------- Step 3: Details ---------------- */}
                        {step === 2 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone (11 digits) <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="08012345678" inputMode="numeric" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="you@example.com" type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Country <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nigeria" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address1"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Address Line 1 <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Street, building, number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address2"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Address Line 2 (optional)
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Apartment, suite, etc." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Lagos" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Lagos" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="problemDescription"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Describe the issue <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell us everything the mechanic should know…"
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Availability (multiple dates) */}
                                {/* Availability (dates + time ranges) */}
                                <FormField
                                    control={form.control}
                                    name="availability"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>
                                                Available dates & times <span className="text-red-500">*</span>
                                            </FormLabel>

                                            {/* Calendar Picker */}
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full md:w-72 justify-start text-left font-normal",
                                                            !field.value?.length && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value?.length
                                                            ? `${field.value.length} slot(s) selected`
                                                            : "Pick dates"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="p-0" align="start">
                                                    <Calendar
                                                        mode="multiple"
                                                        selected={field.value?.map((s: any) => s.date)}
                                                        onSelect={(dates) => {
                                                            const existing = field.value || [];
                                                            const updated =
                                                                dates?.map((d) => {
                                                                    const found = existing.find(
                                                                        (s: any) => s.date.getTime() === d.getTime()
                                                                    );
                                                                    return found || { date: d, start: "", end: "" };
                                                                }) ?? [];
                                                            field.onChange(updated);
                                                        }}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>

                                            {/* Selected Dates + Time Range Pickers */}
                                            {field.value?.length ? (
                                                <div className="mt-4 space-y-3">
                                                    {field.value.map((slot: any, idx: number) => (
                                                        <div
                                                            key={idx}
                                                            className="flex flex-col md:flex-row items-start md:items-center gap-3 rounded border p-3 bg-muted/40"
                                                        >
                                                            <span className="text-sm font-medium w-40">
                                                                {format(slot.date, "PP")}
                                                            </span>

                                                            {/* Start Time */}
                                                            <Select
                                                                onValueChange={(val) => {
                                                                    const newValue = [...field.value];
                                                                    newValue[idx] = { ...slot, start: val };
                                                                    field.onChange(newValue);
                                                                }}
                                                                value={slot.start ?? ""}
                                                            >
                                                                <SelectTrigger className="w-32">
                                                                    <SelectValue placeholder="Start time" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="08:00">08:00 AM</SelectItem>
                                                                    <SelectItem value="09:00">09:00 AM</SelectItem>
                                                                    <SelectItem value="10:00">10:00 AM</SelectItem>
                                                                    <SelectItem value="11:00">11:00 AM</SelectItem>
                                                                    <SelectItem value="12:00">12:00 PM</SelectItem>
                                                                    <SelectItem value="13:00">01:00 PM</SelectItem>
                                                                    <SelectItem value="14:00">02:00 PM</SelectItem>
                                                                    <SelectItem value="15:00">03:00 PM</SelectItem>
                                                                    <SelectItem value="16:00">04:00 PM</SelectItem>
                                                                    <SelectItem value="17:00">05:00 PM</SelectItem>
                                                                    <SelectItem value="18:00">06:00 PM</SelectItem>
                                                                </SelectContent>
                                                            </Select>

                                                            <span className="text-muted-foreground">to</span>

                                                            {/* End Time */}
                                                            <Select
                                                                onValueChange={(val) => {
                                                                    const newValue = [...field.value];
                                                                    newValue[idx] = { ...slot, end: val };
                                                                    field.onChange(newValue);
                                                                }}
                                                                value={slot.end ?? ""}
                                                            >
                                                                <SelectTrigger className="w-32">
                                                                    <SelectValue placeholder="End time" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="09:00">09:00 AM</SelectItem>
                                                                    <SelectItem value="10:00">10:00 AM</SelectItem>
                                                                    <SelectItem value="11:00">11:00 AM</SelectItem>
                                                                    <SelectItem value="12:00">12:00 PM</SelectItem>
                                                                    <SelectItem value="13:00">01:00 PM</SelectItem>
                                                                    <SelectItem value="14:00">02:00 PM</SelectItem>
                                                                    <SelectItem value="15:00">03:00 PM</SelectItem>
                                                                    <SelectItem value="16:00">04:00 PM</SelectItem>
                                                                    <SelectItem value="17:00">05:00 PM</SelectItem>
                                                                    <SelectItem value="18:00">06:00 PM</SelectItem>
                                                                    <SelectItem value="19:00">07:00 PM</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : null}

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                        )}

                        {/* ---------------- Step 4: Booking (summary) ---------------- */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold">Review & Confirm</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <SummaryItem label="Plate" value={form.getValues("regNumber")} />
                                    <SummaryItem label="Postal code" value={form.getValues("postcode")} />
                                    <SummaryItem
                                        label="Car"
                                        value={`${form.getValues("make")} ${form.getValues("model")} ${form.getValues("year")}`}
                                    />
                                    <SummaryItem
                                        label="Spec"
                                        value={`${form.getValues("fuelType")}, ${form.getValues("transmission")}`}
                                    />
                                    <SummaryItem
                                        label="Mileage"
                                        value={form.getValues("mileage") || "—"}
                                    />
                                    <SummaryItem
                                        label="Work"
                                        value={form.getValues("workTypes").join(", ")}
                                    />
                                    <SummaryItem label="Name" value={form.getValues("fullName")} />
                                    <SummaryItem label="Phone" value={form.getValues("phone")} />
                                    <SummaryItem label="Email" value={form.getValues("email")} />
                                    <SummaryItem
                                        label="Address"
                                        value={`${form.getValues("address1")} ${form.getValues("address2") ?? ""}, ${form.getValues("city")}, ${form.getValues("state")}, ${form.getValues("country")}`}
                                    />
                                    <SummaryItem
                                        label="Dates and Time"
                                        value={form
                                            .getValues("availability")
                                            .map((slot) =>
                                                `${format(slot.date, "PP")} (${slot.start} - ${slot.end})`
                                            )
                                            .join(", ")}
                                        className="md:col-span-2"
                                    />
                                    <div className="md:col-span-2">
                                        <div className="text-[13px] text-gray-500 mb-1">Problem</div>
                                        <div className="rounded border p-3 bg-muted/40">
                                            {form.getValues("problemDescription")}
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border p-4 bg-blue-50">
                                    <div className="text-sm text-blue-700">
                                        Estimated price range (non-binding):
                                    </div>
                                    <div className="text-2xl font-semibold text-blue-700 mt-1">
                                        ₦{priceEstimate?.lo?.toLocaleString()} – ₦{priceEstimate?.hi?.toLocaleString()}
                                    </div>
                                    <p className="text-xs text-blue-700 mt-1">
                                        Final price depends on inspection, parts and labour. We’ll connect you with a vetted mechanic.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={step === 0}
                                className="w-full sm:w-auto"
                            >
                                Back
                            </Button>

                            {step < steps.length - 1 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Next
                                </Button>
                            ) : (
                                <div className="flex flex-col gap-2 w-full sm:w-auto">
                                    <Button
                                        type="submit"
                                        disabled={!isSignedIn}
                                        className={cn(
                                            "w-full sm:w-auto",
                                            isSignedIn
                                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        )}
                                    >
                                        {isSignedIn ? "Confirm Booking" : "Sign in required"}
                                    </Button>
                                    {!isSignedIn && (
                                        <p className="text-xs text-red-500 text-center">
                                            Please sign in to confirm your booking.
                                        </p>
                                    )}
                                </div>
                            )}

                        </div>
                    </form>
                </Form>
            </div>
        </section>
    )
};

export default Repairs;


/* ------------------------ Small Summary Item ------------------------ */

function SummaryItem({
    label,
    value,
    className,
}: {
    label: string;
    value: string;
    className?: string;
}) {
    return (
        <div className={cn("rounded border p-3 bg-muted/40", className)}>
            <div className="text-[13px] text-gray-500">{label}</div>
            <div className="font-medium">{value}</div>
        </div>
    );
}
