const Header = ({text}) => (
    <h1>{text}</h1>
)

const Part = ({part}) => (
    <div>{part.name} {part.exercises}</div>
)

const Total = ({exercisesArray}) => (
    <div><h4>Total of {exercisesArray.reduce((partialSum, currentValue) => partialSum + currentValue, 0)} exercises</h4></div>
)


const Content = ({parts}) => (
    <div>{parts.map((part) => <Part key={part.id} part={part}/>)}</div>
)


const Course = ({course}) => (
    <div>
        <Header text = {course.name}></Header>
        <Content parts = {course.parts}></Content>
        <Total exercisesArray = {course.parts.map((part) => part.exercises)}></Total>
    </div>
)

const Courses = ({courses}) => (
    <div>
        {courses.map((course) => <Course key={course.id} course={course}></Course>)}
    </div>
)

export default Courses