import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { SiteCategory } from '../../lib/types';
import { useTranslation } from 'react-i18next';

export type ChartMode = 'pie' | 'bar';

export interface ChartsProps {
    mode: ChartMode;
    data: any[];
}

const COLORS = {
    [SiteCategory.WORK]: '#3b82f6',
    [SiteCategory.LEARNING]: '#10b981',
    [SiteCategory.SOCIAL]: '#ec4899',
    [SiteCategory.ENTERTAINMENT]: '#a855f7',
    [SiteCategory.SHOPPING]: '#f59e0b',
    [SiteCategory.NEWS]: '#06b6d4',
    [SiteCategory.PRODUCTIVITY]: '#4f46e5',
    [SiteCategory.AI]: '#e11d48',
    [SiteCategory.OTHER]: '#64748b',
};

const CustomTooltip = ({ active, payload, label }: any) => {
    const { t } = useTranslation();

    if (active && payload && payload.length) {
        // Bar Chart
        if (label) {
            const total = payload.reduce((acc: number, p: any) => acc + (typeof p.value === 'number' ? p.value : 0), 0);
            const totalMinutes = Math.floor(total / 60);

            return (
                <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-lg text-xs z-50">
                    <p className="font-semibold text-slate-700 mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => {
                        const val = entry.value as number;
                        if (val === 0) return null;
                        const m = Math.floor(val / 60);
                        return (
                            <div key={index} className="flex items-center space-x-2 mb-1">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-slate-500">{entry.name}:</span>
                                <span className="font-mono text-slate-700">{Math.floor(m / 60)}h {m % 60}m</span>
                            </div>
                        );
                    })}
                    <div className="mt-2 pt-2 border-t border-slate-100 font-bold text-slate-700">
                        {t('total')}: {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
                    </div>
                </div>
            );
        }
        // Pie Chart
        if (payload[0].name) {
            return (
                <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-lg text-xs z-50">
                    <p className="font-semibold text-slate-700">{payload[0].name}</p>
                    <p className="text-slate-500">
                        {Math.floor(payload[0].value / 60)}m {Math.floor(payload[0].value % 60)}s
                    </p>
                </div>
            );
        }
    }
    return null;
};

export default function Charts({ mode, data }: ChartsProps) {
    const { t } = useTranslation();

    if (mode === 'pie') {
        return (
            <div className="w-full h-full min-h-0 min-w-0 relative">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(value) => value} />
                    </PieChart>
                </ResponsiveContainer>
                {data.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm">
                        {t('no_data')}
                    </div>
                )}
            </div>
        );
    }

    // Bar Chart Mode
    const categories = Object.values(SiteCategory);

    return (
        <div className="w-full h-full min-h-0 min-w-0 relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tickFormatter={(value) => `${Math.floor(value / 3600)}h`}
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    {categories.map((cat) => (
                        <Bar
                            key={cat}
                            dataKey={cat}
                            stackId="a"
                            fill={COLORS[cat]}
                            name={t(`categories.${cat}`)}
                            radius={[0, 0, 0, 0]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
            {data.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm pointer-events-none">
                    {t('no_data')}
                </div>
            )}
        </div>
    );
}
