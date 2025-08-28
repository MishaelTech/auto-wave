"use client";

import { Car, ClipboardList, Forward, MapPin, ShieldCheck, Wrench } from 'lucide-react';
import Image from 'next/image';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { useRouter } from 'next/navigation';

// ✅ Validation schema
const formSchema = z.object({
    regNumber: z
        .string()
        .regex(/^[A-Z]{3}-\d{3}[A-Z]{2}$/, "Invalid plate (e.g. ABC-123DE)"),
    postcode: z
        .string()
        .regex(/^\d{6}$/, "Enter a 6-digit Nigerian postal code"),
});

const Hero = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            regNumber: "",
            postcode: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.push(
            `/repair?reg=${encodeURIComponent(values.regNumber)}&postcode=${encodeURIComponent(
                values.postcode
            )}`
        );
    }

    return (
        <section className='relative bg-gradient-to-b from-[#0072FF] to-[#1E90FF] text-white text-center px-4 pt-12 pb-20 overflow-hidden'>
            <div className='max-w-6xl mx-auto relative z-10'>
                {/* Icon row */}
                <div className='flex justify-center gap-6 md:gap-12 mb-4 flex-wrap'>
                    <div className='flex flex-col items-center'>
                        <ShieldCheck className='w-6 h-6 md:w-4 md:h-4' />
                        {/* <span className='text-xs md:text-sm mt-1'>Secure</span> */}
                    </div>

                    <div className='flex flex-col items-center'>
                        <Wrench className='w-6 h-6 md:w-4 md:h-4' />
                        {/* <span className='text-xs md:text-sm mt-1'>Repairs</span> */}
                    </div>

                    <div className='flex flex-col items-center'>
                        <ClipboardList className='w-6 h-6 md:w-4 md:h-4' />
                        {/* <span className='text-xs md:text-sm mt-1'>Servicing</span> */}
                    </div>

                </div>

                {/* Mechanic Image */}
                <div className='flex justify-center mb-6'>
                    <Image
                        src="/next.svg"
                        alt="Mechanic working on a car"
                        width={600}
                        height={400}
                        className='rounded-lg shadow-lg w-40 md:w-56 lg:w-64 h-auto object-cover'
                    />
                </div>

                {/* Hero Heading */}
                <h1 className='text-xl sm:text-2xl md:text-3xl font-bold mb-4 px-4'>
                    Auto Wave: Your Trusted Car Repair Partner, made easy.
                </h1>
                <p className='mb-6 text-sm md:text-base px-2 max-w-2xl mx-auto'>
                    Experience hassle-free car repairs with Auto Wave. Our expert mechanics are here to provide top-notch service, ensuring your vehicle runs smoothly and safely. From routine maintenance to complex repairs, we've got you covered.
                </p>

                {/* Input Boxes */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="bg-white rounded-lg p-4 space-y-3 text-black max-w-md mx-auto"
                    >
                        {/* Plate Number */}
                        <FormField
                            control={form.control}
                            name="regNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                                        <Car className="w-5 h-5 text-blue-600 shrink-0" />
                                        <FormControl>
                                            <Input
                                                placeholder="ABC-123DE"
                                                {...field}
                                                className="border-0 focus-visible:ring-0 flex-1 uppercase"
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="text-red-500 text-xs mt-1 justify-start text-start" />
                                </FormItem>
                            )}
                        />

                        {/* Postcode */}
                        <FormField
                            control={form.control}
                            name="postcode"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                                        <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                                        <FormControl>
                                            <Input
                                                placeholder="100001"
                                                {...field}
                                                className="border-0 focus-visible:ring-0 flex-1"
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="text-red-500 text-xs mt-1 justify-start text-start" />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-black text-white hover:bg-gray-800 cursor-pointer"
                        >
                            GET MY INSTANT PRICE <Forward className="ml-2 w-4 h-4" />
                        </Button>
                    </form>
                </Form>

                <p className="mt-3 text-xs underline cursor-pointer">
                    I don’t know my registration number →
                </p>

                {/* Trustpilot */}
                <div className="mt-6 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-10">
                    <div className="flex items-center gap-2">
                        <span className="text-green-500 font-bold">★</span>
                        <span className="text-sm md:text-base">Trustpilot 20,000+ Reviews</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-400 font-bold">★★★★★</span>
                        <span className="text-sm md:text-base">161,000+ Customer Reviews</span>
                    </div>
                </div>
            </div>

            {/* Wave */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                <svg
                    className="relative block w-full h-[60px] md:h-[80px]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M985.66,92.83c-55.14-9.39-114.09-16.41-172.24-14.11-72.17,2.82-140.06,19.24-211.14,26.54C528.77,115.19,456.43,112,385.11,99.26c-59.92-10.79-113.78-29-173.29-39.72-66-11.9-138.44-14-209.06-7.11V120H1200V95.8C1126.55,108.07,1056.9,104.54,985.66,92.83Z"
                        fill="#ffffff"
                    />
                </svg>

            </div>
        </section>
    )
};

export default Hero;