import { Activity } from 'react';
import { useNodeStore } from '@app/store/useNodeStore.ts';
import { LocalNodeSync } from '@app/components/sync/LocalNodeSync.tsx';
import NodeTypeConfiguration from './NodeTypeConfiguration.tsx';
import LiteNodeConfiguration from './LiteNodeConfiguration.tsx';
import NodeDataLocationSettings from './NodeDataLocation.tsx';
import Network from './Network.tsx';
import Peers from './Peers.tsx';
import Node from './Node.tsx';
import { IS_TU_LITE } from '@app/config/variant.ts';

export const ConnectionsSettings = () => {
    const nodeType = useNodeStore((s) => s.node_type);
    const isRemote = nodeType == 'Remote';

    if (IS_TU_LITE) {
        return <LiteNodeConfiguration />;
    }

    const nonRemoteMarkup = (
        <Activity mode={isRemote ? 'hidden' : 'visible'}>
            <LocalNodeSync />
            <NodeDataLocationSettings />
        </Activity>
    );

    return (
        <>
            {nonRemoteMarkup}
            <NodeTypeConfiguration />
            <Node />
            <Network />
            <Peers />
        </>
    );
};
