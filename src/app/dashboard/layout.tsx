import DashboardClientLayout from "../../components/common/DashboardLayout";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DashboardClientLayout>
            {children}
        </DashboardClientLayout>
    );
}
