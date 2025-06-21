import { world } from '@minecraft/server';
import { getProperties, setProperties } from '../util/property';

const defaultValue = {
    'loc': { x: 0, y: -100, z: 0 },
    'pitch': 0,
    'yaw': 0,
    'ja': 0,
    'ha': 0,
    'secondTurn': 0,
    'preturn': 0,
    'lastTurning': 0,
    'lastLanding': { x: 0, y: 0, z: 0 },
    'hit': { x: 0, y: 0, z: 0 },
    'jump': { x: 0, y: 0, z: 0 },
    'speed': { x: 0, y: 0, z: 0 },
    'speedVector': { speed: 0, facing: 0 },
    'tier': 0,
    'airtime': 0,
    'mm': { x: -1, z: -1 },
    'offset': { total: -1, x: -1, z: -1 },
    'pb': { total: -1, x: -1, z: -1 },
    'lastInput': '',
    'lastSidestep': 'None',
    'lastTiming': ''
};

world.afterEvents.worldLoad.subscribe(() => {
    for (const player of world.getPlayers()) initProps(player);
});

world.afterEvents.playerSpawn.subscribe((ev) => {
    const { initialSpawn, player } = ev;
    if (initialSpawn) initProps(player);
});

function initProps(player) {
    setProperties(player, 'label', defaultValue);
    setProperties(player, 'lb', {
        'mm_x': -1,
        'mm_z': -1,
        'offset': -1,
        'offset_x': -1,
        'offset_z': -1,
        'pb': -1,
        'pb_x': -1,
        'pb_z': -1
    });
}

export function updateLables(player) {
    const current = getProperties(player, 'current');
    const tbf = getProperties(player, 'tbf');
    const ttbf = getProperties(player, 'ttbf');
    const lb = getProperties(player, 'lb');
    const isJumpTick = ttbf.isOnGround === true && tbf.isJumping === true && current.isOnGround === false;
    const hasJumped = tbf.isOnGround === true && current.isJumping === true && current.isOnGround === false;
    const currentLabels = getProperties(player, 'label');
    const updatedLabels = {};

    // Position
    updatedLabels.loc = current.loc;

    // Pitch
    updatedLabels.pitch = current.pitch

    // Yaw
    updatedLabels.yaw = current.yaw;

    // Jump Angle, Jump, Preturn
    if (isJumpTick) {
        updatedLabels.ja = current.yaw;
        updatedLabels.jump = current.loc;
        updatedLabels.preturn = tbf.yaw - ttbf.yaw;
    };

    // Second Turn
    if (currentLabels.airtime === 2) {
        updatedLabels.secondTurn = current.yaw - tbf.yaw;
    };

    // Last Turning
    updatedLabels.lastTurning = current.yaw - tbf.yaw;

    // Last Landing, Hit and Hit Angle
    if (current.isOnGround === true && tbf.isOnGround === false) {
        updatedLabels.lastLanding = tbf.loc;
        updatedLabels.hit = current.loc;
        updatedLabels.ha = current.yaw;
    };

    // Speed
    updatedLabels.speed = current.vel;

    // Speed Vector
    let speed = Math.sqrt(current.vel.x ** 2 + current.vel.z ** 2);
    let vel_fac = Math.atan2(current.vel.x, current.vel.z) * -180 / Math.PI;
    if (isNaN(vel_fac)) vel_fac = 0;
    updatedLabels.speedVector = { speed: speed, facing: vel_fac };

    // Tier
    if (current.isOnGround === true) {
        //updatedLabels.tier = 0;
    } else if (tbf.isOnGround == true && current.isOnGround == false) {
        updatedLabels.tier = 10;
    } else if (tbf.isOnGround == false && current.isOnGround == false) {
        updatedLabels.tier = currentLabels.tier - 1;
    };

    // Airtime
    if (tbf.isOnGround === false && current.isOnGround === true) {
        updatedLabels.airtime = 0;
    } else if (current.isOnGround === false) {
        updatedLabels.airtime = currentLabels.airtime + 1;
    };

    // Offset
    updatedLabels.offset = { total: lb.offset, x: lb.offset_x, z: lb.offset_z };

    // MM
    updatedLabels.mm = { x: lb.mm_x, z: lb.mm_z };

    // PB
    updatedLabels.pb = { total: lb.pb, x: lb.pb_x, z: lb.pb_z };

    // Last Input
    updatedLabels.lastInput = current.input;

    // Last Sidestep
    if (hasJumped) {
        if (current.jumpTickInput.includes('A') || current.jumpTickInput.includes('D')) {
            updatedLabels.lastSidestep = 'WDWA';
        } else updatedLabels.lastSidestep = '';
    } else if (tbf.isOnGround === false) {
        if (currentLabels.lastSidestep === '' && (current.input.includes('A') || current.input.includes('D'))) updatedLabels.lastSidestep = `WAD ${currentLabels.airtime}t`;
    };

    // Last Timing
    if (hasJumped) {
        if (tbf.walktime >= 1) {
            updatedLabels.lastTiming = `HH ${tbf.walktime}t`;
        } else if (current.jumpTickInput.includes('S')) {
            updatedLabels.lastTiming = 'BWJam';
        } else if (current.jumpTickInput.includes('W') && current.isWalkJump === false && tbf.input === '') updatedLabels.lastTiming = 'Jam';
    } else {
        if (current.jumpTickInput === '' && tbf.input === '' && current.input !== '' && currentLabels.airtime > 0) {
            updatedLabels.lastTiming = currentLabels.airtime === 1 ? 'Max Pessi' : `Pessi -${currentLabels.airtime}t`;
        } else if (current.jumpTickInput !== '' && tbf.isSprinting === false && current.isWalkJump === true && current.isSprinting) {
            if (tbf.isOnGround === false) updatedLabels.lastTiming = currentLabels.airtime === 1 ? 'Max FMM' : `FMM ${currentLabels.airtime}t`;
        }
    };

    setProperties(player, 'label', updatedLabels);

}