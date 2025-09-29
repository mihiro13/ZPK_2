import { CommandPermissionLevel, CustomCommandParamType, Player } from '@minecraft/server';
import { setLandingBox } from '../landingBlock/setlb';
import { setProperties } from '../util/property';
import { sendMessage } from '../util/message';

const lb_types = ['x', 'z', 'both', 'zneo'];

export const setlbCommand = {
    name: 'mpk:setlb',
    description: 'Set landing block.',
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [
        { type: CustomCommandParamType.Enum, name: 'mpk:lbtypes' }
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
            }
        }
        return { message: 'Please look at valid block', status: 0 };
    } else if (arg === 'stand') {
        player.setDynamicProperties({
            'lb': player.location,
            'lb_type': 'both',
            'boxStart': { x: 0, y: 500, z: 0 },
            'boxEnd': { x: 0, y: 500, z: 0 }
        })
        setProperties(player, 'lb', {
            'offset': -1,
            'offset_x': -1,
            'offset_z': -1,
            'pb': -1,
            'pb_x': -1,
            'pb_z': -1
        })

        sendMessage(player, 'Clear PB and Set landing block successfully!');
        return undefined;
    } else {
        const location = player.location;
        const bottomBlock = player.dimension.getBlock({ x: location.x, y: location.y - 0.01, z: location.z });
        const lb_type = lb_types.indexOf(arg) === -1 ? 'both' : arg;
        setLandingBox(player, bottomBlock);
        player.setDynamicProperty('lb_type', lb_type);
        return undefined;
    }
}