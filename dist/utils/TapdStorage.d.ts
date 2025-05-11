export type CustomerData = {
    name?: string;
    phone_number?: string;
    email?: string;
};
export type SubmitResponse = {
    success: true;
    customer_id: string;
} | {
    success: false;
    error: any;
};
export declare const TAPD_API_URL: string;
declare function markPromptSeen(venueId: string): Promise<void>;
declare function hasSeenPrompt(venueId: string): Promise<boolean>;
declare function clearPromptSeen(venueId: string): Promise<void>;
declare function resetPromptAfter(days: number, venueId: string): Promise<void>;
declare function saveCustomerId(customerId: string): Promise<void>;
declare function getCustomerId(): Promise<string | null>;
declare function clearCustomerId(): Promise<void>;
declare function submitCustomerData({ apiKey, venueId, data, }: {
    apiKey: string;
    venueId: string;
    data: CustomerData;
}): Promise<SubmitResponse>;
declare function submitCustomerSkip({ apiKey, venueId, }: {
    apiKey: string;
    venueId: string;
}): Promise<SubmitResponse>;
declare const TapdStorage: {
    markPromptSeen: typeof markPromptSeen;
    hasSeenPrompt: typeof hasSeenPrompt;
    clearPromptSeen: typeof clearPromptSeen;
    resetPromptAfter: typeof resetPromptAfter;
    saveCustomerId: typeof saveCustomerId;
    getCustomerId: typeof getCustomerId;
    clearCustomerId: typeof clearCustomerId;
    submitCustomerData: typeof submitCustomerData;
    submitCustomerSkip: typeof submitCustomerSkip;
};
export { markPromptSeen, hasSeenPrompt, clearPromptSeen, resetPromptAfter, saveCustomerId, getCustomerId, clearCustomerId, submitCustomerData, submitCustomerSkip, TapdStorage, };
export default TapdStorage;
