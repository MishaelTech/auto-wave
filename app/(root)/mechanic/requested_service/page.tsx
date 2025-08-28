"use client";

import { getRepairsForMechanic, updateRepairStatus } from "@/actions/mechanicform";
import { Booking } from "@/types";
import { useAuth } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Loader2,
    Phone,
    MapPin,
    Calendar,
    Clock,
    CheckCircle2,
    Circle,
} from "lucide-react";
import { addMechanicToRepair } from "@/actions/repairs";

const STATUS_STEPS = ["pending", "accepted", "completed"] as const;

const RequestedService = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const { getToken, userId } = useAuth();
    const [loading, setLoading] = useState(true);

    const fetchBookingsForMechanicsToAccept = async () => {
        const token = await getToken({ template: "supabase" });
        if (!token) {
            toast.error("User authentication failed. Please sign in again.");
            return;
        }

        try {
            const data = await getRepairsForMechanic(token);
            setBookings(data as Booking[]);
        } catch (err) {
            toast.error("Failed to load bookings");
        }

        setLoading(false);
    };

    const handleUpdateStatus = async (repairId: string, status: "accepted" | "completed") => {
        const token = await getToken({ template: "supabase" });
        if (!token) return;

        try {
            await updateRepairStatus(token, repairId, status);
            toast.success(`Repair request marked as ${status}!`);
            fetchBookingsForMechanicsToAccept();
        } catch (err) {
            toast.error(`Failed to update status to ${status}`);
            console.error(err);
            console.log(err);
        }
    };

    const handleAcceptRepair = async (repairId: string) => {
        const token = await getToken({ template: "supabase" });
        if (!token || !userId) {
            toast.error("User authentication failed. Please sign in again.");
            return;
        }

        try {
            await addMechanicToRepair(repairId, userId, token); // sets mechanic_id + accepted

            toast.success("You have accepted the repair request!");
            fetchBookingsForMechanicsToAccept();
        } catch (error) {
            toast.error("Failed to accept repair request");
            console.error(error);
            console.log(error);
        }
    };


    useEffect(() => {
        fetchBookingsForMechanicsToAccept();
    }, []);

    function formatTime(time24: string) {
        const [hourStr, minute] = time24.split(":");
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${ampm}`;
    }

    function formatDate(isoString: string) {
        const date = new Date(isoString);
        return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    }

    const statusColorClasses = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "accepted":
                return "bg-blue-100 text-blue-700";
            case "completed":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const renderStatusTimeline = (currentStatus: string, repairId: string) => {
        return (
            <div className="flex flex-wrap items-center gap-3 mt-4">
                {STATUS_STEPS.map((step, idx) => {
                    const isActive = STATUS_STEPS.indexOf(currentStatus as any) >= idx;
                    const isLast = idx === STATUS_STEPS.length - 1;
                    const isClickable =
                        STATUS_STEPS.indexOf(currentStatus as any) + 1 === idx; // only next step clickable

                    return (
                        <React.Fragment key={step}>
                            <div
                                className={`flex items-center gap-2 ${isClickable ? "cursor-pointer hover:opacity-80" : ""
                                    }`}
                                // onClick={() =>
                                //     isClickable && handleUpdateStatus(repairId, step as "accepted" | "completed")
                                // }

                                onClick={() => {
                                    if (!isClickable) return;
                                    if (step === "accepted") {
                                        handleAcceptRepair(repairId);
                                    } else {
                                        handleUpdateStatus(repairId, step as "completed");
                                    }
                                }}
                            >
                                {isActive ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                                ) : (
                                    <Circle
                                        className={`h-5 w-5 shrink-0 ${isClickable ? "text-blue-500" : "text-gray-400"
                                            }`}
                                    />
                                )}
                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${statusColorClasses(step)}`}
                                >
                                    {step.charAt(0).toUpperCase() + step.slice(1)}
                                </span>
                            </div>
                            {!isLast && (
                                <div
                                    className={`flex-1 h-[2px] ${isActive ? "bg-green-500" : "bg-gray-300"
                                        } hidden sm:block`} // hide line on very small screens
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        );
    };

    if (loading)
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );

    return (
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10">
            <div className="max-w-6xl mx-auto space-y-6">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Requested Services</h1>
                <Separator />

                {bookings.length === 0 ? (
                    <Card className="p-6 text-center">
                        <CardTitle>No repair requests found</CardTitle>
                        <CardDescription>
                            You currently don’t have any service requests assigned.
                        </CardDescription>
                    </Card>
                ) : (
                    <ScrollArea className="h-[70vh] pr-1 sm:pr-2">
                        <div className="space-y-4">
                            {bookings.map((b) => (
                                <Card key={b.id} className="shadow-sm border rounded-xl">
                                    <CardHeader>
                                        <div className="flex flex-wrap items-center justify-between gap-2 capitalize">
                                            <CardTitle className="text-base sm:text-lg">
                                                {b.make} {b.model} ({b.year})
                                            </CardTitle>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${statusColorClasses(
                                                    b.status
                                                )}`}
                                            >
                                                {b.status}
                                            </span>
                                        </div>

                                        <CardDescription className="text-sm sm:text-base">
                                            <div className="text-xs mb-2">
                                                <span className="font-semibold">Plate Number:</span> {b.reg_number} | <span className="font-semibold">Work:</span>{" "}
                                                {b.work_types.join(", ")}<br />
                                            </div>


                                            <span className="font-semibold">Problem Description:</span> <br />{" "}
                                            {b.problem_description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-2 text-sm sm:text-base">
                                        <p className="flex flex-wrap items-center gap-2 capitalize">
                                            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <span className="font-semibold">Name & Phone:</span>{" "}
                                            {b.full_name} – {b.phone}
                                        </p>
                                        <p className="flex flex-wrap items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <span className="font-semibold">Requested on:</span>{" "}
                                            {new Date(b.created_at).toLocaleDateString()}
                                        </p>

                                        <div>
                                            <span className="font-semibold">Client Availability:</span>
                                            {Array.isArray(b.availability) ? (
                                                <div className="space-y-1 mt-1">
                                                    {b.availability.map((slot, index) => (
                                                        <p key={index} className="flex flex-wrap items-center gap-2">
                                                            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                                                            {formatDate(slot.date)}: {formatTime(slot.start)} –{" "}
                                                            {formatTime(slot.end)}
                                                        </p>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p>{b.availability}</p>
                                            )}
                                        </div>

                                        <p className="flex flex-wrap items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <span className="font-semibold">Address:</span> {b.address1}, {b.city},{" "}
                                            {b.country}
                                        </p>

                                        {/* Interactive Progress Timeline */}
                                        {renderStatusTimeline(b.status, b.id)}
                                    </CardContent>

                                    <CardFooter className="flex justify-end gap-3 flex-wrap">
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
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </section>
    );
};

export default RequestedService;
