"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

type Props = {}

const AboutUs = (props: Props) => {
    return (
        <section className="px-6 md:px-8 lg:px-12 py-16 bg-white">
            <div className="max-w-6xl ">
                {/* About Us Section */}
                <div className=" text-center max-w-4xl ">
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

export default AboutUs;