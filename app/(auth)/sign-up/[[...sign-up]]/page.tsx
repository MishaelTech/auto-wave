"use client";

import React, { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Spinner } from "@/components/Spinner";
import { toast } from "sonner";

const SignUpSchema = z.object({
    firstName: z.string().nonempty("First name is required."),
    lastName: z.string().nonempty("Last name is required."),
    emailAddress: z.email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignUpFormData = z.infer<typeof SignUpSchema>;

export default function SignUpPage() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [verifying, setVerifying] = useState(false);
    const [code, setCode] = useState("");
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [authLaodinng, setAuthLaodinng] = useState({ google: false, facebook: false, apple: false });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SignUpFormData>({
        resolver: zodResolver(SignUpSchema),
    });

    const handleSignUp = async (data: SignUpFormData) => {
        if (!isLoaded) return;

        setLoading(true);
        try {
            await signUp.create({
                emailAddress: data.emailAddress,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
            });

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            if (rememberMe) {
                localStorage.setItem("email", data.emailAddress);
                localStorage.setItem("password", data.password);
            }

            setVerifying(true);
            toast("Verification Email Sent", {
                description: "Please check your inbox for the verification code.",
            });
            reset();
        } catch (error: any) {
            toast("Error", {
                description: error?.errors?.[0]?.message || "Failed to start the sign-up process.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLoaded) return;

        setLoading(true);
        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });

            if (signUpAttempt.status === "complete") {
                await setActive({ session: signUpAttempt.createdSessionId });
                router.push("/");
                toast("Success", {
                    description: "Your account has been successfully created.",
                });
            } else {
                throw new Error("Verification failed. Please try again.");
            }
        } catch {
            toast("Error", {
                description: "Verification failed. Please check the code and try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthSignIn = async (provider: 'google' | 'facebook' | 'apple') => {
        if (!isLoaded) return

        setAuthLaodinng((prev) => ({ ...prev, [provider]: true }))
        try {
            await signUp.authenticateWithRedirect({
                strategy: `oauth_${provider}`,
                redirectUrlComplete: '/',
                redirectUrl: '/',
            })
        } catch (err) {
            toast("Error", {
                description: `Failed to sign in with ${provider}. Please try again.`,
            })
        } finally {
            setAuthLaodinng((prev) => ({ ...prev, [provider]: false }))
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-white to-indigo-50 w-screen">
            {verifying ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <Card className="w-full max-w-md shadow-xl border border-gray-200">
                        <CardContent className="p-6">
                            <h1 className="mb-4 text-lg font-semibold text-center">Verify Your Email</h1>
                            <form onSubmit={handleVerify} className="space-y-4">
                                <div>
                                    <label htmlFor="code" className="block mb-2 text-sm font-medium">
                                        Enter Verification Code
                                    </label>
                                    <Input
                                        id="code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="Enter the code"
                                        className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
                                    {loading ? "Verifying..." : "Verify"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card className="w-full max-w-md shadow-xl border border-gray-200">
                    <CardHeader className="text-center">
                        <CardTitle className="font-semibold text-center text-xl">
                            Create Your Account with AutoWave
                        </CardTitle>
                        <p className="text-sm text-gray-500">Sign Up to get the perfect Mechanic at you nearest location.</p>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="flex justify-between mb-8 space-x-2">
                            <Button
                                onClick={() => handleOAuthSignIn('google')}
                                variant="outline"
                                className="flex-1 flex items-center justify-center space-x-2"
                                disabled={authLaodinng.google}
                            >
                                {authLaodinng.google ?
                                    <Spinner size="md" color="blue-500" />
                                    :
                                    <FcGoogle size={20} />
                                }
                            </Button>
                            <Button
                                onClick={() => handleOAuthSignIn('facebook')}
                                variant="outline"
                                className="flex-1 flex items-center justify-center space-x-2"
                                disabled={authLaodinng.facebook}
                            >
                                {authLaodinng.facebook ?
                                    <Spinner size="md" color="blue-500" />
                                    :
                                    <FaFacebook size={20} className="text-blue-600" />
                                }
                            </Button>
                            <Button
                                onClick={() => handleOAuthSignIn('apple')}
                                variant="outline"
                                className="flex-1 flex items-center justify-center space-x-2"
                                disabled={authLaodinng.apple}
                            >
                                {authLaodinng.apple ?
                                    <Spinner size="md" color="blue-500" />
                                    :
                                    <FaApple size={20} />
                                }
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit(handleSignUp)} className="space-y-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block mb-2 text-sm font-medium">
                                        First Name
                                    </label>
                                    <Input
                                        id="firstName"
                                        {...register("firstName")}
                                        placeholder="First Name"
                                        className={`w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 placeholder:text-sm ${errors.firstName ? "border-red-500" : ""}`}
                                    />
                                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                                </div>

                                <div>
                                    <label htmlFor="lastName" className="block mb-2 text-sm font-medium">
                                        Last Name
                                    </label>
                                    <Input
                                        id="lastName"
                                        {...register("lastName")}
                                        placeholder="Last Name"
                                        className={`w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 placeholder:text-sm ${errors.lastName ? "border-red-500" : ""}`}
                                    />
                                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium">
                                    Email Address
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("emailAddress")}
                                    placeholder="Email Address"
                                    className={`w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 placeholder:text-sm ${errors.emailAddress ? "border-red-500" : ""}`}
                                />
                                {errors.emailAddress && <p className="text-red-500 text-sm mt-1">{errors.emailAddress.message}</p>}
                            </div>

                            <div className="relative">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    placeholder="Password"
                                    className={`w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 placeholder:text-sm ${errors.password ? "border-red-500" : ""}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-11 right-0 flex items-center justify-center pr-3 text-gray-600 hover:text-gray-900 w-5"
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                            </div>

                            {/* CAPTCHA Widget */}
                            <div id="clerk-captcha" data-cl-theme="dark" data-cl-size="flexible" data-cl-language="es-ES" />

                            <div className="flex items-center mt-4">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                                    Remember Me
                                </label>
                            </div>

                            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
                                {loading ? "Creating Account..." : "Continue"}
                            </Button>
                        </form>

                        <div className="mt-6 flex items-start justify-start text-sm text-gray-500">
                            <p className="mr-2">Have an account?</p>
                            <Link href="/sign-in" className="text-blue-500 hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}