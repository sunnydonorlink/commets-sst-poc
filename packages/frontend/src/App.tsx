import './App.css'
import DemoComment from "./DemoComment.tsx";
import {ThemeProvider} from "./theme-provider.tsx";

export default function App() {

  return (
    <ThemeProvider>
      <DemoComment/>
    </ThemeProvider>
  )
}
