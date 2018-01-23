import p5 from "p5";
import Web3 from 'web3';

const width = 1000;
const height = 1000;

new p5();

window.setup = () => {
    createCanvas(width, height);
}

window.draw = () => {

}

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
        })
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