'use client'

import * as React from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FcGoogle } from "react-icons/fc"
import { FaApple, FaFacebook } from "react-icons/fa"
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Spinner } from '@/components/Spinner'
import { toast } from 'sonner'

const SignInSchema = z.object({
    email: z.email('Please enter a valid email.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
})

type SignInFormData = z.infer<typeof SignInSchema>

export default function SignInForm() {
    const { isLoaded, signIn, setActive } = useSignIn()
    const router = useRouter()
    const [loading, setLoading] = React.useState({ email: false, google: false, facebook: false, apple: false })
    const [showPassword, setShowPassword] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<SignInFormData>({
        resolver: zodResolver(SignInSchema),
    })

    React.useEffect(() => {
        const savedEmail = localStorage.getItem('email')
        if (savedEmail) {
            setValue('email', savedEmail)
        }
    }, [setValue])

    const handleSignIn = async (data: SignInFormData) => {
        if (!isLoaded) return

        setLoading((prev) => ({ ...prev, email: true }))
        try {
            const signInAttempt = await signIn.create({
                identifier: data.email,
                password: data.password,
            })

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                localStorage.setItem('email', data.email)
                toast("Success", { description: "You have successfully signed in." })
                router.push('/')
            } else {
                toast(
                    "Action Needed", {
                    description: "Please complete further sign-in steps.",
                })
            }
        } catch (err: any) {
            toast("Error", {
                description: err.errors?.[0]?.message || "Failed to sign in. Please try again.",
            })
        } finally {
            setLoading((prev) => ({ ...prev, email: false }))
        }
    }

    const handleOAuthSignIn = async (provider: 'google' | 'facebook' | 'apple') => {
        if (!isLoaded) return

        setLoading((prev) => ({ ...prev, [provider]: true }))
        try {
            await signIn.authenticateWithRedirect({
                strategy: `oauth_${provider}`,
                redirectUrlComplete: '/',
                redirectUrl: '/',
            })
        } catch (err) {
            toast("Error", {
                description: `Failed to sign in with ${provider}. Please try again.`,
            })
        } finally {
            setLoading((prev) => ({ ...prev, [provider]: false }))
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-indigo-50 w-screen">
            <Card className="w-full max-w-md shadow-lg rounded-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-semibold">Welcome Back to AutoWave</CardTitle>
                    <p className="text-sm text-gray-500">Sign in to continue to your account</p>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between mb-8 space-x-2">
                        <Button
                            onClick={() => handleOAuthSignIn('google')}
                            variant="outline"
                            className="flex-1 flex items-center justify-center space-x-2"
                            disabled={loading.google}
                        >
                            {loading.google ?
                                <Spinner size="md" color="blue-500" />
                                :
                                <FcGoogle size={20} />
                            }
                        </Button>
                        <Button
                            onClick={() => handleOAuthSignIn('facebook')}
                            variant="outline"
                            className="flex-1 flex items-center justify-center space-x-2"
                            disabled={loading.facebook}
                        >
                            {loading.facebook ?
                                <Spinner size="md" color="blue-500" />
                                :
                                <FaFacebook size={20} className="text-blue-600" />
                            }
                        </Button>
                        <Button
                            onClick={() => handleOAuthSignIn('apple')}
                            variant="outline"
                            className="flex-1 flex items-center justify-center space-x-2"
                            disabled={loading.apple}
                        >
                            {loading.apple ?
                                <Spinner size="md" color="blue-500" />
                                :
                                <FaApple size={20} />
                            }
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit(handleSignIn)} className="space-y-8">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                {...register('email')}
                                placeholder="Email Address"
                                className={`w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 placeholder:text-sm ${errors.email ? "border-red-500" : ""}`}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
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

                        <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700" disabled={loading.email}>
                            {loading.email ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="mt-6 flex items-start justify-start text-sm text-gray-500">
                        <p className="mr-2">Don't have an account?</p>
                        <Link href="/sign-up" className="text-blue-500 hover:underline">Sign Up</Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}