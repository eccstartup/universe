import { Background, DashboardContainer, DashboardContent } from '@app/theme/styles.ts';
import SidebarNavigation from '@app/containers/navigation/SidebarNavigation.tsx';
import { Dashboard } from './Dashboard';
import { useConfigUIStore } from '@app/store';
import { IS_TU_LITE } from '@app/config/variant.ts';

export default function MainView() {
    const visualMode = useConfigUIStore((s) => s.visual_mode);

    return (
        <DashboardContainer>
            {!visualMode && <Background />}
            <DashboardContent>
                {!IS_TU_LITE && <SidebarNavigation />}
                <Dashboard />
            </DashboardContent>
        </DashboardContainer>
    );
}
