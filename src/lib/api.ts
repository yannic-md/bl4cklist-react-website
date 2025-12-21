import {APICommunity, APIStatistics} from "@/types/APIResponse";
import {Member} from "@/types/Member";


const API_BASE_URL: string = process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? 'http://localhost:8081/stats/web2' : process.env.NEXT_PUBLIC_CONFIG_API_BASE_URL!;


/** Fetches data from the API endpoint.
 *
 * @template T - The expected response type
 * @param {string} endpoint - The API endpoint path (defaults to empty string for base URL)
 * @param {number} revalidate - Cache revalidation time in seconds (defaults to 300)
 * @returns {Promise<T | null>} The parsed JSON response or null if the request fails
 */
async function fetchFromAPI<T>(endpoint: string = '', revalidate: number = 300): Promise<T | null> {
    try {
        const url: string = endpoint ? `${API_BASE_URL}${endpoint}` : API_BASE_URL;
        const response: Response = await fetch(url, { next: { revalidate } });

        if (!response.ok) {
            console.error(`Failed to fetch from ${url}: HTTP ${response.status}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch from API:`, error);
        return null;
    }
}


/** Fetches guild statistics from the API.
 *
 * @returns {Promise<APIStatistics | null>} The guild statistics object or null if the request fails
 */
export async function fetchGuildStatistics(): Promise<APIStatistics | null> {
    return fetchFromAPI<APIStatistics>('', 300);
}

/** Fetches bl4cklist's team members from the API.
 *
 * @returns {Promise<Member[] | null>} The team member objects or null if the request fails
 */
export async function fetchTeamMembers(): Promise<Member[] | null> {
    return fetchFromAPI<Member[]>('/team', 600);
}

/** Fetches some of the most loyal members of bl4cklist from the API.
 *
 * @returns {Promise<APICommunity | null>} The formatted response for all community members or null if the request fails
 */
export async function fetchCommunityMembers(): Promise<APICommunity | null> {
    return fetchFromAPI<APICommunity>('/community', 300);
}

/**
 * Sends contact form data to the backend API with Turnstile verification.
 *
 * @param {FormData} formData - The form data containing user input fields
 * @param {string} turnstileToken - The Cloudflare Turnstile verification token
 * @param {'unban' | 'general'} formType - The type of contact form being submitted
 *
 * @returns {Promise<boolean>} Response indicating success or failure
 */
export async function submitContactForm(formData: FormData, turnstileToken: string,
                                        formType: 'unban' | 'general'): Promise<boolean> {
    try {
        const payload = {formType, turnstileToken, ...Object.fromEntries(formData.entries())};

        const response: Response = await fetch(`${API_BASE_URL}/contact`, {method: 'POST',
            headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error(`Failed to submit contact form: HTTP ${response.status}`);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Failed to submit contact form:', error);
        return false;
    }
}

/**
 * Saves the milestones achieved by a user to the backend.
 * (Not necessary to let the entire system work; just for tracking)
 *
 * @param userId - The user's Discord ID
 * @param milestones - Array of milestone IDs
 * @returns {Promise<boolean>} - True if successful
 */
export async function saveUserMilestones(userId: string, milestones: string[]): Promise<boolean> {
    try {
        const response: Response = await fetch(`${API_BASE_URL}/milestones/sync`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, milestones })
        });

        return response.ok;
    } catch (error) {
        console.error('Failed to save milestones:', error);
        return false;
    }
}
