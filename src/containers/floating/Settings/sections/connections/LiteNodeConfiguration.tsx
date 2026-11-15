import { useCallback, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCheckmarkCircle, IoTrashOutline } from 'react-icons/io5';

import { Button } from '@app/components/elements/buttons/Button.tsx';
import { IconButton } from '@app/components/elements/buttons/IconButton.tsx';
import { Typography } from '@app/components/elements/Typography.tsx';
import {
    addCustomRemoteNodeAddress,
    removeCustomRemoteNodeAddress,
    setRemoteBaseNodeAddress,
} from '@app/store/actions/config/core.ts';
import { useConfigCoreStore } from '@app/store/stores/config/useConfigCoreStore.ts';
import {
    SettingsGroup,
    SettingsGroupContent,
    SettingsGroupTitle,
    SettingsGroupWrapper,
} from '../../components/SettingsGroup.styles.ts';
import {
    ActiveNode,
    ActiveNodeAddress,
    ActiveNodeLabel,
    AddRow,
    EmptyHint,
    ErrorMessage,
    NodeAddress,
    NodeInput,
    NodeList,
    NodeRow,
    SavedNodesTitle,
} from './LiteNodeConfiguration.styles.ts';

function errorMessage(e: unknown) {
    return typeof e === 'string' ? e : e instanceof Error ? e.message : String(e);
}

export default function LiteNodeConfiguration() {
    const { t } = useTranslation(['settings'], { useSuspense: false });
    const activeAddress = useConfigCoreStore((s) => s.remote_base_node_address || '');
    const savedAddresses = useConfigCoreStore((s) => s.custom_remote_node_addresses || []);
    const [addressInput, setAddressInput] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [busyAddress, setBusyAddress] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const inputId = useId();
    const errorId = useId();

    const handleAdd = useCallback(async () => {
        const trimmed = addressInput.trim();
        if (!trimmed || isAdding) return;
        setIsAdding(true);
        setError(null);
        try {
            await addCustomRemoteNodeAddress(trimmed);
            setAddressInput('');
        } catch (e) {
            setError(errorMessage(e));
        } finally {
            setIsAdding(false);
        }
    }, [addressInput, isAdding]);

    const handleUse = useCallback(
        async (address: string) => {
            if (address === activeAddress || busyAddress) return;
            setBusyAddress(address);
            setError(null);
            try {
                await setRemoteBaseNodeAddress(address);
            } catch (e) {
                setError(errorMessage(e));
            } finally {
                setBusyAddress(null);
            }
        },
        [activeAddress, busyAddress]
    );

    const handleRemove = useCallback(
        async (address: string) => {
            if (busyAddress) return;
            setBusyAddress(address);
            setError(null);
            try {
                await removeCustomRemoteNodeAddress(address);
            } catch (e) {
                setError(errorMessage(e));
            } finally {
                setBusyAddress(null);
            }
        },
        [busyAddress]
    );

    return (
        <SettingsGroupWrapper>
            <SettingsGroup>
                <SettingsGroupContent>
                    <SettingsGroupTitle>
                        <Typography variant="h6">{t('lite-node-title')}</Typography>
                    </SettingsGroupTitle>
                    <Typography>{t('lite-node-description')}</Typography>
                </SettingsGroupContent>
            </SettingsGroup>

            <ActiveNode>
                <ActiveNodeLabel>{t('lite-node-current')}</ActiveNodeLabel>
                <ActiveNodeAddress>{activeAddress || '-'}</ActiveNodeAddress>
            </ActiveNode>

            <AddRow>
                <label htmlFor={inputId} style={{ display: 'none' }}>
                    {t('lite-node-add')}
                </label>
                <NodeInput
                    id={inputId}
                    type="url"
                    inputMode="url"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="https://your-node.example.com:443"
                    value={addressInput}
                    onChange={(e) => {
                        setAddressInput(e.target.value);
                        setError(null);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            void handleAdd();
                        }
                    }}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                />
                <Button
                    size="small"
                    onClick={handleAdd}
                    disabled={!addressInput.trim() || isAdding}
                    isLoading={isAdding}
                >
                    {t('lite-node-add')}
                </Button>
            </AddRow>

            {savedAddresses.length > 0 ? (
                <>
                    <SavedNodesTitle>{t('lite-node-saved')}</SavedNodesTitle>
                    <NodeList>
                        {savedAddresses.map((address) => {
                            const isActive = address === activeAddress;
                            const isBusy = busyAddress === address;
                            return (
                                <NodeRow key={address} $active={isActive}>
                                    <NodeAddress>{address}</NodeAddress>
                                    {isActive ? (
                                        <ActiveNodeLabel>
                                            <IoCheckmarkCircle />
                                            {t('lite-node-in-use')}
                                        </ActiveNodeLabel>
                                    ) : (
                                        <Button
                                            size="small"
                                            variant="secondary"
                                            isLoading={isBusy}
                                            disabled={Boolean(busyAddress)}
                                            onClick={() => handleUse(address)}
                                        >
                                            {t('lite-node-use')}
                                        </Button>
                                    )}
                                    <IconButton
                                        size="small"
                                        aria-label={t('lite-node-remove')}
                                        title={t('lite-node-remove')}
                                        disabled={isActive || Boolean(busyAddress)}
                                        onClick={() => handleRemove(address)}
                                    >
                                        <IoTrashOutline />
                                    </IconButton>
                                </NodeRow>
                            );
                        })}
                    </NodeList>
                </>
            ) : (
                <EmptyHint>{t('lite-node-empty')}</EmptyHint>
            )}

            {error && (
                <ErrorMessage id={errorId} role="alert">
                    {t('lite-node-error', { reason: error })}
                </ErrorMessage>
            )}
        </SettingsGroupWrapper>
    );
}
