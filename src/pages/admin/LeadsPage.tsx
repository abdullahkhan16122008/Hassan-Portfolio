import { motion } from "framer-motion";
import { Mail, Calendar, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const initialLeads = [
    { id: 1, name: "John Doe", email: "john@example.com", message: "Interested in e-commerce project", date: "2025-12-14" },
    { id: 2, name: "Sarah Lee", email: "sarah@company.com", message: "Need a mobile app", date: "2025-12-12" },
];

export default function LeadsPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    let api = import.meta.env.VITE_API_URL;


    useEffect(() => {
        fetchLeads();
    }, []);



    const fetchLeads = async () => {
        try {
            const res = await fetch(`${api}/api/admin/contacts/get`, { method: "POST" });
            const data = await res.json();
            if (data.success) {
                setLeads(data.contacts);
            }
        } catch (err) {
            toast({ title: "Failed to load leads" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (_id) => {
        if (!confirm("Delete this lead permanently?")) return;

        try {
            const res = await axios.post(`${api}/api/admin/contact/delete`, {_id} );
            if (res.data.success) {
                toast({ title: "Lead deleted" });
                fetchLeads();
            }
        } catch (err) {
            toast({ title: "Delete failed" });
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading leads...</div>;
    }
    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Leads ({leads.length})</h1>
            <div className="space-y-6">
                {leads.map((lead, i) => (
                    <motion.div
                        key={lead.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="p-6 card-hover">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold">{lead.name}</h3>
                                        <Button size="sm" variant="ghost" onClick={() => handleDelete(lead._id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> {lead.email}</span>
                                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {lead.date}</span>
                                    </div>
                                    <p className="mt-4">{lead.message}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}