import { useTranslation } from 'react-i18next';

import { SettingsGroupWrapper } from '../../components/SettingsGroup.styles.ts';
import LanguageSettings from './LanguageSettings.tsx';
import ThemeSettings from './ThemeSettings.tsx';
import LogsSettings from './LogsSettings.tsx';
import AppDataSettings from './AppDataSettings.tsx';
import { ResetSettingsButton } from './ResetSettingsButton.tsx';

export const LiteGeneralSettings = () => {
    const { t } = useTranslation('settings', { useSuspense: false });

    return (
        <>
            <LanguageSettings />
            <ThemeSettings />
            <SettingsGroupWrapper $advanced $advancedLabel={t('lite-settings-advanced')}>
                <LogsSettings />
                <AppDataSettings />
                <ResetSettingsButton />
            </SettingsGroupWrapper>
        </>
    );
};
