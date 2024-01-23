import inquirer from 'inquirer';
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

let sleep = () => new Promise((r) => setTimeout(r, 2000))

interface IData {
    question: string,
    code?: string,
    options: string[],
    answer: string,
    level: string
}

const data: IData[] = require('./data.json')

async function startQuiz(questions: IData[]) {
    let answers = []
    for (let i = 0; i < questions.length; i++) {
        console.log('\n')
        console.log(`Question ${i + 1}/${questions.length}: `)
        console.log(`  ${questions[i].question}`)
        if (questions[i].code) {
            console.log(`________________CODE:________________`)
            let set_code = questions[i].code?.replace(/_/g, `   `).split('@') as string[]
            for (let j = 0; j < set_code.length; j++) {
                console.log(` =) ${set_code[j]}`)
            }
            console.log(`_____________________________________`)
        }
        const input = await inquirer.prompt([{
            name: 'options',
            message: 'Choose Correct Option: ',
            type: 'rawlist',
            choices: questions[i].options.sort(() => (Math.random() > 0.5) ? 1 : -1)
        }])
        let value: string = await input['options']
        answers.push(value)
        if (i === questions.length - 1) {
            console.log(`=======================================================`)
        }
        console.log('\n')
    }
    return answers
}

async function Result(name: string, answers: string[], questions: IData[]) {
    console.log(`Compiling Result`)
    await sleep()

    let correct_answers = questions.map((val) => val.answer)
    let points = 0
    for (let i = 0; i < questions.length; i++) {
        if (correct_answers[i] === answers[i]) {
            points++
        }
    }
    let percentage: number = (points * 100) / questions.length
    console.log('Result Compiled')

    console.log(`                Result                `)
    console.log(`--------------------------------------`)
    console.log(` Name: ${name}`)
    console.log(`--------------------------------------`)
    console.log(` Marks: ${points + " out of " + questions.length}`)
    console.log(`--------------------------------------`)
    console.log(` Percentage: ${percentage.toFixed(2) + "%"}`)
    console.log(`--------------------------------------`)
    console.log(` Grade: ${percentage >= 50 ? ' Passed ' : ' Failed '}`)
    console.log(`--------------------------------------`)
}

async function NoOfQuestions() {
    let value: number
    while (true) {
        const input = await inquirer.prompt([{
            name: 'noofquestions',
            message: 'Enter No Of Questions (Max 5)',
            type: 'number'
        }])
        value = await input['noofquestions']
        if (value <= 5 && value > 0) {
            break
        }
        console.log('The Number Of Questions Should Be Between (1 - 5)')
    }
    return value
}

async function DifficultyLevel() {
    const input = await inquirer.prompt([{
        name: 'level',
        message: 'Select Difficulty Level',
        type: 'list',
        choices: [{ name: 'Easy', value: 'easy' }, { name: 'Intermediate', value: 'intermediate' }, { name: 'Difficult', value: 'difficult' }]
    }])
    let value: string = await input['level']
    return value
}

async function Name() {
    let value: string
    while (true) {
        const input = await inquirer.prompt([{
            name: 'name',
            message: 'Enter Your Name: ',
        }])
        value = await input['name']
        if (value) {
            break
        }
    }
    return value
}

while (true) {

    let name = await Name()
    let difficultyLevel = await DifficultyLevel()
    let noOfQuestions = await NoOfQuestions()

    console.log('Preparing Quiz')
    await sleep()

    let sorted_data = data.sort(() => (Math.random() > 0.5) ? 1 : -1)
    let questions = sorted_data.filter((val) => val.level === difficultyLevel).slice(0, noOfQuestions)
    console.log('Quiz Prepared')
    let answers = await startQuiz(questions)
    await Result(name, answers, questions)
    const input = await inquirer.prompt([
        {
            name: `Do You Want To Reattempt Quiz?`,
            type: "confirm",
        }
    ])
    let value: boolean = await input['Do You Want To Reattempt Quiz?']
    if (!value) {
        console.log(`\n_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_\n`)
        break;
    }
    console.log(`\n_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_x_\n`)
}
