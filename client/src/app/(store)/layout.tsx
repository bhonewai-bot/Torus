import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Store - Torus",
    description: "Torus online store",
};

export default function StoreLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}