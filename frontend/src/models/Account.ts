import { Vault } from "./Vault";
import { TagPassword } from "./TagPassword";

export interface PasswordAccount {
    id: number;
    created_at: string;
    last_modified: string;
    vault: Vault | number;
    password: string;
    website_or_app: string;
    username_or_email: string;
    note: string;
    tags: TagPassword[];
    nb_tgs: number;
}