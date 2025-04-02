import { SignUp } from '@clerk/nextjs';
import React from 'react';

function page() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-2">
        {/* Left half: Sign-in */}
        <main className="flex items-center justify-center px-8 py-12">
          <div className="max-w-md w-full">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl mb-8 text-center mr-[35px]">
              Welcome to FinanceSecure
            </h1>

            {/* SignIn component */}
            <SignUp redirectUrl="/dashboard" 
              appearance={{
                elements: {
                  card: "shadow-lg w-full",
                },
              }}
            />
          </div>
        </main>

        {/* Right half: Image */}
        <aside className="relative hidden lg:block">
          <img
            alt="Finance Background"
            src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>
      </div>
    </section>
  );
}

export default page;
