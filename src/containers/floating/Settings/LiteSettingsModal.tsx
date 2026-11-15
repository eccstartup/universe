import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineExternalLink } from 'react-icons/hi';
import {
    IoArrowBack,
    IoClose,
    IoDocumentTextOutline,
    IoGitNetworkOutline,
    IoOptionsOutline,
    IoServerOutline,
    IoWalletOutline,
} from 'react-icons/io5';
import { open } from '@tauri-apps/plugin-shell';

import { Typography } from '@app/components/elements/Typography.tsx';
import { IconButton } from '@app/components/elements/buttons/IconButton.tsx';
import VersionChip from '@app/containers/navigation/components/VersionChip/VersionChip.tsx';
import { useHasL2Access } from '@app/hooks/wallet/useHasL2Access.ts';

import { L2Settings } from './sections/l2/L2Settings.tsx';
import { ReleaseNotes } from './sections/releaseNotes/ReleaseNotes.tsx';
import { LiteGeneralSettings } from './sections/general/LiteGeneralSettings.tsx';
import { LiteWalletSettings } from './sections/wallet/LiteWalletSettings.tsx';
import LiteNodeConfiguration from './sections/connections/LiteNodeConfiguration.tsx';
import {
    Container,
    Content,
    Footer,
    FooterLink,
    FooterLinks,
    Header,
    HeaderSide,
    HeaderTitle,
    HomeGroup,
    HomeRow,
    HomeRowChevron,
    HomeRowHint,
    HomeRowIcon,
    HomeRowLabel,
    HomeRowText,
    SectionContent,
} from './LiteSettingsModal.styles.ts';

type LiteSettingsType = 'general' | 'wallet' | 'connections' | 'l2' | 'releaseNotes';

interface LiteSection {
    type: LiteSettingsType;
    label: string;
    hint: string;
    icon: ReactNode;
}

interface LiteSettingsModalProps {
    onClose: () => void;
}

export default function LiteSettingsModal({ onClose }: LiteSettingsModalProps) {
    const { t } = useTranslation(['settings', 'common'], { useSuspense: false });
    const l2Supported = useHasL2Access();
    const [activeSection, setActiveSection] = useState<LiteSettingsType | null>(null);

    const sections: LiteSection[] = [
        {
            type: 'general',
            label: t('tabs.general'),
            hint: t('lite-settings-general-hint'),
            icon: <IoOptionsOutline />,
        },
        {
            type: 'wallet',
            label: t('tabs.wallet'),
            hint: t('lite-settings-wallet-hint'),
            icon: <IoWalletOutline />,
        },
        {
            type: 'connections',
            label: t('tabs.connections'),
            hint: t('lite-settings-connections-hint'),
            icon: <IoServerOutline />,
        },
        ...(l2Supported
            ? [
                  {
                      type: 'l2' as const,
                      label: t('tabs.l2'),
                      hint: t('lite-settings-l2-hint'),
                      icon: <IoGitNetworkOutline />,
                  },
              ]
            : []),
        {
            type: 'releaseNotes',
            label: t('tabs.releaseNotes'),
            hint: t('lite-settings-release-notes-hint'),
            icon: <IoDocumentTextOutline />,
        },
    ];

    const currentSection = sections.find((section) => section.type === activeSection);

    function sectionMarkup(type: LiteSettingsType) {
        switch (type) {
            case 'general':
                return <LiteGeneralSettings />;
            case 'wallet':
                return <LiteWalletSettings />;
            case 'connections':
                return <LiteNodeConfiguration />;
            case 'l2':
                return <L2Settings />;
            case 'releaseNotes':
                return <ReleaseNotes />;
        }
    }

    return (
        <Container>
            <Header>
                <HeaderSide>
                    {currentSection ? (
                        <IconButton
                            size="small"
                            aria-label={t('back', { ns: 'common' })}
                            title={t('back', { ns: 'common' })}
                            onClick={() => setActiveSection(null)}
                            data-testid="settings-lite-back"
                        >
                            <IoArrowBack size={18} />
                        </IconButton>
                    ) : null}
                </HeaderSide>
                <HeaderTitle>
                    <Typography variant="h5">{currentSection?.label ?? t('settings')}</Typography>
                </HeaderTitle>
                <HeaderSide $right>
                    <IconButton
                        size="small"
                        aria-label={t('close', { ns: 'common' })}
                        title={t('close', { ns: 'common' })}
                        onClick={onClose}
                        data-testid="settings-lite-close"
                    >
                        <IoClose size={18} />
                    </IconButton>
                </HeaderSide>
            </Header>

            {currentSection ? (
                <SectionContent data-testid={`settings-lite-section-${currentSection.type}`}>
                    {sectionMarkup(currentSection.type)}
                </SectionContent>
            ) : (
                <Content data-testid="settings-lite-home">
                    <HomeGroup>
                        {sections.map((section) => (
                            <HomeRow
                                key={section.type}
                                type="button"
                                onClick={() => setActiveSection(section.type)}
                                data-testid={`settings-tab-${section.type}`}
                            >
                                <HomeRowIcon>{section.icon}</HomeRowIcon>
                                <HomeRowText>
                                    <HomeRowLabel>{section.label}</HomeRowLabel>
                                    <HomeRowHint>{section.hint}</HomeRowHint>
                                </HomeRowText>
                                <HomeRowChevron size={16} />
                            </HomeRow>
                        ))}
                    </HomeGroup>

                    <Footer>
                        <VersionChip />
                        <FooterLinks>
                            <FooterLink onClick={() => open('https://www.tari.com/user_agreement/')}>
                                {t('user-agreement')}
                                <HiOutlineExternalLink size={10} />
                            </FooterLink>
                            <FooterLink
                                onClick={() => open('https://github.com/tari-project/universe/blob/main/LICENSE.md')}
                            >
                                {t('license-agreement')}
                                <HiOutlineExternalLink size={10} />
                            </FooterLink>
                        </FooterLinks>
                    </Footer>
                </Content>
            )}
        </Container>
    );
}
