import {createElement} from "./src/jsx"

import {Carousel} from './components/Carousel'


let component = <Carousel data={[
  './src/images/1.jpg',
  './src/images/2.jpg',
  './src/images/3.jpg',
  './src/images/4.jpg'
]} />

component.mountTo(document.body)