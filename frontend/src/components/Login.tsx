import { useRef, useEffect, useContext } from 'react';
import AuthContext from "../context/AuthProvider";
import {Container} from "@mui/system";

const Login = () => {
    // @ts-ignore
    const { logoutUser, loginUser } = useContext(AuthContext);
    const userRef = useRef();
    // const errRef = useRef();

    // const [user, setUser] = useState('');
    // const [pwd, setPwd] = useState('');
    // const [errMsg, setErrMsg] = useState('');
    // const [success, setSuccess] = useState(false);

    useEffect(() => {
        // @ts-ignore
        userRef.current.focus();
        logoutUser();
    }, [])

    // useEffect(() => {
    //     setErrMsg('');
    // }, [user, pwd])

    // const handleSubmit = async (e: { preventDefault: () => void; }) => {
    //     e.preventDefault();
    //
    //     try {
    //         const response = await axios.post(LOGIN_URL,
    //             JSON.stringify({ user, pwd }),
    //             {
    //                 headers: { 'Content-Type': 'application/json' },
    //                 withCredentials: true
    //             }
    //         );
    //         console.log(JSON.stringify(response?.data));
    //         //console.log(JSON.stringify(response));
    //         const accessToken = response?.data?.accessToken;
    //         const roles = response?.data?.roles;
    //         setAuth({ user, pwd, roles, accessToken });
    //         setUser('');
    //         setPwd('');
    //         setSuccess(true);
    //     } catch (err) {
    //         // @ts-ignore
    //         if (!err?.response) {
    //             setErrMsg('No Server Response');
    //         } // @ts-ignore
    //         else if (err.response?.status === 400) {
    //             setErrMsg('Missing Username or Password');
    //         } // @ts-ignore
    //         else if (err.response?.status === 401) {
    //             setErrMsg('Unauthorized');
    //         } else {
    //             setErrMsg('Login Failed');
    //         }
    //         // @ts-ignore
    //         errRef.current.focus();
    //     }
    // }

    return (
        <Container sx={{display: "flex", justifyContent: "center"}}>
                <section>
                    {/*<p // @ts-ignore*/}
                    {/*    ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>*/}
                    <h1>Sign In</h1>
                    <form onSubmit={loginUser}>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            // @ts-ignore
                            ref={userRef}
                            autoComplete="off"
                            // onChange={(e) => setUser(e.target.value)}
                            // value={user}
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            // onChange={(e) => setPwd(e.target.value)}
                            // value={pwd}
                            required
                        />
                        <button>Sign In</button>
                    </form>
                    <p>
                        Need an Account?<br />
                        <span className="line">
                            <a href="/register">Sign Up</a>
                        </span>
                    </p>
                </section>
        </Container>
    )
}

export default Login