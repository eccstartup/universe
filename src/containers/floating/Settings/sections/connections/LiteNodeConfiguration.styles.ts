import styled from 'styled-components';
import { StyledInput } from '@app/components/elements/inputs/Input.styles.ts';

export const ActiveNode = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px 12px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.palette.background.default};
`;

export const ActiveNodeHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
`;

export const ConnectionState = styled.span<{ $connected: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
    color: ${({ theme, $connected }) => ($connected ? theme.palette.success.main : theme.palette.text.secondary)};

    &:before {
        content: '';
        width: 7px;
        height: 7px;
        flex-shrink: 0;
        border-radius: 50%;
        background-color: ${({ theme, $connected }) =>
            $connected ? theme.palette.success.main : theme.palette.text.secondary};
    }
`;

export const ActiveNodeLabel = styled.span`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    color: ${({ theme }) => theme.palette.text.secondary};
    white-space: nowrap;
`;

export const ActiveNodeAddress = styled.span`
    font-size: 12px;
    overflow-wrap: anywhere;
    color: ${({ theme }) => theme.palette.text.primary};
`;

export const AddRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;

    button {
        flex-shrink: 0;
    }
`;

export const NodeInput = styled(StyledInput)`
    font-size: 13px;
    min-width: 0;
`;

export const SavedNodesTitle = styled.span`
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.palette.text.primary};
`;

export const NodeList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

export const NodeRow = styled.div<{ $active: boolean }>`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 10px;
    background-color: ${({ theme, $active }) =>
        $active ? theme.palette.background.accent : theme.palette.background.default};

    button {
        flex-shrink: 0;
    }
`;

export const NodeAddress = styled.span`
    flex: 1;
    min-width: 0;
    font-size: 12px;
    overflow-wrap: anywhere;
    color: ${({ theme }) => theme.palette.text.primary};
`;

export const EmptyHint = styled.span`
    font-size: 12px;
    opacity: 0.7;
`;

export const ErrorMessage = styled.span`
    font-size: 11px;
    color: ${({ theme }) => theme.palette.error.main};
`;
