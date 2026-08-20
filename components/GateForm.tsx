"use client";

import { useState } from "react";

export function GateForm() {
  const [error, setError] = useState("");

  return (
    <form action="/api/gate" method="POST" className="mt-6 space-y-4">
      <div>
        <label htmlFor="viewerName" className="block text-sm font-medium text-text-primary">
          Your name
        </label>
        <input
          id="viewerName"
          name="viewerName"
          required
          autoComplete="name"
          className="mt-1.5 w-full rounded-lg border border-border-default bg-surface-metric px-3 py-2.5 text-body transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/25"
        />
      </div>
      <div>
        <label htmlFor="passphrase" className="block text-sm font-medium text-text-primary">
          Passphrase
        </label>
        <input
          id="passphrase"
          name="passphrase"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5 w-full rounded-lg border border-border-default bg-surface-metric px-3 py-2.5 text-body transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/25"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-variance-unfavourable">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="w-full rounded-lg bg-brand-green px-4 py-3 text-body font-semibold text-white shadow-card transition-opacity hover:opacity-90"
      >
        View board paper
      </button>
    </form>
  );
}
