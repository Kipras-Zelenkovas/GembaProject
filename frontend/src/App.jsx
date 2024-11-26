import "./App.css";
import { Router } from "./routes/Router";

function App() {
    return (
        <div className="flex flex-wrap w-full h-full overflow-y-auto no-scrollbar">
            <Router />
        </div>
    );
}

export default App;
