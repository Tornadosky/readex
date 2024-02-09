import React from 'react';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
    return (
        <div className="flex gap-4 items-start flex-col ">
            <span className="text-violet-600 bg-violet-500/10 p-3 rounded-full">{icon}</span>
            <div>
                <h3 className="font-semibold text-xl">{title}</h3>
                <p className="mt-1 text-gray-500">{description}</p>
            </div>
        </div>
    );
}