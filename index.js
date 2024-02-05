const express = require("express")
const uuid = require("uuid")
const bodyParser = require("body-parser")
const cors = require("cors")
const corsOption = {
    origin: 'https://create-users-bxuysshur-luigiolivi.vercel.app',
    credentials: true,
}

const port = process.env.PORT || 3001
const app = express()
app.use(bodyParser.json())
app.use(cors(corsOption))


const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id === id)

    if(index < 0) {
        return response.status(404).json({ message: "User not found" })
    }

    request.userIndex = index
    request.userId = id

    next()
}


app.get('/users', (request, response) => {
    return response.json(users)
})

app.post('/users', (request, response) => {
    const { name, age } = request.body

    const user = { id: uuid.v4(), name, age }  
    users.push(user)

    return response.status(201).json(user)
})

app.put('/users/:id', checkUserId, (request, response) => {
    const { name, age } = request.body
    const id = request.userId

    const updatedUser = { id, name, age }

    const index = request.userIndex
    users[index] = updatedUser

    return response.json(updatedUser)
})

app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex
    users.splice(index,1)

    return response.status(204).json()
})


app.listen(port, '0.0.0.0')
