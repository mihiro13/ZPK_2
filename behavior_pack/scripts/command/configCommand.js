import { CommandPermissionLevel, CustomCommandParamType, Player, system } from '@minecraft/server';
import { settingForm } from '../form/settings';

export const configCommand = {
    name: 'mpk:config',
    description: 'config',
    permissionLevel: CommandPermissionLevel.Any
};

export function configCommandHandle(origin) {
    if (!origin.sourceEntity || origin.sourceEntity.typeId !== 'minecraft:player') return undefined;
    /** @type { Player } */
    const player = origin.sourceEntity;
    system.run(() => settingForm(player));
    return undefined;
}