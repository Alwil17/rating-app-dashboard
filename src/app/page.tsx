"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";

function HomeContent() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      // If logged in, redirect to admin dashboard
      router.push("/admin");
    } else {
      // If not logged in, redirect to login
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Rating Dashboard</h1>
      <p>Redirecting to dashboard...</p>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
