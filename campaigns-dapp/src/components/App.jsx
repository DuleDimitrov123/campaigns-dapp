import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Campaigns from "./Campaigns";
import CreateCampaign from "./CreateCampaign";
import Campaign from "./Campaign";
import theme from "./theme";
import Header from "./Header";

const App = () => {
    return (
        <BrowserRouter>
            <ChakraProvider theme={theme}>
            <Header />
                <div>
                    <Routes>
                        <Route path="/" exact Component={Campaigns} />
                        <Route path="/campaign/new" Component={CreateCampaign}/>
                        <Route path="/campaign/:address" exact Component={Campaign} />
                    </Routes>
                </div>
            </ChakraProvider>
        </BrowserRouter>
    )
}

export default App;