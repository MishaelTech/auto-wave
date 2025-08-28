"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/client"; // Supabase client
import { useAuth, useUser } from "@clerk/nextjs";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Pencil, CheckCircle2, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { deleteRepair, getRepairs, updateRepair } from "@/actions/repairs";
import { Booking, RepairForm } from "@/types";
import { Spinner } from "@/components/Spinner";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ViewRepairBookings = () => {
    const { userId, getToken } = useAuth();
    const { user, isSignedIn } = useUser();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Edit modal state
    const [editing, setEditing] = useState<Booking | null>(null);
    const [editForm, setEditForm] = useState<Partial<Booking>>({});

    // Delete confirmation state
    const [deleting, setDeleting] = useState<Booking | null>(null);

    // Alert banner state
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(
        null
    );


    const fetchBookings = async () => {
        const token = await getToken({ template: "supabase" });
        if (!userId || !token) {
            toast.error("User authentication failed. Please sign in again.");
            return;
        }

        try {
            const data = await getRepairs(userId, token);
            setBookings(data as Booking[]);
        } catch (err) {
            toast.error("Failed to load bookings");
        }

        setLoading(false);
    };

    const handleEditSave = async () => {
        const token = await getToken({ template: "supabase" });
        if (!userId || !token || !editing) {
            toast.error("User authentication failed. Please sign in again.");
            return;
        }

        try {
            await updateRepair(userId, token, editing.id, editForm); // ✅ pass id + form
            setAlert({ type: "success", message: "Booking updated successfully!" });
            setEditing(null);
            fetchBookings();
            toast.success("Booking updated successfully!");
        } catch (error) {
            toast.error("Failed to edit booking. Please try again.");
            console.error("Error editing booking:", error);
        }
    };

    const handleDelete = async () => {
        const token = await getToken({ template: "supabase" });
        if (!userId || !token || !deleting) {
            toast.error("User authentication failed. Please sign in again.");
            return;
        }

        try {
            await deleteRepair(deleting.id, userId, token)
            setAlert({ type: "success", message: "Booking has been deleted successfully!" });
            setEditing(null);
            fetchBookings();
            toast.success("Booking has been deleted successfully!");

        } catch (error) {
            toast.error("Failed to delete booking. Please try again.");
            console.error("Error delete booking:", error);
        }

    }


    useEffect(() => {
        if (isSignedIn) fetchBookings();
    }, [isSignedIn]);



    if (!isSignedIn) {
        return (
            <div className="text-center py-20">
                <h2 className="text-lg font-semibold">Please sign in to view your bookings</h2>
            </div>
        );
    }

    return (
        <section className="px-6 md:px-8 lg:px-12 py-10">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">My Repair Bookings</h1>
                    <Input
                        type="text"
                        placeholder="🔍 Search bookings..."
                        className="w-64"
                        onChange={(e) => {
                            // TODO: filter bookings dynamically
                        }}
                    />
                </div>

                {/* Inline Alert */}
                <AnimatePresence>
                    {alert && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <Alert
                                className={`flex items-center gap-2 p-3 rounded-lg shadow-sm ${alert.type === "success"
                                    ? "bg-green-50 border-green-400 text-green-700"
                                    : "bg-red-50 border-red-400 text-red-700"
                                    }`}
                            >
                                {alert.type === "success" ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    <XCircle className="w-5 h-5" />
                                )}
                                <AlertDescription>{alert.message}</AlertDescription>
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Booking List */}
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Spinner size="lg" />
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        <p>No bookings found 🚗</p>
                        <p className="text-sm">Start by creating your first booking!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {bookings.map((booking) => (
                            <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <Card className="shadow-sm hover:shadow-lg transition rounded-2xl">
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center capitalize">
                                            {booking.make} {booking.model} ({booking.year})
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full
                                                    ${booking.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : booking.status === "accepted"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : booking.status === "completed"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-100 text-gray-700"
                                                    }`
                                                }
                                            >
                                                {booking.status}
                                            </span>
                                        </CardTitle>
                                        <CardDescription>
                                            Plate: {booking.reg_number} | Work:{" "}
                                            {booking.work_types.join(", ")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-1">
                                        <p className="capitalize">
                                            <span className="font-semibold">Name:</span>{" "}
                                            {booking.full_name}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Phone:</span>{" "}
                                            {booking.phone}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Problem:</span>{" "}
                                            {booking.problem_description}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Created:{" "}
                                            {new Date(booking.created_at).toLocaleString()}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex flex-col justify-start items-start gap-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setEditing(booking);
                                                setEditForm(booking);
                                            }}
                                        >
                                            <Pencil className="w-4 h-4 mr-1" /> Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setDeleting(booking)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                                        </Button>

                                        {booking.status === "accepted" && (
                                            <div className="mt-3 w-full p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-700">
                                                ✅ Your request has been accepted.{" "}
                                                <Button
                                                    variant="link"
                                                    className="p-0 h-auto font-semibold text-blue-700 underline ml-1 cursor-pointer"
                                                    onClick={() => router.push(`/mechanic/${booking.mechanic_id}/booking/${booking.id}`)}
                                                >
                                                    View mechanic profile
                                                </Button>
                                            </div>
                                        )}
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
                <DialogContent className="rounded-xl">
                    <DialogHeader>
                        <DialogTitle>Edit Booking</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Full Name</Label>
                            <Input
                                value={editForm.full_name || ""}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, full_name: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <Label>Phone</Label>
                            <Input
                                value={editForm.phone || ""}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, phone: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <Label>Problem</Label>
                            <Input
                                value={editForm.problem_description || ""}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        problem_description: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setEditing(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditSave}>Save Changes</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
                <DialogContent className="rounded-xl">
                    <DialogHeader>
                        <DialogTitle>Delete Booking</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete this booking? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setDeleting(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Yes, Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
};

export default ViewRepairBookings;
