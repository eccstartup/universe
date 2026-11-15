import WalletSidebarContent from '@app/components/transactions/WalletSidebarContent.tsx';
import { WalletCard, WalletHomeContainer } from './WalletHome.styles.ts';

export default function WalletHome() {
    return (
        <WalletHomeContainer>
            <WalletCard>
                <WalletSidebarContent />
            </WalletCard>
        </WalletHomeContainer>
    );
}
