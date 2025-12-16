import {APICommunity, APIStatistics} from "@/types/APIResponse";
import {Member} from "@/types/Member";
import {CONFIG_API_BASE_URL} from "@/data/apiData";


const API_BASE_URL: string = CONFIG_API_BASE_URL ?? 'http://localhost:3000';


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