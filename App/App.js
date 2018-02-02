import p5 from "p5";
import Web3 from 'web3';


new p5();

const speed = 2;
const retinaDivider = window.devicePixelRatio ? window.devicePixelRatio : 1;
console.log(retinaDivider);
console.log("HERE");

var items = Array(30).fill().map((v, i) => ({
  x: window.innerWidth / 2 * Math.random(),
  y: window.innerHeight / 2 * Math.random(),
  speedX: Math.random() * speed - speed / 2,
  speedY: Math.random() * speed - speed / 2
}));

window.setup = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const canvas = createCanvas(width, height);
  canvas.parent("background");
  resizeHandler();
}

let isClicked = true;

window.document.addEventListener("click", () => isClicked = !isClicked);
window.document.addEventListener("touchstart", () => isClicked = !isClicked);

window.draw = () => {
  if(isClicked) {
    background(255);
  }
  const width = window.innerWidth / retinaDivider;
  const height = window.innerHeight / retinaDivider;
  items = items.map((val, i) => {
    val.x += val.speedX;
    val.y += val.speedY;

    if (val.x > width) {
      val.x = width;
      val.speedX = -val.speedX;
    }
    if (val.x < 0) {
      val.x = 0;
      val.speedX = -val.speedX;
    }
    if (val.y > height) {
      val.y = height;
      val.speedY = -val.speedY;
    }
    if (val.y < 0) {
      val.y = 0;
      val.speedY = -val.speedY;
    }

    items.slice(i + 1).map(val2 => {
      const dist = distance(val.x, val.y, val2.x, val2.y);
      if (dist < 100) {
        strokeWeight((1 - dist / 100) / 5);
        line(val.x, val.y, val2.x, val2.y);
      }
    });

    // rect(val.x, val.y, 1, 1);
    return val;
  });
}

const distance = (x1, y1, x2, y2) => Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );

const resizeHandler = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const canvasEl = document.querySelector("#background canvas");

  canvasEl.setAttribute("width", `${width}px`);
  canvasEl.setAttribute("height", `${height}px`);
  canvasEl.style.width = `${width}px`;
  canvasEl.style.height = `${height}px`;
}

window.addEventListener("resize", resizeHandler);

const web3 = new Web3();
const logoEl = document.querySelector(".logo");

web3.setProvider(new web3.providers.HttpProvider('https://api.myetherapi.com/eth'));

const insertO = str => {
  var index = 4 + Math.round(Math.random() * 4);
  return str.substr(0, index) + (Math.random() > 0.5 ? 'Õ' : 'õ') + str.substr(index + 1);
}
const redarwLogo = () => {
  web3.eth.getBlockNumber().then(result => {
    web3.eth.getBlock(result, (err, block) => {
      const hash = insertO(block.hash.slice(0, 9));
      const fx = new TextScramble(logoEl);
      fx.setText(hash);
    });
    return result;
  })
}

class TextScramble {
    constructor(el) {
      this.el = el
      this.chars = 'abcdefghijklmnopqrstuvwxyz1234567890'
      this.update = this.update.bind(this)
    }

    setText(newText) {
      const oldText = this.el.innerText
      const length = Math.max(oldText.length, newText.length)
      const promise = new Promise((resolve) => this.resolve = resolve)
      this.queue = []
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || ''
        const to = newText[i] || ''
        const start = Math.floor(Math.random() * 40)
        const end = start + Math.floor(Math.random() * 40)
        this.queue.push({ from, to, start, end })
      }
      cancelAnimationFrame(this.frameRequest)
      this.frame = 0
      this.update()
      return promise
    }

    update() {
      let output = ''
      let complete = 0
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i]
        if (this.frame >= end) {
          complete++
          output += to
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar()
            this.queue[i].char = char
          }
          output += `<span class="dud">${char}</span>`
        } else {
          output += from
        }
      }
      this.el.innerHTML = output
      if (complete === this.queue.length) {
        this.resolve()
      } else {
        this.frameRequest = requestAnimationFrame(this.update)
        this.frame++
      }
    }

    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)]
    }
  }

redarwLogo();
window.setInterval(redarwLogo, 15 * 100 * 5);