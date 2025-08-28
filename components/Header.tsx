"use client";

import { getBarLinks } from '@/constants';
import { Menu, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';
import { Spinner } from './Spinner';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { useUserType } from '@/utils/useUserTypes';

type Props = {}

const Header = (props: Props) => {
    const { userType, loading } = useUserType();
    const navbarLinks = getBarLinks(userType);
    const pathname = usePathname();
    const { signOut } = useClerk();
    const { isLoaded, isSignedIn, user } = useUser();



    return (
        <header className='sticky top-0 z-50 w-full bg-[#0072FF] text-white px-4 py-3 flex items-center justify-between shadow-md'>
            <Link href='/' className='flex items-center gap-2'>
                <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0072FF] font-bold'>
                    AW
                </div>
                <span className='text-lg font-semibold'>Auto Wave</span>
            </Link>

            <nav className='hidden md:flex items-center gap-8 text-sm font-medium'>
                {navbarLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className='flex items-center gap-2 hover:text-gray-200 transition-colors duration-200'
                        >
                            <Icon className='w-4 h-4' />
                            {item.title}

                        </Link>
                    )
                })}
            </nav>

            <div className='flex items-center gap-5'>
                {/* Cart badge */}
                <div className='relative cursor-pointer'>
                    <ShoppingCart className='w-6 h-6' />
                    <span className='absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                        1
                    </span>
                </div>

                {/*  login */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Loading */}
                    {!isLoaded && <Spinner size="md" />}

                    {/* Not signed in → show Sign In */}
                    {isLoaded && !isSignedIn && (
                        <Link
                            href="/sign-in"
                            className="text-sm font-medium bg-white text-[#0072FF] px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200"
                        >
                            Sign In
                        </Link>
                    )}

                    {/* Signed in → show Avatar + Sign Out */}
                    {isLoaded && isSignedIn && (
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border">
                                <AvatarImage src={user?.imageUrl || ""} alt={user?.fullName || "User"} />
                                <AvatarFallback>
                                    {user?.firstName?.charAt(0) ?? "U"}
                                </AvatarFallback>
                            </Avatar>

                            <Button
                                onClick={() => signOut({ redirectUrl: "/sign-in" })}
                                className="text-sm font-medium bg-white text-[#0072FF] px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200"
                            >
                                Sign Out
                            </Button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu (Sheet) */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant='ghost'
                            size='icon'
                            className='md:hidden text-white hover:bg-gray-200'
                            aria-label='Open menu'
                        >
                            <Menu className='w-6 h-6' />
                        </Button>
                    </SheetTrigger>

                    <SheetContent
                        side='left'
                        className='bg-white text-black p-4 flex flex-col gap-4 w-64 border-none'
                    >
                        <SheetHeader>
                            <SheetTitle className='flex items-center gap-2'>
                                <Link href='/' className='flex items-center gap-2'>
                                    <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0072FF] font-bold shadow-md'>
                                        AW
                                    </div>
                                    <span className='text-lg font-semibold'>Auto Wave</span>
                                </Link>
                            </SheetTitle>
                        </SheetHeader>

                        <nav className='flex flex-col gap-4 text-sm font-medium'>
                            {navbarLinks.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className={
                                            cn('flex items-center gap-2 hover:text-gray-200 transition-all duration-200 px-4 py-3 rounded-lg hover:bg-gray-100 group', {
                                                'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md': isActive,
                                                'hover:bg-gray-100': !isActive,
                                            })
                                        }
                                    >

                                        <div
                                            className={cn('relative flex items-center justify-center size-8 rounded-md transition-all duration-200',
                                                {
                                                    'bg-white opacity-20': isActive,
                                                    'bg-gray-200 text-gray-700 group-hover:bg-gray-300': !isActive,
                                                }
                                            )}
                                        >
                                            <Icon size={25} className={cn('object-contain p-1', {
                                                'invert brightness-200': isActive,
                                            })} />
                                        </div>

                                        <span className={cn('text-sm font-medium', {
                                            'text-white': isActive,
                                            'text-gray-700 group-hover:text-gray-900': !isActive,
                                        })}>
                                            {item.title}
                                        </span>
                                    </Link>
                                )
                            })}
                        </nav>

                        <div className=" items-center gap-4">
                            {/* Loading */}
                            {!isLoaded && <Spinner size="md" />}

                            {/* Not signed in → show Sign In */}
                            {isLoaded && !isSignedIn && (
                                <Link
                                    href="/sign-in"
                                    className="text-sm font-medium bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors duration-200"
                                >
                                    Sign In
                                </Link>
                            )}

                            {/* Signed in → show Avatar + Sign Out */}
                            {isLoaded && isSignedIn && (
                                <div className=" mt-10 flex justify-start items-start gap-3 flex-col">
                                    <div className='flex items-center gap-2 flex-1 relative'>
                                        <Avatar className="h-9 w-9 border">
                                            <AvatarImage src={user?.imageUrl || ""} alt={user?.fullName || "User"} />
                                            <AvatarFallback>
                                                {user?.firstName?.charAt(0) ?? "U"}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div>
                                            <p className='font-bold text-gray-500'>{user?.firstName}</p>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => signOut({ redirectUrl: "/sign-in" })}
                                        className="text-sm font-medium bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-900 transition-colors duration-200"
                                    >
                                        Sign Out
                                    </Button>

                                </div>
                            )}
                        </div>

                    </SheetContent>
                </Sheet>

            </div>
        </header>
    )
};

export default Header;