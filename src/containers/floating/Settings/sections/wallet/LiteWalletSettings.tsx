import WalletAddressMarkup from './WalletAddressMarkup/WalletAddressMarkup.tsx';
import TariSeedWords from './TariSeedWords/TariSeedWords.tsx';
import { RefreshWalletHistory } from './RefreshWalletHistory.tsx';
import { PinMarkup } from './PinMarkup.tsx';

export const LiteWalletSettings = () => {
    return (
        <>
            <PinMarkup />
            <WalletAddressMarkup />
            <TariSeedWords />
            <RefreshWalletHistory />
        </>
    );
};
