import { world, system } from '@minecraft/server';
import { getProperties } from '../util/property';

world.afterEvents.worldLoad.subscribe(() => {
    system.runInterval(() => {
        for (const player of world.getPlayers()) {
            const labels = getProperties(player, 'label');
            const guiConfig = _safeParse(player.getDynamicProperty('guiConfig'), defaultConfig);
            const digit = player.getDynamicProperty('digit') ?? 4;
            const separate = ': §r';
            const color1 = player.getDynamicProperty('color1') ?? '§6';
            const color2 = player.getDynamicProperty('color2') ?? '§f';
            const angleLine = guiConfig.pitch || guiConfig.yaw || guiConfig.ja || guiConfig.ha ? '\n' : '';
            const display = initializeDisplay(labels, { digit: digit, separate: separate, color1: color1, color2: color2 }, angleLine, player);
            const result = Object.keys(display).filter(key => guiConfig[key] === true).map(key => display[key]).join('');
            player.onScreenDisplay.setActionBar(result);
        }
    })
});

function _isNumeric(value) {
    if (typeof value === "number") return !isNaN(value);
    if (typeof value !== "string") return false;
    if (value.trim() === "") return false; // ← 空文字除外
    return !isNaN(Number(value));
};

function initializeDisplay(labels, decorateOptions, angleLine, player) {
    const { digit, separate, color1, color2 } = decorateOptions;
    const display = {};

    function formatVec3(label, value) {
        return label === '' ? `§r§${color1}${label}X${separate}§${color2}${value.x.toFixed(digit)} ` +
            `§r§${color1}Y${separate}§${color2}${value.y.toFixed(digit)} ` +
            `§r§${color1}Z${separate}§${color2}${value.z?.toFixed(digit) ?? value.y.toFixed(digit)}${angleLine}` :
            `\n§r§${color1}${label}X${separate}§${color2}${value.x.toFixed(digit)} ` +
            `§r§${color1}Y${separate}§${color2}${value.y.toFixed(digit)} ` +
            `§r§${color1}Z${separate}§${color2}${value.z?.toFixed(digit) ?? value.y.toFixed(digit)}`;
    };

    function formatScalar(label, value, suffix = '') {
        return `§r§${color1}${label}${separate}§${color2}${value.toFixed(digit)}${suffix} `;
    };

    function formatValue(label, value, suffix = '') {
        return _isNumeric(value) ? `\n§r§${color1}${label}${separate}§${color2}${value.toFixed(digit)}${suffix}` : `\n§r§${color1}${label}${separate}§${color2}${value}${suffix}`;
    };

    function formatVector(label, value) {
        return `\n§r§${color1}${label}${separate}§${color2}${value.speed.toFixed(digit)}§r§${color1}/§r§${color2}${value.facing.toFixed(digit)}`;
    };

    function formatOffset(label, value) {
        const lb_type = player.getDynamicProperty('lb_type');
        if (lb_type === 'both' || lb_type === 'zneo') {
            return `\n§r§${color1}${label}${separate}§${color2}${value.total.toFixed(digit)} §r§${color1}X${separate}§${color2}${value.x.toFixed(digit)} §r§${color1}Z${separate}§${color2}${value.z.toFixed(digit)}`;
        } else if (lb_type === 'x') {
            return `\n§r§${color1}${label} X${separate}§${color2}${value.x.toFixed(digit)}`;
        } else if (lb_type === 'z') {
            return `\n§r§${color1}${label} Z${separate}§${color2}${value.z.toFixed(digit)}`;
        }
    };

    display.loc = formatVec3('', labels.loc);
    display.pitch = formatScalar('P', labels.pitch, '°');
    display.yaw = formatScalar('F', labels.yaw, '°');
    display.ja = formatScalar('Jump Angle', labels.ja, '°');
    display.ha = formatScalar('Hit Angle', labels.ha, '°');
    display.secondTurn = formatValue('Second Turn', labels.secondTurn);
    display.preturn = formatValue('Preturn', labels.preturn);
    display.lastTurning = formatValue('Last Turning', labels.lastTurning);
    display.lastLanding = formatVec3('Last Landing ', labels.lastLanding);
    display.hit = formatVec3('Hit ', labels.hit);
    display.jump = formatVec3('Jump ', labels.jump);
    display.speed = formatVec3('Speed (b/t)', labels.speed);
    display.speedVector = formatVector('Speed Vector', labels.speedVector);
    display.tier = formatValue('Tier', labels.tier);
    display.airtime = formatValue('Airtime', labels.airtime);
    display.offset = formatOffset('Offset', labels.offset);
    display.pb = formatOffset('PB', labels.pb);
    display.lastInput = formatValue('Last Input', labels.lastInput);
    display.lastSidestep = formatValue('Last Sidestep', labels.lastSidestep);
    display.lastTiming = formatValue('Last Timing', labels.lastTiming);

    return display;
};

const defaultConfig = {
    'loc': true,
    'pitch': true,
    'yaw': true,
    'ja': false,
    'ha': false,
    'secondTurn': false,
    'preturn': false,
    'lastTurning': true,
    'lastLanding': true,
    'hit': false,
    'jump': false,
    'speed': false,
    'speedVector': false,
    'tier': false,
    'airtime': false,
    'offset': true,
    'pb': true,
    'lastInput': false,
    'lastSidestep': false,
    'lastTiming': false
};

function _safeParse(str, obj) {
    try {
        return JSON.parse(str);
    } catch {
        return obj;
    }
};

/*

// Second Turn
if (current.airtime === 2) {
    labels.secondTurn = `Second Turn${separate}${current.yaw - tbf.yaw}\n`;
};

// Preturn
if (ttbf.isOnGround === true && current.isOnGround === false && current.isJumping) {
    labels.preturn = `Preturn${separate}${tbf.yaw - ttbf.yaw}\n`;
};

// Last Turning
labels.lastTurning = `Last Turning${separate}${current.yaw - tbf.yaw}\n`;

// Last Landing, Hit
if (isOnGround === true && tbf_isOnGround === false) {
    labels.lastLanding = `X${separate}${tbf.loc.x.toFixed(digit)} Y${separate}${tbf.loc.y.toFixed(digit)} Z${separate}${tbf.loc.y.toFixed(digit)}\n`;
    labels.hit = `X${separate}${current.loc.x.toFixed(digit)} Y${separate}${current.loc.y.toFixed(digit)} Z${separate}${current.loc.y.toFixed(digit)}\n`;
};

// Speed
labels.speed = `Speed (b/t) X${separate}${current.vel.x.toFixed(digit)} Y${separate}${current.vel.y.toFixed(digit)} Z${separate}${current.vel.y.toFixed(digit)}\n`;

// Speed Vector
let vel_fac = Math.atan2(vel.x, vel.z) * -180 / Math.PI;
if (isNaN(vel_fac)) vel_fac = 0;
labels.speedVector = `Speed Vector${separate}${Math.sqrt(current.vel.x ** 2 + current.vel.z ** 2).toFixed(digit)}/${vel_fac.toFixed(digit)}°`;

// Tier
if (current.isOnGround === true && tbf.isOnGround === false) {
    labels.tier = `Tier${separate}10`;
} else if (tbf_isOnGround == false && isOnGround == false) {
    player.setDynamicProperty('tier', ((player.getDynamicProperty('tier') ?? 0) - 1) ?? 0);
};

// Airtime
labels.airtime = `Airtime${separate}${current.airtime}`;

*/