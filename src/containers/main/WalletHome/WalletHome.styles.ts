import styled from 'styled-components';

export const WalletHomeContainer = styled.div<{ $lite?: boolean }>`
    display: flex;
    flex-direction: ${({ $lite }) => ($lite ? 'column' : 'row')};
    height: 100%;
    width: 100%;
    padding: ${({ $lite }) => ($lite ? '10px 12px 12px' : '32px')};
    gap: ${({ $lite }) => ($lite ? '10px' : '0')};
    align-items: center;
    justify-content: ${({ $lite }) => ($lite ? 'flex-start' : 'center')};
    pointer-events: auto;
    position: relative;
`;

export const WalletTopBar = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2px 4px;
    flex-shrink: 0;
`;

export const WalletBrand = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 600;
`;

export const WalletBrandMark = styled.div`
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        width: 100%;
        height: auto;
        display: block;
    }
`;

export const WalletNetwork = styled.span`
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.palette.text.secondary};
    border: 1px solid ${({ theme }) => theme.palette.divider};
    border-radius: 999px;
    padding: 2px 7px;
`;

export const WalletCard = styled.div<{ $lite?: boolean }>`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: ${({ $lite }) => ($lite ? 'none' : '440px')};
    height: ${({ $lite }) => ($lite ? 'auto' : 'min(100%, 720px)')};
    min-height: ${({ $lite }) => ($lite ? '0' : '480px')};
    flex: ${({ $lite }) => ($lite ? '1 1 auto' : 'none')};
    position: relative;
`;

export const WalletQuickActions = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;

    > button {
        width: 36px;
        height: 36px;
        padding: 7px;
        border-radius: 10px;
    }

    > button svg {
        width: 18px;
        height: 18px;
    }
`;

export const WalletL2Panel = styled.div`
    width: 100%;
    flex: 1;
    min-height: 0;
    display: flex;

    > div {
        width: 100%;
        height: 100%;
    }
`;
