import styled from 'styled-components';
import { LITE_TAPPLET_BAR_HEIGHT } from '../styles.ts';

export const MiningViewContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
`;

export const TappletContainer = styled.div<{ $lite?: boolean }>`
    pointer-events: all;
    position: fixed;
    top: ${({ $lite }) => ($lite ? `${LITE_TAPPLET_BAR_HEIGHT}px` : '0')};
    left: 0;
    width: 100vw;
    height: ${({ $lite }) => ($lite ? `calc(100vh - ${LITE_TAPPLET_BAR_HEIGHT}px)` : '100vh')};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 2;
    background: ${({ theme }) => theme.palette.background.default};
`;
