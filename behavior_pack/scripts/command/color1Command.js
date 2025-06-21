import { CommandPermissionLevel, CustomCommandParamType, Player } from '@minecraft/server';
import { sendMessage } from '../util/message';

const colors = [
    'black', 'dark_blue', 'dark_green', 'dark_aqua', 'dark_red',
    'dark_purple', 'gold', 'gray', 'dark_gray', 'blue',
    'green', 'aqua', 'red', 'light_purple', 'yellow',
    'white', 'minecoin_gold', 'material_quartz', 'material_iron',
    'obfuscated', 'bold', 'material_netherite', 'material_redstone', 'material_copper',
    'italic', 'material_gold', 'reset', 'material_emerald', 'material_diamond',
    'material_lapis', 'material_amethyst', 'material_resin'
];

export const color1Command = {
    name: 'mpk:color1',
    description: 'set color1',
    permissionLevel: CommandPermissionLevel.Any,
    mandatoryParameters: [
        { type: CustomCommandParamType.Enum, name: 'mpk:colors' }
    ]
};

export function color1CommandHandle(origin, arg) {
    if (!origin.sourceEntity || origin.sourceEntity.typeId !== 'minecraft:player') return undefined;
    /** @type { Player } */
    const player = origin.sourceEntity;
    const colorIndex = colors.indexOf(arg);
    if (colorIndex === -1) return undefined;
    const sectionColor = colorIndex.toString(36);
    player.setDynamicProperty('color1', sectionColor);
    sendMessage(player, 'Set color1 to §' + sectionColor + arg);
    return undefined;
};