import * as m from 'motion/react-m';
import styled from 'styled-components';

export const DashboardContentContainer = styled(m.div)<{ $tapplet?: boolean }>`
    height: 100%;
    flex-shrink: 1;
    width: 100%;
    will-change: width;
    position: relative;
    pointer-events: ${({ $tapplet }) => ($tapplet ? 'auto' : 'none')};
`;

export const LITE_TAPPLET_BAR_HEIGHT = 52;

export const LiteTappletBar = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: ${LITE_TAPPLET_BAR_HEIGHT}px;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 10px;
    background: ${({ theme }) => theme.palette.background.paper};
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

export const LiteTappletBarTitle = styled.div`
    flex: 1;
    min-width: 0;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.palette.text.primary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const LiteTappletBarSide = styled.div`
    width: 34px;
    height: 34px;
    flex-shrink: 0;
`;
