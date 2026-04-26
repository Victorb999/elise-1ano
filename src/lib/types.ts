export interface Guest {
    id: string;
    name: string;
    group: string;
    hasCompanions: boolean;
    childrenCount: number;
    companionCount: number;
    companions: string[];
    confirmed: boolean | null;
    confirmedAt: string | null;
    confirmedCompanions: string[];
    totalConfirmed: number;
    message?: string;
}

export interface EventData {
    title: string;
    date: string;
    time: string;
    location: string;
    address: string;
    googleMapsUrl: string;
}
