import { system, world } from '@minecraft/server';
import { getProperties, setProperties } from '../util/property';
import { sendMessage } from '../util/message';

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        const props = getProperties(player, 'current');
        const tbf_props = getProperties(player, 'tbf');
        const ttbf_props = getProperties(player, 'ttbf');
        const lb = player.getDynamicProperty('lb');
        const lb_type = player.getDynamicProperty('lb_type');
        const inv_x = player.getDynamicProperty('inv_x');
        const inv_z = player.getDynamicProperty('inv_z');
        if (lb === undefined) continue;

        if (props.loc.y <= lb.y && tbf_props.loc.y > lb.y) {
            let offset_x;
            let offset_z;
            let offset;
            const props = getProperties(player, 'lb');
            let pb = props.pb ?? -1;
            let pb_x = props.pb_x ?? -1;
            let pb_z = props.pb_z ?? -1;
            const offset_limit = player.getDynamicProperty('offset_limit') ?? 0.5;

            const z_source = lb_type === 'zneo' ? ttbf_props.loc.z : tbf_props.loc.z;
            offset_z = inv_z ? (z_source - lb.z) : (lb.z - z_source);
            offset_x = inv_x ? (tbf_props.loc.x - lb.x) : (lb.x - tbf_props.loc.x);

            //offset_z >= 0 && offset_x <= 0 ==> offset_z * offset_x <= 0
            if (offset_z >= 0 && offset_x <= 0) {
                offset = offset_x;
            } else if (offset_z <= 0 && offset_x >= 0) {
                offset = offset_z;
            } else {
                const magnitude = Math.hypot(offset_x, offset_z);
                offset = offset_x < 0 && offset_z < 0 ? -magnitude : magnitude;
            }

            const inXRange = offset_x >= offset_limit * -1 && offset_x <= offset_limit;
            const inZRange = offset_z >= offset_limit * -1 && offset_z <= offset_limit;

            const withinLimit =
                ((lb_type === 'both' || lb_type === 'zneo') && inXRange && inZRange) ||
                (lb_type === 'x' && inXRange) ||
                (lb_type === 'z' && inZRange);

            if (withinLimit) {
                const sendpb = player.getDynamicProperty('sendpb') ?? true;
                const sendpb_x = player.getDynamicProperty('sendpb_x') ?? true;
                const sendpb_z = player.getDynamicProperty('sendpb_z') ?? true;
                const sendoffset = player.getDynamicProperty('sendoffset') ?? true;
                const sendoffset_x = player.getDynamicProperty('sendoffset_x') ?? true;
                const sendoffset_z = player.getDynamicProperty('sendoffset_z') ?? true;
                const digit = player.getDynamicProperty('digit') ?? 4;

                setProperties(player, 'lb', {
                    'offset': offset,
                    'offset_x': offset_x,
                    'offset_z': offset_z
                });

                if (offset > pb) {
                    setProperties(player, 'lb', { 'pb': offset });
                    if (sendpb === true && (lb_type === 'zneo' || lb_type === 'both')) {
                        sendMessage(player, `New pb! : ${offset.toFixed(digit)}`);
                    }
                }

                if (offset_z > pb_z) {
                    setProperties(player, 'lb', { 'pb_z': offset_z });
                    if ((sendpb_z === true && (lb_type !== 'x')) || (sendpb == true && (lb_type === 'z'))) {
                        sendMessage(player, `New pb Z! : ${offset_z.toFixed(digit)}`);
                    }
                }

                if (offset_x > pb_x) {
                    setProperties(player, 'lb', { 'pb_x': offset_x });
                    if ((sendpb_x === true && (lb_type !== 'z')) || (sendpb === true && (lb_type === 'x'))) {
                        sendMessage(player, `New pb X! : ${offset_x.toFixed(digit)}`);
                    }
                }

                if ((lb_type === 'both' || lb_type === 'zneo') && sendoffset === true) {
                    sendMessage(player, `§lOffset: §r${offset.toFixed(digit)}`);
                }

                if ((lb_type === 'z' && (sendoffset === true || sendoffset_z === true)) || ((lb_type === 'both' || lb_type === 'zneo') && sendoffset_z === true)) {
                    sendMessage(player, `§lOffset Z: §r${offset_z.toFixed(digit)}`);
                }

                if ((lb_type === 'x' && (sendoffset === true || sendoffset_x === true)) || ((lb_type === 'both' || lb_type === 'zneo') && sendoffset_x === true)) {
                    sendMessage(player, `§lOffset X: §r${offset_x.toFixed(digit)}`);
                }

            }
        }
    }
});