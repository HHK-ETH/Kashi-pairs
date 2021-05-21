import React from "react";

function Home({setKashiPairs}: {setKashiPairs: Function}): JSX.Element {
    return (
        <div className={'container text-center'}>
            <h1>Welcome</h1>
            <p>this is small react project to retrieve all kashi pairs and some infos.</p>
            <p>Use 2 APIs : Coingecko and Infura</p>
            <p>This is an exercise not a real project, use it at your own risks</p>
            <a className={'btn btn-primary'} href={'/pairs'}>Enter</a>
        </div>
    );
}

export default Home;
