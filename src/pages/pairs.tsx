import React, {useEffect, useState} from "react";
import {KashiPairInfos, Token, TOKEN_LIST} from "../utils/constants";
import {formatUnits} from "ethers/lib/utils";

function getTokenInfos(address: string): Token | undefined {
    return TOKEN_LIST.find(token => token.address === address);
}

export function SearchPair({setTokenSymbol}: {setTokenSymbol: Function}): JSX.Element {
    return (
        <div className="text-center">
            <label htmlFor="search" className="form-label">Search a token symbol</label>
            <input type="text" className="form-control" id="search" placeholder={"Enter token symbol here"} onChange={(event => setTokenSymbol(event.target.value))}/>
        </div>
    );
}

async function fetchPrice(index: number, asset: Token): Promise<number> {
    return fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${asset.symbol}&vs_currencies=usd`, {method: 'GET'})
        .then((res) => {
            return res.json().then((res) => {
                if (res[asset.symbol.toLowerCase()]) {
                    console.log(parseFloat(res[asset.symbol.toLowerCase()].usd))
                    return parseFloat(res[asset.symbol.toLowerCase()].usd);
                }
                return 0;
            })
        });
}

function Pairs({kashiPairs, search}: {kashiPairs: KashiPairInfos[], search: string}): JSX.Element {

    const [prices, setPrices]: [number[], Function] = useState(new Array(kashiPairs.length));

    useEffect(() => {
        async function fetchAll() {
            const prices = kashiPairs.map(async (pair, index) => {
                const asset: Token | undefined = TOKEN_LIST.find(token => token.address === pair.assetAddress);
                if (asset === undefined) {
                    return 0;
                }
                return await (fetchPrice(index, asset));
            });
            setPrices(await Promise.all(prices));
        }
        fetchAll();
    }, [kashiPairs]);

    return (
        <div>
            {
                kashiPairs.sort((pairA, pairB) => {
                    if (pairA.totalAsset.elastic > pairB.totalAsset.elastic) {
                        return -1
                    }
                    if (pairA.totalAsset.elastic < pairB.totalAsset.elastic) {
                        return 1
                    }
                    return 0;
                }).map((pair, index) => {
                    const asset: Token | undefined = getTokenInfos(pair.assetAddress);
                    const collateral: Token | undefined = getTokenInfos(pair.collateralAddress);
                    if (asset !== undefined && collateral !== undefined &&
                        (asset.symbol.toLowerCase().indexOf(search.toLowerCase()) !==  -1 || collateral.symbol.toLowerCase().indexOf(search.toLowerCase()) !== -1)) {
                        const totalAsset: number = parseFloat(formatUnits(pair.totalAsset.elastic, asset.decimals)) + parseFloat(formatUnits(pair.totalBorrow.elastic, asset.decimals));
                        const kmValue: number = totalAsset / parseFloat(formatUnits(pair.totalAsset.base, asset.decimals));
                        return (
                            <div className="card text-center">
                                <div className="card-header" key={index}>
                                    1 - km{collateral.symbol}-{asset.symbol} = {kmValue ? kmValue.toFixed(5) : 1} {asset.symbol} = {prices[index] !== 0 ? `${(kmValue * prices[index]).toFixed(5)}$` : 'Unable to fetch price'}
                                </div>
                                <div className="card-body container">
                                    <img src={asset.logoURI} alt={"img"} className={"col-3"}/>
                                    <img src={collateral.logoURI} alt={"img"} className={"col-3"}/>
                                </div>
                                <div className="card-footer text-muted">
                                    Total asset: {totalAsset.toFixed(5)} {asset.symbol}
                                </div>
                            </div>
                        );
                    }
                    return (<div></div>);
                })
            }
        </div>
    );
}

export default Pairs;
