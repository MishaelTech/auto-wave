"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Coins, Headphones, Wallet } from "lucide-react";
import Link from "next/link";
import { FormValues, mechanicFormSchema } from "@/types";
import { toast } from "sonner";
import { useAuth, useUser } from "@clerk/nextjs";
import { addMechanics } from "@/actions/mechanicform";

const MechanicApplyHome = () => {
    const { userId, getToken } = useAuth();
    const { user } = useUser();
    const form = useForm<FormValues>({
        resolver: zodResolver(mechanicFormSchema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.emailAddresses[0]?.emailAddress || "",
            phone: "",
            postcode: "",
            address: "",
            policeReport: null,
        },
    });

    // function onSubmit(values: FormValues) {
    //     // Submit the mechanic application form
    //     submitMechanicForm(values)
    //         .then(() => {
    //             form.reset();
    //             toast.success("Application submitted successfully!");
    //         })
    //         .catch((error) => {
    //             console.error("Error submitting application:", error);
    //             toast.error("Failed to submit application. Please try again.");
    //         });

    // }


    const onSubmit = async (values: FormValues) => {
        const token = await getToken({ template: "supabase" });
        if (!userId || !token) {
            toast.error("User authentication failed. Please sign in again.");
            return;
        }

        try {
            const repairs = await addMechanics(userId, token, values);
            console.log("Inserted repairs:", repairs);

            // Save booking
            toast.success("Application submitted successfully! Our team will contact you shortly.", {
                duration: 5000,
            });
            // Reset form after successful submission
            form.reset();

        } catch (error) {
            console.error("Error saving adding:", error);
            toast.error("Failed to submit application. Please try again.");

        }

    }

    return (
        <section className="px-6 md:px-8 lg:px-12 py-12">
            {/* Application Form */}
            <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest text-center">
                    Become a Mechanic
                </h2>
                <h3 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mt-2 mb-6">
                    Join our trusted network and earn flexibly
                </h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* First Name */}
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} disabled />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Last Name */}
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} disabled />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="john@example.com" {...field} disabled />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Phone */}
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mobile Number <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder="08012345678" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Postcode */}
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Postcode */}
                        <FormField
                            control={form.control}
                            name="postcode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Postcode <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="100001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Police Report PDF Upload */}
                        <FormField
                            control={form.control}
                            name="policeReport"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Police Report (PDF) <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) => field.onChange(e.target.files)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Upload your police clearance certificate (PDF only).
                                    </p>
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Join Free
                        </Button>
                    </form>
                </Form>
            </div>

            <div className="bg-blue-50 mt-12 w-full p-10 rounded-2xl shadow-sm">
                {/* Why Join Section */}
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="p-6 bg-white rounded-xl shadow-md">
                        <Coins className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                        <h4 className="text-lg font-semibold">Free to Join</h4>
                        <p className="text-sm text-gray-600">
                            No upfront fees – only pay a commission on jobs you choose and complete.
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow-md">
                        <Headphones className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                        <h4 className="text-lg font-semibold">24/7 Support</h4>
                        <p className="text-sm text-gray-600">
                            We'll handle customer support, quoting, payment handling and more, while you focus on your work and growing your business.
                        </p>
                    </div>

                    <div className="p-6 bg-white rounded-xl shadow-md">
                        <Wallet className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                        <h4 className="text-lg font-semibold">Flexible Earnings</h4>
                        <p className="text-sm text-gray-600">
                            Maximise your income by choosing jobs that fit your schedule and expertise through AutoWave.
                        </p>
                    </div>
                </div>

                {/* How It Works Section */}
                <div className="mt-16 max-w-3xl mx-auto px-6">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest text-center">
                        How It Works
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-bold mt-2 mb-8 text-blue-700 text-center">
                        Simple steps to get started
                    </h3>
                    <p className="text-gray-600 mb-6 text-center">
                        Getting started is quick and easy. Just follow the steps below.
                    </p>

                    <div className="space-y-8">
                        {/* Step 1 */}
                        <div className="flex items-start gap-4">
                            <span className="flex h-10 w-10 p-5 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                                1
                            </span>
                            <div>
                                <h4 className="font-semibold text-lg">Receive</h4>
                                <p className="text-gray-600 text-sm mt-1">
                                    We send you job requests via our app or SMS. You can choose which jobs to accept based on your skills and availability. All jobs are pre-screened to ensure they match your expertise. You'll reveice margin of the job cost, which you can set based on your experience and the job type.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-start gap-4">
                            <span className="flex h-10 w-10 p-5 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                                2
                            </span>
                            <div>
                                <h4 className="font-semibold text-lg">Decide</h4>
                                <p className="text-gray-600 text-sm mt-1">
                                    You can accept or decline jobs based on your schedule and expertise. We provide all the details you need to make an informed decision. If you accept you carry out the job at the customer's location and use AutoWave to manage the booking.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-start gap-4">
                            <span className="flex h-10 w-10 p-5 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                                3
                            </span>
                            <div>
                                <h4 className="font-semibold text-lg">Get Paid</h4>
                                <p className="text-gray-600 text-sm mt-1">
                                    After completing the job, you receive payment directly through our secure platform. We handle all customer payments, so you can focus on your work without worrying about invoicing or chasing payments.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Frequently Asked Question */}
            <div className="mt-16 max-w-3xl mx-auto px-6 bg-white">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest text-center">
                    Frequently Asked Questions
                </h2>
                <h3 className="text-3xl md:text-4xl font-bold mt-2 mb-8 text-blue-700 text-center">
                    Got questions? We have answers!
                </h3>
                <p className="text-gray-600 mb-6 text-center">
                    Here are some common questions we get from mechanics looking to join our platform.
                </p>

                <div className="justify-center items-center flex">
                    <Link href="/mechnic/frequently-asked-question" className="bg-white px-8 py-3 rounded-full border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition">
                        View FAQs
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default MechanicApplyHome;
