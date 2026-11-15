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

export const LiteTappletClose = styled.button`
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 20;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    background: ${({ theme }) => theme.palette.background.paper};
    color: ${({ theme }) => theme.palette.text.primary};
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
    cursor: pointer;
`;
