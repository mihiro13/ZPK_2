import { Player } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';
import { settingForm } from './settings';

/**
 * @param {Player} player 
 */
export function offsetForm(player) {
    const sendpb = player.getDynamicProperty('sendpb') ?? true;
    const sendpb_x = player.getDynamicProperty('sendpb_x') ?? true;
    const sendpb_z = player.getDynamicProperty('sendpb_z') ?? true;
    const sendoffset = player.getDynamicProperty('sendoffset') ?? true;
    const sendoffset_x = player.getDynamicProperty('sendoffset_x') ?? true;
    const sendoffset_z = player.getDynamicProperty('sendoffset_z') ?? true;
    const digit = player.getDynamicProperty('digit') ?? 4;
    const offset_limit = player.getDynamicProperty('offset_limit') ?? 0.7;
    new ModalFormData()
        .title('Offset')
        .slider('Decimal Format', 0, 16, { defaultValue: digit })
        .slider('Offset Limit §7(0.1x) §r', 1, 10, { defaultValue: offset_limit * 10 })
        .toggle('Send Total Offset in chat', { defaultValue: sendoffset })
        .toggle('Send Offset x in chat', { defaultValue: sendoffset_x })
        .toggle('Send Offset z in chat', { defaultValue: sendoffset_z })
        .toggle('Send Total PB in chat', { defaultValue: sendpb })
        .toggle('Send PB x in chat', { defaultValue: sendpb_x })
        .toggle('Send PB z in chat', { defaultValue: sendpb_z })
        .show(player).then((res) => {
            if (res.canceled) return settingForm(player);
            player.setDynamicProperties({
                'digit': res.formValues[0],
                'offset_limit': res.formValues[1] / 10,
                'sendoffset': res.formValues[2],
                'sendoffset_x': res.formValues[3],
                'sendoffset_z': res.formValues[4],
                'sendpb': res.formValues[5],
                'sendpb_x': res.formValues[6],
                'sendpb_z': res.formValues[7]
            });
            return settingForm(player);
        })
};