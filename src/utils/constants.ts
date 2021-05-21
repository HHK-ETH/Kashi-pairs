import bentobox from "./abi/bentobox.json";
import kashiMaster from "./abi/kashiPairMediumRiskV1.json";
import list from './tokenList.json';

export type Token = {
    address: string,
    chainId: number,
    name: string,
    symbol: string,
    decimals: number,
    logoURI: string
}

export type KashiPairInfos = {
    assetAddress: string;
    collateralAddress: string;
    accrueInfo: {
        interestPerSecond: any,
        lastAccrued: any,
        feesEarnedFraction: any,
    };
    totalAsset: {
        elastic: any,
        base: any
    },
    totalBorrow: {
        elastic: any,
        base: any
    }
}

export const BENTO_BOX_ADDR = bentobox.address;

export const BENTO_BOX_ABI = bentobox.abi;

export const KASHI_ADDR = kashiMaster.address;

export const KASHI_ABI = kashiMaster.abi;

export const TOKEN_LIST = list.tokens;
