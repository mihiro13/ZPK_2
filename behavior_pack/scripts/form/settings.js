import { PlayerPermissionLevel } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';
import { prohibitedItem } from '../server/practice';

/**
 * @param {Player} player 
 */
export function settingForm(player) {
    const sendpb = player.getDynamicProperty('sendpb') ?? true;
    const sendpb_x = player.getDynamicProperty('sendpb_x') ?? true;
    const sendpb_z = player.getDynamicProperty('sendpb_z') ?? true;
    const sendoffset = player.getDynamicProperty('sendoffset') ?? true;
    const sendoffset_x = player.getDynamicProperty('sendoffset_x') ?? true;
    const sendoffset_z = player.getDynamicProperty('sendoffset_z') ?? true;
    const offset_limit = player.getDynamicProperty('offset_limit') ?? 0.7;
    const prefix = player.getDynamicProperty('prefix') ?? '<MPK>';
    const checkpointRetuner = player.getDynamicProperty('cpReturnItem') ?? 'minecraft:red_dye';
    const checkpointSet = player.getDynamicProperty('cpSetItem') ?? 'minecraft:emerald';
    const gamemodeChanger = player.getDynamicProperty('gmChangerItem') ?? 'minecraft:iron_nugget';
    const form = new ModalFormData()
        .title('Setting')
        .textField('Prefix', '<MPK>', { defaultValue: prefix })
        .slider('Offset Limit §7(0.1x) §r', 1, 10, { defaultValue: offset_limit * 10 })
        .toggle('Send Total Offset in chat', { defaultValue: sendoffset })
        .toggle('Send Offset x in chat', { defaultValue: sendoffset_x })
        .toggle('Send Offset z in chat', { defaultValue: sendoffset_z })
        .toggle('Send Total PB in chat', { defaultValue: sendpb })
        .toggle('Send PB x in chat', { defaultValue: sendpb_x })
        .toggle('Send PB z in chat', { defaultValue: sendpb_z });
    if (player.playerPermissionLevel === PlayerPermissionLevel.Operator) {
        form.textField('Checkpoint Returner', 'minecraft:red_dye', { defaultValue: checkpointRetuner })
            .textField('Checkpoint Set', 'minecraft:emerald', { defaultValue: checkpointSet })
            .textField('Gamemode Changer', 'minecraft:iron_nugget', { defaultValue: gamemodeChanger })
    };
    form.show(player).then((res) => {
        if (res.canceled) {
            if (res.cancelationReason === 'UserBusy') settingForm(player);
            return;
        }
        player.setDynamicProperties({
            'prefix': res.formValues[0],
            'offset_limit': res.formValues[1] / 10,
            'sendoffset': res.formValues[2],
            'sendoffset_x': res.formValues[3],
            'sendoffset_z': res.formValues[4],
            'sendpb': res.formValues[5],
            'sendpb_x': res.formValues[6],
            'sendpb_z': res.formValues[7]
        });

        if (player.playerPermissionLevel === PlayerPermissionLevel.Operator) {
            player.setDynamicProperties({
                'cpReturnItem': prohibitedItem.includes(res.formValues[8]) ? checkpointRetuner : res.formValues[8],
                'cpSetItem': prohibitedItem.includes(res.formValues[9]) ? cpSetItem : res.formValues[9],
                'gamemodeChanger': prohibitedItem.includes(res.formValues[10]) ? gamemodeChanger : res.formValues[10]
            })
        }
    })
};