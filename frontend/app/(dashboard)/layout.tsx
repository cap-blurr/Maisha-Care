import Sidebar from "@/components/dashboard/sidebar/sidebar"

export default function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <Sidebar>
        {children}
      </Sidebar>
    )
  }