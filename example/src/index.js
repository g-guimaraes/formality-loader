import { main, value } from './App.fm'
import foo from './Foo.fm/foo'
import area from 'Area#o99z.fm'
import circleArea from 'Area#o99z.fm/circle_area'

console.log(main(3))
console.log(value)
console.log(foo)
console.log(area.square_area(100))
console.log(area.PI)

const btn = document.getElementById('calc')

btn.onclick = () => {
  const input = document.getElementById('input')
  const value = input.value
  const result = circleArea(value)

  alert('the result is ' + result)
}
