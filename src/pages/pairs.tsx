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

async function fetchPrice(addresses: string[]): Promise<number[]> {
    return fetch(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${addresses.join(',')}&vs_currencies=usd`, {method: 'GET'})
        .then((res) => {
            return res.json().then((res) => {
                return addresses.map((address)=> {
                    if (res[address.toLowerCase()]) {
                        return res[address.toLowerCase()].usd;
                    }
                    return 0;
                });
            })
        });
}

function Pairs({kashiPairs, search}: {kashiPairs: KashiPairInfos[], search: string}): JSX.Element {

    const [prices, setPrices]: [any[], Function] = useState(new Array(kashiPairs.length));

    useEffect(() => {
        async function fetchAll() {
            const addresses: string[] = kashiPairs.map((pair) => {
                return pair.assetAddress
            });
            setPrices(await fetchPrice(addresses));
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
                                    <h5>1 - km{collateral.symbol}-{asset.symbol} = {kmValue ? kmValue.toFixed(5) : 1} {asset.symbol}</h5>
                                    <h5>1 - km{collateral.symbol}-{asset.symbol} = {prices[index] !== 0 ? `${(kmValue * prices[index]).toFixed(5)}$` : 'Unable to fetch price'}</h5>
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
