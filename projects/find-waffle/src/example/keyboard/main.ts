import { KeyMap } from '../../libs/keyboard/KeyMap';

const keyMap = new KeyMap();
const textBox = document.createElement('div');
textBox.className = 'textBox';
textBox.style.cssText = `
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;
document.body.appendChild(textBox);

keyMap.bind(
  'space',
  () => {
    textBox.textContent = 'space key is pressed';
  },
  () => {
    textBox.textContent = 'space key is released';
  },
);

keyMap.bind(
  'ctrl+A',
  () => {
    textBox.textContent = 'ctrl + A key is pressed';
  },
  () => {
    textBox.textContent = 'ctrl + A key is released';
  },
);

keyMap.bind(
  'leftmeta',
  () => {
    textBox.textContent = 'left meta key is pressed';
  },
  () => {
    textBox.textContent = 'left meta key is released';
  },
);

const button = document.createElement('button');
button.textContent = '키맵 활성화';
button.style.cssText = `
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px;
  font-size: 16px;
  background-color: #333;
  color: #fff;
  border: none;
  cursor: pointer;
`;
document.body.appendChild(button);

button.addEventListener('click', () => {
  if (!keyMap.isActivated) {
    keyMap.activate();
  } else {
    keyMap.deactivate();
    textBox.textContent = '';
  }
  button.textContent = keyMap.isActivated ? '키맵 비활성화' : '키맵 활성화';
});
