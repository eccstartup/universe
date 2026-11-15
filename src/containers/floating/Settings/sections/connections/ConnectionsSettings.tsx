import { Activity } from 'react';
import { useNodeStore } from '@app/store/useNodeStore.ts';
import { LocalNodeSync } from '@app/components/sync/LocalNodeSync.tsx';
import NodeTypeConfiguration from './NodeTypeConfiguration.tsx';
import NodeDataLocationSettings from './NodeDataLocation.tsx';
import Network from './Network.tsx';
import Peers from './Peers.tsx';
import Node from './Node.tsx';
import { IS_TU_LITE } from '@app/config/variant.ts';

export const ConnectionsSettings = () => {
    const nodeType = useNodeStore((s) => s.node_type);
    const isRemote = nodeType == 'Remote';

    const nonRemoteMarkup = (
        <Activity mode={isRemote ? 'hidden' : 'visible'}>
            <LocalNodeSync />
            <NodeDataLocationSettings />
        </Activity>
    );

    return (
        <>
            {nonRemoteMarkup}
            {!IS_TU_LITE && <NodeTypeConfiguration />}
            <Node />
            <Network />
            <Peers />
        </>
    );
};
