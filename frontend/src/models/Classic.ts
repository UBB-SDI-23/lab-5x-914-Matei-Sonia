import { Vault } from "./Vault";

 export interface PasswordClassic{
     id: number;
     created_at: string;
     last_modified: string;
     vault: Vault | number;
     password: string;
     used_for: string;
     note: string;
 }