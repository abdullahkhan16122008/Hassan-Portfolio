import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ExternalLink, Github, ArrowUpRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface Project {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    webUrl: string;
    tags: string[];
    featured?: boolean;
}

export default function AllProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const api = import.meta.env.VITE_API_URL;

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
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="container-width section-padding">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <Link to="/#projects">
                            <Button variant="ghost" className="mb-6 -ml-4">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Home
                            </Button>
                        </Link>

                        <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
                            Portfolio
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                            All{" "}
                            <span className="gradient-text">Projects</span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl text-lg">
                            A comprehensive collection of my work showcasing expertise in full-stack development,
                            UI/UX design, and modern web technologies.
                        </p>
                    </motion.div>

                    {/* Loading State */}
                    {loading && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl bg-card border border-border animate-pulse"
                                >
                                    <div className="h-48 md:h-56 bg-muted" />
                                    <div className="p-6 space-y-4">
                                        <div className="h-6 bg-muted rounded w-3/4" />
                                        <div className="h-4 bg-muted rounded w-full" />
                                        <div className="flex gap-2">
                                            <div className="h-6 bg-muted rounded-full w-16" />
                                            <div className="h-6 bg-muted rounded-full w-20" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Projects Grid */}
                    {!loading && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {projects.map((project, index) => (
                                <motion.article
                                    key={project._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.05 * index }}
                                    className="group relative rounded-2xl overflow-hidden bg-card border border-border card-hover"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 md:h-56 overflow-hidden">
                                        <img
                                            src={project.imageUrl}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />

                                        {/* Overlay Links */}
                                        <div className="absolute inset-0 bg-primary/80 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {project.webUrl && (
                                                <motion.a
                                                    href={project.webUrl}
                                                    whileHover={{ scale: 1.1 }}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileTap={{ scale: 0.95 }}
                                                    className="p-3 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30 transition-colors"
                                                    aria-label="View live site"
                                                >
                                                    <ExternalLink className="h-5 w-5 text-primary-foreground" />
                                                </motion.a>
                                            )}
                                                <motion.a
                                                    href={'https://github.com/abdullahkhan16122008'}
                                                    whileHover={{ scale: 1.1 }}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileTap={{ scale: 0.95 }}
                                                    className="p-3 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30 transition-colors"
                                                    aria-label="View source code"
                                                >
                                                    <Github className="h-5 w-5 text-primary-foreground" />
                                                </motion.a>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                                                <Link to={project.webUrl} target="_blank" >
                                                    {project.title}
                                                </Link>
                                            </h2>
                                            <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                                        </div>
                                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags?.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2.5 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && projects.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <p className="text-muted-foreground text-lg">No projects found.</p>
                        </motion.div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
