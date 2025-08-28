"use client";

import { Smartphone, CalendarDays, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "./ui/button";

const HowItWorks = () => {
    return (
        <section className="px-6 md:px-8 lg:px-12 py-16 bg-white">
            <div className="max-w-6xl mx-auto">
                {/* Top Benefits */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center mb-16">
                    <div className="flex flex-col items-center">
                        <p className="font-bold text-lg">Up to 47% cheaper</p>
                        <p className="text-sm text-gray-500 mt-1">Versus franchise garages</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="font-bold text-lg">Fully vetted & qualified</p>
                        <p className="text-sm text-gray-500 mt-1">Nationwide mechanics</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="font-bold text-lg">1-year warranty</p>
                        <p className="text-sm text-gray-500 mt-1">On all parts and repairs</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="font-bold text-lg">Same or next-day</p>
                        <p className="text-sm text-gray-500 mt-1">At your home or office</p>
                    </div>
                </div>

                {/* Section Title */}
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                        How it works
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-bold mt-2 mb-16 leading-snug">
                        Book a trusted mechanic <br className="hidden md:block" /> in just a few clicks
                    </h3>
                </div>

                {/* Steps with animated connectors */}
                <div className="relative flex flex-col md:flex-row justify-between items-center max-w-4xl mx-auto">
                    {/* Connector line (desktop only) */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        viewport={{ once: true }}
                        className="hidden md:block absolute top-10 left-[16%] right-[16%] h-[3px] bg-blue-200 origin-left z-0"
                    ></motion.div>

                    {/* Step 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="flex-1 text-center px-6 mb-12 md:mb-0 relative z-10"
                    >
                        <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-blue-100 mb-6">
                            <Smartphone className="w-10 h-10 text-blue-600" />
                        </div>
                        <h4 className="font-bold text-xl">Get an instant price quote</h4>
                        <p className="text-gray-600 mt-3 text-base leading-relaxed">
                            Select your car and location, tell us what's wrong, and we'll give
                            you an instant fixed price in seconds.
                        </p>
                    </motion.div>

                    {/* Step 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="flex-1 text-center px-6 mb-12 md:mb-0 relative z-10"
                    >
                        <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-blue-100 mb-6">
                            <CalendarDays className="w-10 h-10 text-blue-600" />
                        </div>
                        <h4 className="font-bold text-xl">Pick a date, time & location</h4>
                        <p className="text-gray-600 mt-3 text-base leading-relaxed">
                            Your mechanic will come to whichever address suits you best, at the
                            date and time of your choice.
                        </p>
                    </motion.div>

                    {/* Step 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1 }}
                        viewport={{ once: true }}
                        className="flex-1 text-center px-6 relative z-10"
                    >
                        <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-blue-100 mb-6">
                            <MapPin className="w-10 h-10 text-blue-600" />
                        </div>
                        <h4 className="font-bold text-xl">Mechanic comes to you</h4>
                        <p className="text-gray-600 mt-3 text-base leading-relaxed">
                            No need to go to the garage – once booked just sit back and relax
                            while the mechanic comes to you.
                        </p>
                    </motion.div>
                </div>

                {/* Button */}
                <div className="text-center mt-10">
                    <Button className="bg-white px-8 py-3 rounded-full border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition">
                        Find out more ↓
                    </Button>
                </div>

                {/* About Us Section */}
                <div className="mt-14 text-center max-w-4xl mx-auto">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                        About Us
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-bold mt-2 mb-8">
                        Our promise to you
                    </h3>

                    {/* Image with caption */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="relative rounded-xl overflow-hidden shadow-lg"
                    >
                        <Image
                            src="/next.svg" // replace with your image
                            alt="Mechanic helping customer"
                            width={800}
                            height={450}
                            className="w-full h-auto object-cover"
                        />
                        {/* Overlay */}
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6 text-left">
                            <p className="text-white text-lg md:text-xl font-semibold">
                                Trusted mechanics, affordable prices, and hassle-free service at
                                your doorstep.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
};

export default HowItWorks;
