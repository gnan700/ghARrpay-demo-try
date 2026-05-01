"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { cn } from '@/lib/utils';
import { Building2, MapPin, IndianRupee, Tag, Search, Filter, ChevronRight } from 'lucide-react';
import DataStateDisplay from '@/components/common/DataStateDisplay';

interface Property {
    _id: string;
    name: string;
    location: string;
    price: number;
    type: string;
    available: boolean;
}

export default function PropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/properties`);
            const data = await response.json();
            setProperties(data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/properties/${id}/availability`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ available: !currentStatus })
            });

            if (response.ok) {
                const updatedProp = await response.json();
                setProperties(properties.map(p => p._id === id ? updatedProp : p));
            }
        } catch (error) {
            console.error('Error toggling availability:', error);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const filteredProperties = properties.filter(prop =>
        prop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prop.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Properties</h1>
                    <p className="text-slate-500 font-medium mt-1">Explore and manage available PG accommodations</p>
                </div>
            </div>

            <div className="bg-[#181818] rounded-[32px] border border-[#2E2E2E] p-8 mb-10">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search properties by name or location..."
                        className="w-full bg-[#1E1E1E] border border-[#2E2E2E] rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4ADE80] transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <DataStateDisplay
                isLoading={loading && properties.length === 0}
                isEmpty={!loading && filteredProperties.length === 0}
                emptyMessage={searchTerm ? `No properties found for "${searchTerm}"` : "No properties listed"}
                onRefresh={fetchProperties}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProperties.map((property) => (
                        <div key={property._id} className="bg-[#181818] rounded-[32px] border border-[#2E2E2E] overflow-hidden group hover:border-[#4ADE80]/30 transition-all shadow-xl flex flex-col">
                            <div className="p-8 flex-1">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="h-14 w-14 rounded-2xl bg-[#252525] flex items-center justify-center text-[#4ADE80] group-hover:bg-[#4ADE80] group-hover:text-[#121212] transition-all">
                                        <Building2 className="h-7 w-7" />
                                    </div>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                        property.available ? "bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                                    )}>
                                        {property.available ? 'Available' : 'Full'}
                                    </span>
                                </div>

                                <h3 className="text-xl font-black text-white mb-2 leading-tight group-hover:text-[#4ADE80] transition-colors">
                                    {property.name}
                                </h3>

                                <div className="space-y-3 mt-6">
                                    <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                                        <MapPin className="h-4 w-4 text-[#4ADE80]" />
                                        {property.location}
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                                        <Tag className="h-4 w-4 text-[#4ADE80]" />
                                        {property.type} Sharing
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center gap-1">
                                    <IndianRupee className="h-4 w-4 text-[#4ADE80]" />
                                    <span className="text-2xl font-black text-white">{property.price.toLocaleString()}</span>
                                    <span className="text-slate-500 text-xs font-bold uppercase ml-1">/mo</span>
                                </div>
                            </div>

                            <div className="px-8 pb-8">
                                <button
                                    onClick={() => handleToggleAvailability(property._id, property.available)}
                                    className={cn(
                                        "w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border",
                                        property.available
                                            ? "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white"
                                            : "bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/20 hover:bg-[#4ADE80] hover:text-[#121212]"
                                    )}
                                >
                                    {property.available ? 'Mark as Full' : 'Mark as Available'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </DataStateDisplay>
        </DashboardLayout >
    );
}
