import p5 from "p5";

const width = 1000;
const height = 1000;

new p5();

window.setup = () => {
    createCanvas(1000, 1000);
}

window.draw = () => {
    fill(250, 250, 250);
    strokeWeight(0);
    rect(0, 0, 1000, 1000);
    fill(0, 0, 0, 40);

    dots = dots.map(v => {
        strokeWeight(0);
        ellipse(v.x, v.y, 5, 5);
        if (v.x > width || v.x < 0) v.speedX = -v.speedX;
        if (v.y > height || v.y < 0) v.speedY = -v.speedY;
        v.x += v.speedX;
        v.y += v.speedY;
        dots.map(v2 => {
            const distance = distance2d(v.x, v.y, v2.x, v2.y);
            if (distance > 200) return;
            strokeWeight((1 - distance / 200) / 2);
            line(v.x, v.y, v2.x, v2.y);
        });
        return v;
    });

}

const randomTo = (to) => Math.random() * to;

const teeterTotter = (max, current) => {
    const x2 = current % (max * 2);
    const x1 = current % max;
    return (x2 > x1) ? max - x1 : x1;
}

const distance2d = (x1, y1, x2, y2) => Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));

var dots = new Array(30).fill().map((v, i) => {
    return {
        x: randomTo(width),
        y: randomTo(height),
        speedX: randomTo(4) - 2,
        speedY: randomTo(4) - 2,
    };
});