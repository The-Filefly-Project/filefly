export default function LoginScreen() {
    return (
        <div className="loginScreen">
            <div className="prompt">
                <form>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="login-username" />

                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="login-password" />

                    <input type="checkbox" name="long" id="login-long-session" />
                    <label htmlFor="long">Remember me</label>
                </form>
            </div>
        </div>
    )
}
