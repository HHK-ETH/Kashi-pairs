import React from "react";
import {KashiPairInfos, Token, TOKEN_LIST} from "../utils/constants";
import {formatEther} from "ethers/lib/utils";

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

function Pairs({kashiPairs, search}: {kashiPairs: KashiPairInfos[], search: string}): JSX.Element {
    return (
        <div>
            {
                kashiPairs.sort((pairA, pairB) => {
                    if (parseInt(formatEther(pairA.totalAsset.elastic), 10) > parseInt(formatEther(pairB.totalAsset.elastic), 10)) {
                        return -1
                    }
                    if (parseInt(formatEther(pairA.totalAsset.elastic), 10) < parseInt(formatEther(pairB.totalAsset.elastic), 10)) {
                        return 1
                    }
                    return 0;
                }).map((pair, index) => {
                    const asset: Token | undefined = getTokenInfos(pair.assetAddress);
                    const collateral: Token | undefined = getTokenInfos(pair.collateralAddress);
                    const totalAsset: number = parseInt(formatEther(pair.totalAsset.elastic), 10) + parseInt(formatEther(pair.totalBorrow.elastic), 10);
                    const kmValue: number = totalAsset / parseInt(formatEther(pair.totalAsset.base), 10)
                    if (asset !== undefined && collateral !== undefined &&
                        (asset.symbol.toLowerCase().indexOf(search.toLowerCase()) !==  -1 || collateral.symbol.toLowerCase().indexOf(search.toLowerCase()) !== -1)) {
                        return (
                        <div className="card text-center">
                            <div className="card-header">
                                1 - km{collateral.symbol}-{asset.symbol} = {kmValue ? kmValue : 1} {asset.symbol} = x $
                            </div>
                            <div className="card-body container">
                                <img src={asset.logoURI} alt={"img"} className={"col-3"}/>
                                <img src={collateral.logoURI} alt={"img"} className={"col-3"}/>
                            </div>
                            <div className="card-footer text-muted">
                                Total asset: {totalAsset} {asset.symbol}
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
