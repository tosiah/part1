import {useState} from 'react'


const Header = ({text}) => <div><h1>{text}</h1></div>
const Button = ({clickHandler, text}) => <button onClick={clickHandler}>{text}</button>
const StatisticLine = ({text, value}) => <tr>
    <td>{text}</td>
    <td>{value}</td>
</tr>

const Statistics = ({good, neutral, bad, goodWeight, neutralWeight, badWeight}) => {
    if (good + neutral + bad > 0) {
        return (<tbody>
        <StatisticLine text='good' value={good}></StatisticLine>
        <StatisticLine text='neutral' value={neutral}></StatisticLine>
        <StatisticLine text='bad' value={bad}></StatisticLine>
        <StatisticLine text='all' value={good + neutral + bad}></StatisticLine>
        <StatisticLine text='average'
                       value={(good * goodWeight + neutral * neutralWeight + bad * badWeight) / (good + neutral + bad)}></StatisticLine>
        <StatisticLine text='positive' value={good / (good + neutral + bad) * 100 + '%'}></StatisticLine>
        </tbody>)
    }

    return <div>No feedback given</div>
}

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)
    const [selected, setSelected] = useState(0)

    const anecdotes = [
        'If it hurts, do it more often.',
        'Adding manpower to a late software project makes it later!',
        'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
        'Premature optimization is the root of all evil.',
        'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
        'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
        'The only way to go fast, is to go well.'
    ]

    const [points, setPoints] = useState(Array(anecdotes.length).fill(0))

    const goodWeight = 1
    const neutralWeight = 0
    const badWeight = -1


    const updatePoints = () => {
        const copy = [...points]
        copy[selected]++
        setPoints(copy)
    }

    return (
        <div>
            <Header text='Give Feedback'></Header>
            <div>
                <Button clickHandler={() => setGood(good + 1)} text='good'></Button>
                <Button clickHandler={() => setNeutral(neutral + 1)} text='neutral'></Button>
                <Button clickHandler={() => setBad(bad + 1)} text='bad'></Button>
            </div>

            <Header text='statistics'></Header>

            <Statistics good={good} neutral={neutral} bad={bad} goodWeight={goodWeight} neutralWeight={neutralWeight}
                        badWeight={badWeight}></Statistics>

            {anecdotes[selected]}
            <div>{'has ' + points[selected] + ' votes'}</div>
            <div>
                <Button clickHandler={() => updatePoints()} text='vote'></Button>
                <Button clickHandler={() => setSelected(Math.floor(Math.random() * anecdotes.length))}
                        text='next anecdote'></Button>
            </div>

            <Header text='Anecdote with most votes'></Header>
            {anecdotes[points.indexOf(Math.max(...points))]}

        </div>
    )
}

export default App