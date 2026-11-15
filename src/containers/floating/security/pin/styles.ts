import styled from 'styled-components';
import { Typography } from '@app/components/elements/Typography.tsx';

export const Wrapper = styled.div`
    display: flex;
    padding: 10px;
    width: clamp(600px, 45vw, 710px);
    max-width: 100%;
    flex-direction: column;
    gap: 20px;

    @media (max-width: 700px) {
        width: 100%;
        padding: 4px;
        gap: 14px;
    }
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;
export const Heading = styled(Typography).attrs({
    variant: 'h4',
})`
    font-size: 18px;
`;
