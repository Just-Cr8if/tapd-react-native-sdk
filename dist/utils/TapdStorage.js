"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapdStorage = exports.TAPD_API_URL = void 0;
exports.markPromptSeen = markPromptSeen;
exports.hasSeenPrompt = hasSeenPrompt;
exports.clearPromptSeen = clearPromptSeen;
exports.resetPromptAfter = resetPromptAfter;
exports.saveCustomerId = saveCustomerId;
exports.getCustomerId = getCustomerId;
exports.clearCustomerId = clearCustomerId;
exports.submitCustomerData = submitCustomerData;
exports.submitCustomerSkip = submitCustomerSkip;
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const TAPD_ENVIRONMENT = 'development';
exports.TAPD_API_URL = TAPD_ENVIRONMENT === 'development'
    ? 'http://localhost:8000/api'
    : 'https://tapd.mobylmenu.com/api';
const KEY_PREFIX = 'tapd_seen_prompt_for_venue';
const TAPD_CUSTOMER_ID_KEY = 'tapd_customer_id';
function getStorageKey(venueId) {
    return `${KEY_PREFIX}_${venueId}`;
}
// AsyncStorage Helpers
async function safeSetItem(key, value) {
    try {
        await async_storage_1.default.setItem(key, JSON.stringify(value));
    }
    catch (err) {
        console.warn('Failed to set item in storage:', err);
    }
}
async function safeGetItem(key) {
    try {
        const item = await async_storage_1.default.getItem(key);
        return item ? JSON.parse(item) : null;
    }
    catch {
        return null;
    }
}
async function safeRemoveItem(key) {
    try {
        await async_storage_1.default.removeItem(key);
    }
    catch (err) {
        console.warn('Failed to remove item from storage:', err);
    }
}
// Prompt Seen Logic
async function markPromptSeen(venueId) {
    console.log('markPromptSeen', venueId);
    await safeSetItem(getStorageKey(venueId), { seen: true, timestamp: Date.now() });
}
async function hasSeenPrompt(venueId) {
    console.log('hasSeenPrompt', venueId);
    const data = await safeGetItem(getStorageKey(venueId));
    return data?.seen === true;
}
async function clearPromptSeen(venueId) {
    await safeRemoveItem(getStorageKey(venueId));
}
async function resetPromptAfter(days, venueId) {
    const data = await safeGetItem(getStorageKey(venueId));
    const now = Date.now();
    if (!data?.timestamp || now - data.timestamp > days * 86400000) {
        await clearPromptSeen(venueId);
    }
}
// Customer ID Helpers
async function saveCustomerId(customerId) {
    console.log('saveCustomerId', customerId);
    await safeSetItem(TAPD_CUSTOMER_ID_KEY, customerId);
}
async function getCustomerId() {
    const customerId = await safeGetItem(TAPD_CUSTOMER_ID_KEY);
    console.log('getCustomerId', customerId);
    return customerId;
}
async function clearCustomerId() {
    console.log('clearCustomerId');
    await safeRemoveItem(TAPD_CUSTOMER_ID_KEY);
}
// API: Submit Customer Data
async function submitCustomerData({ apiKey, venueId, data, }) {
    const payload = {
        venue_id: venueId,
        name: data.name || null,
        phone_number: data.phone_number || null,
        email: data.email || null,
    };
    try {
        const res = await fetch(`${exports.TAPD_API_URL}/customer-entry/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify(payload),
        });
        const responseBody = await res.json().catch(() => null);
        if (!res.ok || !responseBody?.customer_id) {
            console.error('❌ Customer submission failed:', res.status, responseBody);
            return { success: false, error: responseBody };
        }
        await markPromptSeen(venueId);
        await saveCustomerId(responseBody.customer_id);
        return { success: true, customer_id: responseBody.customer_id };
    }
    catch (err) {
        console.error('❌ Unexpected error submitting customer info:', err);
        return { success: false, error: err };
    }
}
// API: Submit Skip
async function submitCustomerSkip({ apiKey, venueId, }) {
    try {
        const res = await fetch(`${exports.TAPD_API_URL}/customer-entry/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify({ venue_id: venueId, skipped: true }),
        });
        const responseBody = await res.json().catch(() => null);
        if (!res.ok || !responseBody?.customer_id) {
            console.error('❌ Skip submission failed:', res.status, responseBody);
            return { success: false, error: responseBody };
        }
        await markPromptSeen(venueId);
        await saveCustomerId(responseBody.customer_id);
        return { success: true, customer_id: responseBody.customer_id };
    }
    catch (err) {
        console.error('❌ Unexpected error skipping customer prompt:', err);
        return { success: false, error: err };
    }
}
// Export
const TapdStorage = {
    markPromptSeen,
    hasSeenPrompt,
    clearPromptSeen,
    resetPromptAfter,
    saveCustomerId,
    getCustomerId,
    clearCustomerId,
    submitCustomerData,
    submitCustomerSkip,
};
exports.TapdStorage = TapdStorage;
exports.default = TapdStorage;
