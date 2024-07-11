import React, { useState } from 'react';
import './App.css'
import SISState from './components/SISState';

const App = () => {
  const [APIKey, setAPIKey] = useState<string | null>(null)

  return APIKey ?
    <SISState APIKey={APIKey} /> :
    <KeyEntryBox onKeyChange={setAPIKey} />
}

const KeyEntryBox = (props: { onKeyChange(value: string): any }) => {
  const [key, setAPIKey] = useState<string>()

  return (
    <form onSubmit={(e) => { e.preventDefault(); key != undefined && props.onKeyChange(key) }}>
      <label>Enter API Key: <input name="key" onChange={(e) => setAPIKey(e.target.value)} /></label>
      <input type="submit" value="enter" />
    </form>
  )
}

export default App
