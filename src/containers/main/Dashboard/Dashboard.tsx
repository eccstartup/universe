import { useTranslation } from 'react-i18next';
import { IoArrowBack } from 'react-icons/io5';

import { useMiningStatesSync } from '@app/hooks/mining/useMiningStatesSync.ts';
import DisconnectWrapper from '../Reconnect/DisconnectWrapper.tsx';
import { DashboardContentContainer, LiteTappletBar, LiteTappletBarSide, LiteTappletBarTitle } from './styles';
import { IconButton } from '@app/components/elements/buttons/IconButton.tsx';
import { useAirdropStore, useUIStore } from '@app/store';
import { setShowTapplet } from '@app/store/actions/uiStoreActions.ts';
import { useTappletsStore } from '@app/store/useTappletsStore';
import { Tapplet } from '@app/components/tapplets/Tapplet.tsx';
import MiningView from './MiningView/MiningView.tsx';
import WalletHome from '../WalletHome/WalletHome.tsx';
import { FEATURE_FLAGS } from '@app/store/consts.ts';
import { Activity } from 'react';
import { IS_TU_LITE } from '@app/config/variant.ts';

function MiningDashboard() {
    useMiningStatesSync();
    return <MiningView />;
}

export default function Dashboard() {
    const { t } = useTranslation(['wallet', 'common'], { useSuspense: false });
    const showTapplet = useUIStore((s) => s.showTapplet);
    const activeTapplet = useTappletsStore((s) => s.activeTapplet);

    const connectionStatus = useUIStore((s) => s.connectionStatus);
    const features = useAirdropStore((s) => s.features);
    const orphanChainUiDisabled = !!features?.includes(FEATURE_FLAGS.FF_UI_ORPHAN_CHAIN_DISABLED);

    const renderTapplet = showTapplet && activeTapplet && activeTapplet?.source?.length > 0;

    const tappletMarkup = (
        <Activity mode={showTapplet ? 'visible' : 'hidden'} key="tapplet">
            {renderTapplet ? <Tapplet source={activeTapplet.source} lite={IS_TU_LITE} /> : null}
        </Activity>
    );
    const mainMarkup = (
        <Activity mode={!showTapplet ? 'visible' : 'hidden'} key="main">
            {IS_TU_LITE ? <WalletHome /> : <MiningDashboard />}
        </Activity>
    );
    return (
        <DashboardContentContainer $tapplet={renderTapplet}>
            {connectionStatus !== 'connected' && !orphanChainUiDisabled ? <DisconnectWrapper /> : null}
            {mainMarkup}
            {tappletMarkup}
            {IS_TU_LITE && renderTapplet ? (
                <LiteTappletBar>
                    <IconButton
                        size="medium"
                        aria-label={t('close', { ns: 'common' })}
                        title={t('close', { ns: 'common' })}
                        onClick={() => setShowTapplet(false)}
                        data-testid="lite-tapplet-close"
                    >
                        <IoArrowBack size={18} />
                    </IconButton>
                    <LiteTappletBarTitle>{t('lite-bridge-title')}</LiteTappletBarTitle>
                    <LiteTappletBarSide />
                </LiteTappletBar>
            ) : null}
        </DashboardContentContainer>
    );
}
