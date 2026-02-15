import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PredictionResponse } from '@/types/prediction';

interface VisualizationPanelProps {
    result: PredictionResponse;
}

export const VisualizationPanel = ({ result }: VisualizationPanelProps) => {
    const data = [
        { name: 'Confirmed', value: (result.probabilities['CONFIRMED'] || 0) * 100 },
        { name: 'False Positive', value: (result.probabilities['FALSE POSITIVE'] || 0) * 100 }
    ];

    return (
        <div className="w-full h-64 mt-6">
            <ResponsiveContainer width="100%" height="80%">
                <BarChart data={data} layout="vertical" margin={{ left: 40, right: 20 }}>
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        width={100}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            borderColor: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(8px)',
                            color: '#fff'
                        }}
                    />
                    <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.name === 'Confirmed' ? '#00ddeb' : entry.name === 'Candidate' ? '#fbbf24' : '#ef4444'}
                                fillOpacity={0.8}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
