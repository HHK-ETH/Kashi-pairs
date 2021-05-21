import React from 'react';
import Route from "./components/Route";

function App() {
    return (
        <div>
            <Route path={'/'}>
                <p>home</p>
            </Route>
            <Route path={'/pairs'}>
                <p>pairs</p>
            </Route>
        </div>
    );
}

export default App;
