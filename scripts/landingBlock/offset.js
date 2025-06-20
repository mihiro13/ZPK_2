import { getProperties, setProperties } from '../util/property';
import { sendMessage } from '../util/message';

export function checkOffset(player) {
    const props = getProperties(player, 'current');
    const tbf_props = getProperties(player, 'tbf');
    const ttbf_props = getProperties(player, 'ttbf');
    const lb = player.getDynamicProperty('lb');
    const boxStart = player.getDynamicProperty('boxStart') ?? { x: 0, y: 500, z: 0 };
    const boxEnd = player.getDynamicProperty('boxEnd') ?? { x: 0, y: 500, z: 0 };
    const lb_type = player.getDynamicProperty('lb_type');
    const inv_x = player.getDynamicProperty('inv_x');
    const inv_z = player.getDynamicProperty('inv_z');
    const newLb = props.loc.y <= boxEnd.y && tbf_props.loc.y > boxEnd.y;
    const oldLb = props.loc.y <= lb.y && tbf_props.loc.y > lb.y;
    
    if (oldLb) {
        if (!lb) return;
    }

    if (newLb) {
        if (boxStart.y === 500 || boxEnd.y === 500) return;
    }

    if (oldLb || newLb) {
        let offset_x;
        let offset_z;
        let old_offset_x;
        let old_offset_z;

        const old_z_source = lb_type === 'zneo' ? ttbf_props.loc.z : tbf_props.loc.z;
        old_offset_z = inv_z ? (old_z_source - lb.z) : (lb.z - old_z_source);
        old_offset_x = inv_x ? (tbf_props.loc.x - lb.x) : (lb.x - tbf_props.loc.x);

        const positions = [
            boxStart,
            boxEnd,
            { x: boxStart.x, y: boxStart.y, z: boxEnd.z },
            { x: boxEnd.x, y: boxEnd.y, z: boxStart.z }
        ];

        let nearest = null;
        let minDistance = Infinity;

        for (const pos of positions) {
            const dx = props.loc.x - pos.x;
            const dz = props.loc.z - pos.z;
            const distSq = dx * dx + dz * dz;

            if (distSq < minDistance) {
                minDistance = distSq;
                nearest = pos;
            }
        }

        const center = {
            x: (boxStart.x + boxEnd.x) / 2,
            y: (boxStart.y + boxEnd.y) / 2,
            z: (boxStart.z + boxEnd.z) / 2,
        };

        const z_source = lb_type === 'zneo' ? ttbf_props.loc.z : tbf_props.loc.z;

        const isInX = (nearest.x < props.loc.x && props.loc.x < center.x) || (props.loc.x < nearest.x && center.x < props.loc.x);
        const isInZ = (nearest.z < z_source && z_source < center.z) || (z_source < nearest.z && center.z < z_source);

        offset_z = isInZ ? nearest.z > z_source ? nearest.z - z_source : z_source - nearest.z : z_source > nearest.z ? nearest.z - z_source : z_source - nearest.z;
        offset_x = isInX ? nearest.x > tbf_props.loc.x ? nearest.x - tbf_props.loc.x : tbf_props.loc.x - nearest.x : tbf_props.loc.x > nearest.x ? nearest.x - tbf_props.loc.x : tbf_props.loc.x - nearest.x;

        showOffset(player, old_offset_x, old_offset_z);
        showOffset(player, offset_x, offset_z);
    }
}

function showOffset(player, offset_x, offset_z) {
    const lb_type = player.getDynamicProperty('lb_type');
    const lbProps = getProperties(player, 'lb');
    let pb = lbProps.pb ?? -1;
    let pb_x = lbProps.pb_x ?? -1;
    let pb_z = lbProps.pb_z ?? -1;
    const offset_limit = player.getDynamicProperty('offset_limit') ?? 0.5;
    let offset;

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

    if (inXRange && inZRange) {
        const sendpb = player.getDynamicProperty('sendpb') ?? true;
        const sendpb_x = player.getDynamicProperty('sendpb_x') ?? true;
        const sendpb_z = player.getDynamicProperty('sendpb_z') ?? true;
        const sendoffset = player.getDynamicProperty('sendoffset') ?? true;
        const sendoffset_x = player.getDynamicProperty('sendoffset_x') ?? true;
        const sendoffset_z = player.getDynamicProperty('sendoffset_z') ?? true;
        const color2 = player.getDynamicProperty('color2') ?? 'f';
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
            sendMessage(player, `§lOffset: §r§${color2}${offset.toFixed(digit)}`);
        }

        if ((lb_type === 'z' && (sendoffset === true || sendoffset_z === true)) || ((lb_type === 'both' || lb_type === 'zneo') && sendoffset_z === true)) {
            sendMessage(player, `§lOffset Z: §r§${color2}${offset_z.toFixed(digit)}`);
        }

        if ((lb_type === 'x' && (sendoffset === true || sendoffset_x === true)) || ((lb_type === 'both' || lb_type === 'zneo') && sendoffset_x === true)) {
            sendMessage(player, `§lOffset X: §r§${color2}${offset_x.toFixed(digit)}`);
        }

    }
}