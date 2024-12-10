/// <reference types="../helpers.d.ts"/>
import Route from "./lib/router/Route"
import Redirect from "./lib/router/Redirect"
import LoginScreen from "./elements/pages/login/LoginScreen"
import FileExplorer from "./elements/pages/explorer/FileExplorer"
import Page404 from "./elements/pages/404/404"

export default function App() {
    return (
        <>
            <LoginScreen />

            <Route path="404">
                <Page404></Page404>
            </Route>
            <Route path="/files/*">
                <FileExplorer />
            </Route>

            <Redirect from="/" to="/files/" />
        </>
    )
}
