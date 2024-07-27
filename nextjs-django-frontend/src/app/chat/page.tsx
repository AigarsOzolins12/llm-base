'use client'
import * as React from 'react'
import Button from '@mui/material/Button'
import { TextField } from '@mui/material'

export default function Chat() {
  const [userMessage, setUserMessage] = React.useState("Why is the sky blue?")
  const [chatResponse, setChatResponse] = React.useState("No message here yet!")

  return (<React.Fragment>
            <TextField id="user-input-textfield"           
              label="Multiline"
              multiline
              maxRows={4}
              fullWidth
              onChange={(e) => handleUserMessageChange(e)}
              value={userMessage}
            />
            <Button variant="contained" onClick={generateResponse}>Send message</Button>
            <TextField id="response-textfield"
            label="Multiline"
            multiline
            maxRows={20}
            fullWidth
            value={chatResponse}/>

          </React.Fragment>);

  function handleUserMessageChange(e:any) {
    setUserMessage(e.target.value)
  }

  function generateResponse() {
    fetch('http://localhost:8000/generate-ollama', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'user_id': 'someuserid12345',
        'messages': [
          {
            'role': 'user',
            'content': userMessage
          }
        ]
      })
    }).then(response => handleStream(response))
  }
  
  async function handleStream(response: Response) {
    if (response && response.body) {
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let result = ''
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break;
        }
        result += decoder.decode(value, { stream: true })
        setChatResponse(result)
      }
    
      result += decoder.decode()
      setChatResponse(result)
    }
  }
  
}

