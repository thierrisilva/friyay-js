import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import './raf';

configure({ adapter: new Adapter() });

console.error = message => {
  throw new Error(message);
};