// donut.js
const screenWidth = 80;
const screenHeight = 22;

const thetaSpacing = 0.07;
const phiSpacing = 0.02;
const R1 = 1;
const R2 = 2;
const K2 = 5;
const K1 = screenWidth * K2 * 3 / (8 * (R1 + R2));

const luminanceChars = ".,-~:;=!*#$@";

let A = 0, B = 0;

function renderFrame() {
    let output = Array(screenWidth * screenHeight).fill(" ");
    let zBuffer = Array(screenWidth * screenHeight).fill(0);

    for (let theta = 0; theta < 2 * Math.PI; theta += thetaSpacing) {
        for (let phi = 0; phi < 2 * Math.PI; phi += phiSpacing) {
            let cosA = Math.cos(A), sinA = Math.sin(A);
            let cosB = Math.cos(B), sinB = Math.sin(B);
            let cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);
            let cosPhi = Math.cos(phi), sinPhi = Math.sin(phi);

            let circleX = R2 + R1 * cosTheta;
            let circleY = R1 * sinTheta;

            let x = circleX * (cosB * cosPhi + sinA * sinB * sinPhi) - circleY * cosA * sinB;
            let y = circleX * (sinB * cosPhi - sinA * cosB * sinPhi) + circleY * cosA * cosB;
            let z = K2 + cosA * circleX * sinPhi + circleY * sinA;
            let ooz = 1 / z;

            let xp = Math.floor(screenWidth / 2 + K1 * ooz * x);
            let yp = Math.floor(screenHeight / 2 - K1 * ooz * y);

            let L = cosPhi * cosTheta * sinB - cosA * cosTheta * sinPhi - sinA * sinTheta
                  + cosB * (cosA * sinTheta - cosTheta * sinA * sinPhi);

            let luminanceIndex = Math.floor((L + 1) * 5.5);

            if (yp >= 0 && yp < screenHeight && xp >= 0 && xp < screenWidth && ooz > zBuffer[yp * screenWidth + xp]) {
                zBuffer[yp * screenWidth + xp] = ooz;
                output[yp * screenWidth + xp] = luminanceChars[Math.max(0, Math.min(11, luminanceIndex))];
            }
        }
    }

    // move cursor home and print
    process.stdout.write("\x1b[H");
    for (let k = 0; k < screenWidth * screenHeight; k++) {
        process.stdout.write(k % screenWidth ? output[k] : "\n");
    }

    A += 0.04;
    B += 0.08;
}

console.clear();
setInterval(renderFrame, 30);
