import {BENTO_BOX_ABI, BENTO_BOX_ADDR, KASHI_ABI, KASHI_ADDR, KashiPairInfos} from "./constants";
import {ethers, Contract} from "ethers";

export class KashiHelper {
    public kashiPairs: Contract[];

    private static instance: KashiHelper;

    public static async getInstance(): Promise<KashiHelper> {
        if (KashiHelper.instance === undefined) {
            //TODO use metamask provider instead of personal infura
            const bentoBox: Contract = new Contract(BENTO_BOX_ADDR, BENTO_BOX_ABI, new ethers.providers.InfuraProvider("homestead", 'd3a9e80d30ec469594562f41b54da082'));
            const kashiPairs: Contract[] = await KashiHelper.getAllKashiPairs(bentoBox);
            KashiHelper.instance = new KashiHelper(kashiPairs);
        }
        return KashiHelper.instance;
    }

    private constructor(kashiPairs: Contract[]) {
        this.kashiPairs = kashiPairs;
    }

    private static async getAllKashiPairs(bentoBox: Contract): Promise<Contract[]> {
        const kashiAddresses: any[] = await bentoBox.queryFilter(bentoBox.filters.LogDeploy(KASHI_ADDR));
        return kashiAddresses.reduce((kashiPairs: any, log: any) => {
            if (log.args.cloneAddress !== undefined) {
                //TODO use metamask provider instead of personal infura
                kashiPairs.push(new Contract(log.args.cloneAddress, KASHI_ABI, new ethers.providers.InfuraProvider("homestead", 'd3a9e80d30ec469594562f41b54da082')));
            }
            return kashiPairs;
        });
    }

    public static async kashiPairsInfos(kashiPairs: Contract[]): Promise<KashiPairInfos[]> {
        return Promise.all(kashiPairs.map(async (kashiPair): Promise<KashiPairInfos> => {
            return {
                assetAddress: await kashiPair.asset(),
                collateralAddress: await kashiPair.collateral(),
                accrueInfo: await kashiPair.accrueInfo(),
                totalAsset: await kashiPair.totalAsset(),
                totalBorrow: await kashiPair.totalBorrow(),
            };
        }));
    }
}
