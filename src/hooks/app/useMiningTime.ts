import { useEffect } from 'react';
import { checkMiningTime } from '@app/store/actions/miningStoreActions.ts';
import { useConfigMiningStore } from '@app/store';
import { IS_TU_LITE } from '@app/config/variant.ts';

export default function useMiningTime() {
    const needsAlertCheck = useConfigMiningStore((s) => s.eco_alert_needed);
    useEffect(() => {
        if (IS_TU_LITE || !needsAlertCheck) return;
        const INTERVAL = 1000 * 60 * 60; // every hour - it is also checked on stop
        const interval = setInterval(() => {
            checkMiningTime();
        }, INTERVAL);

        return () => clearInterval(interval);
    }, [needsAlertCheck]);
}
