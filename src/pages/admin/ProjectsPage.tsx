import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, CheckCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const initialProjects = [
    {
        id: 1,
        title: "E-Commerce Platform",
        description: "A full-stack e-commerce solution with real-time inventory and payments.",
        tags: ["Next.js", "Stripe", "PostgreSQL"],
        imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
        featured: true,
        completed: true,
    },
    // Add more...
];

export default function ProjectsPage() {
    //   const [projects, setProjects] = useState(initialProjects);
    const [isOpen, setIsOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const [form, setForm] = useState({
        title: "",
        description: "",
        tags: "",
        imageFile: null as File | null,
        imagePreview: "", // For preview
        webUrl: "", // For preview
        featured: false,
        completed: false,
    });

    const resetForm = () => {
        setForm({
            title: "",
            description: "",
            tags: "",
            imageFile: null,
            imagePreview: "",
            webUrl: "",
            featured: false,
            completed: false,
        });
        setEditing(null);
    };

    let api = import.meta.env.VITE_API_URL;


    useEffect(() => {
        fetchProjects();
    }, []);


    const fetchProjects = async () => {
        try {
            const res = await fetch(`${api}/api/admin/project/get`, { method: "POST" });
            const data = await res.json();
            if (data.success) {
                setProjects(data.projects);
            }
        } catch (err) {
            toast({ title: "Failed to load projects" });
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm({ ...form, imageFile: file, imagePreview: URL.createObjectURL(file) });
        }
    };

    const handleSave = async () => {
        const tagsArray = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("tags", JSON.stringify(tagsArray));
        formData.append("featured", String(form.featured));
        formData.append("webUrl", String(form.webUrl));
        formData.append("completed", String(form.completed));
        if (form.imageFile) formData.append("image", form.imageFile);

        try {
            const url = editing
                ? `${api}/api/admin/projects/edit/${editing._id}`
                : `${api}/api/admin/projects/add`;
            const method = editing ? "PUT" : "POST";

            const res = await fetch(url, { method, body: formData });
            const data = await res.json();

            if (data.success) {
                toast({ title: editing ? "Project updated!" : "Project added!" });
                fetchProjects(); // refresh list
                setIsOpen(false);
                resetForm();
            } else {
                toast({ title: data.message || "Error" });
            }
        } catch (err) {
            toast({ title: "Network error" });
        }
    };

    const handleDelete = async (_id: string) => {
        if (!confirm("Delete this project?")) return;

        try {
            const res = await fetch(`${api}/api/admin/project/delete/${_id}`, { method: "POST" });
            const data = await res.json();
            if (data.success) {
                toast({ title: "Project deleted" });
                fetchProjects();
            }
        } catch (err) {
            toast({ title: "Delete failed" });
        }
    };

    const openEdit = (project: any) => {
        setEditing(project);
        setForm({
            title: project.title,
            description: project.description,
            tags: project.tags.join(", "),
            imageFile: null,
            imagePreview: project.imageUrl,
            featured: project.featured,
            webUrl: project.webUrl,
            completed: project.completed,
        });
        setIsOpen(true);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Projects Management</h1>
                <Button onClick={() => { resetForm(); setIsOpen(true); }}>
                    <Plus className="mr-2 h-5 w-5" /> Add Project
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, i) => (
                    <motion.div
                        key={project._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="overflow-hidden card-hover">
                            <img src={project.imageUrl || "/placeholder.svg"} alt={project.title} className="h-48 w-full object-cover" />
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-lg">{project.title}</h3>
                                    {project.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                                </div>
                                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
                                <a className="text-muted-foreground underline text-sm mb-4 line-clamp-2" target="_blank">{project.webUrl}</a>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tags.map((tag: string) => (
                                        <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-secondary">{tag}</span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => openEdit(project)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => handleDelete(project._id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Modal with Image Upload */}
            <Dialog open={isOpen} onOpenChange={setIsOpen} >
                <DialogContent className="max-w-2xl max-h-[98vh] overflow-auto ">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Edit" : "Add New"} Project</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div>
                            <Label>Title</Label>
                            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        </div>
                        <div>
                            <Label>Website Url</Label>
                            <Input value={form.webUrl} onChange={(e) => setForm({ ...form, webUrl: e.target.value })} />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        </div>
                        <div>
                            <Label>Tags (comma separated)</Label>
                            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                        </div>

                        {/* Image Upload with Preview */}
                        <div>
                            <Label>Project Image</Label>
                            <div className="mt-2">
                                {form.imagePreview ? (
                                    <div className="relative inline-block">
                                        <img src={form.imagePreview} alt="Preview" className="h-48 rounded-lg object-cover" />
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            className="absolute top-2 right-2"
                                            onClick={() => setForm({ ...form, imageFile: null, imagePreview: "" })}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/50">
                                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                        <span className="text-sm text-muted-foreground">Click to upload image</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                                <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                                <Label>Featured</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch checked={form.completed} onCheckedChange={(v) => setForm({ ...form, completed: v })} />
                                <Label>Completed</Label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave}>Save Project</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
