import React, {useEffect, useState} from 'react';
import Route from "./components/Route";
import Pairs from "./pages/pairs";
import Home from "./pages/home";
import {KashiPairInfos} from "./utils/constants";

function App() {

    const [kashiPairs, setKashiPairs]: [KashiPairInfos[], Function] = useState([]);

    return (
        <div className={'container'}>
            <Route path={'/'}>
                <Home setKashiPairs={setKashiPairs}/>
            </Route>
            <Route path={'/pairs'}>
                <Pairs kashiPairs={kashiPairs}/>
            </Route>
        </div>
    );
}

export default App;
