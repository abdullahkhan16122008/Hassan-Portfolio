import { Card } from "@/components/ui/card";
import { FolderOpen, Users, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { icon: FolderOpen, label: "Total Projects", value: "12" },
    { icon: CheckCircle, label: "Completed", value: "8" },
    { icon: Users, label: "Total Leads", value: "24" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <stat.icon className="h-12 w-12 text-primary opacity-20" />
            </div>
          </Card>
        ))}
      </div>
      <p className="text-muted-foreground">Use the sidebar to manage your projects and leads.</p>
    </div>
  );
}