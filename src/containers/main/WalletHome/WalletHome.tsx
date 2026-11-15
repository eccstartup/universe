import { useTranslation } from 'react-i18next';
import WalletSidebarContent from '@app/components/transactions/WalletSidebarContent.tsx';
import { TariOutlineSVG } from '@app/assets/icons/tari-outline.tsx';
import OpenSettingsButton from '@app/containers/floating/Settings/components/OpenSettingsButton.tsx';
import BridgeButton from '@app/containers/navigation/Sidebars/buttons/BridgeButton.tsx';
import L2Button from '@app/containers/navigation/Sidebars/buttons/L2Button.tsx';
import SidebarL2 from '@app/containers/navigation/Sidebars/SidebarL2.tsx';
import { useHasL2Access } from '@app/hooks/wallet/useHasL2Access.ts';
import { useConfigUIStore, useUIStore } from '@app/store';
import { WalletUIMode } from '@app/types/events-payloads.ts';
import { IS_TU_LITE } from '@app/config/variant.ts';
import {
    WalletBrand,
    WalletBrandMark,
    WalletCard,
    WalletHomeContainer,
    WalletL2Panel,
    WalletNetwork,
    WalletQuickActions,
    WalletTopBar,
} from './WalletHome.styles.ts';

export default function WalletHome() {
    const { t } = useTranslation('wallet');
    const isStandardWalletUI = useConfigUIStore((s) => s.wallet_ui_mode === WalletUIMode.Standard);
    const l2Open = useUIStore((s) => s.l2Open);
    const l2Supported = useHasL2Access();
    const showL2Panel = IS_TU_LITE && l2Open && l2Supported;

    return (
        <WalletHomeContainer $lite={IS_TU_LITE}>
            {IS_TU_LITE && (
                <WalletTopBar>
                    <WalletBrand>
                        <WalletBrandMark>
                            <TariOutlineSVG />
                        </WalletBrandMark>
                        {t('lite-title')}
                        <WalletNetwork>{t('lite-network')}</WalletNetwork>
                    </WalletBrand>
                    <WalletQuickActions>
                        {isStandardWalletUI && <BridgeButton />}
                        {l2Supported && <L2Button />}
                        <OpenSettingsButton iconSize={18} size="large" />
                    </WalletQuickActions>
                </WalletTopBar>
            )}
            {showL2Panel ? (
                <WalletL2Panel>
                    <SidebarL2 />
                </WalletL2Panel>
            ) : (
                <WalletCard $lite={IS_TU_LITE}>
                    <WalletSidebarContent />
                </WalletCard>
            )}
        </WalletHomeContainer>
    );
}
