"use client";

import { use } from "react";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getMechanicByMechanicId, getRepairsById } from "@/actions/mechanicform";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Download, MapPin, Phone } from "lucide-react";
import { formatDate, formatTime, statusColorClasses } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

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
            }
        };

        fetchData();
    }, [id, bookingId, getToken]);

    if (!mechanic || !booking) {
        return <div className="p-6 text-gray-600">Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            {/* Mechanic Profile Card */}
            <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center gap-3">
                    <Avatar className="h-14 w-14 border">
                        <AvatarImage
                            src={mechanic?.avatar_url || ""}
                            alt={mechanic?.first_name || "mechanic"}
                        />
                        <AvatarFallback>
                            {mechanic?.first_name?.charAt(0) ?? "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-lg">
                            {mechanic?.first_name} {mechanic?.last_name}
                        </CardTitle>
                        <p className="text-sm text-gray-500">{mechanic?.email}</p>
                    </div>
                </CardHeader>

                <CardContent className="space-y-2">
                    <p>
                        <span className="font-semibold">Phone:</span> {mechanic?.phone}
                    </p>
                    <p>
                        <span className="font-semibold">Postcode:</span> {mechanic?.postcode}
                    </p>

                    {mechanic?.police_report && (
                        <div className="mt-3">
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="flex items-center gap-2"
                            >
                                <a
                                    href={mechanic.police_report}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                >
                                    <Download className="h-4 w-4" /> Download Police Report
                                </a>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Booking Details Card */}
            <ScrollArea className=" pr-1 sm:pr-2">
                <div className="space-y-4">
                    <Card key={booking.id} className="shadow-sm border rounded-xl">
                        <CardHeader>
                            <div className="flex flex-wrap items-center justify-between gap-2 capitalize">
                                <CardTitle className="text-base sm:text-lg">
                                    {booking.make} {booking.model} ({booking.year})
                                </CardTitle>
                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${statusColorClasses(
                                        booking.status
                                    )}`}
                                >
                                    {booking.status}
                                </span>
                            </div>

                            <CardDescription className="text-sm sm:text-base">
                                <div className="text-xs mb-2">
                                    <span className="font-semibold">Plate Number:</span> {booking.reg_number} | <span className="font-semibold">Work:</span>{" "}
                                    {booking.work_types.join(", ")}<br />
                                </div>


                                <span className="font-semibold">Problem Description:</span> <br />{" "}
                                {booking.problem_description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-2 text-sm sm:text-base">
                            <p className="flex flex-wrap items-center gap-2 capitalize">
                                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="font-semibold">Name & Phone:</span>{" "}
                                {booking.full_name} – {booking.phone}
                            </p>
                            <p className="flex flex-wrap items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="font-semibold">Requested on:</span>{" "}
                                {new Date(booking.created_at).toLocaleDateString()}
                            </p>

                            <div>
                                <span className="font-semibold">Client Availability:</span>
                                {Array.isArray(booking.availability) ? (
                                    <div className="space-y-1 mt-1">
                                        {booking.availability.map((slot: any, index: any) => (
                                            <p key={index} className="flex flex-wrap items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                                                {formatDate(slot.date)}: {formatTime(slot.start)} –{" "}
                                                {formatTime(slot.end)}
                                            </p>
                                        ))}
                                    </div>
                                ) : (
                                    <p>{booking.availability}</p>
                                )}
                            </div>

                            <p className="flex flex-wrap items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="font-semibold">Address:</span> {booking.address1}, {booking.city},{" "}
                                {booking.country}
                            </p>

                            {/* Interactive Progress Timeline */}
                            {/* {renderStatusTimeline(b.status, b.id)} */}
                        </CardContent>

                        {/* <CardFooter className="flex justify-end gap-3 flex-wrap">
                                        {b.status === "pending" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleAcceptRepair(b.id)}
                                            >
                                                Accept
                                            </Button>
                                        )}
                                        {b.status === "accepted" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleUpdateStatus(b.id, "completed")}
                                            >
                                                Complete
                                            </Button>
                                        )}
                                    </CardFooter> */}
                    </Card>
                </div>
            </ScrollArea>
        </div>
    );
}
