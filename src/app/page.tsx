"use client";

import React, { Suspense } from "react";

function HomeContent() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Rating Dashboard</h1>
      <p>Welcome to your admin dashboard!</p>
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
