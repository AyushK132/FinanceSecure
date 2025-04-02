import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './button'
import { LayoutDashboard, PenBox } from 'lucide-react'
import { checkUser } from '../../lib/checkUser'

const Header = async () => {
    await checkUser();
    return (
        <div className="fixed top-0 w-full bg-[] backdrop-blur-md z-50">
            <nav className="mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-4">
                    <Image
                        className="h-[100px] w-auto object-contain"
                        src="/logo.png"
                        alt="main logo"
                        height={100} // Ensure the size is consistent with your Tailwind classes
                        width={100}
                    />
                    <h1 className="text-[40px] bg-gradient-to-r from-[#8e89f0] to-[#f5a293] font-extrabold tracking-tighter pr-2 pb-2 text-transparent bg-clip-text text-gray-900 translate-x-[-40px] translate-y-[-1px]">FinanceSecure</h1>
                </Link>

                <div className="flex items-center space-x-4">
                    <SignedIn>
                        <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
                            <Button variant="outline">
                                <LayoutDashboard size={18} />
                                <span className="hidden md:inline">Dashboard</span>
                            </Button>
                        </Link>

                        <Link href="/transaction/create">
                            <Button className="flex items-center gap-2">
                                <PenBox size={18} />
                                <span className="hidden md:inline"> Add Transactions</span>
                            </Button>
                        </Link>
                    </SignedIn>

                    <SignedOut>
                        <SignInButton forceRedirectUrl="/dashboard">
                            <Button variant="outline">Login</Button>
                        </SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <UserButton appearance={{
                            elements: {
                                avatarBox: "w-10 h-10"
                            }
                        }} />
                    </SignedIn>
                </div>
            </nav>
        </div>
    );
}

export default Header;
