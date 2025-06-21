import { CommandPermissionLevel, CustomCommandParamType, Player } from '@minecraft/server';
import { setLandingBox } from '../util/blockCollision';

const lb_types = ['x', 'z', 'both', 'zneo'];

export const setlbCommand = {
    name: 'mpk:setlb',
    description: 'Set landing block.',
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [
        { type: CustomCommandParamType.String, name: 'param' }
    ]
};

export function setlbCommandHandle(origin, arg) {
    if (!origin.sourceEntity || origin.sourceEntity.typeId !== 'minecraft:player') return undefined;
    /** @type { Player } */
    const player = origin.sourceEntity;
    if (arg === 'target') {
        const head = player.getHeadLocation();
        const view = player.getViewDirection();
        for (let i = 1; i < 10; i += 0.7) {
            const blocklocation = {
                x: head.x + view.x * i,
                y: head.y + view.y * i,
                z: head.z + view.z * i
            };
            const block = player.dimension.getBlock(blocklocation);
            if (!block.isAir) {
                setLandingBox(player, block);
                player.setDynamicProperty('lb_type', 'both');
                return undefined;
            };
        }
        return { message: 'Please look at valid block', status: 0 };
    } else {
        const location = player.location;
        const bottomBlock = player.dimension.getBlock({ x: location.x, y: location.y - 1, z: location.z });
        const lb_type = lb_types.indexOf(arg) === -1 ? 'both' : arg;
        setLandingBox(player, bottomBlock);
        player.setDynamicProperty('lb_type', lb_type);
        return undefined;
    }
};