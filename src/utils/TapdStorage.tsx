import AsyncStorage from '@react-native-async-storage/async-storage';

export type CustomerData = {
  name?: string;
  phone_number?: string;
  email?: string;
};

export type SubmitResponse =
  | { success: true; customer_id: string }
  | { success: false; error: any };

const TAPD_ENVIRONMENT = 'development';

export const TAPD_API_URL =
  TAPD_ENVIRONMENT === 'development'
    ? 'http://localhost:8000/api'
    : 'https://tapd.mobylmenu.com/api';

const KEY_PREFIX = 'tapd_seen_prompt_for_venue';
const TAPD_CUSTOMER_ID_KEY = 'tapd_customer_id';

function getStorageKey(venueId: string) {
  return `${KEY_PREFIX}_${venueId}`;
}

// AsyncStorage Helpers
async function safeSetItem(key: string, value: any) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Failed to set item in storage:', err);
  }
}

async function safeGetItem<T = any>(key: string): Promise<T | null> {
  try {
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

async function safeRemoveItem(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.warn('Failed to remove item from storage:', err);
  }
}

// Prompt Seen Logic
async function markPromptSeen(venueId: string) {
  console.log('markPromptSeen', venueId);
  await safeSetItem(getStorageKey(venueId), { seen: true, timestamp: Date.now() });
}

async function hasSeenPrompt(venueId: string): Promise<boolean> {
  console.log('hasSeenPrompt', venueId);
  const data = await safeGetItem(getStorageKey(venueId));
  return data?.seen === true;
}

async function clearPromptSeen(venueId: string) {
  await safeRemoveItem(getStorageKey(venueId));
}

async function resetPromptAfter(days: number, venueId: string) {
  const data = await safeGetItem(getStorageKey(venueId));
  const now = Date.now();
  if (!data?.timestamp || now - data.timestamp > days * 86400000) {
    await clearPromptSeen(venueId);
  }
}

// Customer ID Helpers
async function saveCustomerId(customerId: string) {
  console.log('saveCustomerId', customerId);
  await safeSetItem(TAPD_CUSTOMER_ID_KEY, customerId);
}

async function getCustomerId(): Promise<string | null> {
  const customerId = await safeGetItem(TAPD_CUSTOMER_ID_KEY);
  console.log('getCustomerId', customerId);
  return customerId;
}

async function clearCustomerId() {
  console.log('clearCustomerId');
  await safeRemoveItem(TAPD_CUSTOMER_ID_KEY);
}

// API: Submit Customer Data
async function submitCustomerData({
  apiKey,
  venueId,
  data,
}: {
  apiKey: string;
  venueId: string;
  data: CustomerData;
}): Promise<SubmitResponse> {
  const payload = {
    venue_id: venueId,
    name: data.name || null,
    phone_number: data.phone_number || null,
    email: data.email || null,
  };

  try {
    const res = await fetch(`${TAPD_API_URL}/customer-entry/submit`, {
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
  } catch (err) {
    console.error('❌ Unexpected error submitting customer info:', err);
    return { success: false, error: err };
  }
}

// API: Submit Skip
async function submitCustomerSkip({
  apiKey,
  venueId,
}: {
  apiKey: string;
  venueId: string;
}): Promise<SubmitResponse> {
  try {
    const res = await fetch(`${TAPD_API_URL}/customer-entry/submit`, {
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
  } catch (err) {
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

export {
  markPromptSeen,
  hasSeenPrompt,
  clearPromptSeen,
  resetPromptAfter,
  saveCustomerId,
  getCustomerId,
  clearCustomerId,
  submitCustomerData,
  submitCustomerSkip,
  TapdStorage,
};

export default TapdStorage;