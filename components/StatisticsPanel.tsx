"use client";

import { useMemo } from "react";
import { Project } from "./ProjectCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { parseRevenue } from "@/lib/utils";

interface StatisticsPanelProps {
    projects: Project[];
    filteredProjects: Project[];
}

export function StatisticsPanel({ projects, filteredProjects }: StatisticsPanelProps) {
    // Calculate statistics
    const stats = useMemo(() => {
        if (!filteredProjects) return { totalProjects: 0, avgRevenue: 0, maxRevenue: 0, totalRevenue: 0 };
        const revenues = filteredProjects.map(p => parseRevenue(p.revenue)).filter(r => r > 0);
        const totalRevenue = revenues.reduce((sum, r) => sum + r, 0);
        const avgRevenue = revenues.length > 0 ? totalRevenue / revenues.length : 0;
        const maxRevenue = revenues.length > 0 ? Math.max(...revenues) : 0;

        return {
            totalProjects: filteredProjects.length,
            avgRevenue: Math.round(avgRevenue),
            maxRevenue: Math.round(maxRevenue),
            totalRevenue: Math.round(totalRevenue),
        };
    }, [filteredProjects]);

    // Revenue distribution data
    const revenueDistribution = useMemo(() => {
        if (!filteredProjects) return [];
        const ranges = [
            { name: "$0-500", min: 0, max: 500, count: 0, color: "#10b981" },
            { name: "$500-1k", min: 500, max: 1000, count: 0, color: "#3b82f6" },
            { name: "$1k-5k", min: 1000, max: 5000, count: 0, color: "#8b5cf6" },
            { name: "$5k-10k", min: 5000, max: 10000, count: 0, color: "#f59e0b" },
            { name: "$10k+", min: 10000, max: Infinity, count: 0, color: "#ef4444" },
        ];

        filteredProjects.forEach(p => {
            const rev = parseRevenue(p.revenue);
            if (rev > 0) {
                const range = ranges.find(r => rev > r.min && rev <= r.max);
                if (range) range.count++;
            }
        });

        return ranges.filter(r => r.count > 0);
    }, [filteredProjects]);

    // Tech stack frequency
    const techStackFrequency = useMemo(() => {
        if (!filteredProjects) return [];
        const techCount: Record<string, number> = {};

        filteredProjects.forEach(p => {
            if (p.stack && Array.isArray(p.stack)) {
                p.stack.forEach(tech => {
                    techCount[tech] = (techCount[tech] || 0) + 1;
                });
            }
        });

        return Object.entries(techCount)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10); // Top 10 tech stacks for better visibility
    }, [filteredProjects]);

    // Year distribution - Uses all projects to show full timeline context
    const yearDistribution = useMemo(() => {
        if (!projects) return [];
        const yearCount: Record<number, number> = {};

        projects.forEach(p => {
            yearCount[p.year] = (yearCount[p.year] || 0) + 1;
        });

        return Object.entries(yearCount)
            .map(([year, count]) => ({ year, count }))
            .sort((a, b) => Number(a.year) - Number(b.year)); // Sort chronologically
    }, [projects]);

    const chartConfig = {
        count: {
            label: "Projects",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="glass bg-white/50 dark:bg-gray-950/50 border-border dark:border-cyan-500/30 relative overflow-hidden group shadow-sm">
                     <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-500/50 opacity-0 dark:opacity-100" />
                    <CardHeader className="pb-2 relative z-10">
                        <CardDescription className="text-muted-foreground dark:text-cyan-500/70 font-mono text-xs uppercase tracking-wider">Total Projects</CardDescription>
                        <CardTitle className="text-3xl font-bold text-foreground dark:text-cyan-50 font-mono">{stats.totalProjects}</CardTitle>
                    </CardHeader>
                    <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-16 h-16 text-primary dark:text-cyan-500" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
                    </div>
                </Card>

                <Card className="glass bg-white/50 dark:bg-gray-900/50 border-border dark:border-cyan-500/30 relative overflow-hidden group shadow-sm">
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-500/50 opacity-0 dark:opacity-100" />
                    <CardHeader className="pb-2 relative z-10">
                        <CardDescription className="text-muted-foreground dark:text-cyan-500/70 font-mono text-xs uppercase tracking-wider">Avg Revenue</CardDescription>
                        <CardTitle className="text-3xl font-bold text-primary dark:text-cyan-400 font-mono dark:shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                            ${stats.avgRevenue.toLocaleString()}<span className="text-sm text-muted-foreground dark:text-cyan-600">/mo</span>
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card className="glass bg-white/50 dark:bg-gray-900/50 border-border dark:border-cyan-500/30 relative overflow-hidden group shadow-sm">
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-500/50 opacity-0 dark:opacity-100" />
                    <CardHeader className="pb-2 relative z-10">
                        <CardDescription className="text-muted-foreground dark:text-cyan-500/70 font-mono text-xs uppercase tracking-wider">Max Revenue</CardDescription>
                        <CardTitle className="text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono dark:shadow-[0_0_15px_rgba(96,165,250,0.2)]">
                            ${stats.maxRevenue.toLocaleString()}<span className="text-sm text-muted-foreground dark:text-blue-600">/mo</span>
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card className="glass bg-white/50 dark:bg-gray-900/50 border-border dark:border-cyan-500/30 relative overflow-hidden group shadow-sm">
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-500/50 opacity-0 dark:opacity-100" />
                    <CardHeader className="pb-2 relative z-10">
                        <CardDescription className="text-muted-foreground dark:text-cyan-500/70 font-mono text-xs uppercase tracking-wider">Total Revenue</CardDescription>
                        <CardTitle className="text-3xl font-bold text-purple-600 dark:text-purple-400 font-mono dark:shadow-[0_0_15px_rgba(192,132,252,0.2)]">
                            ${stats.totalRevenue.toLocaleString()}<span className="text-sm text-muted-foreground dark:text-purple-600">/mo</span>
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Distribution */}
                <Card className="glass bg-white/50 dark:bg-gray-900/50 border-border dark:border-cyan-500/30">
                    <CardHeader>
                        <CardTitle className="text-foreground dark:text-cyan-50 font-mono uppercase tracking-wider text-lg">// Revenue_Distribution_</CardTitle>
                        <CardDescription className="text-muted-foreground dark:text-cyan-500/50 text-xs">
                            [PROJECTS_GROUPED_BY_MONTHLY_REVENUE]
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={revenueDistribution}
                                        dataKey="count"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        innerRadius={40}
                                        label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                                        stroke="rgba(0,0,0,0.1)"
                                        strokeWidth={2}
                                    >
                                        {revenueDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Legend verticalAlign="bottom" height={36} iconType="square" />
                                    <ChartTooltip 
                                        content={<ChartTooltipContent className="bg-popover border-border dark:bg-gray-900 dark:border-cyan-500/50 text-popover-foreground dark:text-cyan-50 font-mono" />} 
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Year Distribution */}
                <Card className="glass bg-white/50 dark:bg-gray-900/50 border-border dark:border-cyan-500/30">
                    <CardHeader>
                        <CardTitle className="text-foreground dark:text-cyan-50 font-mono uppercase tracking-wider text-lg">// Projects_by_Year_</CardTitle>
                        <CardDescription className="text-muted-foreground dark:text-cyan-500/50 text-xs">
                            [TIMELINE_ANALYSIS]
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={yearDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                                    <XAxis 
                                        dataKey="year" 
                                        stroke="currentColor" 
                                        className="text-muted-foreground"
                                        tick={{ fontSize: 12, fontFamily: 'monospace' }}
                                        interval={filteredProjects.length > 1000 ? "preserveStartEnd" : 0}
                                    />
                                    <YAxis stroke="currentColor" className="text-muted-foreground" tick={{ fontSize: 12, fontFamily: 'monospace' }} />
                                    <ChartTooltip 
                                        content={<ChartTooltipContent className="bg-popover border-border dark:bg-gray-900 dark:border-cyan-500/50 text-popover-foreground dark:text-cyan-50 font-mono" />}
                                        cursor={{ fill: 'rgba(6,182,212,0.1)' }}
                                    />
                                    <Bar dataKey="count" fill="var(--color-primary)" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Tech Stack Usage Bar Chart */}
            <Card className="glass bg-white/50 dark:bg-gray-900/50 border-border dark:border-cyan-500/30">
                <CardHeader>
                    <CardTitle className="text-foreground dark:text-cyan-50 font-mono uppercase tracking-wider text-lg">// Top_10_Tech_Stacks_</CardTitle>
                    <CardDescription className="text-muted-foreground dark:text-cyan-500/50 text-xs">
                        [FREQUENCY_ANALYSIS_MATRIX]
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={techStackFrequency} layout="vertical" margin={{ left: 30, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                                <XAxis type="number" stroke="currentColor" className="text-muted-foreground" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    width={100} 
                                    stroke="currentColor" 
                                    className="text-muted-foreground"
                                    tick={{ fontSize: 12, fontFamily: 'monospace' }}
                                />
                                <ChartTooltip 
                                    content={<ChartTooltipContent className="bg-popover border-border dark:bg-gray-900 dark:border-cyan-500/50 text-popover-foreground dark:text-cyan-50 font-mono" />}
                                    cursor={{ fill: 'rgba(6,182,212,0.1)' }}
                                />
                                <Bar 
                                    dataKey="count" 
                                    fill="var(--color-accent)" 
                                    radius={[0, 2, 2, 0]} 
                                    label={{ position: 'right', fill: 'currentColor', fontSize: 12, fontFamily: 'monospace' }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}