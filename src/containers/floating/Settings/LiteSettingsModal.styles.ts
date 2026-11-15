import styled from 'styled-components';
import { IoChevronForward } from 'react-icons/io5';

export const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: ${({ theme }) => theme.palette.background.default};
`;

export const Header = styled.header`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: 4px;
    min-height: 58px;
    padding: 0 10px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
    background-color: ${({ theme }) => theme.palette.background.paper};
`;

export const HeaderSide = styled.div<{ $right?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: ${({ $right }) => ($right ? 'flex-end' : 'flex-start')};
    flex-shrink: 0;
    width: 36px;
`;

export const HeaderTitle = styled.div`
    flex: 1;
    min-width: 0;
    text-align: center;

    h5 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

export const Content = styled.div`
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 14px 14px 24px;
    overflow-y: auto;
`;

export const SectionContent = styled.div`
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 0 14px 24px;
    overflow-y: auto;

    > *:first-child {
        border-top: none;
        padding-top: 14px;
    }
`;

export const HomeGroup = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    border-radius: 16px;
    background-color: ${({ theme }) => theme.palette.background.paper};
`;

export const HomeRow = styled.button`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 13px 14px;
    border: none;
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
    background: none;
    color: inherit;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:last-child {
        border-bottom: none;
    }

    &:active {
        background-color: ${({ theme }) => theme.palette.background.accent};
    }
`;

export const HomeRowIcon = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.palette.background.accent};
    color: ${({ theme }) => theme.palette.text.primary};
    font-size: 19px;
`;

export const HomeRowText = styled.span`
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    gap: 2px;
`;

export const HomeRowLabel = styled.span`
    font-size: 15px;
    font-weight: 500;
    line-height: 1.2;
    color: ${({ theme }) => theme.palette.text.primary};
`;

export const HomeRowHint = styled.span`
    overflow: hidden;
    font-size: 11px;
    line-height: 1.25;
    color: ${({ theme }) => theme.palette.text.secondary};
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const HomeRowChevron = styled(IoChevronForward)`
    flex-shrink: 0;
    color: ${({ theme }) => theme.palette.text.secondary};
`;

export const Footer = styled.footer`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 22px;
    color: ${({ theme }) => theme.palette.text.secondary};
`;

export const FooterLinks = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 14px;
`;

export const FooterLink = styled.button`
    display: flex;
    align-items: center;
    gap: 3px;
    border: none;
    background: none;
    color: ${({ theme }) => theme.palette.text.accent};
    font-size: 11px;
    cursor: pointer;

    &:hover {
        color: ${({ theme }) => theme.palette.text.secondary};
    }
`;
