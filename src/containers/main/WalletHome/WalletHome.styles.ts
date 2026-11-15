import styled from 'styled-components';

export const WalletHomeContainer = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    padding: 32px;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
    position: relative;
`;

export const WalletCard = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 440px;
    height: min(100%, 720px);
    min-height: 480px;
    position: relative;
`;
