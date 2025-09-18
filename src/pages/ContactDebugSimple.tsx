// Simple debug component to test if basic React works
export default function ContactDebugSimple() {
  console.log('ContactDebugSimple rendering...')
  
  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: 'white' }}>
      <h1>Contact Debug Simple</h1>
      <p>If you can see this text, React is working.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
      <button onClick={() => alert('Button works!')}>Test Button</button>
    </div>
  )
}