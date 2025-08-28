import Image from "next/image";
import { Button } from "./ui/button";

const ApplyToBeAMechanic = () => {
    return (
        <section className="px-6 md:px-8 lg:px-12 py-16">
            <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="mb-8">
                        <Image
                            src="/next.svg" // replace with your image
                            alt="Apply to be a mechanic"
                            width={800}
                            height={450}
                            className="w-full h-auto object-cover rounded-lg shadow-lg mb-8"

                        />
                    </div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                        Apply to be a Mechanic
                    </h2>
                    <p className="mt-4 text-lg text-gray-700">
                        Join our team of skilled mechanics and help us provide top-notch service to our customers.
                    </p>

                    <Button className="bg-white px-8 py-3 mt-5 rounded-full border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition cursor-pointer">
                        Apply Now
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default ApplyToBeAMechanic;
