import React from "react";
import {KashiPairInfos, Token, TOKEN_LIST} from "../utils/constants";
import {formatEther} from "ethers/lib/utils";

function getTokenInfos(address: string): Token | undefined {
    return TOKEN_LIST.find(token => token.address === address);
}

function Pairs({kashiPairs}: {kashiPairs: KashiPairInfos[]}): JSX.Element {
    return (
        <div>
            {
                kashiPairs.map((pair, index) => {
                    const asset: Token | undefined = getTokenInfos(pair.assetAddress);
                    const collateral: Token | undefined = getTokenInfos(pair.collateralAddress);
                    const totalAsset: number = parseInt(formatEther(pair.totalAsset.elastic), 10) + parseInt(formatEther(pair.totalBorrow.elastic), 10);
                    if (asset !== undefined && collateral !== undefined && totalAsset > 0.01) {
                        return (
                        <div className="card text-center">
                            <div className="card-header">
                                1 - km{collateral.symbol}-{asset.symbol} = x tokens
                            </div>
                            <div className="card-body container">
                                <img src={asset.logoURI} alt={"img"} className={"col-3"}/>
                                <img src={collateral.logoURI} alt={"img"} className={"col-3"}/>
                            </div>
                            <div className="card-footer text-muted">
                                Total asset: {totalAsset}
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
