import React, {useState} from "react";
import {KashiHelper} from "../utils/kashiHelper";
import {KashiPairInfos} from "../utils/constants";

function Spinner({display}: {display: boolean}): JSX.Element {
    if (display) {
        return (
            <div className={"text-center"}>
                <div className={"spinner-border"} role={"status"}>
                    <span className={"visually-hidden"}>Loading...</span>
                </div>
                Fetching pairs...
            </div>
        );
    }
    return (<div></div>);
}

function Home({setKashiPairs}: {setKashiPairs: Function}): JSX.Element {
    const [spinner, setSpinner]: [boolean, Function] = useState(false);
    const onClick = async function(event: any) {
        event.preventDefault();
        setSpinner(true);
        const kashiHelper: KashiHelper = await KashiHelper.getInstance();
        const kashiPairs: KashiPairInfos[] = await KashiHelper.kashiPairsInfos(kashiHelper.kashiPairs);
        setKashiPairs(kashiPairs);
        setSpinner(false);
        window.history.pushState({}, "", '/pairs');
        const navEvent = new PopStateEvent('popstate');
        window.dispatchEvent(navEvent);
    };

    return (
        <div className={'container text-center'}>
            <h1>Welcome</h1>
            <p>this is small react project to retrieve all kashi pairs and some infos.</p>
            <p>Use 2 APIs : Coingecko and Infura</p>
            <p>This is an exercise not a real project, use it at your own risks</p>
            <a className={'btn btn-primary'} href={'/pairs'} onClick={onClick}>Enter</a>
            <Spinner display={spinner}/>
        </div>
    );
}

export default Home;
