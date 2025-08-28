"use client";

import { use } from "react";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getMechanicByMechanicId, getRepairsById } from "@/actions/mechanicform";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MechanicBookingPage({
    params,
}: {
    params: Promise<{ id: string; bookingId: string }>;
}) {
    const { id, bookingId } = use(params); // ✅ unwrap params
    const { getToken } = useAuth();

    const [mechanic, setMechanic] = useState<any>(null);
    const [booking, setBooking] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = await getToken({ template: "supabase" });
            if (!token) {
                toast.error("User authentication failed. Please sign in again.");
                return;
            }

            try {
                const mech = await getMechanicByMechanicId(id, token);
                setMechanic(mech);

                const book = await getRepairsById(bookingId, token);
                setBooking(book);
            } catch (err) {
                console.error("Error fetching booking:", err);
                toast.error("Failed to load booking details.");
                console.log(err);
            }
        };

        fetchData();
    }, [id, bookingId, getToken]);


    if (!mechanic || !booking) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-xl font-bold mb-4">{mechanic.name}</h1>
            <div className=" mt-10 flex justify-start items-start gap-3 flex-col">
                <div className='flex items-center gap-2 flex-1 relative'>
                    <Avatar className="h-9 w-9 border">
                        <AvatarImage src={mechanic?.avatar_url || ""} alt={mechanic?.fullName || "mechanic"} />
                        <AvatarFallback>
                            {mechanic?.first_name?.charAt(0) ?? "U"}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <p className='font-bold text-gray-500'>{mechanic?.first_name}</p>
                    </div>
                </div>

            </div>
            <p>{mechanic.phone}</p>
            <p>{mechanic.email}</p>
            <p>{mechanic.postcode}</p>

            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                <h2 className="text-lg font-semibold">Your Accepted Request</h2>
                <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                <p>
                    Time: {booking.start} - {booking.end}
                </p>
                <p>
                    Status:{" "}
                    <span className="font-medium text-green-600">{booking.status}</span>
                </p>
            </div>
        </div>
    );
}
