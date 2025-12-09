export interface ImprintSectionType {
    id: string;
    title: string;
    content?: string;
    children?: ImprintSectionType[];
}