import { Vault } from "./Vault";
import { TagPassword } from "./TagPassword";

export interface Tag {
    id: number;
    nb_acc: number;
    title: string;
    vault: Vault | number;
    tagged_passwords: TagPassword[];
}