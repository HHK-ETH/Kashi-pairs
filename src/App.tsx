import React, {useState} from 'react';
import Route from "./components/Route";
import Pairs, {SearchPair} from "./pages/pairs";
import Home from "./pages/home";
import {KashiPairInfos} from "./utils/constants";

function App() {

    const [kashiPairs, setKashiPairs]: [KashiPairInfos[], Function] = useState([]);
    const [tokenSymbol, setTokenSymbol]: [string, Function] = useState('');

    return (
        <div className={'container'}>
            <Route path={'/'}>
                <Home setKashiPairs={setKashiPairs}/>
            </Route>
            <Route path={'/pairs'}>
                <SearchPair setTokenSymbol={setTokenSymbol}/>
                <Pairs kashiPairs={kashiPairs} search={tokenSymbol}/>
            </Route>
        </div>
    );
}

export default App;
