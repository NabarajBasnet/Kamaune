'use client';

import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { MerchantProvider } from "@/contexts/MerchantContext";
import { CampaignProvider } from "@/contexts/CampaignContext";

type ClientLayoutProps = {
    children: React.ReactNode;
};

const DashboardClientLayout = ({ children }: ClientLayoutProps) => {
    return (
        <MerchantProvider>
            <CampaignProvider>
                <div className="w-full">
                    <div className="w-full flex overflow-hidden">
                        <div className="hidden md:flex">
                            <Sidebar />
                        </div>
                        <div className="w-full h-screen overflow-y-auto">
                            <Header />
                            <div className="p-4 bg-gray-50 dark:bg-slate-950 min-h-screen w-full">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </CampaignProvider>
        </MerchantProvider>
    );
};

export default DashboardClientLayout;
