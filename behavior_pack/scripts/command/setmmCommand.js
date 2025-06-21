import { CommandPermissionLevel, CustomCommandParamType, Player } from '@minecraft/server';
import { setMMBox } from '../landingBlock/setlb';

export const setMMCommand = {
    name: 'mpk:setmm',
    description: 'Set momentum block',
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [
        { type: CustomCommandParamType.String, name: 'param' }
    ]
};

export function setMMCommandHandle(origin, arg) {
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
                setMMBox(player, block);
                return undefined;
            };
        }
        return { message: 'Please look at valid block', status: 0 };
    } else {
        const location = player.location;
        const bottomBlock = player.dimension.getBlock({ x: location.x, y: location.y - 1, z: location.z });
        setMMBox(player, bottomBlock);
        return undefined;
    }
};