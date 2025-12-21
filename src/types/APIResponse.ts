import {Member} from "@/types/Member";
import {MILESTONES} from "@/data/milestones";

export interface APIStatistics {
    member_count: number;
    online_count: number;
    message_count: number;
    coding_question_count: number;
    coding_bugs_count: number;
    gaming_news_count: number;
    templates_count: number;
    tickets_count: number;
    tickets_open_count: number;
    tickets_claimed_count: number;
    giveaways_count: number;
    giveaways_scheduled_count: number;
    giveaways_active_count: number;
    backup_count: number;
    log_count: number;
    global_message_count: number;
    global_users_count: number;
    global_chats_count: number;
}

export interface APICommunity {
    supporters: Member[];
    levels: Member[];
    birthday: Member[];
    former: Member[];
}

export interface Milestone {
    id: string;
    imageKey: string;
    icon?: string;
}

export const TOTAL_MILESTONES: number = Object.keys(MILESTONES).length;
export const sadFace: string = `
⠄⠄⠄⠄⠄⢀⣠⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣄⠄⠄⠄⠄
⠄⠄⠄⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣆⠄⠄⠄
⠄⠄⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠄⠄
⠄⠄⣾⣿⡿⠟⡋⠉⠛⠻⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⠉⠉⠙⠻⣿⣿⣇⠄
⠄⢠⣿⡏⢰⣿⣿⡇⠄⠄⢸⣿⣿⣿⠿⠿⣿⣿⣿⠁⣾⣿⣷⠄⠄⠘⣿⣿
⠄⠸⣿⣇⠈⠉⠉⠄⠄⢀⣼⡿⠋⠄⠄⠄⠄⠙⢿⣄⠙⠛⠁⠄⠄⢠⣿⣿
⠄⠄⢿⣿⡇⠄⠄⠄⣶⣿⣿⢁⣤⣤⣤⣤⣤⣤⠄⣿⣷⠄⠄⠄⠈⢹⣿⡟
⠄⠄⠈⢿⡗⠄⠄⢸⣿⣿⣿⣶⣶⣶⣶⣶⣶⣶⣶⣿⣿⠄⠄⠄⠄⢸⡟
`;