import { Player } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui';
import { sendMessage } from '../util/message';
import { setProperties } from '../util/property';

const lb_types = ['x', 'z', 'both'];
const inverseLb_types = ['none', 'x', 'z', 'both'];

/**
 * @param {Player} player 
 */
export function setlbForm(player, newLB = true) {
    new ModalFormData()
        .title('Set Landing Block')
        .dropdown('Landing Block Type', lb_types, { defaultValueIndex: lb_types.indexOf(player.getDynamicProperty('lb_type')) ?? 'both' })
        .dropdown('Inverse LB', inverseLb_types, { defaultValueIndex: inverseLb_types.indexOf(player.getDynamicProperty('inverseLB')) ?? 'none' })
        .show(player).then((res) => {
            if (res.canceled === true) {
                return;
            } else {
                const lb_type = ['x', 'z', 'both'][res.formValues[0]];
                const inverseLB = ['none', 'x', 'z', 'both'][res.formValues[1]];
                const coord = player.location;
                switch (inverseLB) {
                    case 'both':
                        player.setDynamicProperties({
                            'inv_x': true,
                            'inv_z': true
                        });
                        break;
                    case 'x':
                        player.setDynamicProperties({
                            'inv_x': true,
                            'inv_z': false
                        });
                        break;
                    case 'z':
                        player.setDynamicProperties({
                            'inv_x': false,
                            'inv_z': true
                        });
                        break;
                    default:
                        player.setDynamicProperties({
                            'inv_x': false,
                            'inv_z': false
                        });
                        break;
                }

                if (newLB === true) player.setDynamicProperty('lb', coord);

                player.setDynamicProperties({
                    'lb_type': lb_type,
                    'inverseLB': inverseLB
                });
                setProperties(player, 'lb', {
                    'offset': -1,
                    'offset_x': -1,
                    'offset_z': -1,
                    'pb': -1,
                    'pb_x': -1,
                    'pb_z': -1
                });

                sendMessage(player, 'Set landing block successfully!');
            }
        });
};