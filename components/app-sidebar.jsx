"use client"
import React, { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { useClerk } from "@clerk/nextjs"; // Import Clerk's hook
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { getUserAccounts } from "actions/dashboard"; // Fetch user accounts
import {
    SquareTerminal, // Dashboard icon
    User,           // Accounts icon
    CreditCard,     // Make Transaction icon
    Settings2,      // Settings icon
  } from "lucide-react";



  import { createTransaction, updateTransaction } from "@/actions/transaction";

  export function AppSidebar({
    accounts,
    categories,
    editMode = false,
    initialData = null,
    ...props // Ensure props like "collapsed" or "onCollapse" are passed to Sidebar
  }) {


    const { openUserProfile } = useClerk(); // Clerk function to open the user profile modal
    const [settingsOpen, setSettingsOpen] = useState(false); // State for toggling the Settings dropdown
  
    const handleViewProfile = () => {
      openUserProfile({ path: "user-profile/security" }); 
    };



    
    const [accountList, setAccountList] = useState([]);
    const { data: transactionResult } = useFetch(editMode ? updateTransaction : createTransaction);
  
    useEffect(() => {
      const fetchAccounts = async () => {
        try {
          const data = await getUserAccounts();
          setAccountList(data);
        } catch (error) {
          console.error("Failed to fetch accounts:", error);
        }
      };
  
      fetchAccounts();
    }, []);
  
    const data = {
      user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
      },
      teams: [
        {
          name: "Acme Inc",
          logo: SquareTerminal,
          plan: "Enterprise",
        },
        {
          name: "Acme Corp.",
          logo: User,
          plan: "Startup",
        },
      ],
      navMain: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: SquareTerminal,
          isActive: true,
        },
        {
          title: "Accounts",
          url: "#",
          icon: User,
          items: accountList.map((account) => ({
            title: account.name,
            url: `/account/${account.id}`,
          })),
        },
        {
          title: "Transactions",
          url: "#",
          icon: CreditCard,
          items: accountList.map((account) => ({
            title: account.name,
            url: `/transaction/create?accountId=${account.id}`,
          })),
        },
        {
          title: "Settings",
          url: "#",
          icon: Settings2,
          items: [
            {
              title: "View Profile",
              onClick : handleViewProfile,
            },
            {
              title: "Security",
              onClick : handleViewProfile,
            },
            
          ],
        },
      ],
    };
  
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }
  