import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppHome } from "./components/AppHome";
import { AppMenu } from "./components/AppMenu";
import './App.css'
import {AllVaults} from "./components/vault/AllVaults";
import {VaultAdd} from "./components/vault/VaultAdd";
import {VaultEdit} from "./components/vault/VaultEdit";
import {VaultDelete} from "./components/vault/VaultDelete";
import {VaultDetails} from "./components/vault/VaultDetails";
import {StatVaults} from "./components/StatisticOne";
import {StatPassws} from "./components/StatisticTwo";
import {AllAccountPasswords} from "./components/account_passwords/AllAccountPasswords";
import {AccountPasswordAdd} from "./components/account_passwords/AccountPasswordAdd";
import {AccountPasswordDetails} from "./components/account_passwords/AccountPasswordDetails";
import {AccountPasswordDelete} from "./components/account_passwords/AccountPasswordDelete";
import {AcountPasswordEdit} from "./components/account_passwords/AccountPasswordEdit";
import {AllClassicPasswords} from "./components/classic_passwords/AllClassicPasswords";
import {ClassicPasswordAdd} from "./components/classic_passwords/ClassicPasswordAdd";
import {ClassicPasswordDetails} from "./components/classic_passwords/ClassicPasswordDetails";
import {ClassicPasswordDelete} from "./components/classic_passwords/ClassicPasswordDelete";
import {ClassicPasswordEdit} from "./components/classic_passwords/ClassicPasswordEdit";
import {AllTags} from "./components/tag/AllTags";
import {TagsDetails} from "./components/tag/TagsDetails";
import {TagsDelete} from "./components/tag/TagsDelete";
import {TagsAdd} from "./components/tag/TagsAdd";
import {TagsEdit} from "./components/tag/TagsEdit";
import {FilterVaults} from "./components/FilterVaults";
import Register from "./components/Registration";
import Login from "./components/Login";
import  {AuthProvider} from "./context/AuthProvider";
import {UserProfile} from "./components/user/UserProfile";
import {UserLogout} from "./components/user/UserLogout";
import {UserEdit} from "./components/user/UserEdit";
import {ConfirmationCode} from "./components/user/ConfirmationCode";
import {OtherProfile} from "./components/user/OtherProfile";
import {Administration} from "./components/user/Administration";


function App() {
    // @ts-ignore
    return (
        <>
            <CssBaseline/>
            <Router>
                <AuthProvider>
                    <AppMenu/>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<AppHome />} />
                    <Route path="/vault" element={<AllVaults />} />
                    <Route path="/vault/:vaultId/details" element={<VaultDetails/>} />
                    <Route path="/Vault/:vaultId/edit" element={<VaultEdit />} />
                    <Route path="/vault/:vaultId/delete" element={<VaultDelete />} />
                    <Route path="/vault/add" element={<VaultAdd />} />
                    <Route path="/statistics-vault" element={<StatVaults />} />
                    <Route path="/statistics-password" element={<StatPassws />} />
                    <Route path="/account" element={<AllAccountPasswords />} />
                    <Route path="/account/add" element={<AccountPasswordAdd />} />
                    <Route path="/account/:passwId/details" element={<AccountPasswordDetails/>} />
                    <Route path="/account/:passwId/delete" element={<AccountPasswordDelete/>} />
                    <Route path="/account/:passwId/edit" element={<AcountPasswordEdit/>} />
                    <Route path="/classic" element={<AllClassicPasswords/>} />
                    <Route path="/classic/add" element={<ClassicPasswordAdd/>} />
                    <Route path="/classic/:passwId/details" element={<ClassicPasswordDetails/>} />
                    <Route path="/classic/:passwId/delete" element={<ClassicPasswordDelete/>} />
                    <Route path="/classic/:passwId/edit" element={<ClassicPasswordEdit/>} />
                    <Route path="/tag" element={<AllTags/>} />
                    <Route path="/tag/:tagId/edit" element={<TagsEdit/>} />
                    <Route path="/tag/:tagId/delete" element={<TagsDelete/>} />
                    <Route path="/tag/:tagId/details" element={<TagsDetails/>} />
                    <Route path="/tag/add" element={<TagsAdd/>} />
                    <Route path="/vault/filter" element={<FilterVaults/>} />
                    <Route path="/profile" element={<UserProfile/>} />
                    <Route path="/logout" element={<UserLogout/>} />
                    <Route path="/profile/edit" element={<UserEdit/>} />
                    <Route path="/activate" element={<ConfirmationCode/>} />
                    <Route path="/profile/:userId" element={<OtherProfile/>} />
                    <Route path="/administration" element={<Administration/>} />
                </Routes>
                </AuthProvider>
            </Router>
        </>
    );
}

export default App
