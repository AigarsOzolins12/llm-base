'use client'
import * as React from 'react'
import Button from '@mui/material/Button'
import { TextField, Typography, Box, Stack, CssBaseline, CircularProgress } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { ChatMessage } from './ChatMessage'
import { ChatMessageState } from './ChatMessageState'

export default function Chat() {
  const [userMessage, setUserMessage] = React.useState("Why is the sky blue?")
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [lastResponseMessage, setLastResponseMessage] = React.useState("")

  return (
  <React.Fragment>
    <CssBaseline/>
      <Stack spacing={5} alignItems={'center'} justifyItems={'center'}>
        <Stack spacing={2}>
          {messages.map(message => (
            <Box key={`message-${message.role}-${messages.indexOf(message)}`}>{renderMessageCard(message)}</Box>
          ))}
          {
            lastResponseMessage && 
            <Box key={`message-assistant-lastmessage`}>
              {renderMessageCard({role: "assistant", content: lastResponseMessage, state: ChatMessageState.RESPONDING})}
            </Box>
          }
        </Stack>
        
        <Stack spacing={2} maxWidth="sm">
          <TextField id="user-input-textfield"           
            label="Your message goes here!"
            multiline
            maxRows={4}
            fullWidth
            onChange={(e) => handleUserMessageChange(e)}
            value={userMessage}
          />
          <Box>
            {lastResponseMessage && <CircularProgress />}
            {!lastResponseMessage &&
              <Button variant="contained" onClick={generateResponse}>
                Sent a message
              </Button>
            }
          </Box>
        </Stack>
      </Stack>
    </React.Fragment>
    );

  function renderMessageCard(message: ChatMessage): JSX.Element {
    return (<React.Fragment>
      <Card variant='outlined'>
        <CardContent>
          <Typography variant="h5" component="div">
            {message.role}
          </Typography>
          <Typography variant="body2">
            {message.content}
          </Typography>
        </CardContent>
      </Card>
    </React.Fragment>)
  }


  function handleUserMessageChange(e:any): void {
    setUserMessage(e.target.value)
  }

  function generateResponse() {
    const messagesToSend = [...messages, {role: "user", content: userMessage, state: ChatMessageState.SENT}]
    setMessages(messagesToSend)
    setLastResponseMessage('About to respond...')

    fetch('http://localhost:8000/generate-ollama', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'user_id': 'someuserid12345',
        'messages': messagesToSend
      })
    }).then(response => {
      decodeResponseStream(response, messagesToSend)
    })
  }
  
  async function decodeResponseStream(response: Response, sentMessages: ChatMessage[]) {
    if (response && response.body) {
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let result = ''
      setLastResponseMessage(result)

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break;
        }
        result += decoder.decode(value, { stream: true })
        setLastResponseMessage(result)
      }

      result += decoder.decode()
      setMessages([...sentMessages, {role: "assistant", content:result, state: ChatMessageState.SUCCESS}])
      setLastResponseMessage('')
      setUserMessage('')
    }
  }
  
}

