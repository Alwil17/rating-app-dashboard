'use client';

import { useBreadcrumb } from "@/contexts/breadcrumb.context";
import { useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { PiListStar } from "react-icons/pi";

export default function AdminItemsPage() {
    const { setPageTitle } = useBreadcrumb();
    
    useEffect(() => {
        setPageTitle('Items Management');
    }, [setPageTitle]);

    return (
        <div>
            <PageHeader
                title="Items Management"
                subtitle="Manage and organize your items catalog"
                action={{
                    label: "Add Item",
                    onClick: () => console.log("Add item clicked"),
                }}
            />
            {/* Rest of the items management components */}
        </div>
    );
}