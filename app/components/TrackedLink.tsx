"use client";

import { track } from "@vercel/analytics";
import { ReactNode } from "react";

interface TrackedLinkProps {
  href: string;
  event: string;
  location: string;
  className?: string;
  children: ReactNode;
}

export default function TrackedLink({
  href,
  event,
  location,
  className,
  children,
}: TrackedLinkProps) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track(event, { location })}
    >
      {children}
    </a>
  );
}
