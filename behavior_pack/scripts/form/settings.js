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
    const timezone = player.getDynamicProperty('timezone') ?? '0';
    const position_checker = player.getDynamicProperty('position_checker') ?? false;
    const airtick = player.getDynamicProperty('airtick') ?? '1';
    const complementCoord = player.getDynamicProperty('complementLag') ?? false;
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
        .toggle('Send PB z in chat', { defaultValue: sendpb_z })
        .textField('Timezone (GMT+/-)', '+9 | -5', { defaultValue: timezone })
        .toggle('beta 座標のtick抜けを補完', { defaultValue: complementCoord })
        .toggle('Position Checker', { defaultValue: position_checker })
        .textField('Air Tick', '1', { defaultValue: airtick })
    if (player.playerPermissionLevel === PlayerPermissionLevel.Operator) {
        form.textField('Checkpoint Returner', 'minecraft:red_dye', { defaultValue: String(checkpointRetuner) })
            .textField('Checkpoint Set', 'minecraft:emerald', { defaultValue: String(checkpointSet) })
            .textField('Gamemode Changer', 'minecraft:iron_nugget', { defaultValue: String(gamemodeChanger) })
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
            'sendpb_z': res.formValues[7],
            'timezone': res.formValues[8],
            'complementCoord': res.formValues[9],
            'position_checker': res.formValues[10],
            'airtick': res.formValues[11]
        });

        if (player.playerPermissionLevel === PlayerPermissionLevel.Operator) {
            player.setDynamicProperties({
                'cpReturnItem': prohibitedItem.includes(res.formValues[12]) ? checkpointRetuner : res.formValues[12],
                'cpSetItem': prohibitedItem.includes(res.formValues[13]) ? cpSetItem : res.formValues[13],
                'gamemodeChanger': prohibitedItem.includes(res.formValues[14]) ? gamemodeChanger : res.formValues[14]
            })
        }
    })
};